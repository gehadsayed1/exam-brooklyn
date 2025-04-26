import { defineStore } from "pinia";
import { ref, onBeforeMount } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import notyf from "@/components/global/notyf";
import apiClient from "../api/axiosInstance";
import {
  FORGOT_PASSWORD,
  LOGIN,
  RESET_PASSWORD,
  USER_BY_TOKEN,
} from "../api/Api";
import CryptoJS from "crypto-js"; 
import { handleError } from "./handleError";

export const useAuthStore = defineStore("authStore", () => {
  const token = ref(null);
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const forgotSuccess = ref("");
  const router = useRouter();
  const permissions = ref([]);

  const secretKey = "secret-key-123";

  const encryptPermissions = (perms) => {
    const stringified = JSON.stringify(perms);
    return CryptoJS.AES.encrypt(stringified, secretKey).toString();
  };

  const decryptPermissions = (encrypted) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      handleError(error);
      return [];
    }
  };

  const restoreUserFromCookies = () => {
    const savedToken = Cookies.get("token");
    const savedUser = Cookies.get("user");
    const savedPermissions = Cookies.get("permissions");

    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(decodeURIComponent(savedUser));
      permissions.value = savedPermissions
        ? decryptPermissions(savedPermissions)
        : [];
    }
  };

  onBeforeMount(() => {
    restoreUserFromCookies();
  });

  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    console.log(email, password);
    try {
      const response = await apiClient.post(LOGIN, { email, password });
      token.value = response.data.token;

      Cookies.set("token", token.value, { expires: 7 });
      await getUserByToken();

      notyf.success("Logged in successfully");
      router.push("/systems");
    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await apiClient.post("logout");
      notyf.success("Logged out successfully");
    } catch (err) {
      handleError(err);
    } finally {
      token.value = null;
      user.value = null;
      permissions.value = [];
      loading.value = false;

      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("permissions");

      router.push({ name: "login" });
    }
  };

  const forgotPassword = async (email) => {
    forgotSuccess.value = null;
    try {
      const response = await apiClient.post(FORGOT_PASSWORD, { email });
      notyf.success(response.data.message);
      forgotSuccess.value = response.data.message;
    } catch (err) {
      handleError(err);
      notyf.error(error.value);
      forgotSuccess.value = null;
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (form) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.post(RESET_PASSWORD, form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      notyf.success("Password reset successfully");
      router.push({ name: "login" });
    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
    }
  };

  const getUserByToken = async () => {
    try {
      const response = await apiClient.get(USER_BY_TOKEN);
      user.value = response.data.User;
      permissions.value = response.data.permissions;
      console.log(response.data);

      Cookies.set("user", JSON.stringify(user.value), {
        expires: 7,
        path: "/",
      });
      Cookies.set("permissions", encryptPermissions(permissions.value), {
        expires: 7,
        path: "/",
      });
    } catch (error) {
      handleError(error);
    }
  };

  const hasPermission = (permissionName) => {
    return permissions.value.includes(permissionName);
  };

  return {
    token,
    user,
    loading,
    error,
    getUserByToken,
    login,
    logout,
    forgotPassword,
    resetPassword,
    forgotSuccess,
    permissions,
    hasPermission,
  };
});
