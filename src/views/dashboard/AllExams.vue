<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useExamStore } from "@/stores/examStore";
import DataTable from "@/components/dashboard/DataTable.vue";
import SweetAlert2Modal from "@/components/global/SweetAlert2Modal.vue"; 

const examStore = useExamStore();
const router = useRouter();

const showDeleteAlertDialog = ref(false);
const itemToDelete = ref(null);

const handleEditExam = (exam) => {
  router.push({ name: "edit-exam", params: { id: exam.id } });
};

const showDeleteAlert = (id) => {
  showDeleteAlertDialog.value = true;
  itemToDelete.value = id;
};

const deleteExam = async () => {
  if (itemToDelete.value) {
    await examStore.deleteExam(itemToDelete.value);
    showDeleteAlertDialog.value = false;
    itemToDelete.value = null;
  }
};

const cancelDelete = () => {
  showDeleteAlertDialog.value = false;
  itemToDelete.value = null;
};

onMounted(() => {
  examStore.fetchExams();
});
</script>


<template>
  <div class="overflow-x-auto mx-auto p-6 bg-white rounded shadow">
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
      resourceType="exams"
      @edit="handleEditExam"
      @delete="showDeleteAlert"
      :loading="examStore.loading"
    />

    <SweetAlert2Modal
      v-if="showDeleteAlertDialog"
      title="Are you sure?"
      text="This exam will be deleted."
      icon="warning"
      @confirm="deleteExam"
      @cancel="cancelDelete"
    />
  </div>
</template>

