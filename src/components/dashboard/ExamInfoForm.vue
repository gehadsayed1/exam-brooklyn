<template>
    <div class="space-y-4 mt-8">
      <div>
        <label class="block text-sm text-gray-700">Exam Name</label>
        <input v-model="modelValue.name" type="text" class="w-full border px-3 py-2 rounded" />
      </div>
  
      <div>
        <label class="block text-sm text-gray-700">Description</label>
        <textarea v-model="modelValue.description" class="w-full border px-3 py-2 rounded"></textarea>
      </div>
  
      <div>
        <label class="block text-sm text-gray-700">Duration (minutes)</label>
        <input v-model.number="modelValue.duration" type="number" class="w-full border px-3 py-2 rounded" />
      </div>
    </div>
  </template>
  
  <script setup>
  const modelValue = defineModel()
  </script>
  