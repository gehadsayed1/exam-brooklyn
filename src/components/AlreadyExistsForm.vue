<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStudentStore } from "../stores/studentStore";
import { IdCard } from "lucide-vue-next";

const studentStore = useStudentStore();
const router = useRouter();
const isSubmitting = ref(false);
let timeout = null; 

const examData = localStorage.getItem("exam");
if (examData) {
  router.replace({ name: "exam" });
   
}

watch(() => studentStore.studentId, (newId) => {
  if (timeout) {
    clearTimeout(timeout); 
  }

  if (newId) {
    timeout = setTimeout(() => {
      studentStore.fetchCourses(); 
    }, 500); 
  }
});

watch(() => studentStore.selectedModule, (newModule) => {
  if (newModule) {
    studentStore.fetchInstructors();
  }
});

const submitForm = async () => {
  isSubmitting.value = true; 
  await studentStore.submitForm();
  isSubmitting.value = false; 

  if (studentStore.error === null) {
    // Empty the form after successful submission
    studentStore.studentId = ''; 
    studentStore.selectedModule = null;
    studentStore.selectedInstructor = null;

    router.replace({ name: "exam" }); 
  }
};
</script>

<template>
  <div class="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
    <div class="mb-5 relative">
      <label for="name-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Student ID:
      </label>

      <div class="relative">
        <IdCard class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size="20" />
        <input v-model="studentStore.studentId" type="text" id="name-input" placeholder="Enter Your ID"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
    </div>

    <div class="mb-5" v-show="studentStore.courses.data">
      <label for="module-select" class="block text-sm font-medium text-gray-900">Module Name:</label>
      <select  v-model="studentStore.selectedModule" id="module-select" class="input-field ">
        <option value="" disabled>Choose a Module</option>
        <option class="dark:bg-gray-800" v-for="course in studentStore.courses.data" :key="course.id" :value="course.id">
          {{ course.name }}
        </option>
      </select>
    </div>

    <div class="mb-5" v-show="studentStore.instructors.data">
      <label for="instructor-select" class="block text-sm font-medium text-gray-900">Instructor:</label>
      <select v-model="studentStore.selectedInstructor" id="instructor-select" class="input-field">
        <option value="" disabled>Choose an Instructor</option>
        <option class="dark:bg-gray-800" v-for="instructor in studentStore.instructors.data" :key="instructor.id" :value="instructor.id">
          {{ instructor.name }}
        </option>
      </select>
    </div>

    <button 
      v-show="studentStore.selectedModule && studentStore.selectedInstructor" 
      @click="submitForm"
      type="button"
      class="btn-primary bg-primary flex items-center justify-center"
      :disabled="isSubmitting"
    >
      <span v-if="isSubmitting" class="loader"></span>
      <span v-else>Submit</span>
    </button>

    <p v-if="studentStore.loading" class="text-blue-600 mt-2">Loading...</p>
    <p v-if="studentStore.error" class="text-red-600">{{ studentStore.error }}</p>
  </div>
</template>

<style scoped>
.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: border 0.3s ease;
}
.input-field:focus {
  border-color: #007bff;
}
.btn-primary {
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  text-align: center;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.loader {
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #007bff;
  width: 24px;
  height: 24px;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
