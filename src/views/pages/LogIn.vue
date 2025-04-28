<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import * as yup from "yup";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const prism = ref(null);

// login form data
const email = ref("");
const router = useRouter();
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errors = ref({
  email: "",
  password: "",
});

// reset password form

// forgot password form
const forgotEmail = ref("");
const isResetting = ref(false);
const forgotError = ref("");



// yup schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

function showLogin() {
  prism.value.style.transform = "rotateY(0deg)";
}

function showForgotPassword() {
  prism.value.style.transform = "rotateY(180deg)";
}

async function handleLogin() {
  errors.value = { email: "", password: "" };
  isLoading.value = true;

  try {
    await schema.validate(
      { email: email.value, password: password.value },
      { abortEarly: false }
    );
    await auth.login(email.value, password.value);
    email.value = "";
    password.value = "";
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

async function handleForgotPassword() {
  forgotError.value = "";
  isResetting.value = true;
  ("forgotEmail.value", forgotEmail.value);

  await auth.forgotPassword(forgotEmail.value);
  isResetting.value = false;

  // // simulate request
  // setTimeout(() => {
  //   if (forgotEmail.value.includes("@")) {
  //     forgotSuccess.value = "Reset link sent successfully!";
  //   } else {
  //     forgotError.value = "Please enter a valid email.";
  //   }
  //   isResetting.value = false;
  // }, 1500);
}
</script>

<template>
  <ul class="nav">
    <li class="dark:text-blue-500 text-primary" @click="showLogin">Login</li>
    <li class="dark:text-blue-500 text-primary" @click="showForgotPassword">
      Forgot password
    </li>
  </ul>

  <div class="wrapper">
    <div class="rec-prism mb-8" ref="prism">
      <!-- Login -->
      <div
        class="face face-front dark:bg-gray-600 shadow shadow-blue-500 bg-white"
      >
        <div class="content">
          <div class="flex justify-between items-center mb-3">
            <h2 class="dark:text-blue-400 text-xl text-primary">Sign in</h2>
            <img src="../../assets/logo.png" class="h-10" alt="" />
          </div>

          <form @submit.prevent>
            <div class="field-wrapper dark:text-white text-gray-400">
              <input type="text" v-model="email" placeholder=" " />
              <label>e-mail</label>
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                {{ errors.email }}
              </p>
            </div>

            <div class="field-wrapper dark:text-white text-gray-400">
              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder=" "
                />
                <label>Password</label>
                <span
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  <i
                    :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  ></i>
                </span>
              </div>
              <p v-if="errors.password" class="text-red-500 text-sm mt-1">
                {{ errors.password }}
              </p>
            </div>

            <div class="field-wrapper">
              <button type="submit" @click="handleLogin" :disabled="isLoading">
                <span v-if="isLoading">
                  <span class="spinner"></span> Logging in...
                </span>
                <span v-else>Login</span>
              </button>
            </div>

            <p v-if="auth.error" class="text-red-500 text-sm mt-2 text-center">
              {{ auth.error }}
            </p>
            <span class="psw" @click="showForgotPassword"
              >Forgot Password?</span
            >
          </form>
        </div>
      </div>

      <!-- Forgot Password -->
      <div
        class="face face-back dark:bg-gray-600 shadow shadow-blue-500 bg-white"
      >
        <div class="content">
          <div class="flex justify-between items-center mb-8">
            <h2 class="dark:text-blue-400 text-xl text-primary">
              Forgot Password?
            </h2>
            <img src="../../assets/logo.png" class="h-10" alt="" />
          </div>
          <small class="dark:text-white text-gray-500"
            >Enter your email so we can send you a reset link</small
          >
          <form @submit.prevent>
            <div class="field-wrapper dark:text-white text-gray-400">
              <input type="text" v-model="forgotEmail" placeholder=" " />
              <label>e-mail</label>
              <!-- <p v-if="forgotError" class="text-red-500 text-sm mt-1">
                {{ forgotError }}
              </p> -->
              <p v-if="auth.forgotSuccess" class="text-green-600 text-sm mt-1">
                {{ auth.forgotSuccess }}
              </p>
            </div>

            <div class="field-wrapper">
              <button
                type="submit"
                @click="handleForgotPassword"
                :disabled="isResetting"
              >
                <span v-if="isResetting">
                  <span class="spinner"></span> Sending...
                </span>
                <span v-else>Reset Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f6fffd;
  /* font-family: Tahoma, sans-serif; */
}

.wrapper {
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 800px;
}

.rec-prism {
  width: 100%;
  max-width: 320px;
  height: 400px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
  transform: rotateY(0deg);
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 20px;
  border: 2px solid #092c67;
  border-radius: 6px;
  backface-visibility: hidden;
}

.face-back {
  transform: rotateY(0deg); /* front */
}
.face-back {
  transform: rotateY(180deg);
}

.field-wrapper {
  margin: 20px 0;
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
.field-wrapper input:focus {
  outline: none;
  /* border: none; */
}
.field-wrapper input:focus + label,
.field-wrapper input:not(:placeholder-shown) + label {
  top: -12px;
  font-size: 0.75em;
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

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 0.9em;
  color: #42509e;
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

.psw {
  display: block;
  margin-top: 15px;
  font-size: 0.8em;
  color: #42509e;
  text-align: center;
  cursor: pointer;
}

.nav {
  margin: 50px 0;
  text-align: center;
}

.nav li {
  display: inline-block;
  list-style-type: none;
  font-size: 1em;
  margin: 0 10px;
  position: relative;
  cursor: pointer;
}

.nav li:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 20px;
  border-bottom: 1px solid #42509e;
  transition: all ease-in 0.25s;
}

.nav li:hover:after {
  width: 100%;
}
</style>
