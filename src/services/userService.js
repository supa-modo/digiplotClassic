import {
  apiClient,
  safeApiCall,
  ENABLE_DEBUG_LOGGING,
} from "../config/apiConfig";

/**
 * User Service
 * Handles all user management API calls (Admin only)
 */
class UserService {
  /**
   * Get all users with filtering (Admin only)
   * @param {object} filters - Optional filters (page, limit, search, role, etc.)
   * @returns {Promise<object>} Users response
   */
  async getUsers(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add pagination
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      // Add search filters
      if (filters.search) params.append("search", filters.search);
      if (filters.role) params.append("role", filters.role);
      if (filters.status) params.append("status", filters.status);
      if (filters.verified) params.append("verified", filters.verified);
      if (filters.twoFactorEnabled)
        params.append("twoFactorEnabled", filters.twoFactorEnabled);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("👤 Fetching users with filters:", filters);
      }

      const response = await apiClient.get(`/api/users?${params.toString()}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Users fetched successfully:",
            response.data.data.users.length
          );
        }

        return {
          success: true,
          users: response.data.data.users,
          total: response.data.data.total,
          page: response.data.data.page,
          totalPages: response.data.data.totalPages,
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get users failed:", error);
      }

      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch users");
      }

      throw error;
    }
  }

  /**
   * Get user by ID (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise<object>} User response
   */
  async getUserById(userId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("👤 Fetching user:", userId);
      }

      const response = await apiClient.get(`/api/users/${userId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ User fetched successfully:",
            response.data.data.user.email
          );
        }

        return {
          success: true,
          user: response.data.data.user,
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch user");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get user failed:", error);
      }

      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch user");
      }

      throw error;
    }
  }

  /**
   * Create new user (Admin only)
   * @param {object} userData - User data
   * @returns {Promise<object>} Create user response
   */
  async createUser(userData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("👤 Creating user:", userData.email);
      }

      const response = await apiClient.post("/api/users", userData);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ User created successfully:",
            response.data.data.user.email
          );
        }

        return {
          success: true,
          user: response.data.data.user,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to create user");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Create user failed:", error);
      }

      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to create user");
      }

      throw error;
    }
  }

  /**
   * Update user (Admin only)
   * @param {string} userId - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} Update user response
   */
  async updateUser(userId, userData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("👤 Updating user:", userId);
      }

      const response = await apiClient.put(`/api/users/${userId}`, userData);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ User updated successfully:",
            response.data.data.user.email
          );
        }

        return {
          success: true,
          user: response.data.data.user,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to update user");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Update user failed:", error);
      }

      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to update user");
      }

      throw error;
    }
  }

  /**
   * Delete/deactivate user (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise<object>} Delete user response
   */
  async deleteUser(userId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("👤 Deleting user:", userId);
      }

      const response = await apiClient.delete(`/api/users/${userId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ User deleted successfully");
        }

        return {
          success: true,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Delete user failed:", error);
      }

      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to delete user");
      }

      throw error;
    }
  }

  /**
   * Reset user password (Admin only)
   * @param {string} userId - User ID
   * @param {object} resetData - Password reset data
   * @returns {Promise<object>} Password reset response
   */
  async resetUserPassword(userId, resetData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("👤 Resetting user password:", userId);
      }

      const response = await apiClient.post(
        `/api/users/${userId}/reset-password`,
        resetData
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ User password reset successfully");
        }

        return {
          success: true,
          message: response.data.message,
          temporaryPassword: response.data.temporaryPassword,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to reset user password"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Reset user password failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to reset user password"
        );
      }

      throw error;
    }
  }

  /**
   * Activate/deactivate user (Admin only)
   * @param {string} userId - User ID
   * @param {boolean} activate - Whether to activate or deactivate
   * @returns {Promise<object>} Activation response
   */
  async toggleUserStatus(userId, activate = true) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("👤 Toggling user status:", userId, activate);
      }

      const response = await apiClient.post(
        `/api/users/${userId}/toggle-status`,
        {
          activate,
        }
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ User status toggled successfully");
        }

        return {
          success: true,
          user: response.data.data.user,
          message: response.data.message,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to toggle user status"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Toggle user status failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to toggle user status"
        );
      }

      throw error;
    }
  }

  /**
   * Get user activity logs (Admin only)
   * @param {string} userId - User ID
   * @param {object} filters - Optional filters
   * @returns {Promise<object>} Activity logs response
   */
  async getUserActivityLogs(userId, filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add pagination
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      // Add filters
      if (filters.action) params.append("action", filters.action);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("👤 Fetching user activity logs:", userId);
      }

      const response = await apiClient.get(
        `/api/users/${userId}/activity?${params.toString()}`
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ User activity logs fetched successfully");
        }

        return {
          success: true,
          logs: response.data.data.logs,
          total: response.data.data.total,
          page: response.data.data.page,
          totalPages: response.data.data.totalPages,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to fetch user activity logs"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get user activity logs failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch user activity logs"
        );
      }

      throw error;
    }
  }

  /**
   * Get system statistics (Admin only)
   * @param {object} filters - Optional filters (period, etc.)
   * @returns {Promise<object>} System stats response
   */
  async getSystemStats(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters
      if (filters.period) params.append("period", filters.period);
      if (filters.year) params.append("year", filters.year);
      if (filters.month) params.append("month", filters.month);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("📊 Fetching system stats with filters:", filters);
      }

      const response = await apiClient.get(
        `/api/users/stats?${params.toString()}`
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ System stats fetched successfully");
        }

        return {
          success: true,
          stats: response.data.data,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to fetch system stats"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get system stats failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch system stats"
        );
      }

      throw error;
    }
  }

  /**
   * Export users to CSV/Excel (Admin only)
   * @param {object} filters - Export filters
   * @param {string} format - Export format ('csv' or 'excel')
   * @returns {Promise<object>} Export response
   */
  async exportUsers(filters = {}, format = "csv") {
    try {
      const params = new URLSearchParams();

      // Add filters
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });

      params.append("format", format);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("📊 Exporting users:", format, filters);
      }

      const response = await apiClient.get(
        `/api/users/export?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

      if (ENABLE_DEBUG_LOGGING) {
        console.log("✅ Users exported successfully");
      }

      return {
        success: true,
        blob: response.data,
        filename:
          response.headers["content-disposition"]?.split("filename=")[1] ||
          `users.${format}`,
      };
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Export users failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to export users"
        );
      }

      throw error;
    }
  }
}

// Create and export a singleton instance
const userService = new UserService();
export default userService;
