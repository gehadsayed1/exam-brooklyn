<template>
  <div class="pagination flex justify-center items-center gap-2 mt-8">
    <!-- Previous -->
    <button @click="previousPage" :disabled="currentPage === 0" class="btn-prev">
      Previous
    </button>

    <!-- Visible Page Numbers -->
    <button
      v-for="n in visiblePageNumbers"
      :key="n"
      @click="goToPage(n - 1)"
      :class="['page-btn', { active: currentPage === n - 1 }]"
    >
      {{ n }}
    </button>

    <!-- Dots + Last Number -->
    <template v-if="showLast">
      <span class="dots">...</span>
      <button
        @click="goToPage(totalQuestions - 1)"
        class="page-btn"
        :class="{ active: currentPage === totalQuestions - 1 }"
      >
        {{ totalQuestions }}
      </button>
    </template>

    <!-- Next -->
    <button
      @click="nextPage"
      :disabled="currentPage === totalQuestions - 1"
      class="btn-next"
    >
      Next
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  currentPage: { type: Number, required: true },
  questionsPerPage: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  goToPage: { type: Function, required: true },
})

const visibleStart = ref(0)

const visiblePageNumbers = computed(() => {
  const pages = []
  const maxPages = Math.min(3, props.totalQuestions - 1) 
  for (let i = 0; i < maxPages; i++) {
    const pageNum = visibleStart.value + i + 1
    if (pageNum < props.totalQuestions) pages.push(pageNum)
  }
  return pages
})

const showLast = computed(() => {
  const lastVisible = visibleStart.value + 3
  return props.totalQuestions > 4 && lastVisible < props.totalQuestions
})

const nextPage = () => {
  if (props.currentPage < props.totalQuestions - 1) {
    const newPage = props.currentPage + 1
    props.goToPage(newPage)
    if (newPage >= visibleStart.value + 3 && newPage < props.totalQuestions - 1) {
      visibleStart.value++
    }
  }
}

const previousPage = () => {
  if (props.currentPage > 0) {
    const newPage = props.currentPage - 1
    props.goToPage(newPage)
    if (newPage < visibleStart.value) {
      visibleStart.value = Math.max(0, visibleStart.value - 1)
    }
  }
}
</script>

<style scoped>
.page-btn {
  padding: 8px 12px;
  border: 1px solid #092c67;
  background-color: white;
  color: #092c67;
  cursor: pointer;
  border-radius: 10px;
  min-width: 40px;
}

.page-btn.active {
  background-color: #092c67;
  color: white;
  font-weight: bold;
}

.dots {
  margin: 0 6px;
  color: #092c67;
}

.btn-prev,
.btn-next {
  padding: 8px 14px;
  background-color: #092c67;
  color: white;
  width: 100px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-prev:disabled,
.btn-next:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
