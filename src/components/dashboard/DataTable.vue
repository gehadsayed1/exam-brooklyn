<template>
  <div class="w-full overflow-x-auto bg-white rounded-lg shadow-md">
    <div>
      <div class="flex flex-col p-2 py-6 m-h-screen">
        <div
          class="bg-white items-center justify-between w-full flex rounded-full shadow-lg p-2 mb-5 sticky"
          style="top: 5px"
        >
          <div>
            <div class="p-2 mr-1 rounded-full hover:bg-gray-100 cursor-pointer">
              <svg
                class="h-6 w-6 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Search Input with Blur Effect -->
          <input
            class="font-bold uppercase rounded-full w-full py-4 pl-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline lg:text-sm text-xs"
            type="text"
            v-model="search"
            placeholder="Search by name..."
            :class="{
              'blur-effect': filteredItems.length === 0 && search.length > 0,
            }"
          />
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div
      v-if="!filteredItems.length"
      class="flex justify-center items-center py-20"
    >
      <div
        class="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-10 h-10"
      ></div>
    </div>

    <div v-else>
      <!-- Table -->
      <table class="min-w-[600px] w-full divide-y text-center divide-gray-200">
        <thead class="bg-gradient-to-r bg-primary text-white">
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              class="px-6 py-4 text-center text-md font-semibold tracking-wider"
            >
              {{ header.label }}
            </th>
            <th
              v-if="canEdit || canDelete"
              class="px-6 py-4 text-center text-md font-semibold tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Render data rows -->
          <tr
            v-for="item in paginatedItems"
            :key="item.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="header in headers"
              :key="header.key"
              class="px-6 py-4 whitespace-nowrap break-words"
            >
              <!-- Make the 'name' column clickable -->
              <span
                v-if="header.key === 'name'"
                @click="showDetails(item)"
                class="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {{ getValueByPath(item, header.key) }}
              </span>
              <span v-else>{{ getValueByPath(item, header.key) }}</span>
            </td>

            <td
              v-if="canEdit || canDelete"
              class="px-6 py-4 whitespace-nowrap space-x-6"
            >
              <button
                v-if="canEdit"
                @click="$emit('edit', item)"
                class="text-indigo-600 cursor-pointer hover:text-indigo-800 transition inline-flex items-center gap-1"
              >
                <Edit class="w-4 h-4" />
              </button>
              <button
                v-if="canDelete"
                @click="$emit('delete', item.id)"
                class="text-red-600 cursor-pointer hover:text-red-800 transition inline-flex items-center gap-1"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>

          <!-- No results found for the search -->
          <tr v-if="filteredItems.length === 0 && search.length > 0">
            <td
              :colspan="headers.length + 1"
              class="px-6 py-4 text-start font-bold text-gray-700"
            >
              No results found for "{{ search }}".
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0 && !loading">
            <td
              :colspan="headers.length + 1"
              class="px-6 py-4 text-center font-bold text-gray-600"
            >
              No data found.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        class="flex justify-center gap-3 mt-4 p-4"
        v-if="filteredItems.length > 0"
      >
        <button
          @click="goToPreviousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50"
        >
          Previous
        </button>
        <div class="flex items-center">
          <span class="text-sm text-gray-500">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
        </div>
        <button
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <DetailsPopup
      v-if="selectedExam"
      :selectedExam="selectedExam"
      :isCourse="isCourse"
      :isExam="isExam"
      :isInstructors="isInstructors"
      :isEmployee="isEmployee"
      @close="selectedExam = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Edit, Trash2 } from "lucide-vue-next";
import DetailsPopup from "../global/DetailsPopup.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const props = defineProps({
  headers: Array,
  items: Array,
  loading: Boolean,
  isExam: Boolean,
  isInstructors: Boolean,
  isEmployee: Boolean,
  isCourse: Boolean,
  resourceType: String,
});

const search = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;
const selectedExam = ref(null);

// Function to check if the user has the required permission

const canEdit = computed(() =>
  authStore.hasPermission(`edit-${props.resourceType}`)
);
const canDelete = computed(() =>
  authStore.hasPermission(`delete-${props.resourceType}`)
);
const canCreate = computed(() => hasPermission(`create-${props.resourceType}`));

// Function to format the created_at or updated_at date
const formatDate = (date) => {
  if (!date) return "";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleString("en-US", options);
};

const filteredItems = computed(() => {
  return props.items.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage);
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredItems.value.slice(start, end);
});

function getValueByPath(obj, path) {
  if (path === "created_at" || path === "Updated_at") {
    return formatDate(obj[path]);
  }

  if (path === "courses") {
    return obj.courses && obj.courses.length > 0
      ? obj.courses.map((course) => `(${course.name})`).join(", ")
      : "No courses";
  }

  if (path === "roles") {
    return obj.roles && obj.roles.length > 0
      ? obj.roles.map((role) => `(${role.name})`).join(", ")
      : "No roles";
  }
  if (path === "permissions") {
    return obj.permissions && obj.permissions.length > 0
      ? obj.permissions.map((permissions) => `(${permissions.name})`).join(", ")
      : "No Permissions";
  }
  if (path === "instructor") {
    return obj.instructor && obj.instructor.length > 0
      ? obj.instructor.map((instructor) => `(${instructor.name})`).join(", ")
      : "No instructor";
  }

  return (
    path
      .split(".")
      .reduce((o, key) => (o && o[key] !== undefined ? o[key] : ""), obj) || ""
  );
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const showDetails = (exam) => {
  selectedExam.value = exam;
};

watch(search, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
/* Allow text wrapping in table cells */
td {
  word-wrap: break-word;
  white-space: normal;
}
</style>
