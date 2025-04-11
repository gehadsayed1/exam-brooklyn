<template>
  <transition name="slide">
    <aside
      v-if="isSidebarOpen"  
      class="fixed md:static md:block w-64 min-h-screen bg-white shadow-lg z-50"
      :style="{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }"
    >
    <BadgeX  @click="isSidebarOpen = false" class="cursor-pointer md:hidden absolute top-4 right-4 hover:text-gray-400"/>
      <div class="p-4 font-bold pb-8 pt-17 text-xl flex justify-between items-center">
       
        <h1 class="font-bold text-primary">Brooklyn</h1>
        <img src="../../assets/logo.png" class="h-10" alt="" />
        
      </div>
      <ul class="space-y-2">
        <SidebarItem v-for="item in items" :key="item.name" :item="item" />
      </ul>
    </aside>
  </transition>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import SidebarItem from './SidebarItem.vue'
import { items } from './itemsLink'
import { BadgeX } from 'lucide-vue-next'

const isSidebarOpen = ref(true)  // Initially, the sidebar is closed.
const emitter = inject('emitter')



onMounted(() => {
  if (emitter) {
    emitter.on('toggle-sidebar', (isOpen) => {
      isSidebarOpen.value = isOpen
    })
  } else {
    console.error('Emitter is not available')
  }
})
</script>

<style scoped>
/* Apply smooth transition on transform */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s ease-in-out;
}

.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}
</style>
