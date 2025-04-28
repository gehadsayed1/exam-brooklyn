<script setup>
import InstructorSelect from "@/components/dashboard/InstructorSelect.vue";
import CourseSelect from "@/components/dashboard/CourseSelect.vue";
import ExamInfoForm from "@/components/dashboard/ExamInfoForm.vue";
import ExamQuestions from "@/components/dashboard/ExamQuestions.vue";
import { computed, inject, onMounted, ref } from "vue";
import { useExamStore } from "@/stores/examStore";
import { useScholarshipStore } from "@/stores/scholarships";
import notyf from "@/components/global/Notyf";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";


const authStore = useAuthStore();
const examStore = useExamStore();
const isAdding = ref(false);
const emitter = inject("emitter");
const scholarshipStore = useScholarshipStore();
const questionForm = ref()
const router = useRouter();


onMounted(() => {
  scholarshipStore.fetchScholarships();
  emitter.on("questions", (questions) => {
    (questions);

    exam.value.questions = questions;
  });
});

const isFormValid = computed(() => {
  return (
    exam.value.name &&
    exam.value.duration > 0 &&
    exam.value.ins_id &&
    exam.value.crs_id
  );
});

const exam = ref({
  name: "",
  description: "",
  duration: 0,
  ins_id: "",
  crs_id: "",
  is_active: true,
  questions: [],
});

const submitting = ref(false);
const errors = ref({
  name: "",
  description: "",
  duration: "",
  ins_id: "",
  crs_id: "",
});

(exam.value.ins_id);



const submitExam = async () => {
  const questions = questionForm.value.getQuestions();
  if (!questions) return;

  submitting.value = true;

  try {
    
    exam.value.questions = questions;

    (exam.value);

    await examStore.addExam(exam.value);

    
    exam.value = {
      name: "",
      description: "",
      duration: 0,
      ins_id: "20",
      crs_id: "",
      is_active: true,
      questions: [],
    };

  
  } catch (error) {
    isAdding.value = false;
    
    notyf.error("Failed to create exam.");
  } finally {
    submitting.value = false;
  }
};

</script>

<template>
 <div class=" flex justify-end mr-10">
  <button class="bg-primary text-white py-2 px-4 cursor-pointer mt-5 rounded" @click="router.push({ name: 'examExel'})">Import Exam Excel</button>
 </div>

  <div class="m-10 bg-white shadow-md rounded-2xl p-5">
    <h1 class="text-3xl font-bold text-primary shadow-sm text-center mb-5 p-2">
      Create New Exam
    </h1>
    <!-- Instructor and Course Selects -->
    <div class="flex items-center justify-between mt-8">
      <div>
        <CourseSelect v-model="exam.crs_id" />
        <p v-if="errors.crs_id" class="text-red-500 text-sm ms-5">
          {{ errors.crs_id }}
        </p>
      </div>
     
      <div>
      
        <InstructorSelect v-model="exam.ins_id"  :disabled="!exam.crs_id" />

        <p v-if="errors.ins_id" class="text-red-500 text-sm ms-5">
          {{ errors.ins_id }}
        </p>
      </div>
    </div>

    <!-- General Exam Info Component -->
    <ExamInfoForm v-model="exam" :errors="errors" />

    <!-- Add Question Button -->
    <div class="flex justify-end mt-6">
      <button
        v-if="authStore.hasPermission('create-questions')"
        v-show="!isAdding"
        @click="isAdding = true"
        :disabled="!isFormValid"
        :class="[
          'bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer flex items-center gap-2 min-w-[140px]',
          !isFormValid ? 'opacity-50 cursor-not-allowed' : '',
        ]"
      
      >
        + Add Question
      </button>
    </div>

    <!-- Questions Component -->
    <ExamQuestions
      v-show="isAdding"
      ref="questionForm"
      v-model="exam.questions"
      :questions="exam.questions"
      @update:questions="exam.questions = $event"
    />

    <div class="flex justify-start mt-6">
      <button
        @click="submitExam"
        :disabled="!isFormValid || submitting"
        :class="[
          'px-6 py-2 rounded flex items-center justify-center min-w-[120px]',
          !isFormValid || submitting
            ? 'bg-gray-400  text-white'
            : 'bg-primary text-white hover:bg-[#063585]',
        ]"
      >
        <span v-if="submitting" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
        <span v-else>Submit</span>
      </button>
    </div>
  </div>
</template>
