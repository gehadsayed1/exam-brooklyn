<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Course List</h1>
      <button
        @click="toggleForm"
        class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        + Add Course
      </button>
    </div>

   

    <div>
      <DataTable
        :headers="[
          { label: 'Course Name', key: 'name' },
          { label: 'Course Code', key: 'code' }
        ]"
        :items="filteredCourses"
        @edit="editCourse"
        @delete="confirmDelete"
        :loading="courseStore.loading"
      />
    </div>

    <!-- Reuse Modal Component for Add/Edit Course -->
    <Modal
      v-if="showModal"
      :showModal="showModal" 
      :modalTitle="isEditing ? 'Edit Course' : 'Add Course'"
      :form="form"
      :saving="saving"
      :isCourse="true"
      :scholarships="scholarships"
      @closeModal="closeModal"
      @saveData="saveCourse"
    />

    <!-- SweetAlert2 Modal for Confirmation -->
    <SweetAlert2Modal
      v-if="showDeleteAlert"
      :title="'Are you sure?'"
      :text="'This course will be deleted.'"
      :confirmButtonText="'Yes, delete it!'"
      :cancelButtonText="'Cancel'"
      @confirm="deleteCourse"
      @cancel="cancelDelete"
    />
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCourseStore } from '@/stores/courseStore';
import DataTable from '@/components/dashboard/DataTable.vue';
import SweetAlert2Modal from '@/components/global/SweetAlert2Modal.vue';
import Modal from '@/components/global/Modal.vue';
import { useScholarshipStore } from "@/stores/scholarships";

const courseStore = useCourseStore();
const scholarshipStore = useScholarshipStore();
const showModal = ref(false);
const saving = ref(false);
const isEditing = ref(false);
const form = ref({ code: '', name: '', scholarship: [], instructor: [] });
const showDeleteAlert = ref(false);
const courseIdToDelete = ref(null);
const scholarships = ref([]);
const search = ref("");  


const filteredCourses = computed(() => {
  return courseStore.courses.filter(course => {
    return (
      course.name.toLowerCase().includes(search.value.toLowerCase()) ||
      course.code.toLowerCase().includes(search.value.toLowerCase())
    );
  });
});

const toggleForm = () => {
  showModal.value = true;
  isEditing.value = false;
  form.value = { code: "", name: "", scholarship: [], instructor: [] };
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  saving.value = false;
};

const editCourse = (course) => {
  isEditing.value = true;
  
  form.value = { ...course };
  showModal.value = true;
};

const saveCourse = async () => {
  saving.value = true;
  form.value.code = String(form.value.code);
  try {
    if (isEditing.value) {
      form.value.scholarship = form.value.scholarship.map((s) => s.id);
      form.value.instructor = form.value.instructor.map((s) => s.id);
      await courseStore.updateCourse(form.value.id, form.value);
    } else {
      form.value.scholarship = form.value.scholarship.map((s) => s.id);
      form.value.instructor = form.value.instructor.map((s) => s.id);
      await courseStore.addCourse(form.value);
    }
  } catch (error) {
    console.error(error);
  } finally {
    saving.value = false;
    closeModal();
  }
};

const confirmDelete = (id) => {
  showDeleteAlert.value = true;
  courseIdToDelete.value = id;
};

const deleteCourse = async () => {
  await courseStore.deleteCourse(courseIdToDelete.value);
  showDeleteAlert.value = false;
  courseIdToDelete.value = null;
};

const cancelDelete = () => {
  showDeleteAlert.value = false;
  courseIdToDelete.value = null;
};

onMounted(() => {
  courseStore.fetchCourses();
  scholarshipStore.fetchScholarships();
  scholarships.value = scholarshipStore.scholarships;
});
</script>

