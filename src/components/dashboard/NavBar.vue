<template>
    <header class="bg-white shadow-md p-4 flex  justify-between items-center rounded">
        <button class="md:hidden cursor-pointer" @click="toggleSidebar"><AlignLeft /></button>
      <h1 class="text-lg  ms-2 font-bold">Dashboard</h1>
      <div class="flex items-center ">
       <img class="rounded-full w-10 h-10" src="../../assets/avatar-1.png" alt="">
      </div>
      
    </header>
  </template>
  
  <script setup>
import { getCurrentInstance } from 'vue'
import { AlignLeft } from 'lucide-vue-next'

  
  const { proxy } = getCurrentInstance()
  
  const toggleSidebar = () => {
    proxy.emitter.emit('toggle-sidebar')
  }
  </script>


  