import {
  apiClient,
  safeApiCall,
  ENABLE_DEBUG_LOGGING,
} from "../config/apiConfig";

/**
 * Unit Service
 * Handles all unit-related API calls
 */
class UnitService {
  /**
   * Get all units for the current landlord
   * @param {object} filters - Optional filters (page, limit, search, propertyId, etc.)
   * @returns {Promise<object>} Units response
   */
  async getUnits(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add pagination
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      // Add search filters
      if (filters.search) params.append("search", filters.search);
      if (filters.propertyId) params.append("propertyId", filters.propertyId);
      if (filters.type) params.append("type", filters.type);
      if (filters.status) params.append("status", filters.status);
      if (filters.minRent) params.append("minRent", filters.minRent);
      if (filters.maxRent) params.append("maxRent", filters.maxRent);
      if (filters.bedrooms) params.append("bedrooms", filters.bedrooms);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("🏠 Fetching units with filters:", filters);
      }

      const response = await apiClient.get(`/api/units?${params.toString()}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Units fetched successfully:",
            response.data.data.units.length
          );
        }

        return {
          success: true,
          units: response.data.data.units,
          total: response.data.data.total,
          page: response.data.data.page,
          totalPages: response.data.data.totalPages,
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch units");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get units failed:", error);
      }

      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch units");
      }

      throw error;
    }
  }

  /**
   * Get units by property ID
   * @param {string} propertyId - Property ID
   * @param {object} filters - Optional filters
   * @returns {Promise<object>} Units response
   */
  async getUnitsByProperty(propertyId, filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.status) params.append("status", filters.status);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("🏠 Fetching units for property:", propertyId);
      }

      const response = await apiClient.get(
        `/api/units/property/${propertyId}?${params.toString()}`
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Property units fetched successfully:",
            response.data.data.units.length
          );
        }

        return {
          success: true,
          units: response.data.data.units,
          total: response.data.data.total,
          page: response.data.data.page,
          totalPages: response.data.data.totalPages,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to fetch property units"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get property units failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch property units"
        );
      }

      throw error;
    }
  }

  /**
   * Get unit by ID
   * @param {string} unitId - Unit ID
   * @returns {Promise<object>} Unit response
   */
  async getUnitById(unitId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🏠 Fetching unit:", unitId);
      }

      const response = await apiClient.get(`/api/units/${unitId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Unit fetched successfully:",
            response.data.data.unit.name
          );
        }

        return {
          success: true,
          unit: response.data.data.unit,
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch unit");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get unit failed:", error);
      }

      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch unit");
      }

      throw error;
    }
  }

  /**
   * Create new unit
   * @param {object} unitData - Unit data
   * @returns {Promise<object>} Create unit response
   */
  async createUnit(unitData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🏠 Creating unit:", unitData.name);
      }

      const response = await apiClient.post("/api/units", unitData);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Unit created successfully:",
            response.data.data.unit.name
          );
        }

        return {
          success: true,
          unit: response.data.data.unit,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to create unit");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Create unit failed:", error);
      }

      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to create unit");
      }

      throw error;
    }
  }

  /**
   * Update unit
   * @param {string} unitId - Unit ID
   * @param {object} unitData - Updated unit data
   * @returns {Promise<object>} Update unit response
   */
  async updateUnit(unitId, unitData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🏠 Updating unit:", unitId);
      }

      const response = await apiClient.put(`/api/units/${unitId}`, unitData);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Unit updated successfully:",
            response.data.data.unit.name
          );
        }

        return {
          success: true,
          unit: response.data.data.unit,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to update unit");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Update unit failed:", error);
      }

      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to update unit");
      }

      throw error;
    }
  }

  /**
   * Delete unit
   * @param {string} unitId - Unit ID
   * @returns {Promise<object>} Delete unit response
   */
  async deleteUnit(unitId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🏠 Deleting unit:", unitId);
      }

      const response = await apiClient.delete(`/api/units/${unitId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Unit deleted successfully");
        }

        return {
          success: true,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to delete unit");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Delete unit failed:", error);
      }

      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to delete unit");
      }

      throw error;
    }
  }

  /**
   * Get unit statistics
   * @param {string} unitId - Unit ID
   * @returns {Promise<object>} Unit stats response
   */
  async getUnitStats(unitId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("📊 Fetching unit stats:", unitId);
      }

      const response = await apiClient.get(`/api/units/${unitId}/stats`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Unit stats fetched successfully");
        }

        return {
          success: true,
          stats: response.data.data,
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch unit stats");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get unit stats failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch unit stats"
        );
      }

      throw error;
    }
  }

  /**
   * Upload unit images
   * @param {string} unitId - Unit ID
   * @param {FormData} formData - Form data with images
   * @returns {Promise<object>} Upload response
   */
  async uploadUnitImages(unitId, formData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("📷 Uploading unit images:", unitId);
      }

      const response = await apiClient.post(
        `/api/units/${unitId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Unit images uploaded successfully");
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
        console.error("❌ Upload unit images failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to upload images"
        );
      }

      throw error;
    }
  }
}

// Create and export a singleton instance
const unitService = new UnitService();
export default unitService;
