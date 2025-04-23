<template>
  <transition name="slide">
    <aside
      v-if="isSidebarOpen"  
      class="fixed md:static md:block w-64 min-h-screen bg-white shadow-lg z-50"
      :style="{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }"
    >
    <X   @click="isSidebarOpen = false" class="cursor-pointer md:hidden absolute top-4 w-4 h-4 right-4 hover:text-gray-400"/>
      <div class="p-4 font-bold pb-8 pt-8 text-xl flex justify-between items-center">
       
        <h1 class="font-bold text-primary">Brooklyn</h1>
        <img src="../../assets/logo.png" class="h-10" alt="" />
        
      </div>
      <ul class="space-y-2">
        <SidebarItem v-for="item in filteredItems" :key="item.name" :item="item" />
      </ul>
    </aside>
  </transition>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import SidebarItem from './SidebarItem.vue'
import { items } from './itemsLink'
import { X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'



const authStore = useAuthStore()
const permissions = authStore.permissions || []
const router = useRouter()


const isSidebarOpen = ref(true)  // Initially, the sidebar is closed.
const emitter = inject('emitter')

function hasPermission(permissionName) {
  return permissions.includes(permissionName)
}

function getRouteMeta(routeName) {
  const route = router.getRoutes().find(r => r.name === routeName)
  return route?.meta || {}
}

const filteredItems = items
  .map(item => {
    // لو فيه أطفال، فلترهم
    if (item.children) {
      const filteredChildren = item.children.filter(child => {
        const meta = getRouteMeta(child.route)
        return !meta.requiresPermission || hasPermission(meta.requiresPermission)
      })

      return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null
    } else {
      const meta = getRouteMeta(item.route)
      return !meta.requiresPermission || hasPermission(meta.requiresPermission) ? item : null
    }
  })
  .filter(Boolean)


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
