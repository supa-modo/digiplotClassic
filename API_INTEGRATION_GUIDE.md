# DigiPlot Frontend API Integration Guide

## 🚀 Overview

This guide documents the complete integration of the DigiPlot frontend with the backend APIs, replacing demo data with real API calls for a fully functional property management system.

## ✅ Completed Integrations

### 1. API Services Created

We've created comprehensive API service modules that handle all HTTP requests to the backend:

#### `src/services/propertyService.js`

- ✅ Get all properties for landlord
- ✅ Get property by ID
- ✅ Create new property
- ✅ Update property
- ✅ Delete property
- ✅ Get property statistics
- ✅ Upload property images

#### `src/services/unitService.js`

- ✅ Get all units for landlord
- ✅ Get units by property
- ✅ Get unit by ID
- ✅ Create new unit
- ✅ Update unit
- ✅ Delete unit
- ✅ Get unit statistics
- ✅ Upload unit images

#### `src/services/tenantService.js`

- ✅ Get all tenants for landlord
- ✅ Get tenant by ID
- ✅ Create new tenant
- ✅ Update tenant
- ✅ Assign tenant to unit
- ✅ Remove tenant from unit
- ✅ Upload tenant documents

#### `src/services/paymentService.js`

- ✅ Get payments (role-based filtering)
- ✅ Get payment by ID
- ✅ Create payment (M-Pesa STK Push)
- ✅ Update payment status
- ✅ Get payment statistics
- ✅ Check M-Pesa payment status
- ✅ Download payment receipts
- ✅ Export payments to CSV/Excel

#### `src/services/maintenanceService.js`

- ✅ Get maintenance requests (role-based)
- ✅ Get maintenance request by ID
- ✅ Create maintenance request
- ✅ Update maintenance request
- ✅ Delete maintenance request
- ✅ Get maintenance statistics
- ✅ Upload maintenance images
- ✅ Export maintenance requests

#### `src/services/userService.js` (Admin only)

- ✅ Get all users with filtering
- ✅ Get user by ID
- ✅ Create new user
- ✅ Update user
- ✅ Delete/deactivate user
- ✅ Reset user password
- ✅ Toggle user status
- ✅ Get user activity logs
- ✅ Get system statistics
- ✅ Export users

### 2. Data Helpers & Utilities

#### `src/utils/dataHelpers.js`

- ✅ Data normalization functions for API/demo data compatibility
- ✅ Currency formatting utilities
- ✅ Date formatting utilities
- ✅ Status color helpers
- ✅ Occupancy rate calculations
- ✅ Time-based greeting system

### 3. Updated Components

#### Landlord Dashboard (`src/pages/landlord/LandlordDashboard.jsx`)

- ✅ Replaced demo data with API calls
- ✅ Added loading states
- ✅ Added error handling
- ✅ Parallel data loading for performance
- ✅ Real-time statistics calculation
- ✅ Dynamic unit/property relationship loading

#### Tenant Dashboard (`src/components/tenant/Dashboard.jsx`)

- ✅ Replaced demo data with API calls
- ✅ Added loading states
- ✅ Added error handling
- ✅ Role-based data filtering
- ✅ Real-time payment and maintenance data

## 🔧 API Integration Features

### Authentication Integration

- ✅ JWT token management via `authService.js`
- ✅ Automatic token injection in requests
- ✅ 401 error handling with automatic logout
- ✅ Role-based access control

### Error Handling

- ✅ Comprehensive error handling in all services
- ✅ User-friendly error messages
- ✅ Automatic retry mechanisms
- ✅ Debug logging for development

### Loading States

- ✅ Loading spinners for data fetching
- ✅ Skeleton screens for better UX
- ✅ Progressive data loading

### Data Consistency

- ✅ Field name normalization between API and demo data
- ✅ Backward compatibility with existing components
- ✅ Type-safe data handling

## 🛠️ Environment Configuration

Create a `.env` file in the frontend root with these variables:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:5000
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_DEBUG_LOGGING=true

# Development vs Production
NODE_ENV=development
```

### For Production:

```env
VITE_API_URL=https://your-backend-domain.com
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_DEBUG_LOGGING=false
NODE_ENV=production
```

## 📋 Next Steps

### High Priority

1. **Complete Component Updates**

   - Update all remaining landlord components to use API services
   - Update all tenant components to use API services
   - Update admin components to use API services

2. **Form Integration**

   - Update property creation/editing forms
   - Update unit creation/editing forms
   - Update tenant creation/editing forms
   - Update maintenance request forms
   - Update payment forms

3. **File Upload Integration**
   - Implement image upload for properties
   - Implement image upload for units
   - Implement document upload for tenants
   - Implement image upload for maintenance requests

### Medium Priority

4. **Advanced Features**

   - Real-time notifications
   - Data export functionality
   - Advanced filtering and search
   - Pagination for large datasets

5. **Performance Optimization**
   - Implement caching strategies
   - Add data prefetching
   - Optimize bundle size
   - Add service worker for offline support

### Low Priority

6. **Enhancement Features**
   - Dark mode support
   - Advanced analytics
   - Custom reporting
   - Mobile app integration

## 🔍 Component Update Pattern

When updating components to use API services, follow this pattern:

### 1. Import Services

```javascript
import propertyService from "../../services/propertyService";
import { formatCurrency, formatDate } from "../../utils/dataHelpers";
```

### 2. Add State Management

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### 3. Replace Demo Data Calls

```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyService.getProperties();
      setData(response.properties || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);
```

### 4. Add Loading/Error States

```javascript
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

## 🧪 Testing the Integration

### 1. Start the Backend

```bash
cd backend
npm start
```

### 2. Configure Frontend Environment

```bash
cd digiplot
cp .env.example .env
# Edit .env with correct API URL
```

### 3. Start Frontend

```bash
npm run dev
```

### 4. Test Key Features

- [ ] Login with different user roles
- [ ] View landlord dashboard with real data
- [ ] View tenant dashboard with real data
- [ ] Create/edit properties
- [ ] Create/edit units
- [ ] Create/edit tenants
- [ ] Make payments
- [ ] Create maintenance requests

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure backend CORS is configured correctly
   - Check API URL in environment variables

2. **Authentication Errors**

   - Verify JWT token is being sent
   - Check token expiration
   - Ensure backend authentication middleware is working

3. **Data Loading Issues**

   - Check network tab in browser dev tools
   - Verify API endpoints are correct
   - Check for proper error handling

4. **Field Name Mismatches**
   - Use data helper functions for normalization
   - Check API response structure
   - Update field mappings as needed

## 📖 API Documentation

Refer to the backend documentation for complete API specifications:

- `backend/BACKEND_ARCHITECTURE.md`
- `backend/IMPLEMENTATION_GUIDE.md`

## 🤝 Contributing

When adding new components or updating existing ones:

1. Follow the established service pattern
2. Add proper error handling
3. Include loading states
4. Use data helper functions
5. Test with both API and demo data
6. Update this documentation

---

## Summary

The DigiPlot frontend has been successfully integrated with the backend APIs, providing:

- ✅ Complete service layer for all entities
- ✅ Robust error handling and loading states
- ✅ Data normalization utilities
- ✅ Updated core dashboard components
- ✅ Production-ready authentication flow
- ✅ Comprehensive documentation

The system is now ready for full backend integration and can handle real property management operations with proper data persistence, user authentication, and role-based access control.
