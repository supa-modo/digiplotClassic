import { createContext, useContext, useState, useEffect } from "react";
import { authenticateUser } from "../utils/demoData";

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
        const savedUser = localStorage.getItem("digiplot_user");
        const savedRole = localStorage.getItem("digiplot_role");

        if (savedUser && savedRole) {
          try {
            const parsedUser = JSON.parse(savedUser);
            console.log("AuthProvider: Restoring user session", {
              userId: parsedUser.id,
              role: savedRole,
            });
            setUser(parsedUser);
            setUserRole(savedRole);
          } catch (parseError) {
            console.error("Error parsing saved user data:", parseError);
            localStorage.removeItem("digiplot_user");
            localStorage.removeItem("digiplot_role");
          }
        }
      } catch (storageError) {
        console.error("Error accessing localStorage:", storageError);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, userType) => {
    try {
      const userData = authenticateUser(email, password, userType);

      console.log("AuthProvider: Login successful", {
        userId: userData.id,
        role: userType,
      });

      setUser(userData);
      setUserRole(userType);

      // Save to localStorage
      localStorage.setItem("digiplot_user", JSON.stringify(userData));
      localStorage.setItem("digiplot_role", userType);

      return { success: true, user: userData, role: userType };
    } catch (error) {
      console.error("AuthProvider: Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem("digiplot_user");
    localStorage.removeItem("digiplot_role");
  };

  const isAuthenticated = () => {
    const authenticated = user !== null && userRole !== null;
    // Only log on first load or when authentication status changes
    if (!authenticated && localStorage.getItem("digiplot_user")) {
      console.log(
        "AuthProvider: Auth mismatch - localStorage has data but user state is empty",
        {
          authenticated,
          user: !!user,
          userRole,
          hasLocalStorage: !!localStorage.getItem("digiplot_user"),
        }
      );
    }
    return authenticated;
  };

  // Add a function to manually refresh auth state
  const refreshAuthState = () => {
    console.log("AuthProvider: Manually refreshing auth state");
    const savedUser = localStorage.getItem("digiplot_user");
    const savedRole = localStorage.getItem("digiplot_role");

    if (savedUser && savedRole && (!user || !userRole)) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("AuthProvider: Refreshing missing auth state", {
          userId: parsedUser.id,
          role: savedRole,
        });
        setUser(parsedUser);
        setUserRole(savedRole);
      } catch (error) {
        console.error("Error refreshing auth state:", error);
      }
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
