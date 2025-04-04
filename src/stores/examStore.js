// 📁 src/stores/examStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/axiosInstance'
import { ALL_EXAMS } from '../api/Api'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf({
  duration: 4000,
  dismissible: true,
  position: { x: 'center', y: 'top' }
})

export const useExamStore = defineStore('examStore', () => {
  const exams = ref([])
  const loading = ref(false)
  const error = ref(null)

  // ✅ Fetch all exams
  const fetchExams = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get(ALL_EXAMS)
      console.log(response.data);
      
      exams.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch exams'
      notyf.error(error.value)
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // ✅ Add new exam
  const addExam = async (examData) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post(ALL_EXAMS, examData)
      exams.value.push(response.data)
      notyf.success('Exam created successfully')
    } catch (err) {
      error.value = 'Failed to create exam'
      notyf.error(error.value)
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    exams,
    loading,
    error,
    fetchExams,
    addExam
  }
})
