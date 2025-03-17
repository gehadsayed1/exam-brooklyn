<script setup>
import { onMounted, onBeforeUnmount } from "vue"; 
import thank from "../assets/thank.png"; 



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
 <div class="h-[100vh]  dark:bg-gray-700 py-30 "> 
  <div class="flex flex-col items-center justify-center ">
    <img :src="thank" alt="Thank you image">
    <h1 class="text-2xl text-green-700 font-bold mb-4 mt-10">Exam submitted successfully</h1>
  </div>
 </div>
</template>
