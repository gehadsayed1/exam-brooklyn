<template>
    <div class="flex min-h-screen bg-blue-50">
      <!-- Sidebar -->
      <Sidebar :is-open="sidebarOpen" @toggle="sidebarOpen = !sidebarOpen" />
  
      <!-- Main content -->
      <div class="flex-1 flex flex-col">
        <!-- Navbar -->
        <Navbar />
  
        <!-- Content area -->
        <main class="flex-1 p-4 bg-blue-50">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, getCurrentInstance } from 'vue'
  import Sidebar from './Sidebar.vue'
  import Navbar from './Navbar.vue'
  
  const sidebarOpen = ref(true)
  
  const { proxy } = getCurrentInstance()
  

  onMounted(() => {
  console.log('sidebar mount check')
  proxy.emitter.on('toggle-sidebar', () => {
    console.log('event received!')
    sidebarOpen.value = !sidebarOpen.value

    console.log('sidebarOpen', sidebarOpen.value);
    
  })
})

  </script>
  