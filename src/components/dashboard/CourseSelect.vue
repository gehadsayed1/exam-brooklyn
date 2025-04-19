<template>
  <div class="space-y-6">
    <!-- Select courses -->
    <div class="flex items-end w-[400px] justify-center gap-2">
      <div>
        <label class="text-gray-700 font-medium block mb-1">Select Course:</label>
        <select v-model="selectedCourse"
          class="w-[200px] border border-indigo-500 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <option disabled value="">Choose Courses</option>
          <option v-for="course in courseStore.courses" :key="course.id" :value="course.id">
            {{ course.name }}
          </option>
        </select>
      </div>
      <div class="flex gap-2">
        <RouterLink to="/dashboard/courses"
          class="bg-gray-200 hover:text-indigo-600 font-semibold text-gray-700 px-3 py-2 rounded hover:bg-gray-300 flex items-center gap-1">
          <Plus class="w-6 h-6 text-indigo-600 font-bold" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useCourseStore } from "@/stores/courseStore";
import { Plus } from "lucide-vue-next";
import { RouterLink } from "vue-router";
import { useStudentStore } from "@/stores/studentStore";


const studentStore = useStudentStore();
const modelValue = defineModel();
const courseStore = useCourseStore();
const selectedCourse = ref("");



onMounted(() => {
  courseStore.fetchCourses();
  selectedCourse.value = modelValue.value; 
});

watch(selectedCourse, (val) => {
  modelValue.value = val;
});

watch(modelValue, (val) => {
  selectedCourse.value = val;
});

watch(
  () => selectedCourse.value,
  (newModule) => {
    if (newModule) {
      studentStore.selectedModule = newModule;
      studentStore.fetchInstructors();
    }
  }
);

</script>
