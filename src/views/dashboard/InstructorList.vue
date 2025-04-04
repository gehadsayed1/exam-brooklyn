<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Instructor List</h1>
      <button
        @click="openAddModal"
        class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        + Add Instructor
      </button>
    </div>

    <div v-if="instructorStore.loading" class="flex justify-center items-center py-20">
      <div class="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-10 h-10"></div>
    </div>
    <div v-else>
      <DataTable
        :headers="[
          { label: 'Name', key: 'name' },
          { label: 'Phone', key: 'phone' }
        ]"
        :items="filteredInstructors"
        @edit="editInstructor"
        @delete="confirmDelete"
      />
    </div>

    <!-- Add/Edit Instructor Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Instructor' : 'Add Instructor' }}</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Name</label>
            <input v-model="formInstructor.name" class="w-full border rounded px-3 py-2" type="text" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Phone</label>
            <input v-model="formInstructor.phone" class="w-full border rounded px-3 py-2" type="text" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="closeModal"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            @click="saveInstructor"
            :disabled="saving"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition min-w-[90px] flex justify-center items-center"
          >
            <span v-if="saving" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
            Save
          </button>
        </div>
        <button
          @click="closeModal"
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInstructorStore } from '@/stores/instructorStore'
import Swal from 'sweetalert2'
import DataTable from '@/components/dashboard/DataTable.vue'

const instructorStore = useInstructorStore()
const search = ref('')
const showModal = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const formInstructor = ref({ id: null, name: '', phone: '' })

const filteredInstructors = computed(() => {
  if (!search.value) return instructorStore.instructors
  return instructorStore.instructors.filter(ins =>
    ins.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const openAddModal = () => {
  isEditing.value = false
  formInstructor.value = { name: '', phone: '' }
  showModal.value = true
}

const editInstructor = (instructor) => {
  isEditing.value = true
  formInstructor.value = { ...instructor }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  saving.value = false
}

const saveInstructor = async () => {
  saving.value = true
  if (isEditing.value) {
    await instructorStore.updateInstructor(formInstructor.value.id, {
      name: formInstructor.value.name,
      phone: formInstructor.value.phone
    })
  } else {
    await instructorStore.addInstructor({
      name: formInstructor.value.name,
      phone: formInstructor.value.phone
    })
  }
  saving.value = false
  closeModal()
}

const confirmDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This instructor will be deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  })
  console.log(id);
  

  if (result.isConfirmed) {
    await instructorStore.deleteInstructor(id)
    await instructorStore.fetchInstructors()

    Swal.fire('Deleted!', 'Instructor has been deleted.', 'success')
  }
}

onMounted(() => {
  instructorStore.fetchInstructors()
})
</script>