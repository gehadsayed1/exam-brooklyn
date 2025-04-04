<template>
    <div class="space-y-6 p-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-800">Course List</h1>
        <button
          @click="openModal"
          class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          + Add Course
        </button>
      </div>
  
      <div v-if="courseStore.loading" class="flex justify-center items-center py-20">
        <div class="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-10 h-10"></div>
      </div>
      <div v-else>
        <DataTable
          :headers="[
            { label: 'Course Code', key: 'code' },
            { label: 'Course Name', key: 'name' }
          ]"
          :items="courseStore.courses"
          @edit="editCourse"
          @delete="confirmDelete"
        />
      </div>
  
      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
          <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Course' : 'Add Course' }}</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Course Code</label>
              <input v-model="form.code" class="w-full border rounded px-3 py-2" type="text" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Course Name</label>
              <input v-model="form.name" class="w-full border rounded px-3 py-2" type="text" />
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button @click="closeModal" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            <button @click="saveCourse" :disabled="saving" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 min-w-[90px] flex justify-center items-center">
              <span v-if="saving" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
              Save
            </button>
          </div>
          <button @click="closeModal" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useCourseStore } from '@/stores/courseStore'
  import DataTable from '@/components/dashboard/DataTable.vue'
  import Swal from 'sweetalert2'
  
  const courseStore = useCourseStore()
  const showModal = ref(false)
  const saving = ref(false)
  const isEditing = ref(false)
  const form = ref({ id: null, code: '', name: '' })
  
  const openModal = () => {
    isEditing.value = false
    form.value = { id: null, code: '', name: '' }
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    isEditing.value = false
    saving.value = false
  }
  
  const editCourse = (course) => {
    isEditing.value = true
    form.value = { ...course }
    showModal.value = true
  }
  
  const saveCourse = async () => {
    saving.value = true
    if (isEditing.value) {
      await courseStore.updateCourse(form.value.id, form.value)
    } else {
      await courseStore.addCourse(form.value)
    }
    saving.value = false
    closeModal()
  }
  
  const confirmDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This course will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })
  
    if (result.isConfirmed) {
      await courseStore.deleteCourse(id)
      Swal.fire('Deleted!', 'Course has been deleted.', 'success')
    }
  }
  
  onMounted(() => {
    courseStore.fetchCourses()
  })
  </script>
  