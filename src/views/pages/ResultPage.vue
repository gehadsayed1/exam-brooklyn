<script setup>
import { onMounted, onBeforeUnmount } from "vue"; 
import thank from "../../assets/thank.png"; 


const redirectToHome = () => {
  window.location.replace('/'); 
};

// Force redirect to home when back button is pressed
onMounted(() => {
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', redirectToHome);
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', redirectToHome);
});
</script>

<template>
 <div class="h-[100vh]  dark:bg-gray-800 py-30 "> 
  <div class="flex flex-col items-center justify-center ">
    <img :src="thank" alt="Thank you image">
    <h1 class="text-2xl text-green-700 font-bold mb-4 mt-10">Exam submitted successfully</h1>
    <button @click="redirectToHome" class="bg-primary w-1/4  cursor-pointer text-white py-2 font-semibold px-6 rounded-lg hover:bg-blue-600">Home</button>
  </div>
 </div>
</template>
