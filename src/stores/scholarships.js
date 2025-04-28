import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api/axiosInstance";
import { ALL_SCHOLARSHIPS } from "../api/Api";
import notyf from "../components/global/notyf";
import { handleError } from "./handleError";

export const useScholarshipStore = defineStore("scholarshipStore", () => {
  const scholarships = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchScholarships = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(ALL_SCHOLARSHIPS);
      scholarships.value = response.data.data;
      (response.data.data);
      
    }  catch (err) {
      handleError(err);
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const addScholarship = async (scholarship) => {
    // loading.value = true;
    (scholarship);
    
    try {
      const response = await apiClient.post(ALL_SCHOLARSHIPS, scholarship);
      scholarships.value.push(response.data.data);
      notyf.success("Scholarship added successfully");
    }  catch (err) {
      handleError(err);
      console.error(err);
    } finally {
      // loading.value = false;
    }
  };

  const updateScholarship = async (id, updatedData) => {
    // loading.value = true;
    try {
      const response = await apiClient.put(`${ALL_SCHOLARSHIPS}/${id}`, updatedData);
      scholarships.value = scholarships.value.map((s) =>
        s.id === id ? response.data.data : s
      );
      notyf.success("Scholarship updated successfully");
    }  catch (err) {
      handleError(err);
      console.error(err);
    } finally {
      // loading.value = false;
    }
  };

  const deleteScholarship = async (id) => {
    // loading.value = true;
    try {
      await apiClient.delete(`${ALL_SCHOLARSHIPS}/${id}`);
      scholarships.value = scholarships.value.filter((s) => s.id !== id);
      notyf.success("Scholarship deleted successfully");
    } catch (err) {
      handleError(err);
      console.error(err);
    } finally {
      // loading.value = false;
    }
  };

  const getScholarshipById = async (id) => {
    // loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(`${ALL_SCHOLARSHIPS}/${id}`);
      return response.data.data; 
    }  catch (err) {
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.message || "An error occurred";
        error.value = errorMessage;
        notyf.error(errorMessage);
      } else {
        error.value = "Failed to add scholarship";
        notyf.error(error.value);
      }
      console.error(err);
    } finally {
      // loading.value = false;
    }
  };

  return {
    scholarships,
    loading,
    error,
    fetchScholarships,
    addScholarship,
    updateScholarship,
    deleteScholarship,
    getScholarshipById,
  };
});
