<script setup>
import Nav from "./components/pages/NavBar.vue"
</script>

<template>
  <div class="dark:bg-gray-800 min-h-screen">
    <Nav />
    <router-view></router-view> 
  </div>
 
</template>


