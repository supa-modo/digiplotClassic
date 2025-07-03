import {
  apiClient,
  safeApiCall,
  ENABLE_DEBUG_LOGGING,
} from "../config/apiConfig";

/**
 * Tenant Service
 * Handles all tenant-related API calls
 */
class TenantService {
  /**
   * Get all tenants for the current landlord
   * @param {object} filters - Optional filters (page, limit, search, etc.)
   * @returns {Promise<object>} Tenants response
   */
  async getTenants(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add pagination
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      // Add search filters
      if (filters.search) params.append("search", filters.search);
      if (filters.propertyId) params.append("propertyId", filters.propertyId);
      if (filters.unitId) params.append("unitId", filters.unitId);
      if (filters.status) params.append("status", filters.status);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("👥 Fetching tenants with filters:", filters);
      }

      const response = await apiClient.get(`/api/tenants?${params.toString()}`);

      if (response.data.success && response.data.data) {
        const tenants = response.data.data.tenants || [];

        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Tenants fetched successfully:", tenants.length);
        }

        return {
          success: true,
          tenants: tenants,
          total: response.data.data.total || 0,
          page: response.data.data.page || 1,
          totalPages: response.data.data.totalPages || 1,
        };
      } else {
        throw new Error(response.data?.message || "Failed to fetch tenants");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get tenants failed:", error);
      }

      // For dashboard components, return empty data instead of throwing to prevent crashes
      if (error.response?.status >= 500) {
        if (ENABLE_DEBUG_LOGGING) {
          console.warn("👥 Returning empty tenant data due to server error");
        }
        
        return {
          success: false,
          tenants: [],
          total: 0,
          page: 1,
          totalPages: 1,
          error: error.response?.data?.message || "Server error occurred"
        };
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch tenants"
        );
      }

      throw error;
    }
  }

  /**
   * Get tenant by ID
   * @param {string} tenantId - Tenant ID
   * @returns {Promise<object>} Tenant response
   */
  async getTenantById(tenantId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("👥 Fetching tenant:", tenantId);
      }

      const response = await apiClient.get(`/api/tenants/${tenantId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Tenant fetched successfully:",
            response.data.data.tenant.firstName
          );
        }

        return {
          success: true,
          tenant: response.data.data.tenant,
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch tenant");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get tenant failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch tenant"
        );
      }

      throw error;
    }
  }

  /**
   * Create new tenant
   * @param {object} tenantData - Tenant data
   * @returns {Promise<object>} Create tenant response
   */
  async createTenant(tenantData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log(
          "👥 Creating tenant:",
          tenantData.firstName,
          tenantData.lastName
        );
      }

      const response = await apiClient.post("/api/tenants", tenantData);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Tenant created successfully:",
            response.data.data.tenant.firstName
          );
        }

        return {
          success: true,
          tenant: response.data.data.tenant,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to create tenant");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Create tenant failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to create tenant"
        );
      }

      throw error;
    }
  }

  /**
   * Update tenant
   * @param {string} tenantId - Tenant ID
   * @param {object} tenantData - Updated tenant data
   * @returns {Promise<object>} Update tenant response
   */
  async updateTenant(tenantId, tenantData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("👥 Updating tenant:", tenantId);
      }

      const response = await apiClient.put(
        `/api/tenants/${tenantId}`,
        tenantData
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Tenant updated successfully:",
            response.data.data.tenant.firstName
          );
        }

        return {
          success: true,
          tenant: response.data.data.tenant,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to update tenant");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Update tenant failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to update tenant"
        );
      }

      throw error;
    }
  }

  /**
   * Assign tenant to unit
   * @param {string} tenantId - Tenant ID
   * @param {object} assignmentData - Assignment data with unitId, leaseStartDate, etc.
   * @returns {Promise<object>} Assignment response
   */
  async assignUnit(tenantId, assignmentData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log(
          "👥 Assigning unit to tenant:",
          tenantId,
          assignmentData.unitId
        );
      }

      const response = await apiClient.post(
        `/api/tenants/${tenantId}/assign-unit`,
        assignmentData
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Unit assigned successfully");
        }

        return {
          success: true,
          tenant: response.data.data.tenant,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to assign unit");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Assign unit failed:", error);
      }

      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to assign unit");
      }

      throw error;
    }
  }

  /**
   * Remove tenant from unit
   * @param {string} tenantId - Tenant ID
   * @param {object} removalData - Removal data with moveOutDate, etc.
   * @returns {Promise<object>} Removal response
   */
  async removeUnit(tenantId, removalData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("👥 Removing tenant from unit:", tenantId);
      }

      const response = await apiClient.post(
        `/api/tenants/${tenantId}/remove-unit`,
        removalData
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Tenant removed from unit successfully");
        }

        return {
          success: true,
          tenant: response.data.data.tenant,
          message: response.data.message,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to remove tenant from unit"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Remove from unit failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to remove tenant from unit"
        );
      }

      throw error;
    }
  }

  /**
   * Upload tenant documents
   * @param {string} tenantId - Tenant ID
   * @param {FormData} formData - Form data with documents
   * @returns {Promise<object>} Upload response
   */
  async uploadDocuments(tenantId, formData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("📄 Uploading tenant documents:", tenantId);
      }

      const response = await apiClient.post(
        `/api/tenants/${tenantId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Tenant documents uploaded successfully");
        }

        return {
          success: true,
          documents: response.data.data.documents,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to upload documents");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Upload tenant documents failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to upload documents"
        );
      }

      throw error;
    }
  }
}

// Create and export a singleton instance
const tenantService = new TenantService();
export default tenantService;
