<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-30 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">
        {{ modalTitle }}
      </h2>

      <div class="space-y-4">
        <!-- Name input -->
        <div class="relative">
          <label class="block text-sm mb-1">Name</label>
          <div class="flex items-center space-x-2">
            <LucideUser class="text-gray-500 w-5 h-5 absolute left-3" />
            <input
              v-model="form.name"
              class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2 pl-10"
              type="text"
              placeholder="Enter name"
            />
          </div>
        </div>
        <!-- Email input (Visible when 'isEmployee' is true) -->
        <div v-if="isEmployee" class="relative">
          <label class="block text-sm mb-1">Email</label>
          <div class="flex items-center space-x-2">
            <LucideMail class="text-gray-500 w-5 h-5 absolute left-3" />
            <input
              v-model="form.email"
              class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2 pl-10"
              type="email"
              placeholder="Enter email"
            />
          </div>
        </div>
        <div class="relative" v-if="isInstructor">
          <label class="block text-sm mb-1">Phone</label>
          <div class="flex items-center space-x-2">
            <LucidePhoneCall class="text-gray-500 w-5 h-5 absolute left-3" />
            <input
              v-model="form.phone"
              class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2 pl-10"
              type="text"
              placeholder="Enter name"
            />
          </div>
        </div>
        <!-- Course Code -->
        <div v-if="isCourse" class="relative">
          <label class="block text-sm mb-1">Course Code</label>
          <div class="flex items-center space-x-2">
            <LucideCode class="text-gray-400 w-5 h-5 absolute left-3" />
            <input
              v-model="form.code"
              class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2 pl-10"
              type="text"
              placeholder="Enter course code"
            />
          </div>
        </div>

        <!-- Instructor Multiselect (Visible when 'isCourse' is true) -->
        <div v-if="isCourse" class="relative w-[95%]">
          <label class="block text-sm mb-1"
            >Instructors
            <span class="text-xs text-gray-400">(Optional)</span></label
          >
          <multiselect
            v-model="form.instructor"
            :options="instructors"
            track-by="id"
            label="name"
            multiple
            placeholder="Select Instructors"
            :loading="instructorStore.loading"
            loading-text="Loading instructors..."
            no-options="No instructors available"
            class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2"
            :reduce="(selected) => selected.id"
          />
        </div>

        <!-- Scholarship Multiselect (Visible when 'isCourse' is true) -->
        <div v-if="isCourse" class="relative w-[95%]">
          <label class="block text-sm mb-1"
            >Scholarship
            <span class="text-xs text-gray-400">(Optional)</span></label
          >
          <multiselect
            v-model="form.scholarship"
            :options="scholarships"
            track-by="id"
            label="name"
            multiple
            placeholder="Select Scholarships"
            :loading="scholarshipStore.loading"
            loading-text="Loading scholarships..."
            no-options="No scholarships available"
            class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2"
            :reduce="(selected) => selected.id"
          />
        </div>
        <!-- Scholarship Multiselect (Visible when 'isCourse' is true) -->
        <div v-if="isScholarship || isInstructor" class="relative w-[95%]">
          <label class="block text-sm mb-1"
            >Courses
            <span class="text-xs text-gray-400">(Optional)</span></label
          >
          <multiselect
            v-model="form.courses"
            :options="courses"
            track-by="id"
            label="name"
            multiple
            placeholder="Select Courses"
            :loading="courseStore.loading"
            loading-text="Loading courses..."
            no-options="No courses available"
            class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2"
          />
        </div>

        <div v-if="isEmployee" class="relative w-[95%]">
          <label class="block text-sm mb-1"
            >Roles <span class="text-xs text-gray-400">(Optional)</span></label
          >
          <multiselect
            v-model="form.roles"
            :options="roles || []"
            track-by="id"
            label="name"
            multiple
            placeholder="Select Roles"
            :loading="roleStore.loading"
            loading-text="Loading roles..."
            no-options="No roles available"
            class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2"
            :reduce="(selected) => selected.id"
          />
        </div>
        <div v-if="isRole" class="relative w-[95%]">
          <label class="block text-sm mb-1"
            >Permissions
            <span class="text-xs text-gray-400">(Optional)</span></label
          >
          <multiselect
            v-model="form.permissions"
            :options="permissions || []"
            track-by="id"
            label="name"
            multiple
            placeholder="Select Permissions"
            :loading="rolesStore.loading"
            loading-text="Loading permissions..."
            no-options="No permissions available"
            class="w-full border border-gray-200 bg-white outline-0 shadow-2xl shadow-gray-200 rounded-md px-3 py-2"
            :reduce="(selected) => selected.id"
          />
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="saveData"
          :disabled="isSaveButtonDisabled"
          class="save-button min-w-[90px] flex justify-center items-center"
        >
          <span
            v-if="saving"
            class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"
          ></span>
          Save
        </button>
      </div>

      <button
        @click="closeModal"
        class="absolute top-2 right-2 text-red-800 cursor-pointer hover:text-gray-600 hover:text-3xl text-2xl"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  LucideUser,
  LucideCode,
  LucidePhoneCall,
  LucideMail,
} from "lucide-vue-next";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { useScholarshipStore } from "@/stores/scholarships";
import { useInstructorStore } from "@/stores/instructorStore";
import { useCourseStore } from "@/stores/courseStore";
import { useRoleStore } from "@/stores/roleStore";

