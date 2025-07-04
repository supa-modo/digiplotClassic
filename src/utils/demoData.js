// Demo data following the database schema structure
// This data will be used for frontend development before backend integration

export const demoUsers = [
  // Landlord user
  {
    id: "landlord-1",
    role: "landlord",
    email: "landlord@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+254712345678",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  // Active Tenant users (without lease info - that's in separate leases array)
  {
    id: "a8ae45ad-2111-412b-ad8c-0a048e0e5466",
    role: "tenant",
    email: "tenant@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    phone: "+254723456789",
    emergencyContactName: "Jane Johnson",
    emergencyContactPhone: "+254711223344",
    status: "active",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  // Previous Tenant user
  {
    id: "tenant-2",
    role: "tenant",
    email: "tenant2@example.com",
    firstName: "Michael",
    lastName: "Smith",
    phone: "+254734567890",
    emergencyContactName: "Sarah Smith",
    emergencyContactPhone: "+254712334455",
    status: "inactive",
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2023-12-31T00:00:00Z",
  },
  // Second Active Tenant user
  {
    id: "tenant-3",
    role: "tenant",
    email: "tenant3@example.com",
    firstName: "Sarah",
    lastName: "Wilson",
    phone: "+254745678901",
    emergencyContactName: "David Wilson",
    emergencyContactPhone: "+254723445566",
    status: "active",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  // Additional tenant
  {
    id: "tenant-4",
    role: "tenant",
    email: "tenant4@example.com",
    firstName: "James",
    lastName: "Brown",
    phone: "+254756789012",
    emergencyContactName: "Mary Brown",
    emergencyContactPhone: "+254734556677",
    status: "active",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
];

// Demo lease data - tracks tenant-unit relationships with history
export const demoLeases = [
  // Current active lease for unit-1
  {
    id: "lease-1",
    tenantId: "a8ae45ad-2111-412b-ad8c-0a048e0e5466",
    unitId: "unit-1",
    landlordId: "landlord-1",
    startDate: "2024-01-15",
    endDate: "2025-01-14",
    monthlyRent: 25000,
    securityDeposit: 50000,
    status: "active",
    moveInDate: "2024-01-15",
    notes: "First lease for this tenant",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  // Previous lease for unit-1 (terminated)
  {
    id: "lease-2",
    tenantId: "tenant-2",
    unitId: "unit-1",
    landlordId: "landlord-1",
    startDate: "2023-06-01",
    endDate: "2023-12-31",
    monthlyRent: 23000,
    securityDeposit: 46000,
    status: "terminated",
    moveInDate: "2023-06-01",
    moveOutDate: "2023-12-31",
    terminationReason: "Lease completed naturally",
    notes: "Good tenant, no issues during tenancy",
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2023-12-31T00:00:00Z",
  },
  // Current active lease for unit-3
  {
    id: "lease-3",
    tenantId: "tenant-3",
    unitId: "unit-3",
    landlordId: "landlord-1",
    startDate: "2024-02-01",
    endDate: "2025-01-31",
    monthlyRent: 45000,
    securityDeposit: 90000,
    status: "active",
    moveInDate: "2024-02-01",
    notes: "Family with children, requested quiet environment",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  // Current active lease for unit-5
  {
    id: "lease-4",
    tenantId: "tenant-4",
    unitId: "unit-5",
    landlordId: "landlord-1",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    monthlyRent: 35000,
    securityDeposit: 70000,
    status: "active",
    moveInDate: "2024-03-01",
    notes: "Professional tenant, works in tech industry",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
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
    id: "a8ae45ad-2111-412b-ad8c-0a048e0e5466",
    landlord_id: "landlord-1",
    unit_id: "unit-1",
    id_document_url: "/uploads/a8ae45ad-2111-412b-ad8c-0a048e0e5466-id.pdf",
  },
  {
    id: "tenant-2",
    landlord_id: "landlord-1",
    unit_id: "unit-1",
    id_document_url: "/uploads/tenant-2-id.pdf",
  },
  {
    id: "tenant-3",
    landlord_id: "landlord-1",
    unit_id: "unit-3",
    id_document_url: "/uploads/tenant-3-id.pdf",
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
    image_urls: ["/appartment-3.png"],
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
    image_urls: ["/appartment-2.png", "/appartment-3.png", "/appartment-1.png"],
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "property-3",
    landlord_id: "landlord-1",
    name: "City Center Plaza",
    address: "789 Business Avenue, CBD, Nairobi",
    description: "Commercial and residential complex in the heart of the city.",
    image_urls: [], // No images - will show default icon
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
];

export const demoUnits = [
  {
    id: "unit-1",
    property_id: "property-1",
    name: "Unit 1A",
    description:
      "Spacious 2-bedroom apartment with modern finishes and great city views.",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 850,
    rent_amount: 25000,
    amenities: "WiFi, Parking, Security, Swimming Pool, Gym",
    status: "occupied",
    image_urls: [
      "/appartment-1.png",
      "/appartment-2.png",
      "/appartment-3.png",
      "/appartment-4.png",
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "unit-2",
    property_id: "property-1",
    name: "Unit 1B",
    description: "Cozy 1-bedroom apartment perfect for young professionals.",
    type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    rent_amount: 23000,
    amenities: "WiFi, Parking, Security, Swimming Pool",
    status: "vacant",
    image_urls: [
      "/appartment-1.png",
      "/appartment-2.png",
      "/appartment-3.png",
      "/appartment-4.png",
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "unit-3",
    property_id: "property-2",
    name: "Villa A",
    description:
      "Luxurious 4-bedroom villa with private garden and pool access.",
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 1800,
    rent_amount: 45000,
    amenities: "WiFi, Parking, Security, Garden, Pool, Gym, Balcony",
    status: "occupied",
    image_urls: [
      "/appartment-1.png",
      "/appartment-2.png",
      "/appartment-3.png",
      "/appartment-4.png",
    ],
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "unit-4",
    property_id: "property-2",
    name: "Villa B",
    description:
      "Elegant 3-bedroom villa with modern amenities and garden view.",
    type: "villa",
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    rent_amount: 38000,
    amenities: "WiFi, Parking, Security, Garden, Pool, Balcony",
    status: "maintenance",
    image_urls: [
      "/appartment-1.png",
      "/appartment-2.png",
      "/appartment-3.png",
      "/appartment-4.png",
    ],
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-03-15T00:00:00Z",
  },
  {
    id: "unit-5",
    property_id: "property-3",
    name: "Office Suite 201",
    description: "Professional office space with excellent city views.",
    type: "office",
    bedrooms: 0,
    bathrooms: 1,
    area: 600,
    rent_amount: 35000,
    amenities: "WiFi, Parking, Security, Conference Room, Reception",
    status: "occupied",
    image_urls: [
      "/appartment-1.png",
      "/appartment-2.png",
      "/appartment-3.png",
      "/appartment-4.png",
    ],
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
];

export const demoPayments = [
  // Payments for a8ae45ad-2111-412b-ad8c-0a048e0e5466 (current tenant of unit-1) - lease-1
  {
    id: "payment-1",
    tenantId: "a8ae45ad-2111-412b-ad8c-0a048e0e5466",
    unitId: "unit-1",
    leaseId: "lease-1",
    amount: 25000,
    paymentDate: "2024-01-15T10:30:00Z",
    mpesaTransactionId: "ABC123DEF456",
    status: "successful",
    receiptUrl: "/receipts/payment-1.pdf",
    notes: "Monthly rent payment for January 2024",
  },
  {
    id: "payment-2",
    tenantId: "a8ae45ad-2111-412b-ad8c-0a048e0e5466",
    unitId: "unit-1",
    leaseId: "lease-1",
    amount: 25000,
    paymentDate: "2024-02-15T09:15:00Z",
    mpesaTransactionId: "DEF456GHI789",
    status: "successful",
    receiptUrl: "/receipts/payment-2.pdf",
    notes: "Monthly rent payment for February 2024",
  },
  {
    id: "payment-3",
    tenantId: "a8ae45ad-2111-412b-ad8c-0a048e0e5466",
    unitId: "unit-1",
    leaseId: "lease-1",
    amount: 25000,
    paymentDate: "2024-03-15T14:20:00Z",
    mpesaTransactionId: "GHI789JKL012",
    status: "successful",
    receiptUrl: "/receipts/payment-3.pdf",
    notes: "Monthly rent payment for March 2024",
  },
  // Historical payments for previous tenant (tenant-2) of unit-1 - lease-2
  {
    id: "payment-4",
    tenantId: "tenant-2",
    unitId: "unit-1",
    leaseId: "lease-2",
    amount: 23000,
    paymentDate: "2023-06-15T10:30:00Z",
    mpesaTransactionId: "OLD123ABC456",
    status: "successful",
    receiptUrl: "/receipts/payment-4.pdf",
    notes: "Monthly rent payment for June 2023",
  },
  {
    id: "payment-5",
    tenantId: "tenant-2",
    unitId: "unit-1",
    leaseId: "lease-2",
    amount: 23000,
    paymentDate: "2023-07-15T10:30:00Z",
    mpesaTransactionId: "OLD456DEF789",
    status: "successful",
    receiptUrl: "/receipts/payment-5.pdf",
    notes: "Monthly rent payment for July 2023",
  },
  {
    id: "payment-6",
    tenantId: "tenant-2",
    unitId: "unit-1",
    leaseId: "lease-2",
    amount: 23000,
    paymentDate: "2023-12-15T10:30:00Z",
    mpesaTransactionId: "OLD789GHI012",
    status: "successful",
    receiptUrl: "/receipts/payment-6.pdf",
    notes: "Monthly rent payment for December 2023",
  },
  // Payments for tenant-3 (current tenant of unit-3) - lease-3
  {
    id: "payment-7",
    tenantId: "tenant-3",
    unitId: "unit-3",
    leaseId: "lease-3",
    amount: 45000,
    paymentDate: "2024-02-15T10:30:00Z",
    mpesa_transaction_id: "VIL123ABC456",
    status: "successful",
    receipt_url: "/receipts/payment-7.pdf",
    notes: "Monthly rent payment for February 2024",
  },
  {
    id: "payment-8",
    tenantId: "tenant-3",
    unitId: "unit-3",
    leaseId: "lease-3",
    amount: 45000,
    paymentDate: "2024-03-15T10:30:00Z",
    mpesaTransactionId: "VIL456DEF789",
    status: "successful",
    receiptUrl: "/receipts/payment-8.pdf",
    notes: "Monthly rent payment for March 2024",
  },
  // Payments for tenant-4 (current tenant of unit-5) - lease-4
  {
    id: "payment-9",
    tenantId: "tenant-4",
    unitId: "unit-5",
    leaseId: "lease-4",
    amount: 35000,
    paymentDate: "2024-03-15T10:30:00Z",
    mpesaTransactionId: "OFF123ABC456",
    status: "successful",
    receiptUrl: "/receipts/payment-9.pdf",
    notes: "Monthly rent payment for March 2024",
  },
];

export const demoMaintenanceRequests = [
  // Maintenance requests for unit-1
  {
    id: "maintenance-1",
    tenant_id: "a8ae45ad-2111-412b-ad8c-0a048e0e5466",
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
    tenant_id: "a8ae45ad-2111-412b-ad8c-0a048e0e5466",
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
    tenant_id: "a8ae45ad-2111-412b-ad8c-0a048e0e5466",
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
  // Maintenance requests for unit-3
  {
    id: "maintenance-4",
    tenant_id: "tenant-3",
    unit_id: "unit-3",
    title: "Pool Filter Issue",
    description:
      "The pool filter seems to be malfunctioning. Water is not as clear as usual.",
    category: "pool",
    priority: "low",
    image_url: "/uploads/maintenance-4.jpg",
    status: "pending",
    response_notes: null,
    created_at: "2024-03-22T10:15:00Z",
    updated_at: "2024-03-22T10:15:00Z",
  },
  // Historical maintenance request for unit-1 (from previous tenant)
  {
    id: "maintenance-5",
    tenant_id: "tenant-2",
    unit_id: "unit-1",
    title: "Bathroom Tiles Repair",
    description: "Some bathroom tiles are loose and need to be fixed.",
    category: "general",
    priority: "medium",
    image_url: null,
    status: "resolved",
    response_notes: "Tiles have been repaired and grouted properly.",
    created_at: "2023-08-15T14:20:00Z",
    updated_at: "2023-08-20T16:30:00Z",
  },
];

// Create a consolidated data object for easier access
export const demoData = {
  users: demoUsers,
  landlords: demoLandlords,
  tenants: demoTenants,
  properties: demoProperties,
  units: demoUnits,
  leases: demoLeases,
  payments: demoPayments,
  maintenanceRequests: demoMaintenanceRequests,
};

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
  // Get all leases for the landlord
  const landlordLeases = demoLeases.filter((l) => l.landlordId === landlordId);

  // Create a map of tenants with their current lease info
  const tenantLeaseMap = new Map();

  landlordLeases.forEach((lease) => {
    const existing = tenantLeaseMap.get(lease.tenantId);
    if (!existing || lease.status === "active") {
      tenantLeaseMap.set(lease.tenantId, lease);
    }
  });

  // Convert map to array and enrich with user data
  return Array.from(tenantLeaseMap.values()).map((lease) => {
    const user = demoUsers.find((u) => u.id === lease.tenantId);
    const unit = getUnitById(lease.unitId);
    const property = unit ? getPropertyById(unit.property_id) : null;

    return {
      id: lease.tenantId,
      first_name: user?.firstName,
      last_name: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      status: lease.status,
      lease: lease,
      unit: unit,
      property: property,
    };
  });
};

// New helper functions for lease data
export const getLeaseById = (leaseId) => {
  return demoLeases.find((l) => l.id === leaseId);
};

export const getCurrentLeaseForUnit = (unitId) => {
  return demoLeases.find((l) => l.unitId === unitId && l.status === "active");
};

export const getLeaseHistoryForUnit = (unitId) => {
  return demoLeases
    .filter((l) => l.unitId === unitId)
    .map((lease) => {
      const tenant = demoUsers.find((u) => u.id === lease.tenantId);
      const unit = getUnitById(lease.unitId);
      const property = unit ? getPropertyById(unit.property_id) : null;
      const payments = demoPayments.filter((p) => p.leaseId === lease.id);

      return {
        ...lease,
        tenant: tenant,
        unit: unit,
        property: property,
        payments: payments,
      };
    })
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
};

export const getLeasesForLandlord = (landlordId) => {
  return demoLeases
    .filter((l) => l.landlordId === landlordId)
    .map((lease) => {
      const tenant = demoUsers.find((u) => u.id === lease.tenantId);
      const unit = getUnitById(lease.unitId);
      const property = unit ? getPropertyById(unit.property_id) : null;

      return {
        ...lease,
        tenant: tenant,
        unit: unit,
        property: property,
      };
    })
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
};

export const getCurrentLeaseForTenant = (tenantId) => {
  const activeLease = demoLeases.find(
    (l) => l.tenantId === tenantId && l.status === "active"
  );
  if (!activeLease) return null;

  const unit = getUnitById(activeLease.unitId);
  const property = unit ? getPropertyById(unit.property_id) : null;

  return {
    ...activeLease,
    unit: unit,
    property: property,
  };
};

export const getPaymentsForTenant = (tenantId) => {
  return demoPayments.filter((p) => p.tenantId === tenantId);
};

export const getTenantPayments = (tenantId) => {
  return demoPayments.filter((p) => p.tenantId === tenantId);
};

export const getPaymentsForUnit = (unitId) => {
  return demoPayments
    .filter((p) => p.unitId === unitId)
    .map((payment) => {
      const tenant = demoUsers.find((u) => u.id === payment.tenantId);
      const lease = demoLeases.find((l) => l.id === payment.leaseId);

      return {
        ...payment,
        tenant: tenant,
        lease: lease,
      };
    })
    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
};

export const getPaymentsForLease = (leaseId) => {
  return demoPayments.filter((p) => p.leaseId === leaseId);
};

export const getUnitStatistics = (unitId) => {
  const leaseHistory = getLeaseHistoryForUnit(unitId);
  const payments = getPaymentsForUnit(unitId);

  const totalRevenue = payments.reduce((sum, payment) => {
    return payment.status === "successful" ? sum + payment.amount : sum;
  }, 0);

  const totalLeases = leaseHistory.length;
  const activeLease = leaseHistory.find((l) => l.status === "active");

  // Calculate average lease duration
  const completedLeases = leaseHistory.filter(
    (l) => l.status === "terminated" || l.status === "expired"
  );
  const averageLeaseDuration =
    completedLeases.length > 0
      ? completedLeases.reduce((sum, lease) => {
          const start = new Date(lease.startDate);
          const end = new Date(lease.moveOutDate || lease.endDate);
          return sum + (end - start) / (1000 * 60 * 60 * 24); // days
        }, 0) / completedLeases.length
      : 0;

  // Calculate occupancy rate (simplified)
  const occupancyRate = totalLeases > 0 ? (activeLease ? 100 : 0) : 0;

  return {
    totalRevenue,
    totalLeases,
    averageLeaseDuration: Math.round(averageLeaseDuration),
    occupancyRate,
    currentLease: activeLease,
  };
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
