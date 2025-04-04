<template>
    <li>
      <div
        class="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
        @click="toggle"
      >
        <span class="ml-4 font-bold text-gray-800 text-lg">{{ item.name }}</span>
  
        <span v-if="item.children">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            :class="{ 'rotate-90': open }"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
  
   
      <ul v-if="open && item.children" class="pl-8 list-disc ml-6">
        <li
          v-for="child in item.children"
          :key="child.name"
          class="p-2 hover:bg-gray-100 cursor-pointer font-semibold text-gray-600"
          @click="router.push({ name: child.route})"
        >
          {{ child.name }}
        </li>
      </ul>
    </li>
  </template>
  
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const props = defineProps({ item: Object })
  const open = ref(false)
  const router = useRouter()
  
  const toggle = () => {
    if (props.item.children) {
      open.value = !open.value
    } else if (props.item.route) {
      router.push(props.item.route)
    }
  }
  </script>
  