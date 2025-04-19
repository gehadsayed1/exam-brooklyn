<template>
    <div class="space-y-6 p-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-800">Role List</h1>
        <button
          @click="openAddModal"
          class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          + Add Role
        </button>
      </div>
  
     
      <div >
        <DataTable
          :headers="[
            { label: 'Name', key: 'name' },
            { label: 'Permissions', key: 'permissions' },
           
          ]"
          :items="rolesStore.roles"
          :isPermission="true"
          @edit="editInstructor"
          @delete="showDeleteAlert"
          :loading="rolesStore.loading"
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
        @saveData="saveInstructor"
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
import { useRoleStore } from "@/stores/roleStore";
  
  const rolesStore = useRoleStore();
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
  
  const saveInstructor = async () => {
    saving.value = true;
    try {
      if (isEditing.value) {
        formRoles.value.permissions = formRoles.value.permissions.map(pre => pre.id)
        await rolesStore.updateRole(formRoles.value.id, formRoles.value);
      } else {
        formRoles.value.permissions = formRoles.value.permissions.map(pre => pre.id)
        await rolesStore.addRole(formRoles.value);
      }
    } catch (error) {
      console.error(error);
    } finally {
      saving.value = false;
      closeModal();
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
  