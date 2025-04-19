<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useStudentStore } from "../../stores/studentStore";
import { useRouter } from "vue-router";

const studentStore = useStudentStore();
const router = useRouter();
const notyf = new Notyf({
  duration: 5000,
  dismissible: true,
  ripple: true,
  position: { x: "center", y: "top" },
});

if (!sessionStorage.getItem("attemptId")) {
  router.push("/home");
}

const examData = computed(() => studentStore.startExam?.data || {});
const remainingTime = computed(() => examData.value?.remaining_time || 0);
const exam = computed(() => examData.value?.exam || {});
const questions = computed(() => exam.value?.questions || []);
const previousAnswers = computed(() => examData.value?.answers || []);
const showUnansweredMessage = ref("");

const answersArray = ref([]);
const timeLeft = ref(remainingTime.value);
const selectedOptions = ref([]);
const quizStarted = ref(false);
const isSubmitting = ref(false);
let interval;
const currentQuestionIndex = ref(null);

const mode = ref("all");

const unansweredIndexes = ref([]);

const filteredQuestions = computed(() => {
  return mode.value === "filter"
    ? questions.value.filter((_, i) => unansweredIndexes.value.includes(i))
    : questions.value;
});

const currentQuestion = computed(
  () => questions.value[currentQuestionIndex.value] || null
);
const isLastQuestion = computed(
  () => currentQuestionIndex.value === questions.value.length - 1
);

const answeredCount = computed(() => studentStore.examAnswers.length);

// Track if page was reloaded or not
const lode = ref(false);

const startTimer = () => {
  interval = setInterval(() => {
    let integerPart = Math.floor(timeLeft.value);
    let decimalPart = Math.round((timeLeft.value - integerPart) * 100);

    if (decimalPart > 0) {
      decimalPart--;
    } else if (integerPart > 0) {
      integerPart--;
      decimalPart = 99;
    } else {
      clearInterval(interval);
      notyf.error("Time is up! Exam ended.");

      router.replace({ name: "home" });
      return;
    }

    timeLeft.value = integerPart + decimalPart / 100;
  }, 1000);
};

const saveAnswer = () => {
  if (
    selectedOptions.value[currentQuestionIndex.value] !== null &&
    currentQuestion.value
  ) {
    const answer = {
      q_id: currentQuestion.value.id,
      selected_option: selectedOptions.value[currentQuestionIndex.value],
    };

    const existingIndex = studentStore.examAnswers.findIndex(
      (a) => a.q_id === currentQuestion.value.id
    );

    if (existingIndex !== -1) {
      studentStore.examAnswers[existingIndex] = answer;
    } else {
      studentStore.examAnswers.push(answer);
    }

    const answersIndex = answersArray.value.findIndex(
      (a) => a.q_id === currentQuestion.value.id
    );
    if (answersIndex !== -1) {
      answersArray.value[answersIndex] = answer;
    } else {
      answersArray.value.push(answer);
    }

    const i = unansweredIndexes.value.indexOf(currentQuestionIndex.value);
    if (i !== -1) {
      unansweredIndexes.value.splice(i, 1);
      if (unansweredIndexes.value.length === 0) {
        mode.value = "all";
      }
    }

    sessionStorage.setItem("answers", JSON.stringify(answersArray.value));
  }
};

const loadSelectedOption = () => {
  const savedAnswer = previousAnswers.value.find(
    (ans) => ans.q_id === currentQuestion.value?.id
  );
  const modifiedAnswer = studentStore.examAnswers.find(
    (ans) => ans.q_id === currentQuestion.value?.id
  );

  if (modifiedAnswer) {
    selectedOptions.value[currentQuestionIndex.value] =
      modifiedAnswer.selected_option;
  } else if (savedAnswer) {
    selectedOptions.value[currentQuestionIndex.value] =
      savedAnswer.selected_option;
  } else {
    selectedOptions.value[currentQuestionIndex.value] = null;
  }
};

const handleStart = () => {
  currentQuestionIndex.value = 0;

  quizStarted.value = true;
  timeLeft.value = remainingTime.value;
  startTimer();
  loadSelectedOption();
};

const nextQuestion = async () => {
  saveAnswer();
  if (!isLastQuestion.value) {
    currentQuestionIndex.value++;
    loadSelectedOption();
  } else {
    await submitFinalExam({ answers: answersArray.value });
  }
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    saveAnswer();
    currentQuestionIndex.value--;
    loadSelectedOption();
  }
};

const submitFinalExam = async () => {
  try {
    const unansweredQuestionIndexes = questions.value.reduce(
      (acc, question, index) => {
        if (
          selectedOptions.value[index] === null ||
          selectedOptions.value[index] === undefined
        ) {
          acc.push(index + 1);
        }
        return acc;
      },
      []
    );

    if (unansweredQuestionIndexes.length > 0) {
      unansweredIndexes.value = unansweredQuestionIndexes.map((n) => n - 1);
      showUnansweredMessage.value = `Please answer all questions.`;
      mode.value = "filter";
      return;
    } else {
      showUnansweredMessage.value = "";
    }

    saveAnswer();
    const payload = { answers: answersArray.value };
    isSubmitting.value = true;
    await studentStore.submitFinalExam(payload);
    isSubmitting.value = false;
    clearInterval(interval);
    quizStarted.value = false;
  } catch {
    notyf.error("Error submitting final exam");
  }
};

