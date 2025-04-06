<template>
  <div class="space-y-4 mt-8 border-b-1 border-gray-200 pb-10">
    <!-- Exam Name -->
    <div>
      <label class="block text-sm text-gray-700">Exam Name</label>
      <input
        v-model="modelValue.name"
        type="text"
        class="w-full border focus:border-blue-500 focus:outline-none shadow-md focus:shadow-blue-200 px-3 py-2 rounded-md "
      />
      <p v-if="errors?.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm  text-gray-700">Description</label>
      <textarea
        v-model="modelValue.description"
        class="w-full border focus:border-blue-500 shadow-md focus:shadow-blue-200 focus:outline-none px-3 py-2 rounded-md"
      ></textarea>
      <p v-if="errors?.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
    </div>

    <!-- Duration -->
    <div>
      <label class="block text-sm text-gray-700">Duration (minutes)</label>
      <input
        v-model.number="modelValue.duration"
        type="number"
        class="w-full border focus:border-blue-500 shadow-md focus:shadow-blue-200 focus:outline-none   px-3 py-2 rounded-md"
      />
      <p v-if="errors?.duration" class="text-red-500 text-sm mt-1">{{ errors.duration }}</p>
    </div>
  </div>
</template>

<script setup>
const modelValue = defineModel()
defineProps({
  errors: Object
})
</script>
