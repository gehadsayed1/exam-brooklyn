<template>
  <div class="theme-switcher" @click="toggleTheme">
    <div class="toggle-button" :class="{ 'dark-mode': theme === 'dark' }">
      <Sun v-if="theme === 'light'" class="icon" />
      <Moon v-else class="icon" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Sun, Moon } from "lucide-vue-next"; 

const theme = ref("light");

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
  document.documentElement.classList.toggle("dark", theme.value === "dark");
  localStorage.setItem("theme", theme.value);
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    theme.value = savedTheme;
    document.documentElement.classList.toggle("dark", theme.value === "dark");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    theme.value = "dark";
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
});
</script>

<style scoped>

.theme-switcher {
  width: 50px;
  height: 20px;
  background-color: #ddd;
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding: 3px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  position: relative;
}


.dark .theme-switcher {
  background-color: #405a85;
}


.toggle-button {
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-in-out;
  position: absolute;
  left: 3px; 
}


.dark-mode {
  transform: translateX(30px);
}


.icon {
  width: 16px;
  height: 16px;
  transition: opacity 0.3s ease-in-out;
}
</style>
