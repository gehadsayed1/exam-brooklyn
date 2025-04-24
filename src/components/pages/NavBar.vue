<template>
  <nav class="bg-[#EEEEEE] dark:bg-gray-700">
    <div class="max-w-screen-xl mx-auto px-4">
      <div class="flex justify-between items-center py-2">
        <!-- Logo -->
        <router-link to="/systems" class="flex items-center">
          <img :src="logo" class="h-10" alt="Logo" />
        </router-link>

        <!-- Right Side (User/Auth) -->
        <div class="flex items-center gap-4">
          <!-- Theme Toggle -->
          <Toggle />

          <!-- User Profile or Login Button -->
          <div v-if="user" class="relative group">
            <!-- User Info (Name + Icon) -->
            <div
              class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              @click="toggleDropdown"
            >
              <strong>Welcome,</strong>
              <span v-if="user.name" class="font-semibold text-gray-700 dark:text-gray-200">{{
                user.name
              }}</span>
              <UserIcon class="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </div>

            <!-- Dropdown Menu -->
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
            >
              <div class="py-1">
                <hr class="border-gray-200 dark:border-gray-600" />
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="closeDropdown"
                >
                  Profile
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
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import logo from "../../assets/logo.png";
import Toggle from "./ToggleTheme.vue";
import { useAuthStore } from "@/stores/auth";
import { LogOutIcon, UserIcon } from "lucide-vue-next";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const router = useRouter();
const isDropdownOpen = ref(false);

// Toggle Dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Close Dropdown on Click Outside
const closeDropdown = () => {
  isDropdownOpen.value = false;
};
// watchEffect(() => {
//   if (!authStore.permissions.length && authStore.token) {
//     authStore.getUserByToken();
//   }
// });

onMounted(() => {
  if (authStore.token) {
    authStore.getUserByToken();
  }
});
// Logout Handler
const handleLogout = async () => {
  await authStore.logout();
  closeDropdown();
  router.push({ name: "login" });
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