// Handle before unload
const handleBeforeUnload = (e) => {
  e.preventDefault();
  sessionStorage.removeItem("attemptId");
  sessionStorage.removeItem("answers");
  return "";
};

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>

<template>
  <div class="quiz-container min-h-screen">
    <div class="text-center mb-10 dark:text-white">
      <div>
        <h2 class="font-bold mt-5 mb-5">{{ exam.name }}</h2>
      </div>

      <div class="text-xl font-semibold mb-8">
        Remaining time
        <span class="text-primary font-bold text-2xl dark:text-blue-500">
          ({{ Math.floor(timeLeft) }}.{{
            Math.round((timeLeft - Math.floor(timeLeft)) * 100)
              .toString()
              .padStart(2, "0")
          }}
          )
        </span>
        Minute
      </div>
    </div>

    <!-- Show 'Start Exam' button initially -->
    <div v-if="!quizStarted && timeLeft > 0" class="text-center">
      <button @click="handleStart" class="btn-start">Start Exam</button>
    </div>
    <div v-if="timeLeft <= 0" class="text-center">
      <button @click="router.push('/home')" class="btn-start">Go Back</button>
    </div>

    <div v-if="quizStarted">
      <div class="text-end mb-5 mt-4">
        <label class="text-gray-700 font-medium block mb-2"
          >Go to question:</label
        >
        <select
          v-model="currentQuestionIndex"
          class="border px-4 py-2 rounded-md font-semibold"
          :class="{
            'border-red-500 text-red-600':
              unansweredIndexes.length > 0 && mode === 'filter',
            'border-indigo-500 text-indigo-700': mode !== 'filter',
          }"
        >
          <option :value="null" disabled>
            {{
              unansweredIndexes.length > 0 && mode === "filter"
                ? "Unanswered questions"
                : "Select a question"
            }}
          </option>
          <option
            v-for="(q, index) in filteredQuestions"
            :key="index"
            :value="index"
          >
            Question {{ index + 1 }}
          </option>
        </select>
      </div>
      <div v-if="currentQuestion" class="question-container">
        <h3
          class="text-lg font-semibold text-center border p-3 rounded-xl mb-5 bg-primary text-white"
        >
          {{ currentQuestion.question_text }}
        </h3>
        <div
          v-for="(option, key) in currentQuestion.options"
          :key="key"
          class="option dark:text-gray-300"
          :class="{ selected: selectedOptions[currentQuestionIndex] === key }"
          @click="selectedOptions[currentQuestionIndex] = key"
        >
          <input
            type="radio"
            :id="'option-' + key"
            v-model="selectedOptions[currentQuestionIndex]"
            :value="key"
            style="opacity: 0; position: absolute"
          />
          <label :for="'option-' + key">{{ option }}</label>
        </div>
      </div>

      <div class="text-center">
        <button @click="previousQuestion" class="btn-prev">Previous</button>
        <button v-if="!isLastQuestion" @click="nextQuestion" class="btn-next">
          next
        </button>
        <button v-if="isLastQuestion" @click="submitFinalExam" class="btn-next">
          <span v-if="isSubmitting"
            ><i class="fa-solid fa-circle-notch fa-spin-pulse"></i
          ></span>
          <span v-else>Submit</span>
        </button>
      </div>

      <!-- <div class="pagination">
        <button v-for="(q, index) in questions" :key="index" @click="goToQuestion(index)" :class="{
            active: currentQuestionIndex === index,
            answered: studentStore.examAnswers.some((ans) => ans.q_id === q.id),
          }">
          {{ index + 1 }}
        </button>
      </div> -->

      <div
        class="answered-counter text-center mt-3 text-lg font-medium dark:text-white"
      >
        It has been answered
        <span class="text-primary dark:text-blue-500 text-xl font-bold"
          >({{ answeredCount }})</span
        >
        from
        <span class="text-primary font-bold text-xl dark:text-blue-500"
          >({{ questions.length }})</span
        >
        Questions
      </div>
    </div>

    <div
      v-if="showUnansweredMessage"
      class="alert-message text-red-500 text-center mt-3"
    >
      {{ showUnansweredMessage }}
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

.dark .selected {
  background-color: #2c67ce;
  color: white;
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

.pagination button.answered {
  background-color: #e0f0ff;
  border-color: #4788f8;
  color: #092c67;
  font-weight: bold;
}

.dark .pagination button.answered {
  background-color: #204b80;
  color: white;
}

.answered-counter {
  margin-top: 15px;
  color: #0d47aa;
}

.dark .answered-counter {
  color: #ffffff;
}
</style>
