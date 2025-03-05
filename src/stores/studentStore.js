import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api/axiosInstance";
import { INSTRUCTORS, START_EXAM, STUDENT_ID, FINISH_EXAM_API } from "../api/Api";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({
  duration: 5000,
  dismissible: true,
  ripple: true,
  position: {
    x: "center",
    y: "top",
  },
});

export const useStudentStore = defineStore("studentStore", () => {
  const studentId = ref("");
  const courses = ref([]);
  const selectedModule = ref("");
  const instructors = ref([]);
  const selectedInstructor = ref("");
  const startExam = ref({});
  const loading = ref(false);
  const error = ref(null);
  const examAnswers = ref([]); 

  const fetchCourses = async () => {
    if (!studentId.value.trim()) {
      error.value = "please enter student id";
      return;
    }
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get(`${STUDENT_ID}/${studentId.value}`);
      courses.value = response.data;
    } catch (err) {
      // error.value = "failed to fetch courses";
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
    } catch (err) {
      error.value = "failed to fetch instructors";
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
      startExam.value = response.data.data;
      
      notyf.error("You have already started this exam");

      startExam.value = response.data.data;
      notyf.success("saved successfully");
    } catch (err) {
      notyf.error("failed to save");
    } finally {
      loading.value = false;
    }
  };


  const submitExamAnswers = async () => {
    loading.value = true;
    
  
    if (examAnswers.value.length === 0) {
      notyf.error("No answers to submit.");
      loading.value = false;
      return;
    }
  
    try {
      const payload = {
        answers: examAnswers.value.map(answer => ({
          q_id: answer.q_id,
          selected_option: answer.selected_option,
        }))
      };
      console.log(payload); 
      
      const response = await apiClient.post(FINISH_EXAM_API, payload);
      console.log(response); 
      
      notyf.success("Your answers have been submitted successfully!");
    } catch (err) {
      console.error('Error submitting answers:', err);
      notyf.error("Failed to submit answers");
    } finally {
      loading.value = false;
    }
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
    fetchCourses,
    fetchInstructors,
    submitForm,
    submitExamAnswers,
    examAnswers,
  };
});
