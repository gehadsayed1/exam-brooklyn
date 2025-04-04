
<script setup>
import Nav from "@/components/pages/NavBar.vue"
import { useRoute } from "vue-router"

const route = useRoute()
</script>

<template>
  <div class="dark:bg-gray-800 min-h-screen">
    <Nav v-if="!route.path.startsWith('/dashboard')" />
    
    <router-view />
  </div>
</template>



