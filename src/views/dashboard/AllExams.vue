<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useExamStore } from "@/stores/examStore";
import DataTable from "@/components/dashboard/DataTable.vue";

const examStore = useExamStore();
const router = useRouter();

const handleEditExam = (exam) => {
  router.push({ name: "edit-exam", params: { id: exam.id } });
};

onMounted(() => {
  examStore.fetchExams();
});
</script>

<template>
  <div
    class="overflow-x-auto sm:w-2xl md:w-4xl mx-auto p-6 bg-white rounded shadow"
  >
    <h1 class="text-2xl font-bold text-primary mb-6">All Exams</h1>

    <DataTable
      :headers="[
        { label: 'Exam Name', key: 'name' },
        { label: 'Duration', key: 'duration' },
        { label: 'Instructor', key: 'instructor.name' },
        { label: 'Course', key: 'course.name' },
      ]"
      :isExam="true"
      :items="examStore.exams"
      @edit="handleEditExam"
      @delete="examStore.deleteExam"
      :loading="examStore.loading"
    />
  </div>
</template>
