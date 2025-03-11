<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import thank from '../assets/download.png'; // التأكد من استيراد الصورة بشكل صحيح

const router = useRouter();
const message = ref('No message available');
const score = ref('No score available');

onMounted(() => {
  const storedResult = localStorage.getItem('examResult');
  if (storedResult) {
    const result = JSON.parse(storedResult);
    message.value = result.message || 'No message available';
    score.value = result.score || 'No score available';
  } else {
    // إذا لم تكن البيانات موجودة في localStorage
    message.value = 'No exam result found';
    score.value = 'No score available';
  }

  window.addEventListener('popstate', redirectToHome);
});



onBeforeUnmount(() => {
  window.removeEventListener('popstate', redirectToHome);
});

const redirectToHome = () => {
  // التأكد من أن البيانات موجودة قبل التوجيه إلى الصفحة الرئيسية
  const storedResult = localStorage.getItem('examResult');
  if (storedResult) {
    const result = JSON.parse(storedResult);
    // فقط قم بالتوجيه إذا كانت البيانات موجودة
    router.push({ name: 'home' });
  } else {
    // إظهار رسالة أو التعامل مع الحالة عندما لا تكون البيانات موجودة
    message.value = 'No exam result found';
    score.value = 'No score available';
    router.push({ name: 'home' });
  }
};


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
