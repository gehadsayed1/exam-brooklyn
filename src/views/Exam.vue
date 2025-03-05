<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useStudentStore } from '../stores/studentStore';

const studentStore = useStudentStore();


const duration = ref(studentStore.startExam.duration);
const questions = ref(studentStore.startExam.questions);
const submitAnswers = studentStore.submitExamAnswers; 
const examAnswers = studentStore.examAnswers; 

const timeLeft = ref(duration.value);
const currentQuestionIndex = ref(0);
const selectedOption = ref(null);
const quizCompleted = ref(false);
let interval;


const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);


const startTimer = () => {
  interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(interval);
      notyf.error('Time is up! The quiz has ended.');
      submitAnswers(); 
    }
  }, 1000);
};


const nextQuestion = () => {
  console.log('Before Next Question:', examAnswers.value); 
  if (currentQuestionIndex.value < questions.value.length - 1) {
   
    if (Array.isArray(examAnswers.value)) {
    
      if (selectedOption.value !== null) {
        examAnswers.value.push({
          q_id: currentQuestion.value.id,
          selected_option: selectedOption.value,
        });
        console.log('Selected Answer:', selectedOption.value); 
        console.log('Answered Questions:', examAnswers.value); 
      }
    } else {
      console.error('examAnswers is not an array');
    }

    currentQuestionIndex.value++;
    selectedOption.value = null;
  } else {
    quizCompleted.value = true;
    notyf.success('Congratulations! You have completed the quiz.');
    submitAnswers();
  }
};



const saveState = () => {
  const examState = {
    currentQuestionIndex: currentQuestionIndex.value,
    timeLeft: timeLeft.value,
    selectedOption: selectedOption.value,
  };
  localStorage.setItem("examState", JSON.stringify(examState));
};


const loadState = () => {
  const savedData = JSON.parse(localStorage.getItem("examState"));
  if (savedData) {
    currentQuestionIndex.value = savedData.currentQuestionIndex;
    timeLeft.value = savedData.timeLeft;
    selectedOption.value = savedData.selectedOption;
  }
};


const notyf = new Notyf({
  duration: 5000,
  dismissible: true,
  ripple: true,
  position: {
    x: 'center',
    y: 'top',
  },
});

onMounted(() => {
  loadState();
  startTimer();
});


watch(timeLeft, () => {
  saveState();
});
</script>

<template>
  <div class="@container">
    <div class="text-center">
      <h2 class="text-3xl font-bold mb-4 mt-5">Welcome to the Quiz!</h2>
    </div>
    <div class="text-center">
      <p class="text-xl font-semibold">Time Left: <span
          class="font-bold text-2xl text-primary border px-2 rounded-xl">{{ timeLeft }}</span> Seconds</p>
    </div>
    <div class="quiz-container">
      <div class="question-container" v-if="currentQuestion">
        <h3
          class="text-xl font-bold text-center border border-gray-300 p-4 rounded-2xl shadow bg-primary text-gray-200">
          {{ currentQuestion.question_text }}
        </h3>
        <div v-for="(option, index) in currentQuestion.options" :key="index"
          class="option flex items-center gap-3 mt-2 border border-primary p-2 rounded-2xl cursor-pointer transition-all"
          :class="{ 'selected-option': selectedOption === option }" @click="selectedOption = option">
          <input type="radio" :id="'option-' + index" v-model="selectedOption" :value="option"
            class="radio-btn" />
          <label :for="'option-' + index" class="w-full cursor-pointer">{{ option }}</label>
        </div>
      </div>
      <button @click="nextQuestion" :disabled="!selectedOption">Next Question</button>
      
      <div v-if="quizCompleted">
        <p class="result-message">Congratulations, you've finished the quiz!</p>
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

.result-message {
  text-align: center;
  font-size: 1.2em;
  color: green;
}

.selected-option {
  background-color: #d3e0ff;
  border-radius: 10px;
  padding: 10px;
  transition: background-color 0.3s ease-in-out;
}
</style>
