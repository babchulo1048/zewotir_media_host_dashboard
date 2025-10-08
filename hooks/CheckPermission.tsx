// A simple client-side hook for fetching and managing user permissions

import * as React from "react";
// Replace with your actual API utility (e.g., axiosInstance)
import axios from "axios";

const normalizePermission = (permissionName: string) =>
  permissionName?.trim().toUpperCase();

/**
 * Fetches user permissions and provides a check function.
 * @returns {{
 * permissions: Set<string>,
 * isLoading: boolean,
 * hasPermission: (requiredPermission: string) => boolean
 * }}
 */
export const usePermissions = () => {
  const [permissions, setPermissions] = React.useState(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const roleId =
    typeof window !== "undefined" ? localStorage.getItem("roleId") : null;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  React.useEffect(() => {
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Fetches user permissions from the API and updates the permissions state.
     * @returns {void}
     */
    /*******  9238d52a-b6de-4443-a57b-eed60284a283  *******/ const fetchPermissions =
      async () => {
        if (!roleId) {
          setIsLoading(false);
          return;
        }

        try {
          // API Route: api/roles/${roleId}/permissions
          const response = await axios.get(
            `http://127.0.0.1:9090/api/v1/roles/${roleId}/permissions`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const fetchedPermissions = new Set();
          if (response.data && Array.isArray(response.data)) {
            response.data.forEach((perm) => {
              const normalizedName = normalizePermission(perm.name);
              if (normalizedName) {
                fetchedPermissions.add(normalizedName);
              }
            });
          }
          setPermissions(fetchedPermissions);
        } catch (error) {
          console.error("Error fetching permissions:", error);
          // Optionally set to an empty set or handle error state
          setPermissions(new Set());
        } finally {
          setIsLoading(false);
        }
      };

    fetchPermissions();
  }, [roleId]);

  /**
   * Checks if the user has a specific permission.
   * @param {string} requiredPermission The permission string to check (e.g., "VIEW_DASHBOARD").
   * @returns {boolean}
   */
  const hasPermission = React.useCallback(
    (requiredPermission: string) => {
      if (!requiredPermission) return true; // Treat as no permission required
      const normalizedRequired = normalizePermission(requiredPermission);
      return permissions.has(normalizedRequired);
    },
    [permissions]
  );

  return { permissions, isLoading, hasPermission };
};
