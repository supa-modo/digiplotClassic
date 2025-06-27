import axios from "axios";

// API base URL from environment variables or default
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// Enable mock data based on environment variable
export const ENABLE_MOCK_DATA =
  import.meta.env.VITE_ENABLE_MOCK_DATA === "true";

// Enable debug logging based on environment variable
export const ENABLE_DEBUG_LOGGING =
  import.meta.env.VITE_ENABLE_DEBUG_LOGGING === "true";

// Token storage keys
export const TOKEN_KEY = "digiplot_auth_token";
export const USER_KEY = "digiplot_auth_user";
export const ROLE_KEY = "digiplot_role";

// Create axios instance with auth interceptors
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem(TOKEN_KEY);

    // Debug token info for protected routes
    if (
      config.url &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/register")
    ) {
      if (ENABLE_DEBUG_LOGGING) {
        console.log(
          `🔑 Protected request to ${config.url} - Token exists:`,
          !!token
        );
      }
    }

    // If we have a token, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug logging
    if (ENABLE_DEBUG_LOGGING) {
      console.debug(
        `API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      if (config.data) {
        console.debug("Request data:", config.data);
      }
    }

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Debug logging
    if (ENABLE_DEBUG_LOGGING) {
      console.debug(`API Response: ${response.status} ${response.config.url}`);
      console.debug("Response data:", response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (ENABLE_DEBUG_LOGGING) {
        console.error(
          `API Error ${error.response.status}: ${
            error.response.data?.message || JSON.stringify(error.response.data)
          }`
        );
      }

      // Handle 401 Unauthorized errors (token expired or invalid)
      if (error.response.status === 401) {
        console.log("🚨 401 Unauthorized - Token issue detected");
        console.log("🚨 Current path:", window.location.pathname);
        console.log("🚨 Error details:", error.response.data);

        // Only clear auth and redirect if we're not already on the login page
        if (
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register")
        ) {
          console.log("🚨 Clearing auth data and redirecting to login");
          // Clear auth data from localStorage
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem(ROLE_KEY);
          window.location.href = "/login";
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API No Response:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Wrapper for API calls to handle common error scenarios
 * @param {Function} apiCall - The API call function to execute
 * @param {any} defaultValue - Default value to return on error
 * @returns {Promise<any>} - Response data or default value
 */
export const safeApiCall = async (apiCall, defaultValue = null) => {
  try {
    const result = await apiCall();
    return result;
  } catch (error) {
    console.error("API call failed:", error);

    // If we have a response with validation errors, return them properly
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || "Operation failed",
        errors: error.response.data.errors || [],
      };
    }

    return defaultValue;
  }
};

export default {
  API_BASE_URL,
  apiClient,
  safeApiCall,
  ENABLE_MOCK_DATA,
  ENABLE_DEBUG_LOGGING,
  TOKEN_KEY,
  USER_KEY,
  ROLE_KEY,
};
