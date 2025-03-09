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
  
  const result = ref(null);
  // startExam يحتفظ ببيانات الامتحان الذي تم حفظه من خلال استدعاء startExam API
  const startExam = ref({ questions: [] });
  const loading = ref(false);
  const error = ref(null);

  // تعريف attemptId كمتغير ليكون متاحًا لجميع الدوال
  const attemptId = ref(null);

  // دالة لتحميل بيانات الامتحان من localStorage في حال وجودها
  const loadExamFromLocalStorage = () => {
    const examData = localStorage.getItem("exam");
    if (examData) {
      // نفترض أن البيانات محفوظة كـ JSON string
      const parsedExam = JSON.parse(examData);
      startExam.value = parsedExam;
      // تعيين attemptId من البيانات
      if (parsedExam.data && parsedExam.data.attempt_id) {
        attemptId.value = parsedExam.data.attempt_id;
        console.log("Loaded attemptId from localStorage:", attemptId.value);
      }
      notyf.success("تم تحميل بيانات الامتحان السابق");
    }
  };

  // يجب استدعاء loadExamFromLocalStorage عند تحميل التطبيق أو قبل البدء بالامتحان
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
    // إذا كان الامتحان موجود بالفعل في اللوكل استوريج، نقوم بتحميله مباشرةً
    if (localStorage.getItem("exam")) {
      notyf.error("You have already started this exam");
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
      
      // استخدام response.data بدلاً من resp.data
      localStorage.setItem("exam", JSON.stringify(response.data));
      
      // تحديث بيانات startExam واستدعاء attemptId
      startExam.value = response.data.data;
      if (response.data.data && response.data.data.attempt_id) {
        attemptId.value = response.data.data.attempt_id;
      }
      notyf.error("You have already started this exam");
      notyf.success("saved successfully");
    } catch (err) {
      notyf.error("failed to save");
    } finally {
      loading.value = false;
    }
  };

  // دالة إرسال الإجابات، تستقبل payload بالشكل المطلوب:
  // { answers: [ { q_id: ..., selected_option: ... }, ... ] }
  const submitExamAnswers = async (payload) => {
    loading.value = true;
    console.log("Submitting payload:", payload);
    try {
      // استخدام attemptId.value هنا
      const response = await apiClient.post(`${FINISH_EXAM_API}/${attemptId.value}`, payload);
      result.value = response.data;
      console.log("Response from finish exam API:", response.data);
      
      notyf.success("Your answers have been submitted successfully!");
      // بعد تقديم الإجابات يمكن إزالة بيانات الامتحان المحفوظة
      localStorage.removeItem("exam");
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
