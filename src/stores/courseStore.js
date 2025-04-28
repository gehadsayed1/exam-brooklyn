// 📁 src/stores/courseStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api/axiosInstance";
import { ALL_COURSES } from "../api/Api";
import notyf from "../components/global/notyf"; // Adjust the path as necessary
import { handleError } from "./handleError";

export const useCourseStore = defineStore("courseStore", () => {
  const courses = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchCourses = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(ALL_COURSES);
      courses.value = response.data.data;
      response.data.data;
    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
    }
  };

  const addCourse = async (course) => {
    course;

    try {
      const response = await apiClient.post(ALL_COURSES, course);
      courses.value.push(response.data.data);
      response.data.data;

      notyf.success("Course added successfully");
    } catch (err) {
      handleError(err);
    }
  };

  const updateCourse = async (id, updatedData) => {
    try {
      const response = await apiClient.put(`${ALL_COURSES}/${id}`, updatedData);
      const updatedCourse = response.data.data;

      const index = courses.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        courses.value[index] = updatedCourse;
      }

      notyf.success("Course updated successfully");
    } catch (err) {
      handleError(err);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await apiClient.delete(`${ALL_COURSES}/${id}`);
      courses.value = courses.value.filter((c) => c.id !== id);
      notyf.success("Course deleted successfully");
    } catch (err) {
      handleError(err);
    }
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
  };
});
