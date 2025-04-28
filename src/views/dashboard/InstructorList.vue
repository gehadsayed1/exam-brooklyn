<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Instructor List</h1>
      <!-- <button
        @click="openAddModal"
        v-if="authStore.hasPermission('create-instructors')"
        class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        + Add Instructor
      </button> -->
      <!-- From Uiverse.io by Nawsome -->
      <div
        @click="openAddModal"
        v-if="authStore.hasPermission('create-instructors')"
        class="buttons"
      >
        <button class="btn">
          <span></span>
          <p
            data-start="good luck!"
            data-text="ADD!"
            data-title="new Instructor"
          ></p>
        </button>
      </div>
    </div>

    <div>
      <div>
        <DataTable
          :headers="[
            { label: 'Name', key: 'name' },
            { label: 'courses', key: 'courses' },
          ]"
          :items="filteredInstructors"
          :isInstructors="true"
          resourceType="instructors"
          @edit="editInstructor"
          @delete="showDeleteAlert"
          :search="search"
        />
      </div>

      <!-- Reuse Modal Component for Add/Edit Instructor -->
      <Modal
        v-if="showModal"
        :showModal="showModal"
        :modalTitle="isEditing ? 'Edit Instructor' : 'Add Instructor'"
        :form="formInstructor"
        :saving="saving"
        :isInstructor="true"
        @closeModal="closeModal"
        @saveData="saveInstructor"
      />

      <!-- SweetAlert2 Modal for Confirmation -->
      <SweetAlert2Modal
        v-if="showDeleteAlertDialog"
        title="Are you sure?"
        text="This instructor will be deleted."
        icon="warning"
        @confirm="deleteInstructor"
        @cancel="cancelDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useInstructorStore } from "@/stores/instructorStore";
import DataTable from "@/components/dashboard/DataTable.vue";
import SweetAlert2Modal from "@/components/global/SweetAlert2Modal.vue";
import Modal from "@/components/global/Modal.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const instructorStore = useInstructorStore();
const search = ref("");
const showModal = ref(false);
const saving = ref(false);
const isEditing = ref(false);
const formInstructor = ref({ name: "", phone: "", courses: [] });
const showDeleteAlertDialog = ref(false);
const itemToDelete = ref(null);

const filteredInstructors = computed(() => {
  if (!search.value) return instructorStore.instructors;
  return instructorStore.instructors.filter(
    (ins) =>
      ins.name && ins.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const openAddModal = () => {
  isEditing.value = false;
  formInstructor.value = { name: "", phone: "", courses: [] };
  showModal.value = true;
};

const editInstructor = (instructor) => {
  isEditing.value = true;

  formInstructor.value = { ...instructor };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  saving.value = false;
};

const saveInstructor = async () => {
  saving.value = true;

  const payload = {
    ...formInstructor.value,
    courses: formInstructor.value.courses?.map((course) => course.id),
  };

  try {
    if (isEditing.value) {
      (payload);
      await instructorStore.updateInstructor(formInstructor.value.id, payload);
    } else {
      (payload);
      await instructorStore.addInstructor(payload);
    }
    closeModal();
  } catch (error) {
    console.error(error);
  } finally {
    saving.value = false;
  }
};

const showDeleteAlert = (id) => {
  showDeleteAlertDialog.value = true;
  itemToDelete.value = id;
};

const deleteInstructor = async () => {
  if (itemToDelete.value) {
    await instructorStore.deleteInstructor(itemToDelete.value);
    showDeleteAlertDialog.value = false;
    itemToDelete.value = null;
  }
};

const cancelDelete = () => {
  showDeleteAlertDialog.value = false;
  itemToDelete.value = null;
};

onMounted(() => {
  saving.value = true;
  instructorStore.fetchInstructors();
  saving.value = false;
});
</script>
