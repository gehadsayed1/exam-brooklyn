<template>
    <div
      v-if="showModal"
      class="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-purple-600 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 class="text-2xl font-semibold text-white mb-4">{{ modalTitle }}</h2>
        <div class="space-y-4">
          <!-- Name input with icon -->
          <div class="relative">
            <label class="block text-sm text-gray-200 mb-1">Name</label>
            <div class="flex items-center space-x-2">
              <LucideUser class="text-gray-500 w-5 h-5 absolute left-3" />
              <input
                v-model="form.name"
                class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2 pl-10"
                type="text"
                placeholder="Enter name"
              />
            </div>
          </div>
  
          <!-- Phone input with icon (for instructors) -->
          <div v-if="isInstructor" class="relative">
            <label class="block text-sm text-gray-200 mb-1">Phone</label>
            <div class="flex items-center space-x-2">
              <LucidePhone class="text-gray-200 w-5 h-5 absolute left-3" />
              <input
                v-model="form.phone"
                class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2 pl-10"
                type="text"
                placeholder="Enter phone number"
              />
            </div>
          </div>
  
          <!-- Course code input with icon (for courses) -->
          <div v-if="isCourse" class="relative">
            <label class="block text-sm text-gray-200 mb-1">Course Code</label>
            <div class="flex items-center space-x-2">
              <LucideCode class="text-gray-400 w-5 h-5 absolute left-3" />
              <input
                v-model="form.code"
                class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2 pl-10"
                type="text"
                placeholder="Enter course code"
              />
            </div>
          </div>
        </div>
  
        <div class="flex justify-end gap-3 mt-6">
          <!-- Delete button with spinner -->
          <button
            @click="deleteItem"
            :disabled="isDeleteButtonDisabled"
            class="delete-button min-w-[90px] flex justify-center items-center"
          >
            <span
              v-if="deleting"
              class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"
            ></span>
            Delete
          </button>
          <!-- Save button with spinner -->
          <button
            @click="saveData"
            :disabled="isSaveButtonDisabled"
            class="save-button min-w-[90px] flex justify-center items-center"
          >
            <span
              v-if="saving"
              class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"
            ></span>
            Save
          </button>
        </div>
  
        <button
          @click="closeModal"
          class="absolute top-2 right-2 text-red-800 cursor-pointer hover:text-gray-600 hover:text-3xl text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { LucideUser, LucidePhone, LucideCode } from "lucide-vue-next"; // Import the icons
  
  // Props passed to the modal
  const props = defineProps({
    showModal: Boolean,
    modalTitle: String,
    form: Object,
    saving: Boolean,
    isInstructor: Boolean, 
    isCourse: Boolean, 
  });
  
  // Emits to communicate with the parent
  const emit = defineEmits(["closeModal", "saveData"]);
  
  // Track if deleting is in process
  const deleting = ref(false);
  
  // Track original form data to compare with the current one
  const originalForm = ref({ ...props.form });
  
  // Close the modal
  const closeModal = () => {
    emit("closeModal");
  };
  
  // Save the data (emit to parent)
  const saveData = () => {
    emit("saveData");
  };
  
  // Check if the save button should be disabled
  const isSaveButtonDisabled = computed(() => {
    // Check if form fields are empty or unchanged (i.e., if no editing happened)
    const formChanged =
      props.form.name !== originalForm.value.name ||
      (props.isInstructor && props.form.phone !== originalForm.value.phone) ||
      (props.isCourse && props.form.code !== originalForm.value.code);
    return !formChanged || !props.form.name || (props.isInstructor && !props.form.phone) || (props.isCourse && !props.form.code);
  });
  
  // Check if delete button should be disabled
  const isDeleteButtonDisabled = computed(() => {
    return deleting.value; // Disable delete button while deleting
  });
  
  // Delete item handler
  const deleteItem = () => {
    deleting.value = true;
    // Simulate async deletion process (call parent method)
    setTimeout(() => {
      deleting.value = false;
      // After deletion, emit the delete event
      emit("delete");
    }, 2000);
  };
  </script>
  
  <style scoped>
  /* Optional: Customize the button styles and spinner animations */
  </style>
  