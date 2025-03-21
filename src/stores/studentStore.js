import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "../api/axiosInstance";
import {
  INSTRUCTORS,
  START_EXAM,
  STUDENT_ID,
  FINISH_EXAM_API,
  SUBMIT_EXAM_ANSWERS,
} from "../api/Api";
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

  const storedAttemptId = computed(
    () => attemptId.value || sessionStorage.getItem("attemptId")
  );

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
      const response = await apiClient.get(
        `${INSTRUCTORS}/${selectedModule.value}`
      );
      instructors.value = response.data;
    } finally {
      loading.value = false;
    }
  };

  const submitForm = async () => {
    loading.value = true;
    try {
      const payload = {
        ins_id: selectedInstructor.value,
        course_id: selectedModule.value,
        st_num: studentId.value,
      };

      console.log(payload);

      const response = await apiClient.post(START_EXAM, payload);
      console.log(response.data);

      startExam.value = response.data;
      attemptId.value = startExam.value.data.attempt_id;
      examAnswers.value = startExam.value.data.answers;
      console.log(startExam.value.data.answers);
      sessionStorage.setItem("attemptId", attemptId.value);
      notyf.success("Exam started successfully.");
      router.push("/examPage");
    } catch (error) {
      console.error("Error details:", error);
      notyf.error("Something went wrong. Please try again.");
      router.replace({ name: "home" });
    } finally {
      loading.value = false;
    }
  };

  const submitExamAnswers = async () => {
    const answersFromStorage = sessionStorage.getItem("answers");
    if (!answersFromStorage) {
      return;
    }

    try {
      const answers = JSON.parse(answersFromStorage);
      const finalPayload = {
        answers: answers,
      };

      console.log("Answers to submit:", answers);

      const res = await apiClient.post(
        `${SUBMIT_EXAM_ANSWERS}/${storedAttemptId.value}`,
        finalPayload
      );
      console.log(res.data);
    } catch (error) {
      notyf.error("Error submitting answers.");
      console.error("Error:", error.response || error);
    }
  };

  setInterval(submitExamAnswers, 5000);

  const submitFinalExam = async (payload) => {
    try {
      let answers = payload.answers;

      if (!answers) {
        const answersFromStorage = sessionStorage.getItem("answers");
        answers = answersFromStorage ? JSON.parse(answersFromStorage) : [];
      }

      if (answers.length === 0) {
        notyf.error("No answers available to submit.");
        return;
      }

      console.log("Answers:", answers);

      const finalPayload = {
        answers: answers,
      };

      console.log("Final Payload:", finalPayload);

      const res = await apiClient.post(
        `${FINISH_EXAM_API}/${storedAttemptId.value}`,
        finalPayload
      );

      console.log("Response:", res.data);

      if (res.data && res.data.message) {
        notyf.success("Exam submitted successfully.");
        clearExamData();
        router.push({ name: "ResultPage" });
      } else {
        notyf.error("Error in closing the exam. Please try again.");
      }
    } catch (error) {
      notyf.error("Error saving exam progress.");
      console.error("Error:", error.response || error);
    }
  };

  const clearExamData = () => {
    attemptId.value = null;
    examAnswers.value = [];
    startExam.value = { questions: [] };
    sessionStorage.removeItem("attemptId");
    sessionStorage.removeItem("answers");
  };

  return {
    studentId,
    startExam,
    courses,
    selectedModule,
    instructors,
    selectedInstructor,
    loading,
    error,
    examAnswers,
    fetchCourses,
    fetchInstructors,
    submitForm,
    submitExamAnswers,
    submitFinalExam,
  };
});
