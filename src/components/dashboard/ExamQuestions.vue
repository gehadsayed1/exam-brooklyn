<template>
  <div class="bg-white p-4 rounded shadow space-y-6 mt-8">
    <div v-if="questions.length">
      <!-- Header -->
      <div class="flex justify-between items-center mb-10">
        <div class="flex-1 justify-center flex">
          <span class="text-white ms-33 font-bold bg-indigo-600 rounded-full flex justify-center items-center w-10 h-10">
            {{ questions.length }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Go to:</label>
          <select v-model="currentQuestionIndex" class="border text-primary rounded-md px-2 py-1">
            <option v-for="(q, index) in questions" :key="index" :value="index">
              Question {{ index + 1 }}
            </option>
          </select>
        </div>
      </div>

      <!-- Question Form -->
      <div class="border p-4 rounded space-y-3 relative">
        <!-- Delete Button -->
        <button
          v-if="questions.length > 1"
          @click="deleteQuestion(currentQuestionIndex)"
          class="absolute top-2 right-2  text-red-800 rounded-full w-6 h-6 flex items-center cursor-pointer font-bold justify-center hover:text-red-500"
        >
          ✕
        </button>

        <div>
          <label class="text-sm font-medium text-gray-700">Question Text</label>
          <input v-model="questions[currentQuestionIndex].question_text" type="text" class="w-full border bg-primary text-xl text-gray-50 px-5 py-3 rounded-md" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div><label class="text-sm">Option A</label><input v-model="questions[currentQuestionIndex].option_a" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" /></div>
          <div><label class="text-sm">Option B</label><input v-model="questions[currentQuestionIndex].option_b" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" /></div>
          <div><label class="text-sm">Option C</label><input v-model="questions[currentQuestionIndex].option_c" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" /></div>
          <div><label class="text-sm">Option D</label><input v-model="questions[currentQuestionIndex].option_d" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" /></div>
        </div>

        <div class="flex items-center text-center justify-center mt-4">
          <div>
            <label class="text-sm">Correct Option</label>
            <select v-model="questions[currentQuestionIndex].correct_option" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Question Button -->
    <div class="flex justify-end mt-6">
      <button @click="addQuestion" class="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer flex items-center gap-2 min-w-[140px]">
        + Add New Question
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="text-red-500 mt-4 text-center">
      <p>All fields are required. Please fill out all fields before adding a new question.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'


const questions = ref([{
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_option: 'A'
}])

const currentQuestionIndex = ref(0)
const errorMessage = ref(false)

// ✅ دالة ترجع كل الأسئلة المكتملة
const getQuestions = () => {
  const allQuestions = questions.value

  // تحقق أن آخر سؤال مكتمل
  const last = allQuestions[allQuestions.length - 1]
  if (
    !last.question_text ||
    !last.option_a ||
    !last.option_b ||
    !last.option_c ||
    !last.option_d ||
    !last.correct_option
  ) {
    errorMessage.value = true
    return null
  }

  errorMessage.value = false

 
  return allQuestions.filter(q =>
    q.question_text && q.option_a && q.option_b && q.option_c && q.option_d && q.correct_option
  )
}


const emitter = inject('emitter')

const addQuestion = () => {
  const validQuestions = getQuestions()
  if (!validQuestions) return

 
  emitter?.emit('questions', validQuestions)

  questions.value.push({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A'
  })

  currentQuestionIndex.value = questions.value.length - 1
}


const deleteQuestion = (index) => {
  if (questions.value.length > 1) {
    questions.value.splice(index, 1)
    currentQuestionIndex.value = Math.max(0, currentQuestionIndex.value - 1)
  }
}


defineExpose({ getQuestions })
</script>


<style scoped>
/* Custom styles if needed */
</style>
