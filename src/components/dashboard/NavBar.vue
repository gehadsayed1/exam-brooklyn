<template>
  <header class="bg-white shadow-md p-4 flex justify-between items-center rounded relative">

    <button class="cursor-pointer" @click="toggleSidebar">
      <AlignLeft class="w-6 h-6" />
    </button>

    <h1 class="text-lg ms-2 font-bold">Dashboard</h1>

    <div class="flex items-center gap-3 relative" @click="toggleMenu">
      <router-link to="/systems" class="text-primary hover:text-blue-800">
        <HomeIcon class="w-6 h-6" />
      </router-link>
      <div class="flex items-center gap-2 cursor-pointer">
        <div class="text-gray-700 dark:text-gray-200 font-semibold text-sm flex items-center">
          <strong>Welcome,</strong><span class="text-primary">({{ user?.name || 'Loading...' }})</span>
        </div>
        <img class="rounded-full w-8 h-8" src="../../assets/avatar-1.png" alt="User Avatar" />
      </div>
      <transition name="fade">
        <div v-if="isMenuOpen" class="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 
                 dark:border-gray-600 rounded-lg shadow-lg z-50" @click.stop>
          <div class="py-1">
            <router-link to="/profile" class="block px-4 py-2 text-md font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 
                     dark:hover:bg-gray-600" @click="closeMenu">
              My Profile
            </router-link>
            <button class="w-full text-right  flex gap-2 items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 
                     hover:bg-gray-100 dark:hover:bg-gray-600" @click="authStore.logout()">
              <LogOut class="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { AlignLeft, HomeIcon, LogOut } from 'lucide-vue-next';
import { inject } from 'vue';
import { useAuthStore } from '@/stores/auth';


const authStore = useAuthStore();

const user = computed(() => authStore.user);
const emitter = inject('emitter');
const isSidebarOpen = ref(false);
const isMenuOpen = ref(false);





const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};



const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  emitter?.emit('toggle-sidebar', isSidebarOpen.value);
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>