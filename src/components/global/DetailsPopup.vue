<template>
    <div
     v-if="(isExam || isInstructors || isEmployee || isCourse) && Object.keys(selectedExam).length"
      class="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ease-in-out"
    >
      <div class="bg-white relative p-8 rounded-lg shadow-2xl max-w-lg w-full transform transition-all duration-500 ease-in-out scale-95 hover:scale-100">
        <!-- Modal Header -->
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">{{ isExam && 'Exam' || isInstructors && 'Instructor'|| isEmployee && 'Employee' || isCourse && 'Course' }} Details</h2>
          <div class="border-b-2 border-gray-300 mb-4"></div>
        </div>
  
        <!-- Modal Content -->
        <div v-if="isExam">
          <p class="text-gray-700 text-sm mb-2">
            <strong class="text-primary font-medium">Description:</strong> {{ selectedExam.description }}
          </p>
          <p class="text-gray-700 text-sm mb-2">
            <strong class="text-primary font-medium">Questions Count:</strong> {{ selectedExam.questions_count }}
          </p>
          <p class="text-gray-700 text-sm mb-2">
            <strong class="text-primary font-medium">Created At:</strong> {{ formatDate(selectedExam.created_at) }}
          </p>
        </div>
  
        <div v-if="isInstructors">
          <p class="text-gray-700 text-sm mb-2">
            <strong class="text-primary font-medium">Phone:</strong> {{ selectedExam.phone }}
          </p>
          <p class="text-gray-700 text-sm mb-2">
            <strong class="text-primary font-medium">Updated At:</strong> {{ selectedExam.updated_at }}
          </p>
          <p class="text-gray-700 text-sm mb-2">
            <strong class="text-primary font-medium">Created At:</strong> {{ formatDate(selectedExam.created_at) }}
          </p>
        </div>
  
        <div v-if="isEmployee">
          <p class="text-gray-700 text-sm mb-2">
            <strong class="text-primary font-medium">Email:</strong> {{ selectedExam.email }}
          </p>
          <p class="text-gray-700 text-sm mb-2">
            <strong class="text-primary font-medium">Branch:</strong> {{ selectedExam.branch && selectedExam.branch.name  || "No Branch" }}
          </p>
          <p class="text-gray-700 text-sm mb-2">
            <strong class="text-primary font-medium">Created At:</strong> {{ formatDate(selectedExam.created_at) }}
          </p>
        </div>

        <div v-if="isCourse">
          <p class="text-gray-700 text-sm mb-2">
            <strong class="text-primary font-medium">Scholarship:</strong> {{ selectedExam.scholarship && selectedExam.scholarship.filter((scholarship) => scholarship.name).map((scholarship) => `(${scholarship.name})`).join(', ')  || "No Scholarship" }}
          </p>
        
        </div>


  
        <!-- Modal Footer -->
        <div class="mt-6 flex justify-end">
          <button
            @click="closeModal"
            class="px-6 py-2 bg-indigo-600 cursor-pointer text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    selectedExam: {
      type: Object,
      required: true
    },
    isExam: {
      type: Boolean,
      required: true
    },
    isInstructors: {
      type: Boolean,
      required: true
    },
    isEmployee : {
      type: Boolean,
      required: true
    },
    isCourse : {
      type: Boolean,
      required: true
    }
  });
  
  const emit = defineEmits(['close']);
  
  const formatDate = (date) => {
    if (!date) return "";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleString("en-US", options);
  };
  
  const closeModal = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  /* Optional: Add any custom styles for the modal */
  </style>
  