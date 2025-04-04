<script setup>
import { onMounted } from 'vue'
import { useExamStore } from '@/stores/examStore'
import DataTable from '@/components/dashboard/DataTable.vue'

const examStore = useExamStore()

onMounted(() => {
  examStore.fetchExams()
})
</script>

<template>
  <div class="overflow-x-auto max-w-6xl mx-auto p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold text-primary mb-6">All Exams</h1>
    <DataTable
      :headers="[
        { label: 'Exam Name', key: 'name' },
        { label: 'Description', key: 'description' },
        { label: 'Duration', key: 'duration' },
        { label: 'Instructor', key: 'instructor.name' },
        { label: 'Course', key: 'course.name' },
        { label: 'Questions', key: 'questions_count' },
        { label: 'Created At', key: 'created_at' }
      ]"
      :items="examStore.exams"
    />
  </div>
</template>
