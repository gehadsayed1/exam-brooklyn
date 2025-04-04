<template>
    <div class="bg-white p-4 rounded shadow space-y-6 mt-8">
      <h2 class="text-xl font-semibold text-gray-800">Exam Questions</h2>
  
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="border p-4 rounded space-y-3 relative"
      >
        <button
          @click="removeQuestion(index)"
          class="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          ×
        </button>
  
        <div>
          <label class="text-sm font-medium text-gray-700">Question Text</label>
          <input
            v-model="question.question_text"
            type="text"
            class="w-full border px-3 py-2 rounded"
          />
        </div>
  
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm">Option A</label>
            <input v-model="question.option_a" type="text" class="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label class="text-sm">Option B</label>
            <input v-model="question.option_b" type="text" class="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label class="text-sm">Option C</label>
            <input v-model="question.option_c" type="text" class="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label class="text-sm">Option D</label>
            <input v-model="question.option_d" type="text" class="w-full border px-3 py-2 rounded" />
          </div>
        </div>
  
        <div>
          <label class="text-sm">Correct Option</label>
          <select v-model="question.correct_option" class="w-full border px-3 py-2 rounded">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
      </div>
  
      <button
        @click="addQuestion"
        class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        + Add Question
      </button>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    questions: Array
  })
  
  const emit = defineEmits(['update:questions'])
  
  const addQuestion = () => {
    const newQuestion = {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A'
    }
    emit('update:questions', [...props.questions, newQuestion])
  }
  
  const removeQuestion = (index) => {
    const updated = [...props.questions]
    updated.splice(index, 1)
    emit('update:questions', updated)
  }
  </script>
  