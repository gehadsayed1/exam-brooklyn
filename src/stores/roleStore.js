import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api/axiosInstance";
import { PERMISSIONS, ROLES } from "../api/Api";
import notyf from "@/components/global/notyf";
import { handleError } from "./handleError";

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
      ("Roles fetched successfully:", roles.value);
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
      (response.data.data);
      
      ("Permissions fetched successfully:", permissions.value);
      
      ("Roles fetched successfully:", roles.value);
    } catch (err) {
      error.value = "Failed to fetch roles";
      console.error("Fetch Error:", err.response?.data?.message || err.message);
    } finally {
      loading.value = false;
    }
      
  }

  const addRole = async (roleData) => {
    ("Adding role:", roleData);
    
 
    error.value = null;
    try {
      const response = await apiClient.post(ROLES, roleData);
      roles.value.push(response.data.data); 
        notyf.success("Role added successfully");
      ("Role added successfully:", response.data.data);
      return response.data.data; 
    } catch (err) {
      handleError(err);
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
      ("Role updated successfully:", response.data.data);
      return response.data.data;
    } catch (err) {
      handleError(err);
    } 
  };


  const deleteRole = async (roleId) => {
    error.value = null;
    try {
      await apiClient.delete(`${ROLES}/${roleId}`);
     
      roles.value = roles.value.filter(role => role.id !== roleId);
      notyf.success("Role deleted successfully");
      ("Role deleted successfully:", roleId);
    } catch (err) {
      handleError(err);
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