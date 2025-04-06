<template>
  <div class="space-y-6">
    <!-- Header: Add + View Buttons -->
    <div class="flex items-end w-[400px] justify-center gap-2">
      <div>
        <label class="text-gray-700 font-medium block mb-1"
          >Select Instructor:</label
        >
        <select
          v-model="selectedInstructor"
          class="w-[200px] border border-indigo-500  rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option disabled value="">Choose Instructor</option>
          <option
            v-for="ins in instructorStore.instructors"
            :key="ins.id"
            :value="ins.id"
          >
            {{ ins.name }}
          </option>
        </select>
      </div>
      <div class="flex gap-2">
        <button
          class="bg-indigo-500 text-white px-2 py-2 rounded hover:bg-indigo-600 flex items-center gap-1"
          @click="openAddModal"
        >
          <Plus class="w-3 h-4 " /> Add
        </button>
        <RouterLink
          to="/dashboard/instructors"
          class="bg-gray-200 hover:text-indigo-600 font-semibold text-gray-700 px-3 py-2 rounded hover:bg-gray-300 flex items-center gap-1"
        >
          <Eye class="w-5 h-4 " /> View
        </RouterLink>
      </div>
    </div>

    <!-- Add/Edit Instructor Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-30 flex items-center justify-center z-50"
    >
      <div
        class="bg-blue-100 p-6 rounded-lg shadow-lg w-full max-w-md relative"
      >
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditing ? "Edit Instructor" : "Add Instructor" }}
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Name</label>
            <input
              v-model="newInstructor.name"
              class="w-full border rounded px-3 py-2"
              type="text"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Phone</label>
            <input
              v-model="newInstructor.phone"
              class="w-full border rounded px-3 py-2"
              type="text"
            />
            <p v-if="phoneError" class="text-red-500 text-sm mt-1">
              {{ phoneError }}
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="toggleForm"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            @click="saveInstructor"
            :disabled="saving"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center min-w-[90px]"
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
import { ref, onMounted, watch } from "vue";
import { useInstructorStore } from "@/stores/instructorStore";
import { Eye, Plus } from "lucide-vue-next";
import { RouterLink } from "vue-router";

// ✅ ربط v-model
const modelValue = defineModel();

const instructorStore = useInstructorStore();
const selectedInstructor = ref("");

const showForm = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const saving = ref(false);
const phoneError = ref("");
const newInstructor = ref({ name: "", phone: "" });

// ✅ لما المستخدم يختار من السليكت
watch(selectedInstructor, (val) => {
  modelValue.value = val;
});

// ✅ لو القيمة جاية من الصفحة الرئيسية، نحطها في السليكت
watch(modelValue, (val) => {
  selectedInstructor.value = val;
});

const openAddModal = () => {
  isEditing.value = false;
  showForm.value = true;
  newInstructor.value = { name: "", phone: "" };
};

const toggleForm = () => {
  showForm.value = false;
  newInstructor.value = { name: "", phone: "" };
  isEditing.value = false;
  editingId.value = null;
  saving.value = false;
  phoneError.value = "";
};

const saveInstructor = async () => {
  const phoneRegex = /^01[0-9]{9}$/;
  if (!phoneRegex.test(newInstructor.value.phone)) {
    phoneError.value = "Phone number is not valid";
    return;
  }
  phoneError.value = "";

  if (!newInstructor.value.name || !newInstructor.value.phone) return;
  saving.value = true;
  if (isEditing.value && editingId.value) {
    await instructorStore.updateInstructor(
      editingId.value,
      newInstructor.value
    );
  } else {
    await instructorStore.addInstructor(newInstructor.value);
  }
  await instructorStore.fetchInstructors();
  saving.value = false;
  toggleForm();
};

onMounted(() => {
  instructorStore.fetchInstructors();
});
</script>
