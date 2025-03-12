<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useStudentStore } from '../stores/studentStore';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash-es';

const studentStore = useStudentStore();
const router = useRouter();

const notyf = new Notyf({
  duration: 5000,
  dismissible: true,
  ripple: true,
  position: { x: 'center', y: 'top' },
});

const examData = localStorage.getItem("exam");


let AllExam;
try {
  AllExam = JSON.parse(examData);
  if (!AllExam || !AllExam.data || !AllExam.data.exam) {
    throw new Error("بيانات الامتحان غير صحيحة.");
  }
} catch (error) {
  notyf.error("خطأ في قراءة بيانات الامتحان.");
  console.error(error);
  // router.replace('/');
}

const exam = AllExam.data.exam;
const duration = ref(exam.duration || 0);
const savedTime = localStorage.getItem("timeLeft");
const timeLeft = ref(savedTime ? parseInt(savedTime) : duration.value);
const attemptId = ref( examData.attempt_id|| null);
const questions = ref(exam.questions || []);

if (!Array.isArray(questions.value) || questions.value.length === 0) {
  notyf.error("لا توجد أسئلة في الامتحان.");
  // router.replace('/');  
}

const submitAnswers = studentStore.submitExamAnswers;
const examAnswers = ref([]); 
const currentQuestionIndex = ref(0);
const selectedOption = ref(null);
const quizCompleted = ref(false);
const quizStarted = ref(false);
let interval;

const randomizeArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const currentQuestion = computed(() => {
  if (questions.value && Array.isArray(questions.value) && questions.value.length > 0) {
    return questions.value[currentQuestionIndex.value];
  }
  return null;
});

const isLastQuestion = computed(() => {
  return questions.value.length > 0 && currentQuestionIndex.value === questions.value.length - 1;
});

const startTimer = () => {
  interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
      localStorage.setItem("timeLeft", timeLeft.value);
    } else {
      clearInterval(interval);
      notyf.error('Time is up! The quiz has ended.');
      quizCompleted.value = true;
      quizStarted.value = false;
      submitAnswers({ answers: examAnswers.value, examId: examId.value });
      clearExamState();
    }
  }, 1000);
};

const handleStart = () => {
  if (!localStorage.getItem("examState")) {
    questions.value = randomizeArray(questions.value);
  }
  quizStarted.value = true;
  startTimer();
  saveState();
};

const nextQuestion = () => {
  if (selectedOption.value !== null && currentQuestion.value) {
    const answerIndex = examAnswers.value.findIndex(answer => answer.q_id === currentQuestion.value.id);
    if (answerIndex >= 0) {
      examAnswers.value[answerIndex].selected_option = selectedOption.value; // تحديث الإجابة
    } else {
      // إذا كانت الإجابة غير موجودة، أضفها
      examAnswers.value.push({
        q_id: currentQuestion.value.id,
        selected_option: selectedOption.value,
      });
    }
  }

  if (!isLastQuestion.value) {
    currentQuestionIndex.value++;
    selectedOption.value = examAnswers.value.find(answer => answer.q_id === currentQuestion.value.id)?.selected_option || null;
    saveState();
  } else {
    clearInterval(interval);
    quizCompleted.value = true;
    quizStarted.value = false;
    notyf.success('Congratulations! You have completed the quiz.');
    submitAnswers({ answers: examAnswers.value }).then(() => {
      clearExamState();
      router.replace("/exam");
    });
  }
};


const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    selectedOption.value = examAnswers.value.find(answer => answer.q_id === currentQuestion.value.id)?.selected_option || null; // استرجاع الإجابة المخزنة
    saveState();
  }
};

const saveState = () => {
  const examState = {
    currentQuestionIndex: currentQuestionIndex.value,
    timeLeft: timeLeft.value,
    selectedOption: selectedOption.value,
    examAnswers: examAnswers.value,
    quizStarted: quizStarted.value,
    questions: questions.value,
  };
  localStorage.setItem("examState", JSON.stringify(examState));
};

const loadState = () => {
  const savedData = JSON.parse(localStorage.getItem("examState"));
  if (savedData) {
    currentQuestionIndex.value = savedData.currentQuestionIndex;
    timeLeft.value = savedData.timeLeft;
    selectedOption.value = savedData.selectedOption;
    examAnswers.value = savedData.examAnswers || [];
    quizStarted.value = savedData.quizStarted;
    questions.value = savedData.questions || questions.value;
    if (quizStarted.value) {
      startTimer();
    }
  }
};

const clearExamState = () => {
  localStorage.removeItem("examState");
  localStorage.removeItem("timeLeft");
};

onMounted(() => {
  loadState();
});

onBeforeUnmount(() => {
  clearInterval(interval);
  window.removeEventListener('beforeunload', saveState);
});

const saveStateDebounced = debounce(saveState, 1000);

watch(timeLeft, saveStateDebounced);
watch(currentQuestionIndex, saveStateDebounced);
watch(selectedOption, saveStateDebounced);
</script>

<template>
  <div class="@container">
    <div class="text-center">
      <h2 class="text-3xl font-bold mb-4 mt-5 text-gray-900 dark:text-white">Welcome to the Quiz!</h2>
    </div>
    <div class="text-center">
      <p class="text-xl font-semibold text-gray-900 dark:text-white">
        Time Left:
        <span class="font-bold text-2xl text-primary border px-2 rounded-xl">
          {{ timeLeft }}
        </span>
        Seconds
      </p>
    </div>
    <div class="quiz-container bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div v-if="!quizStarted" class="text-center mt-4 mb-4">
        <button @click="handleStart" class="btn-start bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Start Exam</button>
      </div>
      <div v-if="quizStarted">
        <div class="question-container" v-if="currentQuestion">
          <h3 class="text-xl font-bold text-center border border-gray-300 p-4 rounded-2xl shadow bg-primary text-gray-200 dark:bg-primary dark:text-gray-800">
            {{ currentQuestion.question_text }}
          </h3>
          <div v-for="(option, key) in currentQuestion.options" :key="key"
            class="option flex items-center gap-3 mt-2 border border-primary p-2 rounded-2xl cursor-pointer transition-all dark:border-gray-600"
            :class="{ 'selected-option': selectedOption === key }" @click="selectedOption = key">
            <input type="radio" :id="'option-' + key" v-model="selectedOption" :value="key" class="radio-btn" />
            <label :for="'option-' + key" class="w-full cursor-pointer text-gray-900 dark:text-white">{{ option }}</label>
          </div>
        </div>
        <button @click="previousQuestion" class="btn-prev bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600">
          Previous
        </button>
        <button @click="nextQuestion" :disabled="!selectedOption" class="btn-next bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
          {{ isLastQuestion ? 'Submit Exam' : 'Next Question' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  font-family: Arial, sans-serif;
  margin: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
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
</style>
