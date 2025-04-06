<template>
  <div class="space-y-6">
    <!-- Select courses -->
    <div class="flex items-end w-[400px] justify-center gap-2">
      <div>
        <label class="text-gray-700 font-medium block mb-1"
          >Select Course:</label
        >
        <select
          v-model="selectedCourse"
          class="w-[200px] border  border-indigo-500 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option disabled value="">Choose Courses</option>
          <option
            v-for="course in courseStore.courses"
            :key="course.id"
            :value="course.id"
          >
            {{ course.name }}
          </option>
        </select>
      </div>
      <div class="flex gap-2">
        <button
          class="bg-indigo-500 text-white px-2 py-2 rounded hover:bg-indigo-600 flex items-center gap-1"
          @click="toggleForm"
        >
          <Plus class="w-3 h-4" /> Add
        </button>
        <RouterLink
          to="/dashboard/courses"
          class="bg-gray-200 hover:text-indigo-600 font-semibold text-gray-700 px-3 py-2 rounded hover:bg-gray-300 flex items-center gap-1"
        >
          <Eye class="w-5 h-4" /> View
        </RouterLink>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditing ? "Edit Course" : "Add Course" }}
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Course Code</label>
            <input
              v-model="form.code"
              class="w-full border rounded px-3 py-2"
              type="text"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Course Name</label>
            <input
              v-model="form.name"
              class="w-full border rounded px-3 py-2"
              type="text"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Scholarships</label>
            <select
              v-model="form.scholarship_ids"
              multiple
              class="w-full border rounded px-3 py-2"
            >
              <option v-for="s in scholarships" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="toggleForm"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="saveCourse"
            :disabled="saving"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 min-w-[90px] flex justify-center items-center"
          >
            <span
              v-if="saving"
              class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"
            ></span>
            Save
          </button>
        </div>
        <button
          @click="toggleForm"
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useCourseStore } from "@/stores/courseStore";
import { Eye, Plus } from "lucide-vue-next";
import { RouterLink } from "vue-router";

const modelValue = defineModel();

const courseStore = useCourseStore();
const selectedCourse = ref("");
const showForm = ref(false);
const saving = ref(false);
const isEditing = ref(false);

const form = ref({
  id: null,
  code: "",
  name: "",
  scholarship_ids: [],
});

const scholarships = ref([
  { id: 1, name: "Scholarship A" },
  { id: 2, name: "Scholarship B" },
  { id: 3, name: "Scholarship C" },
]);

// تحديث الـ v-model في الأب عند تغيير السليكت
watch(selectedCourse, (val) => {
  modelValue.value = val;
});

// لما القيمة تجي من الأب تتحدث جوه الكمبوننت
watch(modelValue, (val) => {
  selectedCourse.value = val;
});

const toggleForm = () => {
  showForm.value = !showForm.value;
  isEditing.value = false;
  form.value = { id: null, code: "", name: "", scholarship_ids: [] };
};

const saveCourse = async () => {
  saving.value = true;
  if (isEditing.value) {
    await courseStore.updateCourse(form.value.id, form.value);
  } else {
    await courseStore.addCourse(form.value);
  }
  await courseStore.fetchCourses();
  saving.value = false;
  showForm.value = false;
};

onMounted(() => {
  courseStore.fetchCourses();
});
</script>
