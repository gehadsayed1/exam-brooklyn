<template>
  <div class="bg-white p-4 rounded shadow space-y-6 mt-8">
    <div v-if="questions.length">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex justify-center items-center space-x-4">
          <div class="text-center text-lg text-gray-700 font-medium">
            Number of questions
          </div>
          <div
            class="flex justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-semibold w-8 h-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110">
            {{ questions.length }}
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Go to:</label>
          <select v-model="currentQuestionIndex" class="border rounded-md px-2 py-1">
            <option v-for="(q, index) in questions" :key="q.id" :value="index">
              Question {{ index + 1 }}
            </option>
          </select>
        </div>
      </div>

      <!-- Question Content -->
      <div class="border p-4 rounded space-y-3 relative">
        <div>
          <label class="text-sm font-medium text-gray-700">Question Text</label>
          <input v-model="questions[currentQuestionIndex].question_text" type="text"
            class="w-full border bg-indigo-400 shadow-lg text-xl text-gray-50 px-5 py-3 rounded-md"
            @input="setModified(true)" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="(opt, index) in ['A', 'B', 'C', 'D']" :key="index">
            <label class="text-sm capitalize">Option {{ opt }}</label>
            <input v-model="questions[currentQuestionIndex].options[opt]" type="text"
              class="w-full border-1 border-indigo-300 px-3 py-2 rounded-md" @input="setModified(true)" />
          </div>
        </div>


        <div class="text-center flex flex-col items-center mt-8">
          <label class="text-sm">Correct Option</label>
          <select v-model="questions[currentQuestionIndex].correct_option"
            class="w-1/5 px-3 py-2 rounded-md border-1 border-indigo-500" @change="setModified(true)">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center mt-4">
          <button @click="saveQuestion(questions[currentQuestionIndex])"
            class="text-white flex items-center gap-1 cursor-pointer px-4 py-2 rounded-md" :class="{
              'bg-gray-400': !isModified,
              'bg-blue-600 hover:bg-blue-500': isModified,
            }" :disabled="!isModified || saving">
            <span v-if="saving"
              class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 inline-block mr-2"></span>
            <span v-else class="flex items-center gap-1">
              <ArrowDownToDot class="w-5 h-5 flex" />
              {{ saving ? "saving.." : "Save" }}
            </span>
          </button>

          <button @click="deleteQuestion(questions[currentQuestionIndex].id)"
            class="text-red-500 hover:text-red-700 px-4 py-2 rounded cursor-pointer transition-all duration-200"
            :disabled="saving">
            <Beer class="w-7 h-7 hover:scale-110" />
          </button>
        </div>
      </div>

      <SweetAlert2Modal v-if="showDeleteAlertDialog" title="Are you sure?" text="This question will be deleted."
        icon="warning" @confirm="confirmDelete" @cancel="cancelDelete" />
    </div>

    <div v-else class="text-center text-gray-500 font-bold">
      There are no questions for this exam yet.
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useExamStore } from "@/stores/examStore";
import { ArrowDownToDot, Beer } from "lucide-vue-next";

import SweetAlert2Modal from "@/components/global/SweetAlert2Modal.vue";


const props = defineProps({
  questions: Array,
});

const showDeleteAlertDialog = ref(false);
const examStore = useExamStore();
const currentQuestionIndex = ref(0);
const saving = ref(false);
const isModified = ref(false);
const originalQuestion = ref({});

watch(
  () => props.questions[currentQuestionIndex.value],
  () => {
    isModified.value = true;
  },
  { deep: true }
);

// Save changes to the current question
const saveQuestion = async (q) => {
  if (!q.id) {
    console.error("Question ID is missing");
    return;
  }

  saving.value = true;
  try {
    await examStore.updateQuestion(q.id, {
      question_text: q.question_text,
      option_a: q.options.A,
      option_b: q.options.B,
      option_c: q.options.C,
      option_d: q.options.D,
      correct_option: q.correct_option,
    });

    originalQuestion.value = { ...q };
    isModified.value = false;
  } catch (e) {
    console.error("Error while saving question:", e);
  } finally {
    saving.value = false;
  }
};

// Handle deletion with confirmation
const deleteQuestion = (id) => {
  showDeleteAlertDialog.value = true;
};

// Confirm delete
const confirmDelete = async () => {
  showDeleteAlertDialog.value = false;
  try {
    await examStore.deleteQuestion(
      props.questions[currentQuestionIndex.value].id
    );
    props.questions.splice(currentQuestionIndex.value, 1);
    currentQuestionIndex.value = Math.max(0, currentQuestionIndex.value - 1); // Move to the previous question or stay at 0
  } catch (e) {
    console.error("Error deleting question:", e);
  }
};

// Cancel deletion
const cancelDelete = () => {
  showDeleteAlertDialog.value = false;
};

// Mark the question as modified
const setModified = (status) => {
  isModified.value = status;
};
</script>
