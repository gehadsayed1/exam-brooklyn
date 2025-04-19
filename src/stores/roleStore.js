import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api/axiosInstance";
import { PERMISSIONS, ROLES } from "../api/Api";
import notyf from "@/components/global/notyf";

export const useRoleStore = defineStore("roleStore", () => {
  const roles = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const permissions = ref([]);


  const fetchRoles = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(ROLES);
      roles.value = response.data.data;
      console.log("Roles fetched successfully:", roles.value);
    } catch (err) {
      error.value = "Failed to fetch roles";
      console.error("Fetch Error:", err.response?.data?.message || err.message);
    } finally {
      loading.value = false;
    }
  };

  const fetchPermissions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(PERMISSIONS);
      permissions.value = response.data.data;
      console.log(response.data.data);
      
      console.log("Permissions fetched successfully:", permissions.value);
      
      console.log("Roles fetched successfully:", roles.value);
    } catch (err) {
      error.value = "Failed to fetch roles";
      console.error("Fetch Error:", err.response?.data?.message || err.message);
    } finally {
      loading.value = false;
    }
      
  }

  const addRole = async (roleData) => {
    console.log("Adding role:", roleData);
    
 
    error.value = null;
    try {
      const response = await apiClient.post(ROLES, roleData);
      roles.value.push(response.data.data); 
        notyf.success("Role added successfully");
      console.log("Role added successfully:", response.data.data);
      return response.data.data; 
    } catch (err) {
      error.value = "Failed to add role";
      console.error("Add Error:", err.response?.data?.message || err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };


  const updateRole = async (roleId, updatedData) => {
   
    error.value = null;
    try {
      const response = await apiClient.put(`${ROLES}/${roleId}`, updatedData);
     
      const index = roles.value.findIndex(role => role.id === roleId);
      if (index !== -1) {
        roles.value[index] = response.data.data; 
      }
        notyf.success("Role updated successfully");
      console.log("Role updated successfully:", response.data.data);
      return response.data.data;
    } catch (err) {
      error.value = "Failed to update role";
      console.error("Update Error:", err.response?.data?.message || err.message);
      throw err;
    } 
  };

  // حذف دور
  const deleteRole = async (roleId) => {
    error.value = null;
    try {
      await apiClient.delete(`${ROLES}/${roleId}`);
     
      roles.value = roles.value.filter(role => role.id !== roleId);
      notyf.success("Role deleted successfully");
      console.log("Role deleted successfully:", roleId);
    } catch (err) {
      error.value = "Failed to delete role";
      console.error("Delete Error:", err.response?.data?.message || err.message);
      throw err;
    } 
  };

  return { 
    roles, 
    loading, 
    error, 
    fetchRoles, 
    addRole, 
    updateRole, 
    deleteRole,
    fetchPermissions,
    permissions
  };
});