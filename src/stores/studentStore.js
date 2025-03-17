import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "../api/axiosInstance";
import { INSTRUCTORS, START_EXAM, STUDENT_ID, FINISH_EXAM_API, SUBMIT_EXAM_ANSWERS } from "../api/Api";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useRouter } from "vue-router";

const notyf = new Notyf({
  duration: 5000,
  dismissible: true,
  ripple: true,
  position: { x: "center", y: "top" },
});

export const useStudentStore = defineStore("studentStore", () => {
  const studentId = ref("");
  const courses = ref([]);
  const router = useRouter();
  const selectedModule = ref("");
  const instructors = ref([]);
  const selectedInstructor = ref("");
  const startExam = ref({ questions: [] });
  const loading = ref(false);
  const error = ref(null);
  const attemptId = ref(null);
  const examAnswers = ref([]);
  const message = ref("");

  const storedAttemptId = computed(() => attemptId.value || localStorage.getItem("attemptId"));

  const fetchCourses = async () => {
    if (!studentId.value.trim()) {
      error.value = "Please enter student ID";
      return;
    }
    loading.value = true;
    try {
      const response = await apiClient.get(`${STUDENT_ID}/${studentId.value}`);
      courses.value = response.data;
    } finally {
      loading.value = false;
    }
  };

  const fetchInstructors = async () => {
    if (!selectedModule.value) return;
    loading.value = true;
    try {
      const response = await apiClient.get(`${INSTRUCTORS}/${selectedModule.value}`);
      instructors.value = response.data;
    } finally {
      loading.value = false;
    }
  };

  const submitForm = async () => {
    loading.value = true;
    try {
      const payload = {
        st_num: studentId.value,
        course_id: selectedModule.value,
        ins_id: selectedInstructor.value,
      };
      const response = await apiClient.post(START_EXAM, payload);
      startExam.value = response.data;
      attemptId.value = startExam.value.data.attempt_id;
      localStorage.setItem("attemptId", attemptId.value);
      notyf.success(response.data.message);
      router.replace({ name: "exam" });
    } catch {
      notyf.error("Failed to start the exam");
    } finally {
      loading.value = false;
    }
  };

  const updateAnswer = async (newAnswer) => {
    if (!newAnswer || !newAnswer.q_id || !newAnswer.selected_option) return;
  
    const existingIndex = examAnswers.value.findIndex(a => a.q_id === newAnswer.q_id);
  
    if (existingIndex !== -1) {
      examAnswers.value[existingIndex].selected_option = newAnswer.selected_option;
    } else {
      examAnswers.value.push(newAnswer);
    }
  
    await submitExamAnswers(newAnswer); // ✅ Send answer immediately
  };
  
  const submitExamAnswers = async (answer) => {
    if (!storedAttemptId.value || !answer || !answer.q_id || !answer.selected_option) return;
  
    try {
      const payload = {
        attempt_id: storedAttemptId.value,
        answers: examAnswers.value, // ✅ Send the full answers array
      };
  
      await apiClient.post(`${SUBMIT_EXAM_ANSWERS}/${storedAttemptId.value}`, payload);
    } catch {
      notyf.error("Error submitting answer");
    }
  };
  

  const submitExamProgress = async () => {
    if (!storedAttemptId.value || examAnswers.value.length === 0) return;

    try {
      const payload = { attempt_id: storedAttemptId.value, answers: examAnswers.value };
      await apiClient.post(`${FINISH_EXAM_API}/${storedAttemptId.value}`, payload);
    } catch {
      notyf.error("Error saving progress");
    }
  };

  const submitFinalExam = async () => {
    loading.value = true;
    if (!storedAttemptId.value || examAnswers.value.length === 0) {
      notyf.error("No answers to submit.");
      return;
    }

    try {
      const payload = {
        attempt_id: storedAttemptId.value,
        answers: examAnswers.value.filter(a => a.q_id && a.selected_option),
      };

      if (payload.answers.length === 0) {
        notyf.error("No valid answers to submit.");
        return;
      }

      await apiClient.post(`${FINISH_EXAM_API}/${storedAttemptId.value}`, payload);
      notyf.success("Exam submitted successfully!");
      clearExamData();
      router.push({ name: "ResultPage" });

    } catch {
      notyf.error("Failed to submit the exam.");
    } finally {
      loading.value = false;
    }
  };

  const clearExamData = () => {
    attemptId.value = null;
    examAnswers.value = [];
    startExam.value = { questions: [] };
    localStorage.removeItem("attemptId");
  };

  setInterval(submitExamProgress, 5 * 60 * 1000);

  return {
    studentId,
    startExam,
    courses,
    selectedModule,
    instructors,
    selectedInstructor,
    loading,
    error,
    attemptId,
    examAnswers,
    fetchCourses,
    fetchInstructors,
    submitForm,
    submitExamAnswers,
    submitExamProgress,
    submitFinalExam,
    updateAnswer,
    clearExamData,
  };
});
