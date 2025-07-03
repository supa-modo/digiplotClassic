import {
  apiClient,
  safeApiCall,
  ENABLE_DEBUG_LOGGING,
} from "../config/apiConfig";

/**
 * Maintenance Service
 * Handles all maintenance request-related API calls
 */
class MaintenanceService {
  /**
   * Get maintenance requests (role-based filtering)
   * @param {object} filters - Optional filters (page, limit, search, etc.)
   * @returns {Promise<object>} Maintenance requests response
   */
  async getMaintenanceRequests(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add pagination
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      // Add search filters
      if (filters.search) params.append("search", filters.search);
      if (filters.tenantId) params.append("tenantId", filters.tenantId);
      if (filters.unitId) params.append("unitId", filters.unitId);
      if (filters.propertyId) params.append("propertyId", filters.propertyId);
      if (filters.status) params.append("status", filters.status);
      if (filters.category) params.append("category", filters.category);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("🔧 Fetching maintenance requests with filters:", filters);
      }

      const response = await apiClient.get(
        `/api/maintenance?${params.toString()}`
      );

      if (response.data.success && response.data.data) {
        const requests = response.data.data.requests || [];

        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Maintenance requests fetched successfully:",
            requests.length
          );
        }

        return {
          success: true,
          requests: requests,
          total: response.data.data.total || 0,
          page: response.data.data.page || 1,
          totalPages: response.data.data.totalPages || 1,
        };
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch maintenance requests"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get maintenance requests failed:", error);
      }

      // For dashboard components, return empty data instead of throwing to prevent crashes
      if (error.response?.status >= 500) {
        if (ENABLE_DEBUG_LOGGING) {
          console.warn("🔧 Returning empty maintenance data due to server error");
        }
        
        return {
          success: false,
          requests: [],
          total: 0,
          page: 1,
          totalPages: 1,
          error: error.response?.data?.message || "Server error occurred"
        };
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch maintenance requests"
        );
      }

      throw error;
    }
  }

  /**
   * Get maintenance request by ID
   * @param {string} requestId - Maintenance request ID
   * @returns {Promise<object>} Maintenance request response
   */
  async getMaintenanceRequestById(requestId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🔧 Fetching maintenance request:", requestId);
      }

      const response = await apiClient.get(`/api/maintenance/${requestId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Maintenance request fetched successfully");
        }

        return {
          success: true,
          request: response.data.data.request,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to fetch maintenance request"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get maintenance request failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch maintenance request"
        );
      }

      throw error;
    }
  }

  /**
   * Create maintenance request
   * @param {object} requestData - Maintenance request data
   * @returns {Promise<object>} Create request response
   */
  async createMaintenanceRequest(requestData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🔧 Creating maintenance request:", requestData.title);
      }

      const response = await apiClient.post("/api/maintenance", requestData);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Maintenance request created successfully");
        }

        return {
          success: true,
          request: response.data.data.request,
          message: response.data.message,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to create maintenance request"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Create maintenance request failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to create maintenance request"
        );
      }

      throw error;
    }
  }

  /**
   * Update maintenance request (different permissions for tenant/landlord)
   * @param {string} requestId - Maintenance request ID
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Update response
   */
  async updateMaintenanceRequest(requestId, updateData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🔧 Updating maintenance request:", requestId);
      }

      const response = await apiClient.put(
        `/api/maintenance/${requestId}`,
        updateData
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Maintenance request updated successfully");
        }

        return {
          success: true,
          request: response.data.data.request,
          message: response.data.message,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to update maintenance request"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Update maintenance request failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to update maintenance request"
        );
      }

      throw error;
    }
  }

  /**
   * Delete maintenance request (Tenant only, pending status)
   * @param {string} requestId - Maintenance request ID
   * @returns {Promise<object>} Delete response
   */
  async deleteMaintenanceRequest(requestId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🔧 Deleting maintenance request:", requestId);
      }

      const response = await apiClient.delete(`/api/maintenance/${requestId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Maintenance request deleted successfully");
        }

        return {
          success: true,
          message: response.data.message,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to delete maintenance request"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Delete maintenance request failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to delete maintenance request"
        );
      }

      throw error;
    }
  }

  /**
   * Get maintenance statistics (Landlord only)
   * @param {object} filters - Optional filters (period, propertyId, etc.)
   * @returns {Promise<object>} Maintenance stats response
   */
  async getMaintenanceStats(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters
      if (filters.period) params.append("period", filters.period);
      if (filters.year) params.append("year", filters.year);
      if (filters.month) params.append("month", filters.month);
      if (filters.propertyId) params.append("propertyId", filters.propertyId);
      if (filters.unitId) params.append("unitId", filters.unitId);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("📊 Fetching maintenance stats with filters:", filters);
      }

      const response = await apiClient.get(
        `/api/maintenance/stats?${params.toString()}`
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Maintenance stats fetched successfully");
        }

        return {
          success: true,
          stats: response.data.data,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to fetch maintenance stats"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get maintenance stats failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch maintenance stats"
        );
      }

      throw error;
    }
  }

  /**
   * Upload maintenance request images
   * @param {string} requestId - Maintenance request ID
   * @param {FormData} formData - Form data with images
   * @returns {Promise<object>} Upload response
   */
  async uploadMaintenanceImages(requestId, formData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("📷 Uploading maintenance images:", requestId);
      }

      const response = await apiClient.post(
        `/api/maintenance/${requestId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Maintenance images uploaded successfully");
        }

        return {
          success: true,
          images: response.data.data.images,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to upload images");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Upload maintenance images failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to upload images"
        );
      }

      throw error;
    }
  }

  /**
   * Export maintenance requests to CSV/Excel
   * @param {object} filters - Export filters
   * @param {string} format - Export format ('csv' or 'excel')
   * @returns {Promise<object>} Export response
   */
  async exportMaintenanceRequests(filters = {}, format = "csv") {
    try {
      const params = new URLSearchParams();

      // Add filters
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });

      params.append("format", format);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("📊 Exporting maintenance requests:", format, filters);
      }

      const response = await apiClient.get(
        `/api/maintenance/export?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

      if (ENABLE_DEBUG_LOGGING) {
        console.log("✅ Maintenance requests exported successfully");
      }

      return {
        success: true,
        blob: response.data,
        filename:
          response.headers["content-disposition"]?.split("filename=")[1] ||
          `maintenance.${format}`,
      };
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Export maintenance requests failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to export maintenance requests"
        );
      }

      throw error;
    }
  }
}

// Create and export a singleton instance
const maintenanceService = new MaintenanceService();
export default maintenanceService;
