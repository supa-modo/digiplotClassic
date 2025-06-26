// Demo data following the database schema structure
// This data will be used for frontend development before backend integration

export const demoUsers = [
  // Landlord user
  {
    id: "landlord-1",
    role: "landlord",
    email: "landlord@example.com",
    full_name: "John Doe",
    phone: "+254712345678",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  // Tenant user
  {
    id: "tenant-1",
    role: "tenant",
    email: "tenant@example.com",
    first_name: "Alice",
    last_name: "Johnson",
    full_name: "Alice Johnson",
    phone: "+254723456789",
    emergency_contact_name: "Jane Johnson",
    emergency_contact_phone: "+254711223344",
    lease_start_date: "2024-01-15T00:00:00Z",
    lease_end_date: "2025-01-14T23:59:59Z",
    security_deposit: 50000,
    unit_id: "unit-1",
    status: "active",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
];

export const demoLandlords = [
  {
    id: "landlord-1",
    business_name: "Doe Properties Ltd",
    mpesa_short_code: "123456",
    mpesa_consumer_key: "demo_consumer_key",
    mpesa_consumer_secret: "demo_consumer_secret",
    mpesa_passkey: "demo_passkey",
    mpesa_env: "sandbox",
  },
];

export const demoTenants = [
  {
    id: "tenant-1",
    landlord_id: "landlord-1",
    unit_id: "unit-1",
    id_document_url: "/uploads/tenant-1-id.pdf",
  },
];

export const demoProperties = [
  {
    id: "property-1",
    landlord_id: "landlord-1",
    name: "Sunset Apartments",
    address: "123 Main Street, Westlands, Nairobi",
    description:
      "Modern apartments in prime location with excellent amenities and security.",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "property-2",
    landlord_id: "landlord-1",
    name: "Garden View Estate",
    address: "456 Garden Road, Karen, Nairobi",
    description:
      "Luxury estate with beautiful garden views and top-notch facilities.",
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
];

export const demoUnits = [
  {
    id: "unit-1",
    property_id: "property-1",
    name: "Unit 1A",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    size: 850,
    rent_amount: 25000,
    amenities: "WiFi, Parking, Security, Swimming Pool, Gym",
    status: "occupied",
    image_urls: [
      "/images/unit-1-living.jpg",
      "/images/unit-1-kitchen.jpg",
      "/images/unit-1-bedroom.jpg",
      "/images/unit-1-bathroom.jpg",
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "unit-2",
    property_id: "property-1",
    name: "Unit 1B",
    type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    size: 650,
    rent_amount: 23000,
    amenities: "WiFi, Parking, Security, Swimming Pool",
    status: "available",
    image_urls: ["/images/unit-2-living.jpg", "/images/unit-2-kitchen.jpg"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "unit-3",
    property_id: "property-2",
    name: "Villa A",
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    size: 1800,
    rent_amount: 45000,
    amenities: "WiFi, Parking, Security, Garden, Pool, Gym, Balcony",
    status: "available",
    image_urls: ["/images/unit-3-exterior.jpg", "/images/unit-3-living.jpg"],
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
];

export const demoPayments = [
  {
    id: "payment-1",
    tenant_id: "tenant-1",
    unit_id: "unit-1",
    amount: 25000,
    payment_date: "2024-01-15T10:30:00Z",
    mpesa_transaction_id: "ABC123DEF456",
    status: "successful",
    receipt_url: "/receipts/payment-1.pdf",
    notes: "Monthly rent payment for January 2024",
  },
  {
    id: "payment-2",
    tenant_id: "tenant-1",
    unit_id: "unit-1",
    amount: 25000,
    payment_date: "2024-02-15T09:15:00Z",
    mpesa_transaction_id: "DEF456GHI789",
    status: "successful",
    receipt_url: "/receipts/payment-2.pdf",
    notes: "Monthly rent payment for February 2024",
  },
  {
    id: "payment-3",
    tenant_id: "tenant-1",
    unit_id: "unit-1",
    amount: 25000,
    payment_date: "2024-03-12T14:20:00Z",
    mpesa_transaction_id: "GHI789JKL012",
    status: "pending",
    receipt_url: null,
    notes: "Monthly rent payment for March 2024",
  },
];

export const demoMaintenanceRequests = [
  {
    id: "maintenance-1",
    tenant_id: "tenant-1",
    unit_id: "unit-1",
    title: "Leaking Kitchen Faucet",
    description:
      "The kitchen faucet has been leaking continuously for the past two days. Water is dripping constantly even when turned off completely.",
    category: "plumbing",
    priority: "medium",
    image_url: "/uploads/maintenance-1.jpg",
    status: "pending",
    response_notes: null,
    created_at: "2024-03-20T08:30:00Z",
    updated_at: "2024-03-20T08:30:00Z",
  },
  {
    id: "maintenance-2",
    tenant_id: "tenant-1",
    unit_id: "unit-1",
    title: "Broken Window Lock",
    description:
      "The lock on the bedroom window is broken and won't close properly. This is a security concern.",
    category: "security",
    priority: "high",
    image_url: "/uploads/maintenance-2.jpg",
    status: "in_progress",
    response_notes: "Technician assigned and will visit tomorrow morning.",
    created_at: "2024-03-18T15:45:00Z",
    updated_at: "2024-03-19T09:00:00Z",
  },
  {
    id: "maintenance-3",
    tenant_id: "tenant-1",
    unit_id: "unit-1",
    title: "Air Conditioning Not Working",
    description:
      "The air conditioning unit in the living room stopped working yesterday. No cold air is coming out.",
    category: "hvac",
    priority: "high",
    image_url: null,
    status: "resolved",
    response_notes: "AC unit has been repaired and is now working properly.",
    created_at: "2024-03-10T12:00:00Z",
    updated_at: "2024-03-15T16:30:00Z",
  },
];

// Helper functions to get related data
export const getTenantById = (tenantId) => {
  const tenant = demoTenants.find((t) => t.id === tenantId);
  if (!tenant) return null;

  const user = demoUsers.find((u) => u.id === tenantId);
  return { ...tenant, ...user };
};

export const getLandlordById = (landlordId) => {
  const landlord = demoLandlords.find((l) => l.id === landlordId);
  if (!landlord) return null;

  const user = demoUsers.find((u) => u.id === landlordId);
  return { ...landlord, ...user };
};

export const getUnitById = (unitId) => {
  return demoUnits.find((u) => u.id === unitId);
};

export const getPropertyById = (propertyId) => {
  return demoProperties.find((p) => p.id === propertyId);
};

export const getUnitsForProperty = (propertyId) => {
  return demoUnits.filter((u) => u.property_id === propertyId);
};

export const getPropertiesForLandlord = (landlordId) => {
  return demoProperties.filter((p) => p.landlord_id === landlordId);
};

export const getTenantsForLandlord = (landlordId) => {
  return demoTenants
    .filter((t) => t.landlord_id === landlordId)
    .map((tenant) => {
      const user = demoUsers.find((u) => u.id === tenant.id);
      const unit = getUnitById(tenant.unit_id);
      const property = unit ? getPropertyById(unit.property_id) : null;
      return {
        ...tenant,
        ...user,
        unit: unit,
        property: property,
      };
    });
};

export const getPaymentsForTenant = (tenantId) => {
  return demoPayments.filter((p) => p.tenant_id === tenantId);
};

export const getTenantPayments = (tenantId) => {
  return demoPayments.filter((p) => p.tenant_id === tenantId);
};

export const getMaintenanceRequestsForTenant = (tenantId) => {
  return demoMaintenanceRequests.filter((m) => m.tenant_id === tenantId);
};

export const getMaintenanceRequestsForLandlord = (landlordId) => {
  const tenants = getTenantsForLandlord(landlordId);
  const tenantIds = tenants.map((t) => t.id);
  return demoMaintenanceRequests
    .filter((m) => tenantIds.includes(m.tenant_id))
    .map((request) => {
      const tenant = getTenantById(request.tenant_id);
      const unit = getUnitById(request.unit_id);
      const property = unit ? getPropertyById(unit.property_id) : null;
      return {
        ...request,
        tenant: tenant,
        unit: unit,
        property: property,
      };
    });
};

// Authentication helper
export const authenticateUser = (email, password, userType) => {
  // Simple demo authentication
  if (password !== "password") {
    throw new Error("Invalid credentials. Please try again.");
  }

  const user = demoUsers.find((u) => u.email === email && u.role === userType);
  if (!user) {
    throw new Error(`Invalid ${userType} credentials`);
  }

  // Get additional user data based on role
  if (userType === "landlord") {
    const landlord = demoLandlords.find((l) => l.id === user.id);
    return { ...user, ...landlord };
  } else if (userType === "tenant") {
    const tenant = demoTenants.find((t) => t.id === user.id);
    const unit = tenant ? getUnitById(tenant.unit_id) : null;
    const property = unit ? getPropertyById(unit.property_id) : null;
    return {
      ...user,
      ...tenant,
      unit: unit,
      property: property,
    };
  }

  return user;
};
