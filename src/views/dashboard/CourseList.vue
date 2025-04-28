<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Course List</h1>
      <!-- <button
        v-if="authStore.hasPermission('create-courses')"
        @click="toggleForm"
        class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        + Add Course
      </button> -->
      <!-- From Uiverse.io by Nawsome -->
      <div
        v-if="authStore.hasPermission('create-courses')"
        @click="toggleForm"
        class="buttons"
      >
        <button class="btn">
          <span></span>
          <p
            data-start="good luck!"
            data-text="ADD!"
            data-title="new Course"
          ></p>
        </button>
      </div>
    </div>

    <div>
      <DataTable
        :headers="[
          { label: 'Course Name', key: 'name' },
          { label: 'Course Code', key: 'code' },
          { label: 'Instructor', key: 'instructor' },
        ]"
        :items="filteredCourses"
        resourceType="courses"
        :isCourse="true"
        @edit="editCourse"
        @delete="confirmDelete"
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
import { ref, onMounted, computed } from "vue";
import { useCourseStore } from "@/stores/courseStore";
import DataTable from "@/components/dashboard/DataTable.vue";
import SweetAlert2Modal from "@/components/global/SweetAlert2Modal.vue";
import Modal from "@/components/global/Modal.vue";
import { useScholarshipStore } from "@/stores/scholarships";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const courseStore = useCourseStore();
const scholarshipStore = useScholarshipStore();
const showModal = ref(false);
const saving = ref(false);
const isEditing = ref(false);
const form = ref({ code: "", name: "", scholarship: [], instructor: [] });
const showDeleteAlert = ref(false);
const courseIdToDelete = ref(null);
const scholarships = ref([]);
const search = ref("");

const filteredCourses = computed(() => {
  return courseStore.courses.filter((course) => {
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

  const payload = {
    ...form.value,
    code: String(form.value.code),
    scholarship: form.value.scholarship?.map((s) => s.id),
    instructor: form.value.instructor?.map((i) => i.id),
  };

  try {
    if (isEditing.value) {
      await courseStore.updateCourse(form.value.id, payload);
    } else {
      await courseStore.addCourse(payload);
    }
    closeModal();
  } catch (error) {
    console.error(error);
  } finally {
    saving.value = false;
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
