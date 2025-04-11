<script setup>
import logo from "../../assets/logo.png"
import Toggle from "./ToggleTheme.vue"

</script>

<template>
<nav class="bg-[#EEEEEE] dark:bg-gray-700">
 <div class="@container">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
    <router-link to="/systems" class="flex items-center">
        <img :src="logo" class="h-10" alt="Logo" />
    </router-link>
    <div  >
      <Toggle/>
    </div>
  </div>
 </div>
</nav>

</template>

