// 📁 src/stores/instructorStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api/axiosInstance";
import { ALL_INSTRUCTORS } from "../api/Api";
import notyf from "../components/global/notyf";
import { handleError } from "./handleError";

export const useInstructorStore = defineStore("instructorStore", () => {
  const instructors = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ✅ Get all instructors
  const fetchInstructors = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(ALL_INSTRUCTORS);
      instructors.value = response.data.data;
      loading.value = false;
    } catch (err) {
      handleError(err);
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // ✅ Add instructor
  const addInstructor = async ({ name, phone }) => {
    try {
      const response = await apiClient.post(ALL_INSTRUCTORS, { name, phone });
      (response.data);

      instructors.value.push(response.data.data);
      notyf.success("Instructor added successfully");
    } catch (err) {
      handleError(err);
      console.error(err);
    }
  };

  // ✅ Update instructor
  const updateInstructor = async (id, updatedData) => {
    try {
      const response = await apiClient.put(
        `${ALL_INSTRUCTORS}/${id}`,
        updatedData
      );
      const index = instructors.value.findIndex((i) => i.id === id);
      if (index !== -1) {
        instructors.value.splice(index, 1, response.data.data);
      }
      notyf.success("Instructor updated successfully");
    } catch (err) {
      handleError(err);
      console.error(err);
    }
  };

  // ✅ Delete instructor
  const deleteInstructor = async (id) => {
    try {
      await apiClient.delete(`${ALL_INSTRUCTORS}/${id}`);
      instructors.value = instructors.value.filter((i) => i.id !== id);
      notyf.success("Instructor has been deleted.");
    } catch (err) {
      handleError(err);
      console.error(err);
    }
  };

  return {
    instructors,
    loading,
    error,
    fetchInstructors,
    addInstructor,
    deleteInstructor,
    updateInstructor,
  };
});
