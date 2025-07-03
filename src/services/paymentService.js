import {
  apiClient,
  safeApiCall,
  ENABLE_DEBUG_LOGGING,
} from "../config/apiConfig";

/**
 * Payment Service
 * Handles all payment-related API calls including M-Pesa integration
 */
class PaymentService {
  /**
   * Get payments (role-based filtering)
   * @param {object} filters - Optional filters (page, limit, search, etc.)
   * @returns {Promise<object>} Payments response
   */
  async getPayments(filters = {}) {
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
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.minAmount) params.append("minAmount", filters.minAmount);
      if (filters.maxAmount) params.append("maxAmount", filters.maxAmount);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("💳 Fetching payments with filters:", filters);
      }

      const response = await apiClient.get(
        `/api/payments?${params.toString()}`
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log(
            "✅ Payments fetched successfully:",
            response.data.data.payments.length
          );
        }

        return {
          success: true,
          payments: response.data.data.payments,
          total: response.data.data.total,
          page: response.data.data.page,
          totalPages: response.data.data.totalPages,
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch payments");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get payments failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch payments"
        );
      }

      throw error;
    }
  }

  /**
   * Get payment by ID
   * @param {string} paymentId - Payment ID
   * @returns {Promise<object>} Payment response
   */
  async getPaymentById(paymentId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("💳 Fetching payment:", paymentId);
      }

      const response = await apiClient.get(`/api/payments/${paymentId}`);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Payment fetched successfully");
        }

        return {
          success: true,
          payment: response.data.data.payment,
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch payment");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get payment failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch payment"
        );
      }

      throw error;
    }
  }

  /**
   * Create payment (initiate M-Pesa STK Push)
   * @param {object} paymentData - Payment data
   * @returns {Promise<object>} Payment creation response
   */
  async createPayment(paymentData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("💳 Creating payment:", paymentData.amount);
      }

      const response = await apiClient.post("/api/payments", paymentData);

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Payment initiated successfully");
        }

        return {
          success: true,
          payment: response.data.data.payment,
          checkoutRequestId: response.data.data.checkoutRequestId,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to create payment");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Create payment failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to create payment"
        );
      }

      throw error;
    }
  }

  /**
   * Update payment status (Landlord only)
   * @param {string} paymentId - Payment ID
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Update response
   */
  async updatePayment(paymentId, updateData) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("💳 Updating payment:", paymentId);
      }

      const response = await apiClient.put(
        `/api/payments/${paymentId}`,
        updateData
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Payment updated successfully");
        }

        return {
          success: true,
          payment: response.data.data.payment,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || "Failed to update payment");
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Update payment failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to update payment"
        );
      }

      throw error;
    }
  }

  /**
   * Get payment statistics (Landlord only)
   * @param {object} filters - Optional filters (period, propertyId, etc.)
   * @returns {Promise<object>} Payment stats response
   */
  async getPaymentStats(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters
      if (filters.period) params.append("period", filters.period);
      if (filters.year) params.append("year", filters.year);
      if (filters.month) params.append("month", filters.month);
      if (filters.propertyId) params.append("propertyId", filters.propertyId);
      if (filters.unitId) params.append("unitId", filters.unitId);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("📊 Fetching payment stats with filters:", filters);
      }

      const response = await apiClient.get(
        `/api/payments/stats?${params.toString()}`
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ Payment stats fetched successfully");
        }

        return {
          success: true,
          stats: response.data.data,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to fetch payment stats"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Get payment stats failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch payment stats"
        );
      }

      throw error;
    }
  }

  /**
   * Check M-Pesa payment status
   * @param {string} checkoutRequestId - M-Pesa checkout request ID
   * @returns {Promise<object>} Status check response
   */
  async checkMpesaStatus(checkoutRequestId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("💳 Checking M-Pesa status:", checkoutRequestId);
      }

      const response = await apiClient.get(
        `/api/payments/mpesa/status/${checkoutRequestId}`
      );

      if (response.data.success) {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("✅ M-Pesa status checked successfully");
        }

        return {
          success: true,
          status: response.data.data.status,
          payment: response.data.data.payment,
        };
      } else {
        throw new Error(
          response.data.message || "Failed to check M-Pesa status"
        );
      }
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Check M-Pesa status failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to check M-Pesa status"
        );
      }

      throw error;
    }
  }

  /**
   * Download payment receipt
   * @param {string} paymentId - Payment ID
   * @returns {Promise<object>} Receipt download response
   */
  async downloadReceipt(paymentId) {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("📄 Downloading payment receipt:", paymentId);
      }

      const response = await apiClient.get(
        `/api/payments/${paymentId}/receipt`,
        {
          responseType: "blob",
        }
      );

      if (ENABLE_DEBUG_LOGGING) {
        console.log("✅ Payment receipt downloaded successfully");
      }

      return {
        success: true,
        blob: response.data,
      };
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Download receipt failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to download receipt"
        );
      }

      throw error;
    }
  }

  /**
   * Export payments to CSV/Excel
   * @param {object} filters - Export filters
   * @param {string} format - Export format ('csv' or 'excel')
   * @returns {Promise<object>} Export response
   */
  async exportPayments(filters = {}, format = "csv") {
    try {
      const params = new URLSearchParams();

      // Add filters
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });

      params.append("format", format);

      if (ENABLE_DEBUG_LOGGING) {
        console.log("📊 Exporting payments:", format, filters);
      }

      const response = await apiClient.get(
        `/api/payments/export?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

      if (ENABLE_DEBUG_LOGGING) {
        console.log("✅ Payments exported successfully");
      }

      return {
        success: true,
        blob: response.data,
        filename:
          response.headers["content-disposition"]?.split("filename=")[1] ||
          `payments.${format}`,
      };
    } catch (error) {
      if (ENABLE_DEBUG_LOGGING) {
        console.error("❌ Export payments failed:", error);
      }

      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to export payments"
        );
      }

      throw error;
    }
  }
}

// Create and export a singleton instance
const paymentService = new PaymentService();
export default paymentService;
