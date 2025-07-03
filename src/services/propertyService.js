import {
  apiClient,
  safeApiCall,
  ENABLE_DEBUG_LOGGING,
} from "../config/apiConfig";

/**
 * Property Service
 * Handles all property-related API calls
 */
class PropertyService {
  /**
   * Get all properties for the current landlord
   * @param {object} filters - Optional filters (page, limit, search, etc.)
   * @returns {Promise<object>} Properties response
   */
  async getProperties(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add pagination
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      // Add search filters
      if (filters.search) params.append("search", filters.search);
      if (filters.propertyType)
        params.append("propertyType", filters.propertyType);
      if (filters.city) params.append("city", filters.city);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("🏢 Fetching properties with filters:", filters);
      }

      const response = await apiClient.get(
        `/api/properties?${params.toString()}`
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Properties fetched successfully:",
            response.data.data.properties.length
          );
        }

        return {
          success: true,
          properties: response.data.data.properties,
          total: response.data.data.total,
          page: response.data.data.page,
          totalPages: response.data.data.totalPages,
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch properties");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get properties failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch properties"
        );
      }

      throw error;
    }
  }

  /**
   * Get property by ID
   * @param {string} propertyId - Property ID
   * @returns {Promise<object>} Property response
   */
  async getPropertyById(propertyId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🏢 Fetching property:", propertyId);
      }

      const response = await apiClient.get(`/api/properties/${propertyId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Property fetched successfully:",
            response.data.data.property.name
          );
        }

        return {
          success: true,
          property: response.data.data.property,
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch property");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get property failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch property"
        );
      }

      throw error;
    }
  }

  /**
   * Create new property
   * @param {object} propertyData - Property data
   * @returns {Promise<object>} Create property response
   */
  async createProperty(propertyData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🏢 Creating property:", propertyData.name);
      }

      const response = await apiClient.post("/api/properties", propertyData);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Property created successfully:",
            response.data.data.property.name
          );
        }

        return {
          success: true,
          property: response.data.data.property,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to create property");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Create property failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to create property"
        );
      }

      throw error;
    }
  }

  /**
   * Update property
   * @param {string} propertyId - Property ID
   * @param {object} propertyData - Updated property data
   * @returns {Promise<object>} Update property response
   */
  async updateProperty(propertyId, propertyData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🏢 Updating property:", propertyId);
      }

      const response = await apiClient.put(
        `/api/properties/${propertyId}`,
        propertyData
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Property updated successfully:",
            response.data.data.property.name
          );
        }

        return {
          success: true,
          property: response.data.data.property,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to update property");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Update property failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to update property"
        );
      }

      throw error;
    }
  }

  /**
   * Delete property
   * @param {string} propertyId - Property ID
   * @returns {Promise<object>} Delete property response
   */
  async deleteProperty(propertyId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("🏢 Deleting property:", propertyId);
      }

      const response = await apiClient.delete(`/api/properties/${propertyId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Property deleted successfully");
        }

        return {
          success: true,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to delete property");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Delete property failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to delete property"
        );
      }

      throw error;
    }
  }

  /**
   * Get property statistics
   * @param {string} propertyId - Property ID
   * @returns {Promise<object>} Property stats response
   */
  async getPropertyStats(propertyId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("📊 Fetching property stats:", propertyId);
      }

      const response = await apiClient.get(
        `/api/properties/${propertyId}/stats`
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Property stats fetched successfully");
        }

        return {
          success: true,
          stats: response.data.data,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to fetch property stats"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get property stats failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch property stats"
        );
      }

      throw error;
    }
  }

  /**
   * Upload property images
   * @param {string} propertyId - Property ID
   * @param {FormData} formData - Form data with images
   * @returns {Promise<object>} Upload response
   */
  async uploadPropertyImages(propertyId, formData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("📷 Uploading property images:", propertyId);
      }

      const response = await apiClient.post(
        `/api/properties/${propertyId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Property images uploaded successfully");
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
        console.error("❌ Upload property images failed:", error);
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
const propertyService = new PropertyService();
export default propertyService;
