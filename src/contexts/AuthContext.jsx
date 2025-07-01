import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { ENABLE_DEBUG_LOGGING } from "../config/apiConfig";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("useAuth called outside AuthProvider context");
    console.trace("Call stack:");
    // In development, provide more helpful error info
    if (process.env.NODE_ENV === "development") {
      console.error("Make sure your component is wrapped with <AuthProvider>");
    }
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = authService.getStoredAuthData();

        if (authData && authData.user && authData.role) {
          if (ENABLE_DEBUG_LOGGING) {
            console.log("AuthProvider: Restoring user session", {
              userId: authData.user.id,
              role: authData.role,
            });
          }
          setUser(authData.user);
          setUserRole(authData.role);
        }
      } catch (storageError) {
        console.error("Error accessing stored auth data:", storageError);
        // Clear potentially corrupted data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Add effect to handle auth state synchronization
  useEffect(() => {
    if (loading) return;

    const authenticated = user !== null && userRole !== null;
    const serviceAuthenticated = authService.isAuthenticated();

    // Check for auth mismatch and fix it
    if (authenticated !== serviceAuthenticated) {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("AuthProvider: Auth mismatch detected", {
          contextAuthenticated: authenticated,
          serviceAuthenticated,
          user: !!user,
          userRole,
        });
      }

      // If service has auth but context doesn't, refresh context
      if (serviceAuthenticated && !authenticated) {
        const authData = authService.getStoredAuthData();
        if (authData && authData.user && authData.role) {
          try {
            if (ENABLE_DEBUG_LOGGING) {
              console.log("AuthProvider: Auto-refreshing missing auth state", {
                userId: authData.user.id,
                role: authData.role,
              });
            }
            setUser(authData.user);
            setUserRole(authData.role);
          } catch (error) {
            console.error("Error auto-refreshing auth state:", error);
            authService.logout();
          }
        }
      } else if (!serviceAuthenticated && authenticated) {
        // If context has auth but service doesn't, clear context
        if (ENABLE_DEBUG_LOGGING) {
          console.log("AuthProvider: Clearing stale auth state");
        }
        setUser(null);
        setUserRole(null);
      }
    }
  }, [user, userRole, loading]);

  const login = async (email, password, userType, twoFactorToken = null) => {
    try {
      if (ENABLE_DEBUG_LOGGING) {
        console.log("AuthProvider: Attempting login", {
          email,
          userType,
          has2FA: !!twoFactorToken,
        });
      }

      const result = await authService.login(
        email,
        password,
        userType,
        twoFactorToken
      );

      if (result.success) {
        console.log("AuthProvider: Login successful", {
          userId: result.user.id,
          role: result.role,
        });

        setUser(result.user);
        setUserRole(result.role);

        return { success: true, user: result.user, role: result.role };
      } else {
        // Handle 2FA requirement or other non-success cases
        return result;
      }
    } catch (error) {
      console.error("AuthProvider: Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    if (ENABLE_DEBUG_LOGGING) {
      console.log("AuthProvider: Logging out user");
    }

    setUser(null);
    setUserRole(null);
    authService.logout();
  };

  // Make isAuthenticated a pure function that doesn't cause side effects
  const isAuthenticated = () => {
    return user !== null && userRole !== null;
  };

  // Manual refresh function for external use
  const refreshAuthState = () => {
    if (ENABLE_DEBUG_LOGGING) {
      console.log("AuthProvider: Manually refreshing auth state");
    }

    const authData = authService.getStoredAuthData();

    if (authData && authData.user && authData.role) {
      try {
        if (ENABLE_DEBUG_LOGGING) {
          console.log("AuthProvider: Refreshing auth state", {
            userId: authData.user.id,
            role: authData.role,
          });
        }
        setUser(authData.user);
        setUserRole(authData.role);
      } catch (error) {
        console.error("Error refreshing auth state:", error);
        authService.logout();
        setUser(null);
        setUserRole(null);
      }
    } else {
      // No valid auth data, clear state
      setUser(null);
      setUserRole(null);
    }
  };

  const isTenant = () => {
    return userRole === "tenant";
  };

  const isLandlord = () => {
    return userRole === "landlord";
  };

  const isAdmin = () => {
    return userRole === "admin";
  };

  const value = {
    user,
    userRole,
    login,
    logout,
    isAuthenticated,
    isTenant,
    isLandlord,
    isAdmin,
    loading,
    refreshAuthState,
    // Expose auth service methods
    authService,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
