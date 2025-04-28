<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Role List</h1>
      <!-- <button
        @click="openAddModal"
        v-if="authStore.hasPermission('create-role')"
        class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        + Add Role
      </button> -->
      <!-- From Uiverse.io by Nawsome -->
      <div
        @click="openAddModal"
        v-if="authStore.hasPermission('create-role')"
        class="buttons"
      >
        <button class="btn">
          <span></span>
          <p data-start="good luck!" data-text="ADD!" data-title="new Role"></p>
        </button>
      </div>
    </div>

    <div>
      <DataTable
        :headers="[
          { label: 'Name', key: 'name' },
          { label: 'Permissions', key: 'permissions' },
        ]"
        :items="rolesStore.roles"
        :isPermission="true"
        resourceType="role"
        @edit="editInstructor"
        @delete="showDeleteAlert"
      />
    </div>

    <!-- Reuse Modal Component for Add/Edit Instructor -->
    <Modal
      v-if="showModal"
      :showModal="showModal"
      :modalTitle="isEditing ? 'Edit Role' : 'Add Role'"
      :form="formRoles"
      :saving="saving"
      :isRole="true"
      @closeModal="closeModal"
      @saveData="saveRole"
    />

    <!-- SweetAlert2 Modal for Confirmation -->
    <SweetAlert2Modal
      v-if="showDeleteAlertDialog"
      title="Are you sure?"
      text="This instructor will be deleted."
      icon="warning"
      @confirm="deleteRole"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import DataTable from "@/components/dashboard/DataTable.vue";
import SweetAlert2Modal from "@/components/global/SweetAlert2Modal.vue";
import Modal from "@/components/global/Modal.vue";
import { useAuthStore } from "@/stores/auth";
import { useRoleStore } from "@/stores/roleStore";

const rolesStore = useRoleStore();
const authStore = useAuthStore();
const showModal = ref(false);
const saving = ref(false);
const isEditing = ref(false);
const formRoles = ref({ name: "", permissions: [] });
const showDeleteAlertDialog = ref(false);
const itemToDelete = ref(null);

const openAddModal = () => {
  isEditing.value = false;
  formRoles.value = { name: "", permissions: [] };
  showModal.value = true;
};

const editInstructor = (roles) => {
  isEditing.value = true;

  formRoles.value = { ...roles };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  saving.value = false;
};
const saveRole = async () => {
  saving.value = true;

  const payload = {
    ...formRoles.value,
    permissions: formRoles.value.permissions?.map((pre) => pre.id),
  };

  try {
    if (isEditing.value) {
      await rolesStore.updateRole(formRoles.value.id, payload);
    } else {
      await rolesStore.addRole(payload);
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

const deleteRole = async () => {
  if (itemToDelete.value) {
    await rolesStore.deleteRole(itemToDelete.value);
    showDeleteAlertDialog.value = false;
    itemToDelete.value = null;
  }
};

const cancelDelete = () => {
  showDeleteAlertDialog.value = false;
  itemToDelete.value = null;
};

onMounted(() => {
  rolesStore.fetchRoles();
});
</script>
