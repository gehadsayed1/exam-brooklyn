<template>
  <div class="bg-white p-4 rounded shadow space-y-6 mt-8">
    <div v-if="questions.length">
      <!-- Header -->
      <div class="flex justify-between items-center mb-10">
        <div class="flex-1 justify-center flex">
          <span class="text-white ms-33 font-bold bg-indigo-600 rounded-full flex justify-center items-center w-10 h-10">
            {{ questions.length }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Go to:</label>
          <select v-model="currentQuestionIndex" class="border text-primary rounded-md px-2 py-1">
            <option v-for="(q, index) in questions" :key="index" :value="index">
              Question {{ index + 1 }}
            </option>
          </select>
        </div>
      </div>

      <!-- Question Form -->
      <div class="border p-4 rounded space-y-3 relative">
        <div>
          <label class="text-sm font-medium text-gray-700">Question Text</label>
          <input v-model="questions[currentQuestionIndex].question_text" type="text" class="w-full border bg-primary text-xl text-gray-50 px-5 py-3 rounded-md" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div><label class="text-sm">Option A</label><input v-model="questions[currentQuestionIndex].option_a" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" /></div>
          <div><label class="text-sm">Option B</label><input v-model="questions[currentQuestionIndex].option_b" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" /></div>
          <div><label class="text-sm">Option C</label><input v-model="questions[currentQuestionIndex].option_c" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" /></div>
          <div><label class="text-sm">Option D</label><input v-model="questions[currentQuestionIndex].option_d" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" /></div>
        </div>

        <div class="flex items-center text-center justify-center mt-4">
          <div>
            <label class="text-sm">Correct Option</label>
            <select v-model="questions[currentQuestionIndex].correct_option" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Question Button -->
    <div class="flex justify-end mt-6">
      <button @click="addQuestion" class="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer flex items-center gap-2 min-w-[140px]">
        + Add New Question
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="text-red-500 mt-4 text-center">
      <p>All fields are required. Please fill out all fields before adding a new question.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const emitter = inject('emitter')

// Local state for questions
const questions = ref([{
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_option: 'A'
}])  // Start with a single empty question

// State for the current question index
const currentQuestionIndex = ref(0)

// Error message state
const errorMessage = ref(false)

// Function to add a new question
const addQuestion = () => {
  // Get the current question fields
  const currentQuestion = questions.value[currentQuestionIndex.value]

  // Check if all fields are filled
  if (
    !currentQuestion.question_text ||
    !currentQuestion.option_a ||
    !currentQuestion.option_b ||
    !currentQuestion.option_c ||
    !currentQuestion.option_d ||
    !currentQuestion.correct_option
  ) {
    errorMessage.value = true
    return
  }

  // Clear the error message and add the question
  errorMessage.value = false

  // Filter out the incomplete questions before sending
  const validQuestions = questions.value.filter((question) => {
    return (
      question.question_text &&
      question.option_a &&
      question.option_b &&
      question.option_c &&
      question.option_d
    );
  });

  // Only emit valid questions
  emitter.emit('questions', validQuestions);
  const newQuestion = {
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A'
  };

  questions.value.push(newQuestion);
  currentQuestionIndex.value = questions.value.length - 1;
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
