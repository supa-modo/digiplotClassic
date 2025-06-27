# Admin Routing Setup Guide

## Overview

This guide shows how to integrate the admin interface into your existing React routing system.

## Required Route Additions

Add these routes to your main `App.jsx` or routing configuration:

### Import Admin Components

```javascript
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
```

### Admin Routes Structure

```javascript
// Admin routes - protected by role
{
  path: "/admin",
  element: (
    <ProtectedRoute requireRole="admin">
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <AdminDashboard />,
    },
    {
      path: "users",
      element: <AdminUsers />,
    },
    {
      path: "settings",
      element: <AdminSettings />,
    },
    // Add more admin routes as needed
    {
      path: "properties",
      element: <div>Admin Properties - Coming Soon</div>,
    },
    {
      path: "payments",
      element: <div>Admin Payments - Coming Soon</div>,
    },
    {
      path: "reports",
      element: <div>Admin Reports - Coming Soon</div>,
    },
    {
      path: "analytics",
      element: <div>Admin Analytics - Coming Soon</div>,
    },
    {
      path: "maintenance",
      element: <div>Admin Maintenance - Coming Soon</div>,
    },
    {
      path: "logs",
      element: <div>System Logs - Coming Soon</div>,
    },
    {
      path: "permissions",
      element: <div>Roles & Permissions - Coming Soon</div>,
    },
    {
      path: "units",
      element: <div>Admin Units - Coming Soon</div>,
    },
  ],
}
```

### Complete App.jsx Example

```javascript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Tenant Components
import TenantLayout from "./components/tenant/TenantLayout";
import TenantDashboard from "./pages/tenant/TenantDashboard";
// ... other tenant imports

// Landlord Components
import LandlordLayout from "./components/landlord/LandlordLayout";
import LandlordDashboard from "./pages/landlord/LandlordDashboard";
// ... other landlord imports

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Tenant routes */}
          <Route
            path="/tenant"
            element={
              <ProtectedRoute requireRole="tenant">
                <TenantLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TenantDashboard />} />
            {/* Add other tenant routes */}
          </Route>

          {/* Landlord routes */}
          <Route
            path="/landlord"
            element={
              <ProtectedRoute requireRole="landlord">
                <LandlordLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<LandlordDashboard />} />
            {/* Add other landlord routes */}
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            {/* Add placeholder routes for future features */}
            <Route
              path="properties"
              element={
                <div className="p-6">
                  <h1>Properties Management - Coming Soon</h1>
                </div>
              }
            />
            <Route
              path="payments"
              element={
                <div className="p-6">
                  <h1>Payment Management - Coming Soon</h1>
                </div>
              }
            />
            <Route
              path="reports"
              element={
                <div className="p-6">
                  <h1>Reports - Coming Soon</h1>
                </div>
              }
            />
            <Route
              path="analytics"
              element={
                <div className="p-6">
                  <h1>Analytics - Coming Soon</h1>
                </div>
              }
            />
            <Route
              path="maintenance"
              element={
                <div className="p-6">
                  <h1>Maintenance Management - Coming Soon</h1>
                </div>
              }
            />
            <Route
              path="logs"
              element={
                <div className="p-6">
                  <h1>System Logs - Coming Soon</h1>
                </div>
              }
            />
            <Route
              path="permissions"
              element={
                <div className="p-6">
                  <h1>Roles & Permissions - Coming Soon</h1>
                </div>
              }
            />
            <Route
              path="units"
              element={
                <div className="p-6">
                  <h1>Unit Management - Coming Soon</h1>
                </div>
              }
            />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 route */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

### ProtectedRoute Component

If you don't have a ProtectedRoute component yet, create one:

```javascript
// src/components/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requireRole = null }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && userRole !== requireRole) {
    // Redirect to appropriate dashboard based on actual role
    if (userRole === "tenant") return <Navigate to="/tenant" replace />;
    if (userRole === "landlord") return <Navigate to="/landlord" replace />;
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

## Testing the Admin Interface

1. **Start your backend and frontend servers**
2. **Login with admin credentials:**
   - Email: `admin@digiplot.com`
   - Password: `admin123`
3. **You should be redirected to `/admin`**
4. **Test the following:**
   - Dashboard loads with statistics
   - User management page works
   - Create/edit/delete users
   - Settings page loads
   - Navigation between admin pages

## Admin Features Available

✅ **Completed:**

- Admin layout with navigation
- User dashboard with statistics
- Complete user CRUD operations
- User search and filtering
- Pagination
- User roles and status management
- Password reset functionality
- Responsive design
- Error handling

🚧 **Placeholders (Future Development):**

- Property management
- Financial reports
- System analytics
- Maintenance management
- System logs
- Roles & permissions editor
- Unit management

## Security Notes

1. **Role-based access:** Only users with `admin` role can access admin routes
2. **API authentication:** All admin API calls require valid JWT token
3. **Protected routes:** Admin routes are wrapped with role protection
4. **Session management:** Automatic logout on token expiration

## Next Steps

1. Add the routing code to your main App.jsx
2. Test the admin interface
3. Customize the placeholder pages as needed
4. Add additional admin features based on requirements
