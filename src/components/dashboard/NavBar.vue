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
      <div class="flex items-center  cursor-pointer">
        <div class="text-gray-700 gap-2 dark:text-gray-200 font-semibold text-sm flex items-center">
          <div>
            <strong>Welcome, </strong>
              <span v-if="user.name" class="font-semibold text-gray-700 dark:text-gray-200">
                
           {{ user.name }}

              </span>
          </div>
              <UserIcon class="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </div>
      </div>
      <transition name="fade">
        <div v-if="isMenuOpen" class="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 
                 dark:border-gray-600 rounded-lg shadow-lg z-50" @click.stop>
          <div class="py-1">
            <router-link to="/profile" class="block px-4 py-2 text-md font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 
                     dark:hover:bg-gray-600" @click="closeMenu">
              My Profile
            </router-link>
            <button
                  class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex gap-2 items-center"
                  @click="handleLogout"
                >
                  <span v-if="authStore.loading">
                    <i class="fa-solid fa-circle-notch fa-spin-pulse"></i
                  ></span>
                  <span v-else class="flex items-center gap-2">
                    <LogOutIcon class="w-4 h-4" />
                    Logout
                  </span>
                </button>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { AlignLeft, HomeIcon, LogOut, LogOutIcon, UserIcon } from 'lucide-vue-next';
import { inject } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';


const authStore = useAuthStore();
const router = useRouter()

const user = computed(() => authStore.user);
const emitter = inject('emitter');
const isSidebarOpen = ref(false);
const isMenuOpen = ref(false);




const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: "login" });
};
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