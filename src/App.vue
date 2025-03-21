<script setup>
import Nav from "./components/NavBar.vue"
</script>

<template>
  <div class="dark:bg-gray-800 min-h-screen">
    <Nav />
    <router-view></router-view> 
  </div>
 
</template>


