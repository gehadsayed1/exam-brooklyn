<template>
  <div class="space-y-6">
    <div class="flex items-end w-[400px] justify-center gap-2">
      <div>
        <label class="text-gray-700 font-medium block mb-1"
          >Select Instructor:</label
        >

        <select
          :disabled="disabled"
          v-model="selectedInstructor"
          class="w-[200px] border border-indigo-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
        <option disabled value="" class="text-gray-400">
            {{ disabled ? "Select course first" : "Choose Instructor" }}
          </option>

          <option
            v-for="ins in studentStore.instructors.data"
            :key="ins.id"
            :value="ins.id"
          >
            {{ ins.name }}
          </option>
        </select>
      </div>

      <div class="flex gap-2">
        <RouterLink
          to="/dashboard/instructors"
          class="bg-gray-200 hover:text-indigo-600 font-semibold text-gray-700 px-3 py-2 rounded hover:bg-gray-300 flex items-center gap-1"
        >
          <Plus class="w-6 h-6 text-indigo-600 font-bold" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { Plus } from "lucide-vue-next";
import { RouterLink } from "vue-router";
import { useStudentStore } from "@/stores/studentStore";

const studentStore = useStudentStore();
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const modelValue = defineModel();
const selectedInstructor = ref(modelValue.value);

watch(modelValue, (val) => {
  selectedInstructor.value = val;
});

watch(selectedInstructor, (val) => {
  modelValue.value = val;
});

onMounted(() => {
  selectedInstructor.value = modelValue.value;
});
</script>
