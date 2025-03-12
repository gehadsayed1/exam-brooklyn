<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import thank from "../assets/thank.png"; 

const router = useRouter();
const message = ref('No message available');
const score = ref('No score available');

const redirectToHome = () => {
  console.log("📌 User tried to go back! Redirecting to home...");
  window.location.replace('/'); // 
};


onMounted(() => {
  const storedResult = localStorage.getItem('examResult');
  if (storedResult) {
    const result = JSON.parse(storedResult);
    message.value = result.message || 'No message available';
    score.value = result.score || 'No score available';
  } else {
    message.value = 'No exam result found';
    score.value = 'No score available';
  }

 
  history.pushState(null, null, window.location.href);
  window.addEventListener('popstate', redirectToHome);
});


onBeforeUnmount(() => {
  window.removeEventListener('popstate', redirectToHome);
});

// Debugging
console.log('Message:', message.value);  
console.log('Score:', score.value); 
</script>

<template>
  <div class="flex flex-col items-center justify-center h-[70vh]">
    <img :src="thank" alt="Thank you image">
    <h1 class="text-2xl text-green-700 font-bold mb-4 mt-10">{{ message }}</h1>
    <p class="text-lg">Your score: <span class="font-bold text-primary">({{ score }})</span></p>
  </div>
</template>
