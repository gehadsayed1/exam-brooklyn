import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "@/api/axiosInstance";
import { ALL_EXAMS, ADD_EXAM, QUESTIONS } from "../api/Api";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({
  duration: 4000,
  dismissible: true,
  position: { x: "center", y: "top" },
});

export const useExamStore = defineStore("examStore", () => {
  const exams = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const singleExam = ref(null);
  const examQuestions = ref([]);

  // ✅ Fetch all exams
  const fetchExams = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(ALL_EXAMS);
      exams.value = response.data.data;
    } catch (err) {
      error.value = "Failed to fetch exams";
      notyf.error(error.value);
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
    } catch (err) {
      error.value = "Failed to create exam";
      notyf.error(error.value);
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // ✅ Update exam
  const updateExam = async (updatedData) => {
    console.log(updatedData);
    try {
      const response = await apiClient.post(ALL_EXAMS, updatedData);
      notyf.success("Exam updated successfully");
    } catch (err) {
      console.error(err);
      notyf.error("Failed to update exam");
    }
  };

  // ✅ Fetch single exam
  const fetchExamById = async (id) => {
    loading.value = true;
    try {
      const response = await apiClient.get(`${ALL_EXAMS}/${id}`);
      singleExam.value = response.data.data;
    } catch (err) {
      error.value = "Failed to fetch exam";
      notyf.error(error.value);
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
      error.value = "Failed to delete exam";
      notyf.error(error.value);
      console.error(err);
    }
  };

  // ✅ Fetch questions for an exam
  const fetchExamQuestions = async (examId) => {
    try {
      const response = await apiClient.get(`${ALL_EXAMS}/${examId}/questions`);
      console.log(response);
      
      examQuestions.value = response.data.data;
    } catch (err) {
      notyf.error("Failed to fetch questions");
      console.error(err);
    }
  };

  // ✅ Update question
  const updateQuestion = async (questionId, updatedData) => {
    try {
      const response = await apiClient.put(`${QUESTIONS}/${questionId}`, updatedData);
      notyf.success("Question updated successfully");
    } catch (err) {
      console.error(err);
      notyf.error("Failed to update question");
    }
  };

  // ✅ Delete question
  const deleteQuestion = async (questionId) => {
    try {
      await apiClient.delete(`${QUESTIONS}/${questionId}`);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Bulk create questions
  const bulkCreateQuestions = async (examId, questionsArray) => {
    try {
      await apiClient.post(`${ALL_EXAMS}/${examId}/questions`, {
        questions: questionsArray
      });
      notyf.success("Questions added successfully");
    } catch (err) {
      console.error(err);
      notyf.error("Failed to add questions");
    }
  };

  // ✅ Add new questions
  const addNewQuestions = async ({ exam_id, questions }) => {
    try {
      await apiClient.post(`${ALL_EXAMS}/${exam_id}/questions`, { questions });
      notyf.success("Questions added successfully");
    } catch (err) {
      console.error(err);
      notyf.error("Failed to add new questions");
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
    bulkCreateQuestions
  };
});
