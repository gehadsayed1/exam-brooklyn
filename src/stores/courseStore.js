// 📁 src/stores/courseStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../api/axiosInstance'
import { ALL_COURSES } from '../api/Api'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf({
  duration: 4000,
  dismissible: true,
  position: { x: 'center', y: 'top' }
})

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
    } catch (err) {
      error.value = 'Failed to fetch courses'
      notyf.error(error.value)
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const addCourse = async (course) => {
    try {
      const response = await apiClient.post(ALL_COURSES, course)
      courses.value.push(response.data)
      notyf.success('Course added successfully')
    } catch (err) {
      error.value = 'Failed to add course'
      notyf.error(error.value)
      console.error(err)
    }
  }

  const updateCourse = async (id, updatedData) => {
    try {
      const response = await apiClient.put(`${ALL_COURSES}/${id}`, updatedData)
      const index = courses.value.findIndex(c => c.id === id)
      if (index !== -1) {
        courses.value.splice(index, 1, response.data)
      }
      notyf.success('Course updated successfully')
    } catch (err) {
      error.value = 'Failed to update course'
      notyf.error(error.value)
      console.error(err)
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
