import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  children,
  requiredRole = null,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

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
  if (!isAuthenticated()) {
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
