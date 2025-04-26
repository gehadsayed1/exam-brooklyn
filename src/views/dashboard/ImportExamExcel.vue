<script setup>
import { ref } from 'vue';
import apiClient from '@/api/axiosInstance';
import notyf from '@/components/global/notyf';
import { IMPORT_EXAMS } from '@/Api/Api';


const file = ref(null);
const loading = ref(false);

const validFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

const uploadExcel = async () => {
  if (!file.value) {
    notyf.error('Please select a file first.');
    return;
  }

  if (!validFileTypes.includes(file.value.type)) {
    notyf.error('Invalid file type. Please upload an Excel file (.xls or .xlsx).');
    return;
  }

  const formData = new FormData();
  formData.append('file', file.value);

  loading.value = true;
  try {
    await apiClient.post(IMPORT_EXAMS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    notyf.success('Exam imported successfully!');
    file.value = null; // Reset input after upload
  } catch (error) {
    console.error(error);
    file.value = null;
  } finally {
    loading.value = false;
  }
};

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile && !validFileTypes.includes(selectedFile.type)) {
    notyf.error('Invalid file type selected. Please choose a valid Excel file.');
    e.target.value = ''; // clear input
    return;
  }
  file.value = selectedFile;
};
</script>
<template>
  <div class="space-y-6 p-6 bg-white rounded-lg shadow w-full max-w-[90%] mx-auto">
    <h2 class="text-2xl font-bold text-center text-primary">Import Exam Excel</h2>

    <!-- File Input -->
    <input
      type="file"
      accept=".xlsx,.xls"
      @change="handleFileChange"
      class="block w-full text-sm text-gray-700
             file:mr-4 file:py-2 file:px-4
             file:rounded-full file:border-0
             file:text-sm file:font-semibold
             file:bg-indigo-50 file:text-indigo-700
             hover:file:bg-indigo-100"
    />

    <!-- Upload Button -->
    <button
      :disabled="loading"
      @click="uploadExcel"
      class="flex justify-center items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <template v-if="loading">
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Uploading...
      </template>
      <template v-else>
        Upload Excel
      </template>
    </button>

    <!-- Instructions Section -->
    <div class="space-y-4 mt-8">
      <h3 class="text-xl font-semibold text-gray-800">Instructions for Upload:</h3>

      <!-- Format Image Example -->
      <div class="border rounded-md p-4 bg-gray-50 flex justify-center">
        <img src="@/assets/examEcele.png" alt="Excel Format Example" class="max-w-full h-auto rounded shadow" />
      </div>

      <!-- Notes -->
      <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
  <p class="font-bold text-lg mb-2">Important Notice:</p>
  <p class="mb-1">
    Make sure your Excel file follows the exact column names and order as shown in the reference image provided.
  </p>
  <p>
    <strong>The required columns in order are:</strong> 
    correct_option, option_d, option_c, option_b, option_a, question_text, duration, instructor_name, course_name, exam_description, exam_name.
  </p>
  <p class="mt-2">The column names are <strong>case-sensitive</strong> and must be spelled exactly as shown.</p>
</div>

<ul class="list-disc list-inside text-gray-800 leading-relaxed">
  <li>You can add multiple exams in the same Excel sheet.</li>
  <li>Make sure to repeat the same <strong>Exam Name</strong> for all questions belonging to the same exam.</li>
  <li>Use the same <strong>Instructor Name</strong> consistently for all questions under the same exam.</li>
  <li>Use the same <strong>Course Name</strong> consistently for all questions under the same exam.</li>
  <li><strong>Instructor names</strong> must already exist in the Instructor Management page. Names are <strong>case-sensitive</strong>.</li>
  <li><strong>Course names</strong> must already exist in the Course Management page. Names are <strong>case-sensitive</strong>.</li>
  <li>Ensure that the <strong>Duration</strong> is repeated for every question under the same exam.</li>
  <li>Questions related to the same exam must be listed <strong>consecutively and neatly</strong>.</li>
  <li>Use clear and readable formatting to make the file easy to understand.</li>
</ul>


    </div>
  </div>
</template>

