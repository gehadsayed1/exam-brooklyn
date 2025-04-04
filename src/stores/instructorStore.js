// 📁 src/stores/instructorStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../api/axiosInstance'
import { ALL_INSTRUCTORS } from '../api/Api'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import Swal from 'sweetalert2'

const notyf = new Notyf({
  duration: 4000,
  dismissible: true,
  position: { x: 'center', y: 'top' }
})

export const useInstructorStore = defineStore('instructorStore', () => {
  const instructors = ref([])
  const loading = ref(false)
  const error = ref(null)

  // ✅ Get all instructors
  const fetchInstructors = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get(ALL_INSTRUCTORS)
      instructors.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch instructors'
      notyf.error(error.value)
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // ✅ Update instructor
  const updateInstructor = async (id, updatedData) => {
    try {
      const response = await apiClient.put(`${ALL_INSTRUCTORS}/${id}`, updatedData)
      const index = instructors.value.findIndex(i => i.id === id)
      if (index !== -1) {
        instructors.value.splice(index, 1, response.data) // 🔁 تحديث تفاعلي
      }
      notyf.success('Instructor updated successfully')
    } catch (err) {
      error.value = 'Failed to update instructor'
      notyf.error(error.value)
      console.error(err)
    }
  }

  // ✅ Add instructor
  const addInstructor = async ({ name, phone }) => {
    try {
      const response = await apiClient.post(ALL_INSTRUCTORS, { name, phone })
      instructors.value.push(response.data) // ✅ تضاف فورًا في الـ UI
      notyf.success('Instructor added successfully')
    } catch (err) {
      error.value = 'Failed to add instructor'
      notyf.error(error.value)
      console.error(err)
    }
  }

  // ✅ Delete instructor
  const deleteInstructor = async (id) => {
    try {
      await apiClient.delete(`${ALL_INSTRUCTORS}/${id}`)
      instructors.value = instructors.value.filter(i => i.id !== id)
      notyf.success('Instructor has been deleted.')
    } catch (err) {
      error.value = 'Failed to delete instructor'
      notyf.error(error.value)
      console.error(err)
    }
  }
  

  return {
    instructors,
    loading,
    error,
    fetchInstructors,
    addInstructor,
    deleteInstructor,
    updateInstructor
  }
})