// Props
const props = defineProps({
  showModal: Boolean,
  modalTitle: String,
  form: Object,
  saving: Boolean,
  isInstructor: Boolean,
  isCourse: Boolean,
  isScholarship: Boolean,
  isEmployee: Boolean,
  isRole: Boolean,
});

// Emits
const emit = defineEmits(["closeModal", "saveData", "delete"]);

const originalForm = ref({ ...props.form });

// Fetching data from the stores
const courseStore = useCourseStore();
const rolesStore = useRoleStore();
const scholarshipStore = useScholarshipStore();
const instructorStore = useInstructorStore();
const courses = computed(() => courseStore.courses);
const roles = computed(() => rolesStore.roles);
const permissions = computed(() => rolesStore.permissions);
const instructors = computed(() => instructorStore.instructors);
const scholarships = computed(() => scholarshipStore.scholarships);

// Close modal
const closeModal = () => {
  emit("closeModal");
};

// Save handler
const saveData = () => {
  emit("saveData");
};

// Save button validation
const isSaveButtonDisabled = computed(() => {
  const form = props.form;
  const original = originalForm.value;

  const isNameChanged = form.name !== original.name;
  const isPhoneChanged = props.isInstructor && form.phone !== original.phone;
  const isCodeChanged = props.isCourse && form.code !== original.code;

  const isInstructorsChanged =
    props.isCourse &&
    JSON.stringify(form.instructor ?? []) !==
      JSON.stringify(original.instructor ?? []);

  const isScholarshipsChanged =
    props.isScholarship &&
    JSON.stringify(form.scholarship ?? []) !==
      JSON.stringify(original.scholarship ?? []);

  const isCoursesChanged =
    (props.isCourse || props.isScholarship || props.isInstructor) &&
    JSON.stringify(form.courses ?? []) !==
      JSON.stringify(original.courses ?? []);

  const isRolesChanged =
    props.isEmployee &&
    JSON.stringify(form.roles ?? []) !== JSON.stringify(original.roles ?? []);

  const isPermissionsChanged =
    props.isRole &&
    JSON.stringify(form.permissions ?? []) !==
      JSON.stringify(original.permissions ?? []);

  const formChanged =
    isNameChanged ||
    isPhoneChanged ||
    isCodeChanged ||
    isInstructorsChanged ||
    isScholarshipsChanged ||
    isRolesChanged ||
    isPermissionsChanged ||
    isCoursesChanged;

  const requiredFieldsValid =
    form.name &&
    (!props.isInstructor || form.phone) &&
    (!props.isCourse || form.code);

  return !formChanged || !requiredFieldsValid;
});

const formErrors = computed(() => {
  const errors = {};

  if (props.isEmployee && form.email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      errors.email = "Please enter a valid email address.";
    }
  }

  if (props.isInstructor && form.phone) {
    const phonePattern = /^\d{11}$/;
    if (!phonePattern.test(form.phone)) {
      errors.phone = "Phone number must be exactly 11 digits.";
    }
  }

  return errors;
});

// Initialize the stores when the component is mounted
onMounted(() => {
  props.isScholarship ||
    (props.isCourse && scholarshipStore.fetchScholarships());
  props.isInstructor || (props.isCourse && instructorStore.fetchInstructors());
  props.isCourse || (props.isInstructor && courseStore.fetchCourses());
  props.isEmployee && rolesStore.fetchRoles();
  props.isRole && rolesStore.fetchPermissions();
});
</script>


