import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api/axiosInstance";
import { REGISTER, USERS , USER_BY_TOKEN} from "../api/Api";
import notyf from "@/components/global/notyf";
import { handleError } from "./handleError";

export const useEmployeeStore = defineStore("employees", () => {
  const employees = ref([]);
  const loading = ref(false);
  const user = ref(null);


  // Fetch employees from API
  const fetchEmployees = async () => {
    loading.value = true;
    try {
      const response = await apiClient.get(USERS);
      employees.value =  response.data.data
      loading.value = false;
    } catch (error) {
      handleError(error);
      loading.value = false;
    }
  };

  const fetchUser = async () => {
    loading.value = true;
    try {
      const response = await apiClient.get(USER_BY_TOKEN);
      user.value =  response.data.User
      (response.data)
      ();
      
      loading.value = false;
    } catch (error) {
      handleError(error);
      loading.value = false;
    }
  };

  // Add employee to the API
  const addEmployee = async (employee) => {
    try {
      const response = await apiClient.post(REGISTER, employee);
      employees.value.push(response.data.user);
      notyf.success("Employee Created successfully");
    } catch (error) {
      handleError(error);
    }
  };

  // Update employee via API
  const updateEmployee = async (id, updatedEmployee) => {
    try {
      const response = await apiClient.put(`${USERS}/${id}`, updatedEmployee);
      const index = employees.value.findIndex(emp => emp.id === id);
      if (index !== -1) {
        employees.value[index] = response.data.User;
      }
      if (user.value?.id === id) {
        user.value = response.data.User;
      }
      
      notyf.success("Employee updated successfully");
    } catch (error) {
      handleError(error);
    }
  };

  // Delete employee via API
  const deleteEmployee = async (id) => {
    (id);
    
    try {
      await apiClient.delete(`${USERS}/${id}`);
      employees.value = employees.value.filter((emp) => emp.id !== id);
      notyf.success("Employee deleted successfully");
    } catch (error) {
      console.error(error);
      handleError(error);
    }
  };

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    fetchEmployees,
    fetchUser,
    user,
  };
});
