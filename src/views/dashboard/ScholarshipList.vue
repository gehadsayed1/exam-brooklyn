<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Scholarships</h1>
      <button
        @click="toggleForm"
        v-if="authStore.hasPermission('create-scholarship')"
        class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        + Add Scholarship
      </button>
    </div>

  

    <div>
      <DataTable
        :headers="[
          { label: 'Scholarship Name', key: 'name' },
          { label: 'Courses', key: 'courses' }
        ]"
        :items="filteredScholarships"
        :search="search"
        resourceType="scholarship"
        @edit="editScholarship"
        @delete="confirmDelete"
        :loading="scholarshipStore.loading"
      />
    </div>

    <!-- Reuse Modal Component for Add/Edit Scholarship -->
    <Modal
      v-if="showModal"
      :showModal="showModal"
      :modalTitle="isEditing ? 'Edit Scholarship' : 'Add Scholarship'"
      :form="form"
      :saving="saving"
      :isScholarship="true"
      :isCourse="false"
      :scholarships="true"
      @closeModal="closeModal"
      @saveData="saveScholarship"
    />

    <!-- SweetAlert2 Modal for Confirmation -->
    <SweetAlert2Modal
      v-if="showDeleteAlert"
      :title="'Are you sure?'"
      :text="'This scholarship will be deleted.'"
      :confirmButtonText="'Yes, delete it!'"
      :cancelButtonText="'Cancel'"
      @confirm="deleteScholarship"
      @cancel="cancelDelete"
    />
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useScholarshipStore } from "@/stores/scholarships"; 
import DataTable from "@/components/dashboard/DataTable.vue";
import SweetAlert2Modal from "@/components/global/SweetAlert2Modal.vue";
import Modal from "@/components/global/Modal.vue";
import { useAuthStore } from "@/stores/auth";


const authStore = useAuthStore();
const scholarshipStore = useScholarshipStore();
const showModal = ref(false);
const saving = ref(false);
const isEditing = ref(false);
const form = ref({ name: "", courses: [] });
const showDeleteAlert = ref(false);
const scholarshipIdToDelete = ref(null);
const search = ref("");  


const filteredScholarships = computed(() => {
  return scholarshipStore.scholarships.filter((scholarship) => {
    return scholarship.name.toLowerCase().includes(search.value.toLowerCase());
  });
});

const toggleForm = () => {
  showModal.value = true;
  isEditing.value = false;
  form.value = { name: "", courses: [] };
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  saving.value = false;
};

const editScholarship = (scholarship) => {
  isEditing.value = true;
  form.value = { ...scholarship };
  showModal.value = true;
};

const saveScholarship = async () => {
  saving.value = true;

  const payload = {
    ...form.value,
    courses: form.value.courses?.map((course) => course.id),
  };

  try {
    if (isEditing.value) {
      await scholarshipStore.updateScholarship(form.value.id, payload);
    } else {
      await scholarshipStore.addScholarship(payload);
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
  scholarshipIdToDelete.value = id;
};

const deleteScholarship = async () => {
  await scholarshipStore.deleteScholarship(scholarshipIdToDelete.value);
  showDeleteAlert.value = false;
  scholarshipIdToDelete.value = null;
};

const cancelDelete = () => {
  showDeleteAlert.value = false;
  scholarshipIdToDelete.value = null;
};

onMounted(() => {
  scholarshipStore.fetchScholarships();
});
</script>
