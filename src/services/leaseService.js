import apiConfig from "../config/apiConfig";
import {
  demoLeases,
  demoUsers,
  getCurrentLeaseForUnit,
  getLeaseHistoryForUnit,
  getLeasesForLandlord,
  getCurrentLeaseForTenant,
  getUnitStatistics,
  getPaymentsForUnit,
  getMaintenanceRequestsForLandlord,
  getUnitById,
  getPropertyById,
} from "../utils/demoData";

class LeaseService {
  constructor() {
    this.useDemo = true; // Toggle this to switch between demo and API
  }

  // Get all leases for a landlord
  async getLeasesForLandlord(landlordId, filters = {}) {
    if (this.useDemo) {
      try {
        let leases = getLeasesForLandlord(landlordId);

        // Apply filters
        if (filters.status) {
          leases = leases.filter((lease) => lease.status === filters.status);
        }

        if (filters.unitId) {
          leases = leases.filter((lease) => lease.unitId === filters.unitId);
        }

        if (filters.propertyId) {
          leases = leases.filter(
            (lease) => lease.unit?.property_id === filters.propertyId
          );
        }

        // Apply pagination
        const limit = filters.limit || 20;
        const offset = filters.offset || 0;
        const paginatedLeases = leases.slice(offset, offset + limit);

        return {
          success: true,
          data: {
            leases: paginatedLeases,
            total: leases.length,
            limit,
            offset,
          },
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }

    try {
      const response = await fetch(`${apiConfig.baseURL}/leases`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to fetch leases",
      };
    }
  }

  // Get unit lease history with statistics
  async getUnitLeaseHistory(unitId) {
    if (this.useDemo) {
      try {
        const unit = getUnitById(unitId);
        if (!unit) {
          throw new Error("Unit not found");
        }

        const property = getPropertyById(unit.property_id);
        const currentLease = getCurrentLeaseForUnit(unitId);
        const leaseHistory = getLeaseHistoryForUnit(unitId);
        const statistics = getUnitStatistics(unitId);

        return {
          success: true,
          data: {
            unit: { ...unit, property },
            currentLease,
            leaseHistory,
            statistics,
          },
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }

    try {
      const response = await fetch(
        `${apiConfig.baseURL}/leases/unit/${unitId}/history`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to fetch unit lease history",
      };
    }
  }

  // Get current tenant's lease
  async getCurrentTenantLease(tenantId) {
    if (this.useDemo) {
      try {
        const currentLease = getCurrentLeaseForTenant(tenantId);

        return {
          success: true,
          data: {
            lease: currentLease,
          },
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }

    try {
      const response = await fetch(
        `${apiConfig.baseURL}/leases/tenant/${tenantId}/current`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to fetch current tenant lease",
      };
    }
  }

  // Create a new lease
  async createLease(leaseData) {
    if (this.useDemo) {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Basic validation
        if (
          !leaseData.tenantId ||
          !leaseData.unitId ||
          !leaseData.startDate ||
          !leaseData.endDate
        ) {
          throw new Error("Missing required lease data");
        }

        // Check if unit already has an active lease
        const existingLease = getCurrentLeaseForUnit(leaseData.unitId);
        if (existingLease) {
          throw new Error("Unit already has an active lease");
        }

        // Create new lease (in real implementation, this would be saved to database)
        const newLease = {
          id: `lease-${Date.now()}`,
          tenantId: leaseData.tenantId,
          unitId: leaseData.unitId,
          landlordId: leaseData.landlordId,
          startDate: leaseData.startDate,
          endDate: leaseData.endDate,
          monthlyRent: leaseData.monthlyRent,
          securityDeposit: leaseData.securityDeposit,
          status: "active",
          moveInDate: leaseData.moveInDate || leaseData.startDate,
          notes: leaseData.notes || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Add to demo data (in memory only)
        demoLeases.push(newLease);

        return {
          success: true,
          data: {
            lease: newLease,
          },
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }

    try {
      const response = await fetch(`${apiConfig.baseURL}/leases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(leaseData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to create lease",
      };
    }
  }

  // Terminate a lease
  async terminateLease(leaseId, terminationData) {
    if (this.useDemo) {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Find the lease
        const leaseIndex = demoLeases.findIndex((l) => l.id === leaseId);
        if (leaseIndex === -1) {
          throw new Error("Lease not found");
        }

        // Update lease status
        demoLeases[leaseIndex] = {
          ...demoLeases[leaseIndex],
          status: "terminated",
          moveOutDate: terminationData.moveOutDate,
          terminationReason: terminationData.terminationReason,
          updatedAt: new Date().toISOString(),
        };

        return {
          success: true,
          data: {
            lease: demoLeases[leaseIndex],
          },
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }

    try {
      const response = await fetch(
        `${apiConfig.baseURL}/leases/${leaseId}/terminate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(terminationData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to terminate lease",
      };
    }
  }

  // Get lease statistics for dashboard
  async getLeaseStats(landlordId) {
    if (this.useDemo) {
      try {
        const leases = getLeasesForLandlord(landlordId);

        const stats = {
          totalLeases: leases.length,
          activeLeases: leases.filter((l) => l.status === "active").length,
          terminatedLeases: leases.filter((l) => l.status === "terminated")
            .length,
          expiredLeases: leases.filter((l) => l.status === "expired").length,
          totalRevenue: leases.reduce((sum, lease) => {
            if (lease.status === "active") {
              return sum + lease.monthlyRent;
            }
            return sum;
          }, 0),
          averageRent:
            leases.length > 0
              ? leases.reduce((sum, lease) => sum + lease.monthlyRent, 0) /
                leases.length
              : 0,
          occupancyRate:
            leases.length > 0
              ? (leases.filter((l) => l.status === "active").length /
                  leases.length) *
                100
              : 0,
        };

        return {
          success: true,
          data: stats,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    }

    try {
      const response = await fetch(`${apiConfig.baseURL}/leases/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to fetch lease statistics",
      };
    }
  }

  // Helper method to format lease data for display
  formatLeaseData(lease) {
    return {
      id: lease.id,
      tenantName: lease.tenant
        ? `${lease.tenant.firstName} ${lease.tenant.lastName}`
        : "Unknown",
      tenantEmail: lease.tenant?.email || "",
      unitName: lease.unit?.name || "Unknown Unit",
      propertyName: lease.property?.name || "Unknown Property",
      monthlyRent: lease.monthlyRent,
      securityDeposit: lease.securityDeposit,
      startDate: lease.startDate,
      endDate: lease.endDate,
      status: lease.status,
      moveInDate: lease.moveInDate,
      moveOutDate: lease.moveOutDate,
      notes: lease.notes || "",
      terminationReason: lease.terminationReason || "",
    };
  }

  // Helper method to calculate lease duration
  calculateLeaseDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}

export default new LeaseService();
