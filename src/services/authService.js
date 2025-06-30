import {
  apiClient,
  safeApiCall,
  TOKEN_KEY,
  USER_KEY,
  ROLE_KEY,
  ENABLE_DEBUG_LOGGING,
} from "../config/apiConfig";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role (tenant, landlord, admin)
   * @param {string} twoFactorToken - Optional 2FA token
   * @returns {Promise<object>} Login response
   */
  async login(email, password, role, twoFactorToken = null) {
    try {
      const loginData = {
        email: email.toLowerCase(),
        password,
      };

      // Add 2FA token if provided
      if (twoFactorToken) {
        loginData.twoFactorToken = twoFactorToken;
      }

      if (ENABLE_DEBUG_LOGGING) {
        console.log("🔐 Attempting login for:", {
          email,
          role,
          has2FA: !!twoFactorToken,
        });
      }

      const response = await apiClient.post("/api/auth/login", loginData);

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Verify the user role matches what was selected
        if (user.role !== role) {
          throw new Error(
            `Account role mismatch. You selected ${role} but your account is registered as ${user.role}.`
          );
        }

        // Store auth data
        this.storeAuthData(user, token, user.role);

        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Login successful:", {
            userId: user.id,
            role: user.role,
          });
        }

        return {
          success: true,
          user,
          token,
          role: user.role,
        };
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Login failed:", error);
      }

      // Handle specific error cases
      if (error.response?.data) {
        const errorData = error.response.data;

        // Check if 2FA is required
        if (errorData.requires2FA) {
          return {
            success: false,
            requires2FA: true,
            message: errorData.message || "Two-factor authentication required",
          };
        }

        throw new Error(errorData.message || "Login failed");
      }

      throw error;
    }
  }

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} Registration response
   */
  async register(userData) {
    try {
      const registrationData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        password: userData.password,
        role: userData.role,
        phone: userData.phone || "",
        emergencyContactName: userData.emergencyContactName || "",
        emergencyContactPhone: userData.emergencyContactPhone || "",
      };

      if (ENABLE_DEBUG_LOGGING) {
        console.log("📝 Attempting registration for:", {
          email: registrationData.email,
          role: registrationData.role,
        });
      }

      const response = await apiClient.post(
        "/api/auth/register",
        registrationData
      );

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Store auth data
        this.storeAuthData(user, token, user.role);

        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Registration successful:", {
            userId: user.id,
            role: user.role,
          });
        }

        return {
          success: true,
          user,
          token,
          role: user.role,
        };
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Registration failed:", error);
      }

      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Registration failed");
      }

      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<object>} User profile data
   */
  async getProfile() {
    try {
      const response = await apiClient.get("/api/auth/profile");

      if (response.data.success) {
        const user = response.data.data.user;

        // Update stored user data
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        return {
          success: true,
          user,
        };
      } else {
        throw new Error(response.data.message || "Failed to get profile");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get profile failed:", error);
      }

      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Failed to get profile");
      }

      throw error;
    }
  }

  /**
   * Update user profile
   * @param {object} profileData - Profile data to update
   * @returns {Promise<object>} Updated profile response
   */
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put("/api/auth/profile", profileData);

      if (response.data.success) {
        const user = response.data.data.user;

        // Update stored user data
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        return {
          success: true,
          user,
        };
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Update profile failed:", error);
      }

      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Failed to update profile");
      }

      throw error;
    }
  }

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<object>} Change password response
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to change password");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Change password failed:", error);
      }

      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Failed to change password");
      }

      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<object>} Password reset response
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post("/api/auth/forgot-password", {
        email: email.toLowerCase(),
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to send reset email");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Forgot password failed:", error);
      }

      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Failed to send reset email");
      }

      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<object>} Reset password response
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post("/api/auth/reset-password", {
        token,
        newPassword,
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Reset password failed:", error);
      }

      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Failed to reset password");
      }

      throw error;
    }
  }

  /**
   * Setup 2FA (get QR code)
   * @returns {Promise<object>} 2FA setup response
   */
  async setup2FA() {
    try {
      const response = await apiClient.post("/api/auth/2fa/setup");

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        throw new Error(response.data.message || "Failed to setup 2FA");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Setup 2FA failed:", error);
      }

      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Failed to setup 2FA");
      }

      throw error;
    }
  }

  /**
   * Enable 2FA
   * @param {string} token - 2FA verification token
   * @returns {Promise<object>} Enable 2FA response
   */
  async enable2FA(token) {
    try {
      const response = await apiClient.post("/api/auth/2fa/enable", { token });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          backupCodes: response.data.backupCodes,
        };
      } else {
        throw new Error(response.data.message || "Failed to enable 2FA");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Enable 2FA failed:", error);
      }

      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Failed to enable 2FA");
      }

      throw error;
    }
  }

  /**
   * Disable 2FA
   * @param {string} token - 2FA verification token
   * @returns {Promise<object>} Disable 2FA response
   */
  async disable2FA(token) {
    try {
      const response = await apiClient.post("/api/auth/2fa/disable", { token });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to disable 2FA");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Disable 2FA failed:", error);
      }

      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Failed to disable 2FA");
      }

      throw error;
    }
  }

  /**
   * Get 2FA status
   * @returns {Promise<object>} 2FA status response
   */
  async get2FAStatus() {
    try {
      const response = await apiClient.get("/api/auth/2fa/status");

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        throw new Error(response.data.message || "Failed to get 2FA status");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get 2FA status failed:", error);
      }

      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Failed to get 2FA status");
      }

      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    try {
      // Clear all auth data from localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ROLE_KEY);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("🚪 User logged out successfully");
      }

      return { success: true };
    } catch (error) {
      console.error("❌ Logout error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Store authentication data in localStorage
   * @param {object} user - User data
   * @param {string} token - JWT token
   * @param {string} role - User role
   */
  storeAuthData(user, token, role) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(ROLE_KEY, role);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("💾 Auth data stored:", { userId: user.id, role });
      }
    } catch (error) {
      console.error("❌ Failed to store auth data:", error);
    }
  }

  /**
   * Get stored authentication data
   * @returns {object} Auth data or null
   */
  getStoredAuthData() {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userData = localStorage.getItem(USER_KEY);
      const role = localStorage.getItem(ROLE_KEY);

      if (token && userData && role) {
        return {
          token,
          user: JSON.parse(userData),
          role,
        };
      }

      return null;
    } catch (error) {
      console.error("❌ Failed to get stored auth data:", error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const authData = this.getStoredAuthData();
    return !!(authData && authData.token && authData.user && authData.role);
  }

  /**
   * Get current user role
   * @returns {string|null} User role or null
   */
  getCurrentRole() {
    const authData = this.getStoredAuthData();
    return authData ? authData.role : null;
  }

  /**
   * Get current user data
   * @returns {object|null} User data or null
   */
  getCurrentUser() {
    const authData = this.getStoredAuthData();
    return authData ? authData.user : null;
  }

  /**
   * Check if current user is a tenant
   * @returns {boolean}
   */
  isTenant() {
    return this.getCurrentRole() === "tenant";
  }

  /**
   * Check if current user is a landlord
   * @returns {boolean}
   */
  isLandlord() {
    return this.getCurrentRole() === "landlord";
  }

  /**
   * Check if current user is an admin
   * @returns {boolean}
   */
  isAdmin() {
    return this.getCurrentRole() === "admin";
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
