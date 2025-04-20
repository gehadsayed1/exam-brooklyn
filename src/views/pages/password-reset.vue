<script setup>
import { ref } from "vue";
import * as yup from "yup";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const auth = useAuthStore();

// Extract token and email from the URL
const token = ref(route.query.token);
const email = ref(route.query.email);

// Reset password form data
const form = ref({
  email: email.value,
  password: "",
  password_confirmation: "",
  token: token.value,
});

// Variables for toggling password visibility
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const isLoading = ref(false);
const errors = ref({
  password: "",
  password_confirmation: "",
});
const successMessage = ref("");

// Yup schema for validation
const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

async function handleResetPassword() {
  errors.value = { password: "", password_confirmation: "" };
  successMessage.value = "";
  isLoading.value = true;

  try {
    // Validate the form
    await schema.validate(
      {
        password: form.value.password,
        password_confirmation: form.value.password_confirmation,
      },
      { abortEarly: false }
    );

    // Call the reset password API
    await auth.resetPassword(form.value);

    successMessage.value = "Password reset successfully!";
  } catch (validationError) {
    if (validationError.inner) {
      validationError.inner.forEach((err) => {
        errors.value[err.path] = err.message;
      });
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
    <div class="reset-password-container">
    <h2 class="dark:text-blue-400  font-semibold text-xl text-primary mb-10">Reset Password</h2>

    <form @submit.prevent="handleResetPassword">
      <!-- New Password Field -->
      <div class="field-wrapper dark:text-white text-gray-400 relative">
        <input
          :type="showNewPassword ? 'text' : 'password'"
          v-model="form.password"
          placeholder=" "
          class="outline-none"
        />
        <label>New Password</label>
        <span
          class="toggle-password absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          @click="showNewPassword = !showNewPassword"
        >
          <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">
          {{ errors.password }}
        </p>
      </div>

      <!-- Confirm Password Field -->
      <div class="field-wrapper dark:text-white text-gray-400 relative">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="form.password_confirmation"
          placeholder="  "
          class="outline-none"
        />
        <label>Confirm Password</label>
        <span
          class="toggle-password absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
        <p v-if="errors.password_confirmation" class="text-red-500 text-sm mt-1">
          {{ errors.password_confirmation }}
        </p>
      </div>

      <!-- Submit Button -->
      <div class="field-wrapper">
        <button type="submit" :disabled="isLoading">
          <span v-if="isLoading">
            <span class="spinner"></span> Resetting...
          </span>
          <span v-else>Reset Password</span>
        </button>
      </div>

      <!-- Success Message -->
      <p v-if="successMessage" class="text-green-600 text-sm mt-2 text-center">
        {{ successMessage }}
      </p>
    </form>
  </div>
  </div>
</template>

<style scoped>
.reset-password-container {
min-width: 30%;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.field-wrapper {
  margin: 15px 0;
  position: relative;
}

.field-wrapper input[type="text"],
.field-wrapper input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-bottom: 1px solid #092c67;
  font-size: 1em;
  background: transparent;
}

.field-wrapper label {
  position: absolute;
  top: 10px;
  left: 0;
  font-size: 0.85em;
  pointer-events: none;
  transition: 0.2s;
}

.field-wrapper input:focus + label,
.field-wrapper input:not(:placeholder-shown) + label {
  top: -12px;
  font-size: 0.75em;
  color: #42509e;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 0.9em;
  color: #42509e;
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  background: #092c67;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

button[type="submit"]:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.spinner {
  border: 2px solid #fff;
  border-top: 2px solid #092c67;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.6s linear infinite;
  display: inline-block;
  margin-right: 8px;
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