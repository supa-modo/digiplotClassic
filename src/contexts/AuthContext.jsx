import { createContext, useContext, useState, useEffect } from "react";
import { authenticateUser } from "../utils/demoData";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
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
    const savedUser = localStorage.getItem("digiplot_user");
    const savedRole = localStorage.getItem("digiplot_role");

    if (savedUser && savedRole) {
      try {
        setUser(JSON.parse(savedUser));
        setUserRole(savedRole);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("digiplot_user");
        localStorage.removeItem("digiplot_role");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    try {
      const userData = authenticateUser(email, password, userType);

      setUser(userData);
      setUserRole(userType);

      // Save to localStorage
      localStorage.setItem("digiplot_user", JSON.stringify(userData));
      localStorage.setItem("digiplot_role", userType);

      return { success: true, user: userData, role: userType };
    } catch (error) {
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
    return user !== null && userRole !== null;
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
