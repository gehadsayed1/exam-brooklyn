import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "../api/axiosInstance";
import {
  INSTRUCTORS,
  START_EXAM,
  STUDENT_ID,
  FINISH_EXAM_API,
  SUBMIT_EXAM_ANSWERS,
  SEND_OTP_API,
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
  const errorMessages = ref("");
  const instructors = ref([]);
  const selectedInstructor = ref("");
  const startExam = ref({ questions: [] });
  const loading = ref(false);
  const error = ref(null);
  const attemptId = ref(null);
  const examAnswers = ref([]);
  const otpMasg = ref("");
  const masExam = ref("");
  const loadingOtp = ref(false);
  const storedAttemptId = computed(
    () => attemptId.value || sessionStorage.getItem("attemptId")
  );

  const fetchCourses = async () => {
    loading.value = true;
    try {
      const response = await apiClient.get(`${STUDENT_ID}/${studentId.value}`);
      courses.value = response.data;
      errorMessages.value = "";
      console.log(response.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        errorMessages.value =
          error.response?.data?.message || "Something went wrong.";
      }
    } finally {
      loading.value = false;
    }
  };

  const sendOTP = async (studentId) => {
    try {
      console.log("studentId", studentId);

      loadingOtp.value = true;
      const response = await apiClient.post(SEND_OTP_API, {
        st_num: studentId,
      });
      otpMasg.value = response.data.message;
      console.log(response.data);
    } catch (err) {
      console.log(err);

      otpMasg.value = err.response.data.message;
      loadingOtp.value = false;

      console.error(err);
    } finally {
      loadingOtp.value = false;
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

  const submitForm = async (OTP) => {
    console.log(OTP);

    loading.value = true;
    try {
      const payload = {
        ins_id: selectedInstructor.value,
        course_id: selectedModule.value,
        st_num: studentId.value,
        otp: OTP,
      };
      console.log(payload);

      const response = await apiClient.post(START_EXAM, payload);
      startExam.value = response.data;
      attemptId.value = startExam.value.data.attempt_id;
      examAnswers.value = startExam.value.data.answers;
      error.value = null;
      masExam.value = "";
      sessionStorage.setItem("attemptId", attemptId.value);
      router.push("/examPage");
    } catch (error) {
      // console.error("Error details:", error);
      masExam.value =
        error.response.data.message ||
        "Something went wrong. Please try again.";
      console.log(error.response.data.message);
      console.log(masExam.value);

      loading.value = false;
      router.push({ name: "home" });
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

  const interval = setInterval(submitExamAnswers, 3000);

  const submitFinalExam = async (payload) => {
    clearInterval(interval);

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
    errorMessages,
    sendOTP,
    otpMasg,
    masExam,
    loadingOtp,
  };
});
