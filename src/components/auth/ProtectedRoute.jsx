import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  children,
  requiredRole = null,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, userRole, loading, user, refreshAuthState } =
    useAuth();
  const location = useLocation();

  // Get authentication status
  const isAuth = isAuthenticated();

  // Handle auth state refresh when localStorage data exists but user state is missing
  React.useEffect(() => {
    // Only try to refresh if we're not loading and don't have user state
    if (!loading && !isAuth) {
      const savedUser = localStorage.getItem("digiplot_user");
      const savedRole = localStorage.getItem("digiplot_role");

      if (savedUser && savedRole) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "ProtectedRoute: Found localStorage but missing auth state, refreshing"
          );
        }
        refreshAuthState();
      }
    }
  }, [loading, isAuth, refreshAuthState]);

  // Log auth issues in development only
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development" && !isAuth && !loading) {
      const hasLocalStorage = !!localStorage.getItem("digiplot_user");
      if (hasLocalStorage) {
        console.log("ProtectedRoute: Auth issue detected", {
          path: location.pathname,
          loading,
          authenticated: isAuth,
          userRole,
          requiredRole,
          userId: user?.id,
          hasLocalStorage,
        });
      }
    }
  }, [isAuth, loading, location.pathname, userRole, requiredRole, user?.id]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-plot">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-plot mx-auto mb-4"></div>
          <p className="text-secondary-plot">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the current location
  if (!isAuth) {
    if (process.env.NODE_ENV === "development") {
      console.log("ProtectedRoute: Not authenticated, redirecting to login", {
        path: location.pathname,
        hasLocalStorage: !!localStorage.getItem("digiplot_user"),
      });
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated but doesn't have the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on actual user role
    const roleRedirectMap = {
      tenant: "/tenant",
      landlord: "/landlord",
      admin: "/admin",
    };

    const redirectPath = roleRedirectMap[userRole] || "/login";
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated and has correct role (or no role required), render the children
  return children;
};

export default ProtectedRoute;
