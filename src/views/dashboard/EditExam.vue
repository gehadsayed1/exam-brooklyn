<template>
  <div class="m-10 bg-white shadow-md rounded-2xl p-5">
    <h1 class="text-3xl font-bold text-indigo-700 mb-5">Edit Exam</h1>

    <!-- Spinner while loading exam -->
    <div v-if="examStore.loading" class="flex justify-center py-20">
      <div class="animate-spin border-4 border-indigo-600 border-t-transparent rounded-full w-12 h-12"></div>
    </div>

    <div v-else>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <InstructorSelect v-model="exam.ins_id" />
        <CourseSelect v-model="exam.crs_id" />
      </div>

      <ExamInfoForm v-model="exam" />

      <!-- زر حفظ الامتحان -->
      <div class="flex justify-end mt-6">
        <button
          @click="updateExam"
          :disabled="!hasChanges || submitting"
          :class="[ 'px-6 py-2 rounded flex items-center cursor-pointer justify-center min-w-[140px] transition-all duration-300',
            (!hasChanges || submitting)
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          ]"
        >
          <span v-if="submitting" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
          Save Changes
        </button>
      </div>

      <!-- أزرار الأسئلة -->
      <div class="flex justify-center items-center mt-6 gap-4">
        <button
          v-if="!questionsLoaded"
          @click="loadQuestions"
          class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center gap-2 min-w-[140px]"
        >
          <span v-if="loadingQuestions" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
          <span v-else>Get Questions</span>
        </button>

        <button
          @click="handleAddQuestion"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 min-w-[140px]"
        >
          + Add Question
        </button>
      </div>

      <!-- Question Editors -->
      <QuestionEditor
        v-if="showEditor"
        :questions="exam.questions"
        @update:questions="handleQuestionsUpdate"
      />

      <!-- Add New Questions -->
      <ExamQuestions
        v-if="showAdder"
        ref="examQuestionsRef"
        :questions="exam.questions"
        @update:questions="handleQuestionsUpdate"
      />

      <!-- زر إرسال الأسئلة الجديدة -->
      <div v-if="showAdder" class="flex justify-center mt-6">
        <button
          @click="submitNewQuestions"
          class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2 min-w-[140px]"
        >
          <span v-if="submittingNewQuestions" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
          <span v-else>Submit New Questions</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useExamStore } from "../../stores/examStore";
import InstructorSelect from "@/components/dashboard/InstructorSelect.vue";
import CourseSelect from "@/components/dashboard/CourseSelect.vue";
import ExamInfoForm from "@/components/dashboard/ExamInfoForm.vue";
import QuestionEditor from "@/components/dashboard/QuestionEditor.vue";
import ExamQuestions from "@/components/dashboard/ExamQuestions.vue";

const examStore = useExamStore();
const route = useRoute();

const loadingQuestions = ref(false);
const questionsLoaded = ref(false);
const hasChanges = ref(false);
const submitting = ref(false);
const submittingNewQuestions = ref(false);
const showEditor = ref(false);
const showAdder = ref(false);
const examQuestionsRef = ref(null)

const exam = ref({
  name: "",
  description: "",
  duration: 0,
  ins_id: "",
  crs_id: "",
  is_active: true,
  questions: [],
});

watch(
  () => ({
    name: exam.value.name,
    description: exam.value.description,
    duration: exam.value.duration,
    ins_id: exam.value.ins_id,
    crs_id: exam.value.crs_id,
    is_active: exam.value.is_active
  }),
  () => {
    hasChanges.value = true;
  },
  { deep: true }
);

onMounted(async () => {
  const examId = route.params.id;
  await examStore.fetchExamById(examId);

  if (examStore.singleExam) {
    const fetched = examStore.singleExam;
    exam.value = {
      name: fetched.name,
      description: fetched.description,
      duration: fetched.duration,
      ins_id: fetched.instructor.id,
      crs_id: fetched.course.id,
      is_active: !!fetched.is_active,
      questions: [],
    };
  }
});

const loadQuestions = async () => {
  const examId = route.params.id;
  loadingQuestions.value = true;
  try {
    await examStore.fetchExamQuestions(examId);
    const transformed = examStore.examQuestions.map((q) => ({
      id: q.id,
      question_text: q.question_text,
      option_a: q.options?.A || "",
      option_b: q.options?.B || "",
      option_c: q.options?.C || "",
      option_d: q.options?.D || "",
      correct_option: q.correct_option,
    }));
    exam.value.questions = transformed;
    showEditor.value = true;
    showAdder.value = false;
    questionsLoaded.value = true;
    hasChanges.value = false;
  } catch (err) {
    console.error("Error loading questions:", err);
  } finally {
    loadingQuestions.value = false;
  }
};

const handleQuestionsUpdate = (updated) => {
  exam.value.questions = updated;
  hasChanges.value = true;
};

const updateExam = async () => {
  submitting.value = true;

  await examStore.updateExam(route.params.id, {
    name: exam.value.name,
    description: exam.value.description,
    duration: exam.value.duration,
    is_active: exam.value.is_active,
    ins_id: exam.value.ins_id,
    course_id: exam.value.crs_id,
  });

  for (const q of exam.value.questions) {
    const payload = {
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option,
    };
    if (q.id) {
      await examStore.updateQuestion(q.id, payload);
    }
  }

  submitting.value = false;
  hasChanges.value = false;
};

const submitNewQuestions = async () => {
  const newQuestions = exam.value.questions.filter(q => !q.id);
  if (!newQuestions.length) return;

  submittingNewQuestions.value = true;

  try {
    await examStore.addNewQuestions({
      exam_id: route.params.id,
      questions: newQuestions
    });

    notyf.success("New questions added successfully");

    await loadQuestions();
    hasChanges.value = false;
    showAdder.value = false;
  } catch (err) {
    console.error("Error adding new questions:", err);
  } finally {
    submittingNewQuestions.value = false;
  }
};

const handleAddQuestion = () => {
  showAdder.value = true
  nextTick(() => {
    examQuestionsRef.value?.addQuestion()
  })
}
</script>
