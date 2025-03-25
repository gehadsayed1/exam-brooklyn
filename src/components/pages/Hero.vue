<script setup>
import ExistingStudentComponent from "./AlreadyExistsForm.vue";
import hero from "../../assets/hero.webp";


</script>

<template>
  <div class="login dark:bg-gray-900 min-h-screen">
    <div class="grid sm:grid-cols-2 grid-cols-1 p-5 sm:p-0 relative">
      <div class="relative w-[90%] h-[110vh] hidden sm:block">
        <img :src="hero" alt="hero img" class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center w-[70%]">
            <h3 class="font-bold text-5xl md:text-6xl  text-gray-100">
              Knowledge From Home
            </h3>
          </div>
        </div>
      </div>
      <div>
        <div class="flex justify-start items-center pt-5">
          <h2
            class="text-primary dark:text-white relative text-4xl font-bold after:content-[''] after:block after:bg-primary after:w-[100px] after:h-[4px] after:rounded-2xl after:mt-2">
            Sign In
          </h2>
        </div>
       <div class="mt-20">
        <ExistingStudentComponent />
       </div>
      </div>
    </div>
  </div>
</template>
