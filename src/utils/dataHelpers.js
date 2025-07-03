/**
 * Data Helpers
 * Utility functions to handle differences between demo data and API data structures
 */

/**
 * Normalize user data to handle different field naming conventions
 * @param {object} user - User object from API or demo data
 * @returns {object} Normalized user object
 */
export const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    // Ensure consistent field names
    firstName: user.firstName || user.first_name,
    lastName: user.lastName || user.last_name,
    emergencyContactName:
      user.emergencyContactName || user.emergency_contact_name,
    emergencyContactPhone:
      user.emergencyContactPhone || user.emergency_contact_phone,
    leaseStartDate: user.leaseStartDate || user.lease_start_date,
    leaseEndDate: user.leaseEndDate || user.lease_end_date,
    securityDeposit: user.securityDeposit || user.security_deposit,
    unitId: user.unitId || user.unit_id,
    propertyId: user.propertyId || user.property_id,
    landlordId: user.landlordId || user.landlord_id,
    createdAt: user.createdAt || user.created_at,
    updatedAt: user.updatedAt || user.updated_at,
  };
};

/**
 * Normalize property data
 * @param {object} property - Property object from API or demo data
 * @returns {object} Normalized property object
 */
export const normalizeProperty = (property) => {
  if (!property) return null;

  return {
    ...property,
    landlordId: property.landlordId || property.landlord_id,
    imageUrls: property.imageUrls || property.image_urls || [],
    createdAt: property.createdAt || property.created_at,
    updatedAt: property.updatedAt || property.updated_at,
  };
};

/**
 * Normalize unit data
 * @param {object} unit - Unit object from API or demo data
 * @returns {object} Normalized unit object
 */
export const normalizeUnit = (unit) => {
  if (!unit) return null;

  return {
    ...unit,
    propertyId: unit.propertyId || unit.property_id,
    rentAmount: unit.rentAmount || unit.rent_amount,
    imageUrls: unit.imageUrls || unit.image_urls || [],
    createdAt: unit.createdAt || unit.created_at,
    updatedAt: unit.updatedAt || unit.updated_at,
  };
};

/**
 * Normalize payment data
 * @param {object} payment - Payment object from API or demo data
 * @returns {object} Normalized payment object
 */
export const normalizePayment = (payment) => {
  if (!payment) return null;

  return {
    ...payment,
    tenantId: payment.tenantId || payment.tenant_id,
    unitId: payment.unitId || payment.unit_id,
    paymentDate: payment.paymentDate || payment.payment_date,
    mpesaTransactionId:
      payment.mpesaTransactionId || payment.mpesa_transaction_id,
    receiptUrl: payment.receiptUrl || payment.receipt_url,
    createdAt: payment.createdAt || payment.created_at,
    updatedAt: payment.updatedAt || payment.updated_at,
    // Additional fields for display
    tenantName: payment.tenant
      ? `${payment.tenant.firstName || payment.tenant.first_name || ""} ${
          payment.tenant.lastName || payment.tenant.last_name || ""
        }`.trim()
      : payment.tenant_name || payment.tenantName,
    unitName: payment.unit?.name || payment.unit_name || payment.unitName,
    propertyName:
      payment.property?.name || payment.property_name || payment.propertyName,
  };
};

/**
 * Normalize maintenance request data
 * @param {object} request - Maintenance request object from API or demo data
 * @returns {object} Normalized maintenance request object
 */
export const normalizeMaintenanceRequest = (request) => {
  if (!request) return null;

  return {
    ...request,
    tenantId: request.tenantId || request.tenant_id,
    unitId: request.unitId || request.unit_id,
    imageUrl: request.imageUrl || request.image_url,
    responseNotes: request.responseNotes || request.response_notes,
    createdAt: request.createdAt || request.created_at,
    updatedAt: request.updatedAt || request.updated_at,
  };
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: KES)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "KES") => {
  if (amount == null || isNaN(amount)) return `${currency} 0`;

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  try {
    return new Date(date).toLocaleDateString("en-US", defaultOptions);
  } catch (error) {
    console.error("Invalid date:", date);
    return "";
  }
};

/**
 * Get status color class based on status value
 * @param {string} status - Status value
 * @param {string} type - Type of entity (payment, maintenance, etc.)
 * @returns {string} CSS color class
 */
export const getStatusColor = (status, type = "general") => {
  if (!status) return "gray";

  const statusLower = status.toLowerCase();

  switch (type) {
    case "payment":
      switch (statusLower) {
        case "successful":
        case "completed":
          return "green";
        case "failed":
        case "cancelled":
          return "red";
        case "pending":
        case "processing":
          return "yellow";
        default:
          return "gray";
      }

    case "maintenance":
      switch (statusLower) {
        case "resolved":
        case "completed":
          return "green";
        case "pending":
          return "yellow";
        case "in_progress":
        case "in progress":
          return "blue";
        case "cancelled":
          return "red";
        default:
          return "gray";
      }

    case "unit":
      switch (statusLower) {
        case "occupied":
          return "green";
        case "vacant":
          return "blue";
        case "maintenance":
          return "yellow";
        case "unavailable":
          return "red";
        default:
          return "gray";
      }

    default:
      switch (statusLower) {
        case "active":
        case "success":
        case "completed":
          return "green";
        case "inactive":
        case "pending":
          return "yellow";
        case "error":
        case "failed":
        case "cancelled":
          return "red";
        default:
          return "gray";
      }
  }
};

/**
 * Calculate occupancy rate
 * @param {number} occupied - Number of occupied units
 * @param {number} total - Total number of units
 * @returns {number} Occupancy rate as percentage
 */
export const calculateOccupancyRate = (occupied, total) => {
  if (!total || total === 0) return 0;
  return Math.round((occupied / total) * 100 * 10) / 10; // Round to 1 decimal place
};

/**
 * Get time-based greeting
 * @returns {object} Greeting object with text and icon
 */
export const getTimeGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return { text: "morning", icon: "🌅" };
  } else if (hour < 18) {
    return { text: "afternoon", icon: "☀️" };
  } else {
    return { text: "evening", icon: "🌆" };
  }
};

export default {
  normalizeUser,
  normalizeProperty,
  normalizeUnit,
  normalizePayment,
  normalizeMaintenanceRequest,
  formatCurrency,
  formatDate,
  getStatusColor,
  calculateOccupancyRate,
  getTimeGreeting,
};
