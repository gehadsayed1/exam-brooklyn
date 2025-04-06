<template>
  <div class="bg-white p-4 rounded shadow space-y-6 mt-8">
    <div v-if="questions.length">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex-1 flex justify-center">
          <span
            class="text-white font-bold ms-44 bg-indigo-600 rounded-full flex justify-center items-center w-10 h-10"
          >
            {{ questions.length }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Go to:</label>
          <select
            v-model="currentQuestionIndex"
            class="border rounded-md px-2 py-1"
          >
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
          <input
            v-model="questions[currentQuestionIndex].question_text"
            type="text"
            class="w-full border bg-indigo-400 shadow-lg text-xl text-gray-50 px-5 py-3 rounded-md"
            @input="setModified(true)"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="opt in ['a', 'b', 'c', 'd']" :key="opt">
            <label class="text-sm capitalize">Option {{ opt.toUpperCase() }}</label>
            <input
              v-model="questions[currentQuestionIndex][`option_${opt}`]"
              type="text"
              class="w-full border-1 border-indigo-300 px-3 py-2 rounded-md"
              @input="setModified(true)"
            />
          </div>
        </div>

        <div class="text-center flex flex-col items-center mt-8">
          <label class="text-sm">Correct Option</label>
          <select
            v-model="questions[currentQuestionIndex].correct_option"
            class="w-1/5 px-3 py-2 rounded-md border-1 border-indigo-500"
            @change="setModified(true)"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center mt-4">
          <button
            @click="saveQuestion(questions[currentQuestionIndex])"
            class="text-white flex items-center gap-1 cursor-pointer px-2 py-2 rounded-md"
            :class="{
              'bg-gray-400': !isModified,
              'bg-blue-600 hover:bg-blue-500': isModified,
            }"
            :disabled="!isModified || saving"
          >
            <span
              v-if="saving"
              class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 inline-block mr-2"
            ></span>
            <span v-else><ArrowDownToDot class="w-5 h-5" /> {{ saving ? "saving.." : "Save" }}</span>
          </button>

          <button
            @click="deleteQuestion(questions[currentQuestionIndex].id)"
            class="text-red-500 hover:text-red-700 px-4 py-2 rounded cursor-pointer transition-all duration-200"
            :disabled="saving"
          >
            <Beer class="w-7 h-7 hover:scale-110" />
          </button>
        </div>
      </div>

      <!-- ✅ Pagination.vue component -->
      <Pagination
        :currentPage="currentQuestionIndex"
        :questionsPerPage="1"
        :totalQuestions="questions.length"
        :goToPage="goToPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useExamStore } from '@/stores/examStore';
import Pagination from '@/components/pages/Pagination.vue';
import { ArrowDownToDot, Beer } from 'lucide-vue-next';

const props = defineProps({
  questions: Array,
});

const examStore = useExamStore();
const currentQuestionIndex = ref(0);
const saving = ref(false);
const isModified = ref(false); 
const originalQuestion = ref({});

// Watch for changes in the current question
watch(
  () => props.questions[currentQuestionIndex.value],
  () => {
    isModified.value = true; 
  },
  { deep: true }
);

// Save changes to the current question
const saveQuestion = async (q) => {
  saving.value = true;
  try {
    await examStore.updateQuestion(q.id, {
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option,
    });
    originalQuestion.value = { ...q };
    isModified.value = false;  
  } catch (e) {
    console.error(e);
  } finally {
    saving.value = false;
  }
};

// Handle deletion with confirmation
const deleteQuestion = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await examStore.deleteQuestion(id);
      Swal.fire("Deleted!", "Your question has been deleted.", "success");
    } catch (e) {
      console.error(e);
    }
  } else {
    Swal.fire("Cancelled", "Your question is safe", "error");
  }
};

// Navigate to a specific page in the pagination
const goToPage = (pageNumber) => {
  currentQuestionIndex.value = pageNumber;
};

// Mark the question as modified
const setModified = (status) => {
  isModified.value = status;  
};
</script>
