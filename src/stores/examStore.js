import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "@/api/axiosInstance";
import { ALL_EXAMS, ADD_EXAM, QUESTIONS } from "../api/Api";
import notyf from '@/components/global/notyf' 
import { useRouter } from "vue-router";

export const useExamStore = defineStore("examStore", () => {
  const exams = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const singleExam = ref(null);
  const examQuestions = ref([]);
  const router = useRouter();

  // ✅ Fetch all exams
  const fetchExams = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(ALL_EXAMS);
      (response.data);
      
      exams.value = response.data.data;
    } catch (err) {
      handleError(err);
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // ✅ Add new exam
  const addExam = async (examData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post(ADD_EXAM, examData);
      notyf.success("Exam created successfully");
      exams.value.push(response.data);
      router.push({ name: "exams" });
    } catch (err) {
      handleError(err);
    
      console.error(err);
    }
    finally {
      loading.value = false;
    }    
  };
  

  // ✅ Update exam
  const updateExam = async ( id, updatedData) => {
    (updatedData);
    (id);
  
    try {
      const response = await apiClient.put(`${ALL_EXAMS}/${id}`, updatedData);
      (response.data);
      examQuestions.value = response.data.data;
      notyf.success("Exam updated successfully");
      router.push({ name: "exams" });
      loading.value = false;
    } catch (err) {
     
      console.error(err);
      handleError(err);
    }
  };

  // ✅ Fetch single exam
  const fetchExamById = async (id) => {
    loading.value = true;
    try {
      const response = await apiClient.get(`${ALL_EXAMS}/${id}`);
      singleExam.value = response.data.data;
      loading.value = false;
    } catch (err) {
      handleError(err);
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // ✅ Delete exam
  const deleteExam = async (id) => {
    try {
      await apiClient.delete(`${ALL_EXAMS}/${id}`);
      exams.value = exams.value.filter((e) => e.id !== id);
      notyf.success("Exam deleted successfully");
    } catch (err) {
      handleError(err);
      console.error(err);
    }
  };

  // ✅ Fetch questions for an exam
  const fetchExamQuestions = async (examId) => {
    try {
      const response = await apiClient.get(`${ALL_EXAMS}/${examId}/questions`);
      examQuestions.value = response.data.data;
    } catch (err) {
      handleError(err);
      console.error(err);
    }
  };

  // ✅ Update question
  const updateQuestion = async (questionId, updatedData) => {
  
    try {
      const response = await apiClient.put(`${QUESTIONS}/${questionId}`, updatedData);
      ("Response:", response.data);
      examQuestions.value = response.data.data;

      if (response.status === 200) {
        notyf.success("Question updated successfully");
      } else {
        notyf.error("Failed to update question, unexpected response");
      }
    } catch (err) {
      handleError(err);
    }
  };
  

  // ✅ Delete question
  const deleteQuestion = async (questionId) => {
    try {
   await apiClient.delete(`${QUESTIONS}/${questionId}`);
      examQuestions.value = examQuestions.value.filter((q) => q.id !== questionId);
      notyf.success("Question deleted successfully");
    }
    catch (err) {
      handleError(err);
      console.error(err);
    }
  };



  // ✅ Add new questions
  const addNewQuestions = async ({ exam_id, questions }) => {
    ("Exam ID:", exam_id);
    ("Questions:", questions);
    try {
      await apiClient.post(`${ALL_EXAMS}/${exam_id}/questions`, { questions });
      notyf.success("Questions added successfully");
    } catch (err) {
      console.error(err);
      handleError(err);
    }
  };

  return {
    exams,
    loading,
    error,
    singleExam,
    examQuestions,
    addNewQuestions,
    fetchExams,
    addExam,
    updateExam,
    deleteExam,
    fetchExamById,
    updateQuestion,
    fetchExamQuestions,
    deleteQuestion,
  };
});
