<script setup>
import { ref, h, computed } from "vue";
import { UserCheck, UserPlus, CheckCircle } from "lucide-vue-next";
import ExistingStudentComponent from "./AlreadyExistsForm.vue";
import NewStudentComponent from "./NewStudentForm.vue";
import hero from "../assets/hero.webp";

const withGraduationCap = (IconComponent) => {
  return h("svg", { width: 50, height: 50, viewBox: "0 0 24 24" }, [
    h("polygon", {
      points: "12,2 4,6 12,10 20,6 12,2",
      fill: "#092c67",
      stroke: "#092c67",
      "stroke-width": 1.5,
    }),
    h(IconComponent, {
      class: "w-12 h-12 text-blue-800 dark:text-gray-200",
      x: 0,
      y: 5,
    }),
  ]);
};

const ExistingStudentIcon = withGraduationCap(UserCheck);
const NewStudentIcon = withGraduationCap(UserPlus);

const selectedRole = ref("existing");

const selectRole = (role) => {
  selectedRole.value = role;
};

const SelectedComponent = computed(() => {
  if (selectedRole.value === "existing") return ExistingStudentComponent;
  if (selectedRole.value === "new") return NewStudentComponent;
  return NewStudentComponent;
});
</script>

<template>
  <div class="login dark:bg-gray-900 min-h-screen">
    <div class="grid sm:grid-cols-2 grid-cols-1 p-5 sm:p-0 relative">
      <div class="relative w-[90%] h-[110vh] hidden sm:block">
        <img :src="hero" alt="hero img" class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center w-[70%]">
            <h3 class="font-bold text-5xl md:text-6xl  text-gray-100">
              Knowledge From Home
            </h3>
          </div>
        </div>
      </div>
      <div>
        <div class="flex justify-start items-center pt-5">
          <h2
            class="text-primary dark:text-white relative text-4xl font-bold after:content-[''] after:block after:bg-primary after:w-[100px] after:h-[4px] after:rounded-2xl after:mt-2">
            Sign In
          </h2>
        </div>
        <div class="@container sm:mr-10 mr-0">
          <p class="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">
            Please Select Your Role
          </p>
          <div class="flex gap-10 p-4 mt-2 justify-center">
            <div class="flex flex-col items-center p-4 rounded gap-5 border w-[130px] relative cursor-pointer" :class="{
              'border-3 border-blue-600': selectedRole === 'existing',
              'border-gray-400': selectedRole !== 'existing',
            }" @click="selectRole('existing')">
              <component :is="ExistingStudentIcon" />
              <span class="text-gray-500 dark:text-gray-400 font-bold sm:text-sm text-xs">Already Exists</span>

              <CheckCircle v-if="selectedRole === 'existing'"
                class="absolute bottom-[-13px] text-blue-600 bg-blue-100 rounded-full" size="24" />
            </div>

            <div class="flex flex-col items-center rounded p-4 gap-5 border w-[130px] relative cursor-pointer" :class="{
              'border-3 border-green-600': selectedRole === 'new',
              'border-gray-400': selectedRole !== 'new',
            }" @click="selectRole('new')">
              <component :is="NewStudentIcon" />
              <span class="text-gray-500 font-bold sm:text-sm text-xs dark:text-gray-400">New Student</span>
              <CheckCircle v-if="selectedRole === 'new'"
                class="absolute bottom-[-13px] text-green-600 bg-green-100 rounded-full" size="24" />
            </div>
          </div>

          <div v-if="SelectedComponent" class="mt-3 mb-3 p-4 border border-gray-300 dark:bg-gray-800 rounded-lg">
            <!-- Added :key to force re-render -->
            <component :is="SelectedComponent" :key="selectedRole" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
