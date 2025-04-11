<template>
  <header class="bg-white shadow-md p-4 flex justify-between items-center rounded">
    <!-- Burger Icon that toggles the sidebar -->
    <button class="cursor-pointer" @click="toggleSidebar">
      <AlignLeft class="w-6 h-6" />
    </button>
   
    <h1 class="text-lg ms-2 font-bold">Dashboard</h1>
    <div class="flex items-center gap-3">
      <router-link to="/systems" class="text-primary hover:text-blue-800">
        <HomeIcon class="w-6 h-6" />
      </router-link>
      <img class="rounded-full w-10 h-10" src="../../assets/avatar-1.png" alt="" />
    </div>
  </header>
</template>

<script setup>
import { inject, ref } from 'vue'
import { AlignLeft, HomeIcon } from 'lucide-vue-next'

const emitter = inject('emitter')


const isSidebarOpen = ref(false)  

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value

  if (emitter) {
    emitter.emit('toggle-sidebar', isSidebarOpen.value)
  } else {
    console.error('Emitter is not available')
  }
}
</script>
