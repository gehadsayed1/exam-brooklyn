<template>
  <div class="m-10 bg-white shadow-md rounded-2xl p-5">
    <h1 class="text-3xl font-bold text-indigo-700 mb-5">Edit Exam</h1>

    <div v-if="examStore.loading" class="flex justify-center items-center py-20">
      <div class="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-10 h-10"></div>
    </div>

    <div v-else>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <CourseSelect v-model="exam.course_id" />
        <InstructorSelect v-model="exam.ins_id" :disabled="!courseChanged" />


        
      </div>

      <!-- Pass v-model to ExamInfoForm to track changes -->
      <ExamInfoForm v-model="exam" />

      <!-- Save Changes Button -->
      <div class="flex justify-end mt-6">
        <button
          @click="updateExam"
          :disabled="!hasChanges || submitting"
          :class="[ 
            'px-6 py-2 rounded flex items-center cursor-pointer justify-center min-w-[140px] transition-all duration-300', 
            !hasChanges || submitting ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          ]"
        >
          <span
            v-if="submitting"
            class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"
          ></span>
          Save Changes
        </button>
      </div>

    

      <div class="flex justify-center items-center mt-6 gap-4">
        <button
          v-if="showGetButton || authStore.hasPermission('view-questions') || authStore.hasPermission('edit-questions')"
          @click="loadQuestions"
          class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center gap-2 min-w-[140px]"
        >
          <span v-if="loadingQuestions" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
          <span v-else>Get Questions</span>
        </button>

        <button  v-if=" !showAdder || authStore.hasPermission('create-questions')" @click="handleAddQuestion" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 min-w-[140px]">
          + Add Question
        </button>
      </div>

      <QuestionEditor v-if="showEditor" :questions="questions" @update:questions="handleQuestionsUpdate" />
      <ExamQuestions v-if="showAdder" ref="questionForm"/>

      <div v-if="showAdder" class="flex justify-center mt-6">
        <button
          @click="submitNewQuestions"
          :disabled="addQuestions.length === 0 "
          :class="[
            'px-6 py-2 rounded flex items-center cursor-pointer justify-center min-w-[140px] transition-all duration-300',
            addQuestions.length === 0  ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-green-600 hover:bg-green-700 text-white'
          ]"

        >
          <span v-if="submittingNewQuestions" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
          <span v-else>Submit New Questions</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch ,inject } from "vue";
import { useRoute } from "vue-router";
import { useExamStore } from "../../stores/examStore";
import InstructorSelect from "@/components/dashboard/InstructorSelect.vue";
import CourseSelect from "@/components/dashboard/CourseSelect.vue";
import ExamInfoForm from "@/components/dashboard/ExamInfoForm.vue";
import QuestionEditor from "@/components/dashboard/QuestionEditor.vue";
import ExamQuestions from "@/components/dashboard/ExamQuestions.vue";
import notyf from '@/components/global/notyf' 
import { useAuthStore } from "@/stores/auth";






const authStore = useAuthStore();
const examStore = useExamStore();
const route = useRoute();
const emitter = inject('emitter')
const loadingQuestions = ref(false);
const hasChanges = ref(false); // Track if changes have been made
const submitting = ref(false);
const submittingNewQuestions = ref(false);
const showEditor = ref(false);
const showAdder = ref(false);
const showGetButton = ref(true);
const showAddButton = ref(true);
const courseChanged = ref(false);
const addQuestions = ref([]);
const questions = ref([]);
const questionForm = ref()






const exam = ref({
  name: "",
  description: "",
  duration: 0,
  ins_id: "",
  course_id: "",
  is_active: true,
});

// Keep track of the initial data for comparison
let initialExamData = {};




watch(
  () => ({
    name: exam.value.name,
    description: exam.value.description,
    duration: exam.value.duration,
    ins_id: exam.value.ins_id,
    course_id: exam.value.course_id,
    is_active: exam.value.is_active,
  }),
  () => {
    hasChanges.value = JSON.stringify(initialExamData) !== JSON.stringify(exam.value);
  },
  { deep: true }
);




onMounted(async () => {
  const examId = route.params.id;
  await examStore.fetchExamById(examId);
  (examStore.singleExam);
  

  if (examStore.singleExam) {
    const fetched = examStore.singleExam;
    exam.value = {
      name: fetched.name,
      description: fetched.description,
      duration: fetched.duration,
      ins_id: fetched.instructor.id,
      course_id: fetched.course.id,
      is_active: !!fetched.is_active,
    };
    initialExamData = { ...exam.value }; // Save the initial data for comparison
  }
  hasChanges.value = false; 
  emitter.on('questions', (questions) => {
    (questions);
    addQuestions.value = questions
  })

});

const loadQuestions = async () => {
  loadingQuestions.value = true;
  try {
    await examStore.fetchExamQuestions(route.params.id);
    questions.value = examStore.examQuestions;
    showEditor.value = true;
    showAdder.value = false;
    loadingQuestions.value = false;
    showGetButton.value = false;
  } catch (err) {
    console.error("Error loading questions:", err);
  } finally {
    loadingQuestions.value = false;
  }
};

const handleQuestionsUpdate = (updated) => {
  questions.value = updated; 
  hasChanges.value = true;
};

const updateExam = async () => {
  submitting.value = true;

  try {
    // لو showAdder مفتوح يعني فيه إضافة أسئلة جديدة
    if (showAdder.value && questionForm.value) {
      const questions = questionForm.value.getQuestions();
      if (questions) {
        exam.value.questions = questions;
      }
    }

    ("Submitting exam data:", exam.value);

    await examStore.updateExam(route.params.id, exam.value);

    notyf.success("Exam updated successfully!");
    hasChanges.value = false;
  } catch (err) {
    console.error("Error updating exam:", err);
    notyf.error("Failed to update exam.");
  } finally {
    submitting.value = false;
  }
};


watch(() => exam.course_id, (newVal, oldVal) => {
  if (newVal !== initialExamData.course_id) {
    courseChanged.value = true;
  }
});

const submitNewQuestions = async () => {
  submittingNewQuestions.value = true;
  
 
  for (let question of addQuestions.value) {
    if (!question.question_text || !question.option_a || !question.option_b || !question.option_c || !question.option_d) {
      notyf.error("Please fill in all fields for each question.");
      submittingNewQuestions.value = false;
      return; 
    }
  }
  

  try {
    ("Submitting new questions:", addQuestions.value);
    ("Exam ID:", route.params.id);
    
    await examStore.addNewQuestions({
      exam_id: route.params.id,
      questions: addQuestions.value,
    });

    submittingNewQuestions.value = false;
    showAdder.value = false;
    showGetButton.value = true;
    showAddButton.value = true;
  } catch (err) {
    console.error("Error submitting new questions:", err);
    submittingNewQuestions.value = false;
  }
};



const handleAddQuestion = () => {
  showAdder.value = true;
  showEditor.value = false;
  showGetButton.value = true;
  showAddButton.value = false;
};
</script>
