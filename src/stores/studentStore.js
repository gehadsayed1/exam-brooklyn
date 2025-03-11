import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api/axiosInstance";
import { INSTRUCTORS, START_EXAM, STUDENT_ID, FINISH_EXAM_API } from "../api/Api";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useRouter } from "vue-router";

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
  const router = useRouter();
  const selectedModule = ref("");
  const instructors = ref([]);
  const selectedInstructor = ref("");
  const result = ref(null);
  const startExam = ref({ questions: [] });
  const loading = ref(false);
  const error = ref(null);

 
  const attemptId = ref(null);

 
  const loadExamFromLocalStorage = () => {
    const examData = localStorage.getItem("exam");
    if (examData) {
    
      const parsedExam = JSON.parse(examData);
      startExam.value = parsedExam;
      
      if (parsedExam.data && parsedExam.data.attempt_id) {
        attemptId.value = parsedExam.data.attempt_id;
        console.log("Loaded attemptId from localStorage:", attemptId.value);
      }
      notyf.success("تم تحميل بيانات الامتحان السابق");
    }
  };

  loadExamFromLocalStorage();

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
      const response = await apiClient.get(`${INSTRUCTORS}/${selectedModule.value}`);
      instructors.value = response.data;
    } catch (err) {
      error.value = "failed to fetch instructors";
    } finally {
      loading.value = false;
    }
  };

  const submitForm = async () => {
    
    if (localStorage.getItem("exam")) {   
      loadExamFromLocalStorage();
      return;
    }

    loading.value = true;
    try {
      const payload = {
        st_num: studentId.value,
        course_id: selectedModule.value,
        ins_id: selectedInstructor.value,
      };
      console.log("Submit form payload:", payload);
      
      const response = await apiClient.post(START_EXAM, payload);
      console.log("Response from start exam API:", response.data);
      if(response.data.message === "You have already started this exam"){
        return 
      }
      
      localStorage.setItem("exam", JSON.stringify(response.data));
      
   
      startExam.value = response.data.data;
      if (response.data.data && response.data.data.attempt_id) {
        attemptId.value = response.data.data.attempt_id;
      }
      notyf.success("Started the exam successfully");
    } catch (err) {
      notyf.error("failed to save");
    } finally {
      loading.value = false;
    }
  };

 
  const submitExamAnswers = async (payload) => {
    loading.value = true;
    console.log("Submitting payload:", payload);
    try {
      const response = await apiClient.post(`${FINISH_EXAM_API}/${attemptId.value}`, payload);
  
      if (response.data) {
        result.value = response.data;
        console.log("Response from finish exam API:", response.data);
  
        // تخزين البيانات في localStorage
        localStorage.setItem('examResult', JSON.stringify(response.data));
  
        notyf.success("Your answers have been submitted successfully!");
      } else {
        console.error("Response data is empty or undefined");
      }
  
      localStorage.removeItem("exam");
      router.push({ name: 'ResultPage' });
    } catch (err) {
      console.error("Error submitting answers:", err);
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
  };
});
