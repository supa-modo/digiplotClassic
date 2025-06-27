import {
  apiClient,
  safeApiCall,
  ENABLE_DEBUG_LOGGING,
} from "../config/apiConfig";

/**
 * User Management Service
 * Handles all user-related API calls for admin operations
 */
class UserService {
  /**
   * Get all users with pagination and filtering
   * @param {object} params - Query parameters
   * @returns {Promise<object>} Users list response
   */
  async getUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add pagination parameters
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      // Add filtering parameters
      if (params.role) queryParams.append("role", params.role);
      if (params.status) queryParams.append("status", params.status);
      if (params.search) queryParams.append("search", params.search);

      const url = `/api/users${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      if (ENABLE_DEBUG_LOGGING) {
        console.log("👥 Fetching users:", { url, params });
      }

      const response = await apiClient.get(url);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Users fetched successfully:", {
            count: response.data.data.users?.length,
            total: response.data.data.total,
          });
        }

        return {
          success: true,
          data: response.data.data,
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get users failed:", error);
      }
      throw error;
    }
  }

  /**
   * Get user statistics
   * @returns {Promise<object>} User statistics response
   */
  async getUserStats() {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("📊 Fetching user statistics");
      }

      const response = await apiClient.get("/api/users/stats");

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ User stats fetched successfully:",
            response.data.data
          );
        }

        return {
          success: true,
          data: response.data.data,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to fetch user statistics"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get user stats failed:", error);
      }
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<object>} User details response
   */
  async getUserById(userId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("👤 Fetching user by ID:", userId);
      }

      const response = await apiClient.get(`/api/users/${userId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ User fetched successfully:", {
            userId,
            email: response.data.data.user.email,
          });
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
        console.error("❌ Get user by ID failed:", error);
      }
      throw error;
    }
  }

  /**
   * Create new user
   * @param {object} userData - User data
   * @returns {Promise<object>} Create user response
   */
  async createUser(userData) {
    try {
      const userPayload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        password: userData.password,
        role: userData.role,
        phone: userData.phone || "",
        emergencyContactName: userData.emergencyContactName || "",
        emergencyContactPhone: userData.emergencyContactPhone || "",
        status: userData.status || "active",
      };

      if (ENABLE_DEBUG_LOGGING) {
        console.log("➕ Creating user:", {
          email: userPayload.email,
          role: userPayload.role,
        });
      }

      const response = await apiClient.post("/api/users", userPayload);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ User created successfully:", {
            userId: response.data.data.user.id,
            email: response.data.data.user.email,
          });
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
      throw error;
    }
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} Update user response
   */
  async updateUser(userId, userData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("✏️ Updating user:", {
          userId,
          updates: Object.keys(userData),
        });
      }

      const response = await apiClient.put(`/api/users/${userId}`, userData);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ User updated successfully:", {
            userId,
            email: response.data.data.user.email,
          });
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
      throw error;
    }
  }

  /**
   * Delete/deactivate user
   * @param {string} userId - User ID
   * @returns {Promise<object>} Delete user response
   */
  async deleteUser(userId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🗑️ Deleting user:", userId);
      }

      const response = await apiClient.delete(`/api/users/${userId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ User deleted successfully:", userId);
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
      throw error;
    }
  }

  /**
   * Reactivate user
   * @param {string} userId - User ID
   * @returns {Promise<object>} Reactivate user response
   */
  async reactivateUser(userId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🔄 Reactivating user:", userId);
      }

      const response = await apiClient.post(`/api/users/${userId}/reactivate`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ User reactivated successfully:", userId);
        }

        return {
          success: true,
          user: response.data.data.user,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to reactivate user");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Reactivate user failed:", error);
      }
      throw error;
    }
  }

  /**
   * Reset user password (admin action)
   * @param {string} userId - User ID
   * @returns {Promise<object>} Reset password response
   */
  async resetUserPassword(userId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🔑 Resetting user password:", userId);
      }

      const response = await apiClient.post(
        `/api/users/${userId}/reset-password`
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ User password reset successfully:", userId);
        }

        return {
          success: true,
          message: response.data.message,
          newPassword: response.data.data?.newPassword,
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
      throw error;
    }
  }

  /**
   * Filter users by role
   * @param {string} role - User role to filter by
   * @returns {Promise<object>} Filtered users response
   */
  async getUsersByRole(role) {
    return this.getUsers({ role });
  }

  /**
   * Search users by query
   * @param {string} query - Search query
   * @param {object} filters - Additional filters
   * @returns {Promise<object>} Search results response
   */
  async searchUsers(query, filters = {}) {
    return this.getUsers({ ...filters, search: query });
  }

  /**
   * Get users with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {object} filters - Additional filters
   * @returns {Promise<object>} Paginated users response
   */
  async getUsersPaginated(page = 1, limit = 10, filters = {}) {
    return this.getUsers({ ...filters, page, limit });
  }
}

// Create and export a singleton instance
const userService = new UserService();
export default userService;
