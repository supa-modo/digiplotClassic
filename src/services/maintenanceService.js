import api from "../config/apiConfig";

const maintenanceService = {
  // Create a new maintenance request
  createMaintenanceRequest: async (maintenanceData) => {
    try {
      const response = await api.post("/maintenance", maintenanceData);
      return {
        success: true,
        maintenanceRequest: response.data,
      };
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to create maintenance request",
      };
    }
  },

  // Get all maintenance requests
  getMaintenanceRequests: async () => {
    try {
      const response = await api.get("/maintenance");
      return {
        success: true,
        maintenanceRequests: response.data,
      };
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch maintenance requests",
      };
    }
  },

  // Get maintenance requests for a specific property
  getMaintenanceRequestsByProperty: async (propertyId) => {
    try {
      const response = await api.get(`/maintenance/property/${propertyId}`);
      return {
        success: true,
        maintenanceRequests: response.data,
      };
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch maintenance requests",
      };
    }
  },

  // Get maintenance requests for a specific unit
  getMaintenanceRequestsByUnit: async (unitId) => {
    try {
      const response = await api.get(`/maintenance/unit/${unitId}`);
      return {
        success: true,
        maintenanceRequests: response.data,
      };
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch maintenance requests",
      };
    }
  },

  // Get a specific maintenance request by ID
  getMaintenanceRequest: async (id) => {
    try {
      const response = await api.get(`/maintenance/${id}`);
      return {
        success: true,
        maintenanceRequest: response.data,
      };
    } catch (error) {
      console.error("Error fetching maintenance request:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch maintenance request",
      };
    }
  },

  // Update an existing maintenance request
  updateMaintenanceRequest: async (id, updateData) => {
    try {
      const response = await api.put(`/maintenance/${id}`, updateData);
      return {
        success: true,
        maintenanceRequest: response.data,
      };
    } catch (error) {
      console.error("Error updating maintenance request:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to update maintenance request",
      };
    }
  },

  // Delete a maintenance request
  deleteMaintenanceRequest: async (id) => {
    try {
      await api.delete(`/maintenance/${id}`);
      return {
        success: true,
        message: "Maintenance request deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting maintenance request:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to delete maintenance request",
      };
    }
  },

  // Update maintenance request status
  updateMaintenanceStatus: async (id, status) => {
    try {
      const response = await api.patch(`/maintenance/${id}/status`, { status });
      return {
        success: true,
        maintenanceRequest: response.data,
      };
    } catch (error) {
      console.error("Error updating maintenance status:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to update maintenance status",
      };
    }
  },

  // Assign maintenance request to technician
  assignMaintenanceRequest: async (id, technicianId) => {
    try {
      const response = await api.patch(`/maintenance/${id}/assign`, {
        technicianId,
      });
      return {
        success: true,
        maintenanceRequest: response.data,
      };
    } catch (error) {
      console.error("Error assigning maintenance request:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to assign maintenance request",
      };
    }
  },
};

export default maintenanceService;
