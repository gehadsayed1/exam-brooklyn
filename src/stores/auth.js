import { defineStore } from "pinia";
import { ref } from "vue";
import Cookies from "js-cookie";

import { useRouter } from "vue-router";
import notyf from "@/components/global/notyf";
import apiClient from "../api/axiosInstance";
import { FORGOT_PASSWORD, LOGIN, RESET_PASSWORD } from "../api/Api";

export const useAuthStore = defineStore("authStore", () => {
  const token = ref(null);
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const forgotSuccess = ref("");

  const router = useRouter();

  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    console.log(email, password);

    try {
      const response = await apiClient.post(LOGIN, {
        email,
        password,
      });
      console.log(response);

      token.value = response.data.token;
      user.value = response.data.user;

      console.log(token.value, user.value);

      Cookies.set("token", token.value, { expires: 7 });

      Cookies.set("user", JSON.stringify(user.value), {
        expires: 7,
        path: "/",
      });

      const userFromCookie = Cookies.get("user");

      if (userFromCookie) {
        user.value = JSON.parse(decodeURIComponent(userFromCookie));
      }
      console.log(user.value);

      notyf.success("Logged in successfully");
      router.push("/systems");
    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.message || "Failed to login";
      notyf.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    await apiClient
      .post("logout", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      .then((response) => {
        notyf.success(response.data.message);
      });
    token.value = null;
    user.value = null;
    Cookies.remove("token");
    Cookies.remove("user");
    router.push({ name: "login" });
  };

  // const loadUserFromCookies = () => {

  //   const savedToken = Cookies.get("token");
  //   const savedUser = Cookies.get("user");

  //   if (savedToken && savedUser) {
  //     token.value = savedToken;
  //     user.value = JSON.parse(savedUser);
  //   }
  // };

  const forgotPassword = async (email) => {
    console.log(email);
    forgotSuccess.value = null;
    try {
      const response = await apiClient.post(FORGOT_PASSWORD, {
        email,
      }); 
      console.log(response);
      notyf.success(response.data.message);
      forgotSuccess.value = response.data.message;
    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.message || "Failed to send OTP";
      notyf.error(error.value);
      forgotSuccess.value = null;
    } finally {
      loading.value = false;
    }
  };
   
  const resetPassword = async (form) => {
    console.log("Form data:", form);
  
    loading.value = true;
    error.value = null;
  
    try {
      // Send the request to the server
      const response = await apiClient.post(RESET_PASSWORD, form, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log("Server response:", response);
  
      // Show success message and redirect to login
      notyf.success("Password reset successfully");
      router.push({ name: "login" });
    } catch (err) {
      console.error("Error response:", err.response?.data);
  
      if (err.response && err.response.status === 422) {
        // Handle validation errors from the server
        const serverErrors = err.response.data.errors;
        for (const key in serverErrors) {
          error.value[key] = serverErrors[key][0];
        }
        notyf.error("Please fix the errors below.");
      } else {
        // Handle other errors
        error.value = err.response?.data?.message || "Failed to reset password";
        notyf.error(error.value);
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    forgotPassword,
    resetPassword,
    token,
    user,
    loading,
    error,
    login,
    logout,
    forgotSuccess,
  };
});
