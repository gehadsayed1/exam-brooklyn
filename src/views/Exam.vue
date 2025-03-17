<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useStudentStore } from "../stores/studentStore";
import { useRouter } from "vue-router";

const studentStore = useStudentStore();
const router = useRouter();
const notyf = new Notyf({
  duration: 5000,
  dismissible: true,
  ripple: true,
  position: { x: "center", y: "top" },
});

const examData = computed(() => studentStore.startExam?.data || {});
const attemptId = computed(() => examData.value?.attempt_id);
const remainingTime = computed(() => examData.value?.remaining_time || 0);
const exam = computed(() => examData.value?.exam || {});
const questions = computed(() => exam.value?.questions || []);
const previousAnswers = computed(() => examData.value?.answers || []);

const timeLeft = ref(remainingTime.value);
const currentQuestionIndex = ref(0);
const selectedOption = ref(null);
const quizStarted = ref(false);
let interval;

const currentQuestion = computed(
  () => questions.value[currentQuestionIndex.value] || null
);
const isLastQuestion = computed(
  () => currentQuestionIndex.value === questions.value.length - 1
);

const loadPreviousAnswers = () => {
  if (previousAnswers.value.length > 0) {
    studentStore.examAnswers = previousAnswers.value.map((ans) => ({
      q_id: ans.q_id,
      selected_option: ans.selected_option,
    }));
  }
};

const loadSelectedOption = () => {
  const savedAnswer = studentStore.examAnswers.find(
    (ans) => ans.q_id === currentQuestion.value?.id
  );
  selectedOption.value = savedAnswer ? savedAnswer.selected_option : null;
};

const startTimer = () => {
  interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(interval);
      notyf.error("Time is up! Exam ended.");
      submitFinalExam();
    }
  }, 60000);
};

const handleStart = () => {
  quizStarted.value = true;
  timeLeft.value = remainingTime.value;
  loadPreviousAnswers();
  startTimer();
  loadSelectedOption();
};

const saveAnswer = async () => {
  if (selectedOption.value !== null && currentQuestion.value) {
    const answer = {
      q_id: currentQuestion.value.id,
      selected_option: selectedOption.value,
    };

    await studentStore.updateAnswer(answer);
  }
};

const nextQuestion = async () => {
  if (selectedOption.value !== null && currentQuestion.value) {
    const answer = {
      q_id: currentQuestion.value.id,
      selected_option: selectedOption.value,
    };
    console.log(answer);

    studentStore.updateAnswer(answer);

    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
      loadSelectedOption();
    } else {
      submitFinalExam();
    }
  } else {
    notyf.error("Please select an answer before proceeding.");
  }
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    loadSelectedOption();
  }
};

const goToQuestion = (index) => {
  saveAnswer();
  currentQuestionIndex.value = index;
  loadSelectedOption();
};

const submitProgress = async () => {
  if (!attemptId.value || studentStore.examAnswers.length === 0) return;
  try {
    const payload = {
      attempt_id: attemptId.value,
      answers: studentStore.examAnswers,
    };
    await studentStore.submitExamAnswers(payload);
  } catch {
    notyf.error("Error saving progress");
  }
};

const submitFinalExam = async () => {
  clearInterval(interval);
  quizStarted.value = false;
  notyf.success("Exam completed successfully!");

  if (!attemptId.value || studentStore.examAnswers.length === 0) return;

  try {
    const payload = { answers: studentStore.examAnswers };
    await studentStore.submitExamAnswers(payload);
    studentStore.clearExamData();
    router.push({ name: "ResultPage" });
  } catch {
    notyf.error("Error submitting final exam");
  }
};

setInterval(submitProgress, 5 * 60 * 1000);

onMounted(() => {
  if (quizStarted.value) {
    startTimer();
    loadPreviousAnswers();
    loadSelectedOption();
  }
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="quiz-container">
    <div class="text-center mb-10">
      <div>
        <h2 class="font-bold mt-5 mb-5">{{ exam.name }}</h2>
      </div>

      <dev class="text-xl font-semibold mb-8">
        Remaining time
        <span class="text-primary font-bold text-2xl"
          >({{ timeLeft.toFixed(2) }})</span
        >
        Minute
      </dev>
    </div>

    <div v-if="!quizStarted" class="text-center">
      <button @click="handleStart" class="btn-start">Start Exam</button>
    </div>
    <div v-if="quizStarted">
      <div v-if="currentQuestion" class="question-container">
        <h3
          class="text-lg font-semibold text-center border p-3 rounded-xl bg-primary text-white"
        >
          {{ currentQuestion.question_text }}
        </h3>
        <div
          v-for="(option, key) in currentQuestion.options"
          :key="key"
          class="option"
          :class="{ selected: selectedOption === key }"
        >
          <input
            type="radio"
            :id="'option-' + key"
            v-model="selectedOption"
            :value="key"
          />
          <label :for="'option-' + key">{{ option }}</label>
        </div>
      </div>
      <button @click="previousQuestion" class="btn-prev">Previous</button>
      <button
        @click="nextQuestion"
        :disabled="!selectedOption"
        class="btn-next"
      >
        {{ isLastQuestion ? "Finish Exam" : "Next" }}
      </button>

      <div class="pagination">
        <button
          v-for="(q, index) in questions"
          :key="index"
          @click="goToQuestion(index)"
          :class="{ active: currentQuestionIndex === index }"
        >
          {{ index + 1 }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 50px;
}
.quiz-container {
  font-family: Arial, sans-serif;
  margin: 20px;
  padding: 10px;
  border-radius: 8px;

  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.option {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 7px;
  margin: 5px 0;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.option:hover {
  border-color: #4788f8;
}

.option input[type="radio"] {
  transform: scale(1.2);
  cursor: pointer;
}

.selected {
  background-color: #d3e0ff;
  border-color: #337af5;
}

button {
  padding: 10px 50px;
  background-color: #092c67;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #073481;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

button:disabled {
  background-color: #ccc;
}

.selected-option {
  background-color: #d3e0ff;
  border-radius: 10px;
  padding: 10px;
  transition: background-color 0.3s ease-in-out;
}

.btn-prev {
  margin-right: 10px;
}
.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 15px;
}
.pagination button {
  margin: 3px;
  padding: 8px 12px;
  border: 1px solid #092c67;
  background-color: white;
  color: #092c67;
  cursor: pointer;
  min-width: 40px;
}
.pagination button.active {
  background-color: #092c67;
  color: white;
  font-weight: bold;
}
</style>
