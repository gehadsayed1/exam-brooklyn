<script setup>
import { User, Phone ,IdCard ,ContactRound ,Layers } from "lucide-vue-next"; 
</script>

<template>
  <div class="">
  
    <div class="mb-5 relative">
      <label for="name-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Full Name:
      </label>
      
      <div class="relative">
        <User class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size="20" />
        <input 
          type="text" 
          id="name-input"
          placeholder="Enter Your Full Name" 
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
    <div class="mb-5 relative">
      <label for="phone-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Phone number:
      </label>
      
      <div class="relative">
        <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size="20" />
        <input 
          type="text" 
          id="phone-input"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" 
          placeholder="123-456-7890" 
          required
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
    <div class="mb-5 relative">
      <label for="name-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Student ID:
      </label>
      
      <div class="relative">
        <IdCard  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size="20" />
        <input 
          type="text" 
          id="name-input"
          placeholder="Enter Your ID" 
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
    <div class="mb-5 relative">
      <label for="name-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Instructor:
      </label>
      
      <div class="relative">
        <ContactRound   class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size="20" />
        <input 
          type="text" 
          id="name-input"
          placeholder="Enter Your Instructor" 
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
    <div class="mb-5 relative">
      <label for="name-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Module Name:
      </label>
      
      <div class="relative">
        <Layers    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size="20" />
        <input 
          type="text" 
          id="name-input"
          placeholder="Enter Your Module Name" 
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
    <button type="submit" class="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-[100%] sm:w-auto px-15 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
  </div>
</template>
