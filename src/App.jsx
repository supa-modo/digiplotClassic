import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantUnitInfo from "./pages/tenant/TenantUnitInfo";
import TenantPayments from "./pages/tenant/TenantPayments";
import TenantMaintenance from "./pages/tenant/TenantMaintenance";
import TenantProfile from "./pages/tenant/TenantProfile";
import LandlordDashboard from "./pages/landlord/LandlordDashboard";
import LandlordProperties from "./pages/landlord/LandlordProperties";
import LandlordUnits from "./pages/landlord/LandlordUnits";
import LandlordUnitDetails from "./pages/landlord/LandlordUnitDetails";
import LandlordTenants from "./pages/landlord/LandlordTenants";
import LandlordPayments from "./pages/landlord/LandlordPayments";
import LandlordMaintenance from "./pages/landlord/LandlordMaintenance";
import LandlordReports from "./pages/landlord/LandlordReports";
import LandlordSettings from "./pages/landlord/LandlordSettings";
import "./index.css";
import Register from "./components/auth/Register";

function App() {
  return (
    <ErrorBoundary fallbackMessage="Failed to initialize application. Please refresh the page.">
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

              {/* Protected Routes */}
              <Route
                path="/tenant"
                element={
                  <ProtectedRoute requiredRole="tenant">
                    <TenantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/unit"
                element={
                  <ProtectedRoute requiredRole="tenant">
                    <TenantUnitInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/payments"
                element={
                  <ProtectedRoute requiredRole="tenant">
                    <TenantPayments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/maintenance"
                element={
                  <ProtectedRoute requiredRole="tenant">
                    <TenantMaintenance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/profile"
                element={
                  <ProtectedRoute requiredRole="tenant">
                    <TenantProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/landlord"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/properties"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordProperties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/properties/:propertyId/units"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordUnits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/units/:unitId"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordUnitDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/tenants"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordTenants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/payments"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordPayments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/maintenance"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordMaintenance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/reports"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/settings"
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordSettings />
                  </ProtectedRoute>
                }
              />

              {/* <Route path="/register" element={<Register />} /> */}

              {/* <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/properties"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminProperties />
                  </ProtectedRoute>
                }
              /> */}

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
