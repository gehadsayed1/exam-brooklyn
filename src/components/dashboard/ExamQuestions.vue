<template>
  <div class="bg-white p-4 rounded shadow space-y-6 mt-8">
    <div v-if="questions.length">
      <div class="flex justify-between items-center mb-10">
        <div class="flex-1 justify-center flex">
          <span class="text-white ms-33 font-bold bg-indigo-600 rounded-full flex justify-center items-center w-10 h-10">
            {{ questions.length }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Go to:</label>
          <select
            v-model="currentQuestionIndex"
            class="border text-primary rounded-md px-2 py-1"
          >
            <option v-for="(q, index) in questions" :key="index" :value="index">
              Question {{ index + 1 }}
            </option>
          </select>
        </div>
      </div>

      <div class="border p-4 rounded space-y-3 relative">
        <button
          @click="removeQuestion(currentQuestionIndex)"
          class="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          ×
        </button>

        <div>
          <label class="text-sm font-medium text-gray-700">Question Text</label>
          <input
            v-model="questions[currentQuestionIndex].question_text"
            type="text"
            class="w-full border bg-primary text-xl text-gray-50 px-5 py-3 rounded-md"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm">Option A</label>
            <input v-model="questions[currentQuestionIndex].option_a" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" />
          </div>
          <div>
            <label class="text-sm">Option B</label>
            <input v-model="questions[currentQuestionIndex].option_b" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" />
          </div>
          <div>
            <label class="text-sm">Option C</label>
            <input v-model="questions[currentQuestionIndex].option_c" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" />
          </div>
          <div>
            <label class="text-sm">Option D</label>
            <input v-model="questions[currentQuestionIndex].option_d" type="text" class="w-full border px-3 py-2 rounded-md focus:outline-none focus:border-blue-800" />
          </div>
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

        <p v-if="errors[currentQuestionIndex]" class="text-red-500 text-sm">
          Please fill out all fields for this question.
        </p>
      </div>
    </div>

    <div class="flex justify-between items-center">
      <button
        @click="addQuestion"
        class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        + Add Question
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  questions: Array
})

const emit = defineEmits(['update:questions'])

const currentQuestionIndex = ref(0)
const errors = ref({})

const isQuestionValid = (question) => {
  return (
    question.question_text &&
    question.option_a &&
    question.option_b &&
    question.option_c &&
    question.option_d &&
    question.correct_option
  )
}

const addQuestion = () => {
  errors.value = {}

  const invalidIndex = props.questions.findIndex(q => !isQuestionValid(q))
  if (invalidIndex !== -1) {
    errors.value[invalidIndex] = true
    currentQuestionIndex.value = invalidIndex
    return
  }

  const newQuestion = {
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A'
  }

  emit('update:questions', [...props.questions, newQuestion])
  currentQuestionIndex.value = props.questions.length
}

const removeQuestion = (index) => {
  const updated = [...props.questions]
  updated.splice(index, 1)
  emit('update:questions', updated)
  if (currentQuestionIndex.value > 0) currentQuestionIndex.value--
}
</script>
