<template>
  <div class="space-y-6 p-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Users List</h1>

      <!-- Button to trigger modal -->
      <!-- <button
        v-if="authStore.hasPermission('create-user')"
        @click="showForm = true"
        class="px-4 py-2 bg-indigo-500 cursor-pointer text-white rounded hover:bg-indigo-600"
      >
        Create New User
      </button> -->
      <!-- From Uiverse.io by Nawsome --> 
<div v-if="authStore.hasPermission('create-user')"
@click="showForm = true" class="buttons">
   <button class="btn"><span></span><p data-start="good luck!" data-text="ADD!" data-title="new User"></p></button>
</div>
    </div>
    <div>
      <DataTable
        :headers="[
          { label: 'User Name', key: 'name' },
          { label: 'Roles', key: 'roles' },
        ]"
        :items="employeesStore.employees"
        :isEmployee="true"
        resourceType="user"
       
        @delete="showDeleteAlert"
        @edit="editEmployee"
      />

      <SweetAlert2Modal
        v-if="showDeleteAlertDialog"
        title="Are you sure?"
        text="This employee will be deleted."
        icon="warning"
        @confirm="deleteEmployee"
        @cancel="cancelDelete"
      />

      <Modal
        v-if="showModal"
        :showModal="showModal"
        :modalTitle="isEditing ? 'Edit Employee' : ''"
        :form="formEmployee"
        :saving="saving"
        :isEmployee="true"
        @closeModal="closeModal"
        @saveData="saveEmployee"
      />
    </div>

    <!-- Modal for Login Form -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-8 relative rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          Create New User
        </h2>

        <form @submit.prevent="handleLogin">
          <div class="field-wrapper dark:text-white text-gray-400">
            <input type="text" v-model="form.name" placeholder=" " />
            <label>Name</label>
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">
              {{ errors.name }}
            </p>
          </div>
          <div class="field-wrapper dark:text-white text-gray-400">
            <input type="text" v-model="form.email" placeholder=" " />
            <label>Email</label>
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">
              {{ errors.email }}
            </p>
          </div>

          <div class="field-wrapper dark:text-white text-gray-400">
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder=" "
              />
              <label>Password</label>
              <span
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <i
                  :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                ></i>
              </span>
            </div>
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">
              {{ errors.password }}
            </p>
          </div>
          <div class="field-wrapper dark:text-white text-gray-400">
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password_confirmation"
                placeholder=" "
              />
              <label>Confirm Password</label>
              <span
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <i
                  :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                ></i>
              </span>
            </div>
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">
              {{ errors.password }}
            </p>
          </div>

          <div class="field-wrapper">
            <button type="submit" :disabled="isLoading">
              <span v-if="isLoading">
                <span class="spinner"></span> Creating...
              </span>
              <span v-else>Create</span>
            </button>
          </div>

          <p
            v-if="employeesStore.error"
            class="text-red-500 text-sm mt-2 text-center"
          >
            {{ employeesStore.error }}
          </p>
        </form>
        <button
          class="absolute top-2 hover:text-gray-500 cursor-pointer right-2"
          @click="showForm = false"
        >
          <X />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import SweetAlert2Modal from "@/components/global/SweetAlert2Modal.vue";
import Modal from "@/components/global/Modal.vue";
import { useEmployeeStore } from "@/stores/employeesStore";
import DataTable from "@/components/dashboard/DataTable.vue";
import { X } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";

const employeesStore = useEmployeeStore();
const authStore = useAuthStore(); // Assuming you have an auth store to manage authentication

const isEditing = ref(false);
const showDeleteAlertDialog = ref(false);
const showForm = ref(false);
const showModal = ref(false);
const saving = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const itemToDelete = ref(null);
const formEmployee = ref({
  name: "",
  email: "",
  roles: [], // Initialize as an empty array
});
const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const errors = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const showDeleteAlert = (id) => {
  showDeleteAlertDialog.value = true;
  itemToDelete.value = id;
};

const deleteEmployee = async () => {
  if (itemToDelete.value) {
    await employeesStore.deleteEmployee(itemToDelete.value);
    showDeleteAlertDialog.value = false;
    itemToDelete.value = null;
  }
};

const cancelDelete = () => {
  showDeleteAlertDialog.value = false;
  itemToDelete.value = null;
};

const editEmployee = (employees) => {
  isEditing.value = true;
(employees);

  formEmployee.value = { ...employees };
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  saving.value = false;
};

onMounted(() => {
  employeesStore.fetchEmployees();
});

const closeLogin = () => {
  showForm.value = false;
  form.value = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };
  errors.value = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };
};


const saveEmployee = async () => {
  saving.value = true;

  const payload = {
    ...formEmployee.value,
    roles: formEmployee.value.roles?.map((role) => role.id),
  };

  try {
    if (isEditing.value) {
      await employeesStore.updateEmployee(formEmployee.value.id, payload);
      showForm.value = false;
    } else {
      await employeesStore.addEmployee(payload);
      closeLogin();
    }
    closeModal();
  } catch (error) {
    console.error(error);
  } finally {
    saving.value = false;
  }
};


async function handleLogin() {
  errors.value = {
    email: "",
    password: "",
    name: "",
    password_confirmation: "",
  };

  isLoading.value = true;

  try {
    await employeesStore.addEmployee(form.value);
    closeLogin();
  } catch (validationError) {
    if (validationError.inner) {
      validationError.inner.forEach((err) => {
        errors.value[err.path] = err.message;
      });
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
<style scoped>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f6fffd;
}

.wrapper {
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 800px;
}

.rec-prism {
  width: 100%;
  max-width: 320px;
  height: 400px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
  transform: rotateY(0deg);
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 20px;
  border: 2px solid #092c67;
  border-radius: 6px;
  backface-visibility: hidden;
}

.field-wrapper {
  margin: 20px 0;
  position: relative;
}

.field-wrapper input[type="text"],
.field-wrapper input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-bottom: 1px solid #092c67;
  font-size: 1em;
  background: transparent;
}

.field-wrapper label {
  position: absolute;
  top: 10px;
  left: 0;
  font-size: 0.85em;
  pointer-events: none;
  transition: 0.2s;
}

.field-wrapper input:focus {
  outline: none;
}

.field-wrapper input:focus + label,
.field-wrapper input:not(:placeholder-shown) + label {
  top: -12px;
  font-size: 0.75em;
  color: #42509e;
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  background: #092c67;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

button[type="submit"]:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 0.9em;
  color: #42509e;
}

.spinner {
  border: 2px solid #fff;
  border-top: 2px solid #092c67;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.6s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.psw {
  display: block;
  margin-top: 15px;
  font-size: 0.8em;
  color: #42509e;
  text-align: center;
  cursor: pointer;
}
</style>
