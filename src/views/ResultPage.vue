<script setup>
import { useRoute } from 'vue-router';
import thank from '../assets/download.png';
const route = useRoute();
const message = route.query.message || 'تم التقديم بنجاح';
const score = route.query.score || 0;
</script>

<template>
    <div class="flex flex-col items-center justify-center h-[70vh]">
        <img :src="thank" alt="">
        <h1 class="text-3xl font-bold mb-4 mt-10">{{ message }}</h1>
        <p class="text-lg">Your score: <span class="font-bold text-primary">({{ score }})</span></p>
    </div>
</template>