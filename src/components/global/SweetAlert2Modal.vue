<template>
  <div v-if="showAlert" class="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
      <p>{{ text }}</p>
      <div class="flex justify-end gap-3 mt-6">
        <button 
          @click="onCancel" 
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition">
          {{ cancelButtonText }}
        </button>
        <button 
          @click="onConfirm" 
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 min-w-[90px] flex justify-center items-center"
          :disabled="isProcessing"
        >
          <!-- Spinner inside the button if deleting -->
          <span v-if="isProcessing" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
          {{ confirmButtonText }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Are you sure?',
  },
  text: {
    type: String,
    default: 'This action cannot be undone.',
  },
  confirmButtonText: {
    type: String,
    default: 'Yes, delete it!',
  },
  cancelButtonText: {
    type: String,
    default: 'Cancel',
  },
});

// Emits
const emit = defineEmits(['confirm', 'cancel']);

const showAlert = ref(true);
const isProcessing = ref(false); // Track processing state

const onConfirm = () => {
  isProcessing.value = true;  // Set to true when the process starts (e.g., delete)
  emit('confirm');
};

const onCancel = () => {
  showAlert.value = false;
  emit('cancel');
};
</script>

<style scoped>
/* Optional: Customize styles further if needed */
</style>
