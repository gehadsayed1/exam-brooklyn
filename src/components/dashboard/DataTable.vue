<template>
  <div class="w-full overflow-x-auto bg-white rounded-lg shadow-md">
    <div v-if="loading"  class="flex justify-center items-center py-20">
              <div class="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-10 h-10"></div>
        </div>
    <table v-else class="min-w-[600px] w-full divide-y text-center divide-gray-200">
      <thead class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="px-6 py-4 text-center text-md font-semibold tracking-wider"
          >
            {{ header.label }}
          </th>
          <th class="px-6 py-4 text-center text-md font-semibold tracking-wider">
            Actions
          </th>
        </tr>
      </thead>

 

      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="item in items"
          :key="item.id"
          class="hover:bg-gray-50 transition-colors"

        >
          <td
            v-for="header in headers"
            :key="header.key"
            class="px-6 py-4 whitespace-nowrap"
          >
            {{ getValueByPath(item, header.key) }}
          </td>

          <td class="px-6 py-4 whitespace-nowrap space-x-6">
            <button
              @click="$emit('edit', item)"
              class="text-indigo-600 cursor-pointer hover:text-indigo-800 transition inline-flex items-center gap-1"
            >
              <Edit class="w-4 h-4" /> Edit
            </button>
            <button
              @click="$emit('delete', item.id)"
              class="text-red-600 cursor-pointer hover:text-red-800 transition inline-flex items-center gap-1"
            >
              <Trash2 class="w-4 h-4" /> Delete
            </button>
          </td>
        </tr>

        <tr v-if="items.length === 0 && !loading">
          <td :colspan="headers.length + 1" class="px-6 py-4 text-center text-gray-500">
            No data found.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Edit, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  headers: Array,
  items: Array,
  loading: Boolean

})

function getValueByPath(obj, path) {
  return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : ''), obj)
}

const emit = defineEmits(['edit', 'delete'])
</script>
