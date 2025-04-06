<script setup>
import InstructorSelect from '@/components/dashboard/InstructorSelect.vue';
import CourseSelect from '@/components/dashboard/CourseSelect.vue';
import ExamInfoForm from '@/components/dashboard/ExamInfoForm.vue';
import ExamQuestions from '@/components/dashboard/ExamQuestions.vue';
import { ref } from 'vue';
import { useExamStore } from '@/stores/examStore';
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf()
const examStore = useExamStore()

const exam = ref({
  name: '',
  description: '',
  duration: 0,
  ins_id: '',
  crs_id: '',
  is_active: true,
  questions: []
})

const submitting = ref(false)
const errors = ref({
  name: '',
  description: '',
  duration: '',
  ins_id: '',
  crs_id: ''
})

const validate = () => {
  errors.value = {
    name: exam.value.name ? '' : 'Exam name is required',
    description: exam.value.description ? '' : 'Description is required',
    duration: exam.value.duration > 0 ? '' : 'Duration must be greater than 0',
    ins_id: exam.value.ins_id ? '' : 'Please select an instructor',
    crs_id: exam.value.crs_id ? '' : 'Please select a course'
  }

  return Object.values(errors.value).every(e => e === '')
}

const submitExam = async () => {
  if (!validate()) {
    notyf.error('Please fill in all required fields.')
    return
  }

  submitting.value = true
  console.log(exam.value);
  
  try {
    await examStore.addExam(exam.value)
   exam.value = {
      name: '',
      description: '',
      duration: 0,
      ins_id: '',
      crs_id: '',
      is_active: true,
      questions: []
    }
  } catch (error) {
    notyf.error('Failed to create exam.')
  } finally {
    submitting.value = false
  }
}
</script>


<template>
  <div class="m-10 bg-white shadow-md rounded-2xl p-5">
    <h1 class="text-3xl font-bold text-primary shadow-sm text-center mb-5 p-2">Create New Exam</h1>
 <!-- Instructor and Course Selects -->
 <div class="flex items-center justify-center gap-5 mt-8">
<div>
  <InstructorSelect v-model="exam.ins_id" />
  <p v-if="errors.ins_id" class="text-red-500 text-sm ms-5 ">{{ errors.ins_id }}</p>
</div>

<div>
  <CourseSelect v-model="exam.crs_id" />
<p v-if="errors.crs_id" class="text-red-500 text-sm ms-5">{{ errors.crs_id }}</p>
</div>

    </div>

    <!-- General Exam Info Component -->
    <ExamInfoForm v-model="exam" :errors="errors" />


   

    <!-- Questions Component -->
    <ExamQuestions :questions="exam.questions" @update:questions="exam.questions = $event" />

    <div class="flex justify-end mt-6">
      <button
        @click="submitExam"
        :disabled="submitting"
        class="bg-primary text-white px-6 py-2 cursor-pointer rounded hover:bg-[#063585] flex items-center justify-center min-w-[120px]"
      >
        <span v-if="submitting" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
        Create Exam
      </button>
    </div>
  </div>
</template>
