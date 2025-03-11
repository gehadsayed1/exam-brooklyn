<template>
    <div class="text-center">
      <p class="text-xl font-semibold text-gray-900 dark:text-white">
        Time Left: 
        <span class="font-bold text-2xl text-primary border px-2 rounded-xl">
          {{ timeLeft }}
        </span>
        Seconds
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useStudentStore } from '../stores/studentStore';
  
  const studentStore = useStudentStore();
  const timeLeft = ref(studentStore.timeLeft);
  
  let interval;
  
  onMounted(() => {
    interval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        clearInterval(interval);
        studentStore.submitExam();
      }
    }, 1000);
  });
  
  onBeforeUnmount(() => {
    clearInterval(interval);
  });
  </script>
  