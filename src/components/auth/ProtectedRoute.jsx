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

  // Only log when there's an issue or on important events
  const isAuth = isAuthenticated();
  if (!isAuth && localStorage.getItem("digiplot_user")) {
    console.log("ProtectedRoute: Auth issue detected", {
      path: location.pathname,
      loading,
      authenticated: isAuth,
      userRole,
      requiredRole,
      userId: user?.id,
      hasLocalStorage: !!localStorage.getItem("digiplot_user"),
    });
  }

  // If we have localStorage data but no user state, try to refresh
  React.useEffect(() => {
    const savedUser = localStorage.getItem("digiplot_user");
    const savedRole = localStorage.getItem("digiplot_role");

    if (savedUser && savedRole && !loading && (!user || !userRole)) {
      console.log(
        "ProtectedRoute: Found localStorage but missing auth state, refreshing"
      );
      refreshAuthState();
    }
  }, [location.pathname, user, userRole, loading, refreshAuthState]);

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
    console.log("ProtectedRoute: Not authenticated, redirecting to login", {
      path: location.pathname,
      hasLocalStorage: !!localStorage.getItem("digiplot_user"),
    });
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated but doesn't have the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on actual user role
    if (userRole === "tenant") {
      return <Navigate to="/tenant" replace />;
    } else if (userRole === "landlord") {
      return <Navigate to="/landlord" replace />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // If authenticated and has correct role (or no role required), render the children
  return children;
};

export default ProtectedRoute;
