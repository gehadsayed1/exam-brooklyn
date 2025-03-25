<script setup>
import { ref, watch } from "vue";
import { useStudentStore } from "../../stores/studentStore";
import { IdCard, UserRound } from "lucide-vue-next";

const studentStore = useStudentStore();

let timeout = null;
const studentOTP = ref("");
const errorLoc = ref(false);

watch(
  () => studentStore.studentId,
  (newId) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (newId) {
      timeout = setTimeout(() => {
        studentStore.fetchCourses();
      }, 500);
    }
  }
);

watch(
  () => studentStore.selectedModule,
  (newModule) => {
    if (newModule) {
      studentStore.fetchInstructors();
    }
  }
);

const submitForm = async () => {
  if (studentOTP.value === "") {
    errorLoc.value = true;
    return;
  }

  await studentStore.submitForm(studentOTP.value);

  if (studentStore.error === null) {
    // Empty the form after successful submission
    studentStore.studentId = "";
    studentStore.selectedModule = null;
    studentStore.selectedInstructor = null;
    studentStore.studentOTP = "";
    studentStore.otpMasg = "";
  }
};
</script>

<template>
  <div
    class="bg-blue-50 w-[100%] sm:w-[90%] rounded-xl pt-15 pb-5 px-5 relative"
  >
    <div
      class="p-10 bg-primary mb-5 w-10 h-10 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[50%]"
    >
      <UserRound
        color="white"
        size="100"
        class="w-10 h-10 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[50%]"
      />
    </div>

    <div
      class="p-5 bg-white rounded-lg shadow-md dark:bg-gray-700 dark:text-white"
    >
      <div class="mb-5 relative">
        <label
          for="name-input"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Student ID:
        </label>

        <div class="relative">
          <IdCard
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="20"
          />
          <input
            v-model="studentStore.studentId"
            type="text"
            id="name-input"
            placeholder="Enter Your ID"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>
      <div class="mb-5 relative">
        <div class="flex justify-center">
          <button
            @click="studentStore.sendOTP(studentStore.studentId)"
            :disabled="!studentStore.studentId"
            :class="{
              'opacity-50 cursor-not-allowed hover:bg-primary':
                !studentStore.studentId || studentStore.errorMessages,
            }"
            class="text-white font-semibold py-2 px-4 rounded-2xl cursor-pointer hover:bg-blue-700 bg-primary w-[200px]"
          >
            <span v-if="studentStore.loadingOtp"
              ><i class="fa-solid fa-circle-notch fa-spin-pulse"></i
            ></span>
            <span v-else> Get Your OTP</span>
          </button>
        </div>
        <p class="text-green-500 text-sm mt-1">{{ studentStore.otpMasg }}</p>

        <div class="relative">
          <input
            type="text"
            v-show="studentStore.otpMasg"
            v-model="studentOTP"
            id="name-input"
            placeholder="Enter Your OTP"
            class="bg-gray-50 border border-gray-300 mt-3 w-full text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>

      <p class="text-red-500 text-sm mb-1" v-if="errorLoc">
        OTP required. Please check your email or try again.
      </p>
      <div
        class="mb-5"
        v-if="studentStore.otpMasg !== '' && studentStore.courses.data"
      >
        <label
          for="module-select"
          class="block dark:text-gray-300 text-sm font-medium text-gray-900"
          >Module Name:</label
        >
        <select
          v-model="studentStore.selectedModule"
          id="module-select"
          class="input-field"
        >
          <option value="" disabled>Choose a Module</option>
          <option
            class="dark:bg-gray-800"
            v-for="course in studentStore.courses.data"
            :key="course.id"
            :value="course.id"
          >
            {{ course.name }}
          </option>
        </select>
      </div>

      <div class="mb-5" v-show="studentStore.instructors.data">
        <label
          for="instructor-select"
          class="block dark:text-gray-300 text-sm font-medium text-gray-900"
          >Instructor:</label
        >
        <select
          v-model="studentStore.selectedInstructor"
          id="instructor-select"
          class="input-field"
        >
          <option value="" disabled>Choose an Instructor</option>
          <option
            class="dark:bg-gray-800"
            v-for="instructor in studentStore.instructors.data"
            :key="instructor.id"
            :value="instructor.id"
          >
            {{ instructor.name }}
          </option>
        </select>
      </div>

      <button
        v-show="studentStore.selectedModule && studentStore.selectedInstructor"
        @click="submitForm"
        type="button"
        class="btn-primary bg-primary flex items-center justify-center"
        :disabled="studentStore.loading"
      >
        <span v-if="studentStore.loading" class="loader"></span>
        <span v-else>Submit</span>
      </button>

      <p v-if="studentStore.loading" class="text-blue-600 mt-2">Loading...</p>
      <p v-if="studentStore.error || studentStore.masExam" class="text-red-600">
        {{ studentStore.error || studentStore.masExam }}
      </p>
      <!-- <p v-if="studentStore.errorMessages" class="text-red-600">{{ studentStore.errorMessages }}</p> -->
    </div>
  </div>
</template>

<style scoped>
.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: border 0.3s ease;
}
.input-field:focus {
  border-color: #007bff;
}
.btn-primary {
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  text-align: center;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.loader {
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #007bff;
  width: 24px;
  height: 24px;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
