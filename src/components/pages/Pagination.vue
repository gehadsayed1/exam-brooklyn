<!-- Pagination.vue -->
<template>
    <div class="pagination">
      <!-- عرض الأزرار الخاصة بالأرقام -->
      <button
        v-for="n in 5"
        :key="n"
        @click="goToPage(n - 1)"
        :class="{
          active: currentPage === n - 1,
        }"
      >
        {{ n }}
      </button>
  
      <!-- النقاط إذا كانت هناك صفحات إضافية -->
      <span v-if="lastQuestionNumber !== totalQuestions">...</span>
  
      <!-- عرض الرقم الأخير -->
      <button @click="goToPage(lastQuestionNumber - 1)" class="btn-next">
        {{ lastQuestionNumber }}
      </button>
    </div>
  
    <!-- عرض أزرار التنقل -->
    <div class="text-center">
      <button @click="previousPage" :disabled="currentPage === 0" class="btn-prev">Previous</button>
      <button
        @click="nextPage"
        :disabled="currentPage >= Math.floor(totalQuestions / questionsPerPage)"
        class="btn-next"
      >
        Next
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  
  // تلقي props من المكون الرئيسي
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true,
    },
    questionsPerPage: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    goToPage: {
      type: Function,
      required: true,
    },
  });
  
  // حساب آخر رقم للسؤال
  const lastQuestionNumber = computed(() => {
    const endIndex = (props.currentPage + 1) * props.questionsPerPage;
    return endIndex > props.totalQuestions ? props.totalQuestions : endIndex;
  });
  
  // دالة التنقل إلى الصفحة التالية
  const nextPage = () => {
    if (props.currentPage < Math.floor(props.totalQuestions / props.questionsPerPage)) {
      props.goToPage(props.currentPage + 1);
    }
  };
  
  // دالة التنقل إلى الصفحة السابقة
  const previousPage = () => {
    if (props.currentPage > 0) {
      props.goToPage(props.currentPage - 1);
    }
  };
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 15px;
  }
  
  .pagination button {
    margin: 3px;
    padding: 8px 12px;
    border: 1px solid #092c67;
    background-color: white;
    color: #092c67;
    cursor: pointer;
    min-width: 40px;
  }
  
  .pagination button.active {
    background-color: #092c67;
    color: white;
    font-weight: bold;
  }
  
  .pagination span {
    margin: 3px;
    color: #092c67;
  }
  
  .text-center button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #092c67;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .text-center button:disabled {
    background-color: #ccc;
  }
  </style>
  