<script setup>
import InstructorSelect from '@/components/dashboard/InstructorSelect.vue';
import CourseSelect from '@/components/dashboard/CourseSelect.vue';
import ExamInfoForm from '@/components/dashboard/ExamInfoForm.vue';
import ExamQuestions from '@/components/dashboard/ExamQuestions.vue';
import { ref, watch } from 'vue';
import { useExamStore } from '@/stores/examStore';

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

const submitExam = async () => {
  console.log('Exam Data to Send:', exam.value)
  submitting.value = true
  await examStore.addExam({
    name: exam.value.name,
    description: exam.value.description,
    duration: exam.value.duration,
    is_active: exam.value.is_active,
    ins_id: exam.value.ins_id,
    course_id: exam.value.crs_id,
    questions: exam.value.questions
  })
  submitting.value = false
  
exam ={
  name: '',
  description: '',
  duration: 0,
  ins_id: '',
  crs_id: '',
  is_active: true,
  questions: []
}
}
</script>

<template>
  <div class="m-10 bg-white shadow-md rounded-2xl p-5">
    <h1 class="text-3xl font-bold text-primary shadow-sm text-center mb-5 p-2">Create Exam</h1>

    <!-- General Exam Info Component -->
    <ExamInfoForm v-model="exam" />

    <!-- Instructor and Course Selects -->
    <div class="flex items-center justify-center gap-5 mt-8">
      <InstructorSelect v-model="exam.ins_id" />
      <CourseSelect v-model="exam.crs_id" />
    </div>

    <!-- Questions Component -->
    <ExamQuestions :questions="exam.questions" @update:questions="exam.questions = $event" />

    <div class="flex justify-end mt-6">
      <button
        @click="submitExam"
        :disabled="submitting"
        class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center justify-center min-w-[120px]"
      >
        <span v-if="submitting" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
        Submit Exam
      </button>
    </div>
  </div>
</template>
