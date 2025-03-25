import { defineStore } from "pinia";
import { ref } from "vue";
import Cookies from "js-cookie";

import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import apiClient from "../api/axiosInstance";
import {LOGIN}  from "../api/Api";

const notyf = new Notyf({
  duration: 5000,
  dismissible: true,
  position: { x: "center", y: "top" },
});

export const useAuthStore = defineStore("authStore", () => {
  const token = ref(null);
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

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
      user.value = response.data.User;

      Cookies.set("token", token.value, { expires: 7 });
      Cookies.set("user", JSON.stringify(user.value), { expires: 7 });

      notyf.success("Logged in successfully");
      router.push("/home"); 
    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.message || "Login failed";
      notyf.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    Cookies.remove("token");
    Cookies.remove("user");
    router.push({ name: "Login" });
  };

  const loadUserFromCookies = () => {
    const savedToken = Cookies.get("token");
    const savedUser = Cookies.get("user");

    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
    }
  };

  return {
    token,
    user,
    loading,
    error,
    login,
    logout,
    loadUserFromCookies,
  };
});
