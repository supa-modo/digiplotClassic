# DigiPlot Frontend Authentication Setup

## Overview

The frontend has been updated to connect to the real backend authentication service instead of using demo data.

## New Files Added

### 1. API Configuration (`src/config/apiConfig.js`)

- Axios client configuration with authentication interceptors
- Automatic token management
- Error handling for 401 responses
- Debug logging support

### 2. Authentication Service (`src/services/authService.js`)

- Complete authentication API integration
- Login with 2FA support
- Registration
- Profile management
- Password reset functionality
- 2FA setup and management

### 3. Registration Component (`src/components/auth/Register.jsx`)

- User registration form
- Role selection (tenant/landlord)
- Form validation
- Integration with auth service

## Updated Files

### 1. AuthContext (`src/contexts/AuthContext.jsx`)

- Integrated with real authentication service
- Added 2FA support
- Improved error handling
- Better state management

### 2. Login Component (`src/components/auth/Login.jsx`)

- Added 2FA input field
- Enhanced error handling
- Role-based navigation
- Integration with auth service

## Environment Configuration

Create a `.env` file in the digiplot directory with:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Development Features
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_DEBUG_LOGGING=true
```

## Dependencies Added

- `axios` - HTTP client for API calls

## Features Available

### Authentication Features

1. **Login/Logout**

   - Email and password authentication
   - Role-based login (tenant, landlord, admin)
   - Automatic token management

2. **Two-Factor Authentication (2FA)**

   - TOTP-based 2FA support
   - QR code setup
   - Backup codes
   - Enable/disable 2FA

3. **Registration**

   - User registration with role selection
   - Form validation
   - Automatic login after registration

4. **Password Management**

   - Password reset via email
   - Change password
   - Secure token validation

5. **Profile Management**
   - Get user profile
   - Update profile information

### Security Features

1. **Token Management**

   - JWT tokens stored securely
   - Automatic token refresh
   - Token expiration handling

2. **Role-Based Access**

   - Tenant, landlord, and admin roles
   - Role verification
   - Protected routes

3. **Error Handling**
   - Graceful error handling
   - User-friendly error messages
   - Automatic logout on token expiration

## API Endpoints Used

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Password Reset

- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Two-Factor Authentication

- `POST /api/auth/2fa/setup` - Get 2FA QR code
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/disable` - Disable 2FA
- `GET /api/auth/2fa/status` - Get 2FA status

## Usage Examples

### Login with 2FA

```javascript
import { useAuth } from "../contexts/AuthContext";

const { login } = useAuth();

// Regular login
const result = await login(email, password, userType);

// Login with 2FA
const result = await login(email, password, userType, twoFactorToken);
```

### Access Auth Service

```javascript
import { useAuth } from "../contexts/AuthContext";

const { authService } = useAuth();

// Get current user
const user = authService.getCurrentUser();

// Check role
const isTenant = authService.isTenant();
const isLandlord = authService.isLandlord();
const isAdmin = authService.isAdmin();
```

## Testing the Integration

1. **Start Backend**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**

   ```bash
   cd digiplot
   npm run dev
   ```

3. **Test Registration**

   - Go to registration page
   - Create a new account
   - Verify automatic login

4. **Test Login**

   - Use created credentials
   - Test different user roles
   - Verify navigation to correct dashboard

5. **Test 2FA (if enabled)**
   - Setup 2FA in user settings
   - Logout and login again
   - Enter 2FA code when prompted

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure backend CORS is configured for frontend URL
   - Check that `VITE_API_URL` matches backend URL

2. **Network Errors**

   - Verify backend is running on correct port
   - Check firewall settings

3. **Authentication Errors**

   - Check token storage in browser localStorage
   - Verify API endpoints are working with Postman

4. **Environment Variables**
   - Ensure `.env` file is in correct location
   - Variables must start with `VITE_` prefix

### Debug Mode

Enable debug logging in `.env`:

```env
VITE_ENABLE_DEBUG_LOGGING=true
```

This will show detailed API request/response logs in browser console.

## Admin Interface

### Admin Layout and Components
The admin interface includes a comprehensive user management system:

#### New Admin Files:
- `src/components/admin/AdminLayout.jsx` - Main admin layout with navigation
- `src/components/admin/UserModal.jsx` - User creation/editing modal
- `src/pages/admin/AdminDashboard.jsx` - Admin dashboard with stats
- `src/pages/admin/AdminUsers.jsx` - User management interface
- `src/pages/admin/AdminSettings.jsx` - System settings
- `src/services/userService.js` - User CRUD operations service

#### Admin Features:
1. **User Management**
   - Create, read, update, delete users
   - Role-based access control
   - User search and filtering
   - Pagination support
   - Bulk operations

2. **Dashboard**
   - User statistics overview
   - Quick action buttons
   - Recent users list
   - System status indicators

3. **Settings**
   - System configuration
   - Email settings
   - Security settings
   - Notification preferences

#### Admin Navigation:
- Dashboard
- User Management
- Properties (placeholder)
- Financial reports (placeholder)
- System settings

#### Admin API Endpoints Used:
- `GET /api/users` - List users with pagination
- `GET /api/users/stats` - User statistics
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/reactivate` - Reactivate user
- `POST /api/users/:id/reset-password` - Reset password

## Next Steps

1. Add admin routes to main App.jsx routing
2. Add forgot password component
3. Add 2FA setup component in user settings
4. Add profile management components
5. Implement protected routes for admin access
6. Add property management for admin
7. Add financial reports interface
8. Add system logs viewer
9. Add bulk user operations
10. Add user import/export functionality
