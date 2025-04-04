<template>
    <div class="space-y-10 p-5">
      <!-- Welcome Section -->
      <section>
       <div class="flex items-center gap-2 font-bold">
        <h1 class="text-3xl  text-gray-800 mb-2">Welcome to the Dashboard </h1>
        <LayoutDashboardIcon  size="30" class="text-primary" />
       </div>
        <p class="text-gray-600">Here you can manage exams, results, and users easily and efficiently.</p>
      </section>
  
      <!-- Stats Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white shadow-md rounded-xl p-6">
          <h2 class="text-gray-600 text-lg mb-1">Total Exams</h2>
          <p class="text-2xl font-bold text-indigo-600">12</p>
        </div>
        <div class="bg-white shadow-md rounded-xl p-6">
          <h2 class="text-gray-600 text-lg mb-1">Registered Students</h2>
          <p class="text-2xl font-bold text-indigo-600">347</p>
        </div>
        <div class="bg-white shadow-md rounded-xl p-6">
          <h2 class="text-gray-600 text-lg mb-1">Published Results</h2>
          <p class="text-2xl font-bold text-indigo-600">9</p>
        </div>
      </section>
  
      <!-- Quick Links -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div class="flex flex-wrap gap-4">
          <router-link
            to="/dashboard/exams"
            class="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Manage Exams
          </router-link>
          <router-link
            to="/dashboard/results"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            View Results
          </router-link>
          <router-link
            to="/dashboard/users"
            class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Manage Users
          </router-link>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { LayoutDashboardIcon } from 'lucide-vue-next';

  </script>
  