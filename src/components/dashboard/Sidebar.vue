<template>
    <transition name="slide">
      <aside
        v-show="shouldShow"
        class="fixed md:static md:block w-64 min-h-screen bg-white   shadow-lg z-50"
      >
        <div class="p-4 font-bold pb-10 text-xl flex justify-between items-center">
          <h1 class=" font-bold text-primary">Brooklyn</h1>
          <img src="../../assets/logo.png" class="h-10" alt="">
          <button class="md:hidden cursor-pointer text-gray-500" @click="closeSidebar"><CircleX /></button>
        </div>
        <ul class="space-y-2  ">
          <SidebarItem v-for="item in items" :key="item.name" :item="item" />
        </ul>
      </aside>
    </transition>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import SidebarItem from './SidebarItem.vue'
  import { CircleX } from 'lucide-vue-next'
  import {items } from './itemsLink'
  
  const props = defineProps({ isOpen: Boolean })
  const emit = defineEmits(['toggle'])
  
 
  

  const isDesktop = ref(window.innerWidth >= 768)
  
  const updateScreen = () => {
    isDesktop.value = window.innerWidth >= 768
  }
  
  onMounted(() => {
    window.addEventListener('resize', updateScreen)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScreen)
  })
  
  const shouldShow = computed(() => {
    return isDesktop.value || props.isOpen
  })
  
  const closeSidebar = () => {
    emit('toggle')
  }
  </script>
  
  <style scoped>
  .slide-enter-active, .slide-leave-active {
    transition: transform 0.3s ease;
  }
  .slide-enter-from, .slide-leave-to {
    transform: translateX(-100%);
  }
  </style>
  