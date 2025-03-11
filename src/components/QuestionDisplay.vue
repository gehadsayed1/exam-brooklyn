<template>
    <div v-if="currentQuestion" class="question-container">
      <h3 class="text-xl font-bold text-center border border-gray-300 p-4 rounded-2xl shadow bg-primary text-gray-200 dark:bg-primary dark:text-gray-800">
        {{ currentQuestion.question_text }}
      </h3>
      <div v-for="(option, key) in currentQuestion.options" :key="key"
           class="option flex items-center gap-3 mt-2 border border-primary p-2 rounded-2xl cursor-pointer transition-all dark:border-gray-600"
           :class="{ 'selected-option': selectedOption === key }" @click="selectOption(key)">
        <input type="radio" :id="'option-' + key" v-model="selectedOption" :value="key" class="radio-btn" />
        <label :for="'option-' + key" class="w-full cursor-pointer text-gray-900 dark:text-white">{{ option }}</label>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue';
  import { useStudentStore } from '../stores/studentStore';
  
  const studentStore = useStudentStore();
  const selectedOption = ref(null);
  
  const currentQuestion = computed(() => {
    return studentStore.questions[studentStore.currentQuestionIndex] || null;
  });
  
  const selectOption = (key) => {
    selectedOption.value = key;
  };
  
  </script>
  
  <style scoped>
  .selected-option {
    background-color: #d3e0ff;
    border-radius: 10px;
    padding: 10px;
    transition: background-color 0.3s ease-in-out;
  }
  </style>
  