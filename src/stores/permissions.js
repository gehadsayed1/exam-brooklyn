// تشفير البيانات باستخدام btoa
const encryptData = (data) => {
    try {
      if (!data || Object.keys(data).length === 0) {
        console.error("No data to encrypt:", data);
        return null;
      }
  
      const jsonData = JSON.stringify(data);
      console.log("Data to encrypt (JSON):", jsonData);
  
      return btoa(encodeURIComponent(jsonData));
    } catch (error) {
      console.error("Error during encryption:", error);
      return null;
    }
  };
  
  
  // فك تشفير البيانات باستخدام atob// فك تشفير البيانات باستخدام atob
  const decryptData = (encryptedData) => {
    try {
      return JSON.parse(decodeURIComponent(atob(encryptedData)));
    } catch (error) {
      console.error("Error decrypting data:", error);
      return null;
    }
  };
  
  // حفظ الصلاحيات في localStorage بناءً على المستخدم الحالي
  export const savePermissionsToLocalStorage = (permissions, userId) => {
    if (!permissions || Object.keys(permissions).length === 0) {
      console.error("Permissions are empty or undefined:", permissions);
      return;
    }
  
    if (!userId) {
      console.error("User ID is missing:", userId);
      return;
    }
  
    console.log("Permissions before saving:", permissions); // تأكد من البيانات
    try {
      const encryptedPermissions = encryptData(permissions);
      if (!encryptedPermissions) {
        console.error("Failed to encrypt permissions");
        return;
      }
  
      console.log("Encrypted permissions:", encryptedPermissions); // تأكد من التشفير
      localStorage.setItem(permissions_${userId}, encryptedPermissions);
  
      // تأكيد أن البيانات تم تخزينها
      const savedData = localStorage.getItem(permissions_${userId});
      console.log("Saved permissions in localStorage:", savedData);
    } catch (error) {
      console.error("Error saving permissions:", error);
    }
  };
  
  // استرجاع الصلاحيات من localStorage بعد فك التشفير بناءً على المستخدم الحالي
  export const loadPermissionsFromLocalStorage = () => {
    try {
  
  
      const storedPermissions = localStorage.getItem(permissions);
      console.log("Stored permissions (encrypted):", storedPermissions);
  
      if (storedPermissions) {
        const decryptedPermissions = decryptData(storedPermissions);
        console.log("Decrypted permissions:", decryptedPermissions);
        return decryptedPermissions;
      } else {
        console.warn("No permissions found in localStorage for user:", );
        return null;
      }
    } catch (error) {
      console.error("Error loading permissions:", error);
      return null;
    }
  };
  
  
  // تنظيف الصلاحيات القديمة من localStorage
  export const clearUserPermissions = (userId) => {
    localStorage.removeItem(permissions_${userId});
  };
  
  // التحقق من وجود صلاحية محددة
  export const hasPermission = (permissions, permissionName) => {
    return permissions?.[permissionName] === true;
  };
  
  // تجهيز الصلاحيات من بيانات الـ API
  export const extractPermissionsFromAPI = (roles) => {
    if (!roles || roles.length === 0) return {};
  
    const permissions = roles.reduce((acc, role) => {
      role.permissions.forEach((perm) => {
        acc[perm.name] = true; // إضافة الصلاحية كـ true
      });
      return acc;
    }, {});
  
    return permissions;
  };
  
  
  import { computed } from "vue";
  
  
  
  // الوظيفة الديناميكية لاستخدام الصلاحيات
  export function usePermission(permissions, permissionName) {
    return computed(() => hasPermission(permissions, permissionName));
  }