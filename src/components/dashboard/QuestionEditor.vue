<template>
    <div class="bg-white p-4 rounded shadow space-y-6 mt-8">
      <div v-if="questions.length">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex-1 flex justify-center">
            <span class="text-white font-bold ms-44 bg-indigo-600 rounded-full flex justify-center items-center w-10 h-10">
              {{ questions.length }}
            </span>
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
            <input
              v-model="questions[currentQuestionIndex].question_text"
              type="text"
              class="w-full border text-gray-900 px-5 py-3 rounded-md"
            />
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div v-for="opt in ['a', 'b', 'c', 'd']" :key="opt">
              <label class="text-sm capitalize">Option {{ opt.toUpperCase() }}</label>
              <input
                v-model="questions[currentQuestionIndex][`option_${opt}`]"
                type="text"
                class="w-full border px-3 py-2 rounded-md"
              />
            </div>
          </div>
  
          <div class="mt-3">
            <label class="text-sm">Correct Option</label>
            <select
              v-model="questions[currentQuestionIndex].correct_option"
              class="w-full border px-3 py-2 rounded-md"
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
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              :disabled="saving"
            >
              <span v-if="saving" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 inline-block mr-2"></span>
              💾 Save Question
            </button>
  
            <button
              @click="examStore.deleteQuestion(questions[currentQuestionIndex].id)"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              :disabled="saving"
            >
              🗑 Delete Question
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
  import { ref } from 'vue'
  import { useExamStore } from '@/stores/examStore'
  import Pagination from '@/components/pages/Pagination.vue' 
  
  const props = defineProps({
    questions: Array
  })
  
  const examStore = useExamStore()
  const currentQuestionIndex = ref(0)
  const saving = ref(false)
  
  const saveQuestion = async (q) => {
    saving.value = true
    try {
      await examStore.updateQuestion(q.id, {
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option
      })
    } catch (e) {
      console.error(e)
    } finally {
      saving.value = false
    }
  }
  

  
  const goToPage = (pageNumber) => {
    currentQuestionIndex.value = pageNumber
  }
  </script>
  