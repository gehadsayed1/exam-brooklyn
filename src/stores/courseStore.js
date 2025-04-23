// 📁 src/stores/courseStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../api/axiosInstance'
import { ALL_COURSES } from '../api/Api'
import notyf from '../components/global/notyf' // Adjust the path as necessary



export const useCourseStore = defineStore('courseStore', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCourses = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get(ALL_COURSES)
      courses.value = response.data.data
    console.log(response.data.data);
    
    } catch (err) {
      error.value = 'Failed to fetch courses'
      notyf.error(error.value)
      console.error(err)
      loading.value = false
    } finally {
      loading.value = false
    }
  }

  const addCourse = async (course) => {
    console.log(course);
    
    try {
      const response = await apiClient.post(ALL_COURSES, course)
      courses.value.push(response.data.data)
      console.log(response.data.data);
      
      notyf.success('Course added successfully')
    } catch (err) {
      
      console.error(err)
      err.data.errors.forEach((error) => {
        notyf.error(error.message)
      })
      loading.value = false
    }
  }
  

  const updateCourse = async (id, updatedData) => {
    try {
      const response = await apiClient.put(`${ALL_COURSES}/${id}`, updatedData);
  
      // Find the course by id and update it in the array
      const index = courses.value.findIndex(course => course.id === id);
      if (index !== -1) {
        // Update the course at the found index
        courses.value[index] = response.data.data;
      } else {
        console.error("Course not found");
      }
  
      notyf.success('Course updated successfully');
    } catch (err) {
      console.log(err);
      error.value = 'Failed to update course';
      notyf.error(error.value);
      console.error(err);
    }
  }
  
  

  const deleteCourse = async (id) => {
    try {
      await apiClient.delete(`${ALL_COURSES}/${id}`)
      courses.value = courses.value.filter(c => c.id !== id) 
      notyf.success('Course deleted successfully')
    } catch (err) {
      if (err.response?.status === 500 && err.response?.data?.message.includes('Integrity constraint')) {
        notyf.error('Cannot delete course: It is linked to other records.')
      } else {
        error.value = 'Failed to delete course'
        notyf.error(error.value)
      }
      console.error(err)
    }
  }
  

  return {
    courses,
    loading,
    error,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse
  }
})
