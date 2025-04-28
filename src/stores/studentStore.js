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
import notyf from "@/components/global/notyf";
import { useRouter } from "vue-router";
import { handleError } from "./handleError";

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
  const loadingOtp = ref(false);
  const otpMessageColor = ref("#000000");
  const otpSent = ref(false);
  const studentOTP = ref("");
  const timer = ref(120);
  let startTimer = null;
  const storedAttemptId = computed(
    () => attemptId.value || sessionStorage.getItem("attemptId")
  );

  const fetchCourses = async () => {
    loading.value = true;
    try {
      const response = await apiClient.get(`${STUDENT_ID}/${studentId.value}`);
      courses.value = response.data;
      (courses.value);

      otpSent.value = true;
      errorMessages.value = "";
      (response.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        errorMessages.value =
          error.response?.data?.message || "Something went wrong.";
      }
    } finally {
      loading.value = false;
      otpSent.value = false;
    }
  };
  const startCountdown = () => {
    if (startTimer) {
      clearInterval(startTimer);
    }

    timer.value = 120;
    startTimer = setInterval(() => {
      if (timer.value > 0) {
        timer.value--;
      } else if (timer.value === 0) {
        clearInterval(startTimer);
        timer.value = 120;
        otpMasg.value = "OTP is expired.";
        otpMessageColor.value = "text-red-500";
      }
    }, 1000);
  };

  const sendOTP = async (studentId) => {
    try {
      otpMasg.value = "";

      ("studentId", studentId);

      loadingOtp.value = true;
      const response = await apiClient.post(SEND_OTP_API, {
        st_num: studentId,
      });
      otpSent.value = true;
      if (response.data && response.data.message) {
        otpMasg.value = response.data.message || "OTP sent to your email";
        otpMessageColor.value = "text-green-500";
        startCountdown();
      }

      (response.data);
    } catch (err) {
      (err);

      if (err.response) {
        otpMasg.value =
          err.response.data.message || "Error occurred while sending OTP.";
        otpMessageColor.value = "text-red-500";
      } else if (err.request) {
        otpMasg.value = "Network error. Please check your connection.";
        otpMessageColor.value = "text-red-500";
      } else {
        otpMasg.value = "An unexpected error occurred.";
        otpMessageColor.value = "text-red-500";
      }

      loadingOtp.value = false;
      console.error(err);
    } finally {
      loadingOtp.value = false;
      otpSent.value = false;
    }
  };

  const fetchInstructors = async () => {
    ("Selected Module:", selectedModule.value);

    if (!selectedModule.value) return;
    loading.value = true;
    try {
      const response = await apiClient.get(
        `${INSTRUCTORS}/${selectedModule.value}`
      );

      instructors.value = response.data;
      (response.data);
      (instructors.value);
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
        otp: studentOTP.value,
      };
      (payload);

      const response = await apiClient.post(START_EXAM, payload);

      if (response && response.data && response.data.data) {
        clearInterval(startTimer);
        startExam.value = response.data;
        attemptId.value = startExam.value.data.attempt_id;
        examAnswers.value = startExam.value.data.answers;
        error.value = null;
        sessionStorage.setItem("attemptId", attemptId.value);
        studentId.value = "";
        selectedModule.value = null;
        selectedInstructor.value = null;
        studentOTP.value = "";
        otpMasg.value = "";
        errorMessages.value = "";
        router.push({ name: "examPage" });
        startAutoSubmit();
      } else {
        console.error("الاستجابة غير متوقعة من السيرفر:", response);
      }
    } catch (error) {
      console.error(error);

      handleError(error);
      loading.value = false;
      router.push({ name: "home" });
    } finally {
      loading.value = false;
      errorMessages.value = "";
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

      ("Answers to submit:", answers);

      const res = await apiClient.post(
        `${SUBMIT_EXAM_ANSWERS}/${storedAttemptId.value}`,
        finalPayload
      );
     
    } catch (error) {
      handleError(error);
      console.error("Error:", error.response || error);
    }
  };

  let interval = null;
  
  const startAutoSubmit = () => {
     interval = setInterval(() => {
       submitExamAnswers();
     }, 5000); 
   };
  
   const stopAutoSubmit = () => {
     if (interval) {
       clearInterval(interval);
      interval = null;
     }
   };

  const submitFinalExam = async (payload) => {
   
    stopAutoSubmit();
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

     

      const finalPayload = {
        answers: answers,
      };

      

      const res = await apiClient.post(
        `${FINISH_EXAM_API}/${storedAttemptId.value}`,
        finalPayload
      );
      stopAutoSubmit();
     

      if (res.data && res.data.message) {
        notyf.success("Exam submitted successfully.");
        clearExamData();
        router.push({ name: "ResultPage" });
      } else {
        notyf.error("Error in closing the exam. Please try again.");
      }
    } catch (error) {
      handleError(error);
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
    otpMessageColor,
    otpSent,
    studentOTP,
    sendOTP,
    otpMasg,
    startCountdown,
    timer,
    loadingOtp,
    stopAutoSubmit,
  };
});
