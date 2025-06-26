import { useState, useEffect } from "react";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import { useAuth } from "../../contexts/AuthContext";
import {
  getPropertiesForLandlord,
  getTenantsForLandlord,
  getMaintenanceRequestsForLandlord,
  getTenantPayments,
} from "../../utils/demoData";
import {
  TbBuilding,
  TbUsers,
  TbCreditCard,
  TbTool,
  TbChartBar,
  TbPlus,
  TbArrowUp,
  TbArrowDown,
  TbCalendar,
  TbMapPin,
  TbPhone,
  TbMail,
  TbEye,
} from "react-icons/tb";

const LandlordDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    properties: [],
    tenants: [],
    maintenanceRequests: [],
    payments: [],
    stats: {},
  });

  useEffect(() => {
    if (user?.id) {
      const properties = getPropertiesForLandlord(user.id);
      const tenants = getTenantsForLandlord(user.id);
      const maintenanceRequests = getMaintenanceRequestsForLandlord(user.id);

      // Get all payments for tenants
      const allPayments = tenants.flatMap((tenant) =>
        getTenantPayments(tenant.id).map((payment) => ({
          ...payment,
          tenant_name: `${tenant.first_name} ${tenant.last_name}`,
          unit_name: tenant.unit?.name,
          property_name: tenant.property?.name,
        }))
      );

      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyRevenue = allPayments
        .filter((payment) => {
          const paymentDate = new Date(payment.payment_date);
          return (
            paymentDate.getMonth() === currentMonth &&
            paymentDate.getFullYear() === currentYear &&
            payment.status === "successful"
          );
        })
        .reduce((sum, payment) => sum + payment.amount, 0);

      const occupiedUnits = tenants.length;
      const totalUnits = properties.reduce(
        (sum, prop) => sum + (prop.units?.length || 0),
        0
      );
      const occupancyRate =
        totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

      const pendingMaintenance = maintenanceRequests.filter(
        (req) => req.status === "pending"
      ).length;
      const recentPayments = allPayments
        .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))
        .slice(0, 5);

      setDashboardData({
        properties,
        tenants,
        maintenanceRequests,
        payments: allPayments,
        stats: {
          totalProperties: properties.length,
          totalTenants: tenants.length,
          monthlyRevenue,
          pendingMaintenance,
          occupancyRate,
          totalUnits,
          occupiedUnits,
          recentPayments,
        },
      });
    }
  }, [user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRecentActivity = () => {
    const activities = [];

    // Recent payments
    dashboardData.stats.recentPayments?.slice(0, 3).forEach((payment) => {
      activities.push({
        type: "payment",
        message: `Payment received from ${payment.tenant_name}`,
        amount: payment.amount,
        time: payment.payment_date,
        color: "success",
      });
    });

    // Recent maintenance requests
    dashboardData.maintenanceRequests
      ?.filter((req) => req.status === "pending")
      .slice(0, 2)
      .forEach((request) => {
        activities.push({
          type: "maintenance",
          message: `New maintenance request: ${request.title}`,
          time: request.created_at,
          color: "warning",
        });
      });

    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  };

  const quickActions = [
    {
      title: "Add Property",
      description: "Create a new property listing",
      icon: TbBuilding,
      color: "bg-blue-500",
      href: "/landlord/properties?action=new",
    },
    {
      title: "Add Tenant",
      description: "Register a new tenant",
      icon: TbUsers,
      color: "bg-green-500",
      href: "/landlord/tenants?action=new",
    },
    {
      title: "View Reports",
      description: "Financial and occupancy reports",
      icon: TbChartBar,
      color: "bg-purple-500",
      href: "/landlord/reports",
    },
    {
      title: "Maintenance",
      description: "Manage maintenance requests",
      icon: TbTool,
      color: "bg-orange-500",
      href: "/landlord/maintenance",
    },
  ];

  return (
    <LandlordLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Monitor your properties, tenants, and revenue performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {/* Total Properties */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">
                  Properties
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData.stats.totalProperties || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {dashboardData.stats.totalUnits || 0} units
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TbBuilding className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Tenants */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">
                  Tenants
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData.stats.totalTenants || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {dashboardData.stats.occupancyRate?.toFixed(1) || 0}%
                  occupancy
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-green-100 rounded-lg">
                <TbUsers className="h-4 w-4 lg:h-6 lg:w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">
                  Revenue
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(dashboardData.stats.monthlyRevenue || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <TbArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  +12%
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-yellow-100 rounded-lg">
                <TbCreditCard className="h-4 w-4 lg:h-6 lg:w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Pending Maintenance */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">
                  Pending
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData.stats.pendingMaintenance || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Maintenance</p>
              </div>
              <div className="p-2 lg:p-3 bg-red-100 rounded-lg">
                <TbTool className="h-4 w-4 lg:h-6 lg:w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <a
                    key={index}
                    href={action.href}
                    className="group p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                  >
                    <div
                      className={`w-8 h-8 lg:w-12 lg:h-12 ${action.color} rounded-lg flex items-center justify-center mb-2 lg:mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-xs lg:text-sm">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {action.description}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3 lg:space-y-4">
              {getRecentActivity().length > 0 ? (
                getRecentActivity().map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.color === "success"
                          ? "bg-green-500"
                          : activity.color === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs lg:text-sm text-gray-900">
                        {activity.message}
                      </p>
                      {activity.amount && (
                        <p className="text-xs lg:text-sm font-medium text-green-600">
                          {formatCurrency(activity.amount)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 lg:py-8">
                  <TbCalendar className="mx-auto h-8 w-8 lg:h-12 lg:w-12 text-gray-300" />
                  <p className="mt-2 text-xs lg:text-sm text-gray-500">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Overview */}
        {dashboardData.properties.length > 0 && (
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                Properties Overview
              </h2>
              <a
                href="/landlord/properties"
                className="text-primary-plot hover:text-primary-plot/80 text-xs lg:text-sm font-medium"
              >
                View all →
              </a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
              {dashboardData.properties.slice(0, 3).map((property) => (
                <div
                  key={property.id}
                  className="border border-gray-200 rounded-lg p-3 lg:p-4 hover:border-gray-300 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 mb-2 text-sm lg:text-base">
                    {property.name}
                  </h3>
                  <div className="flex items-center text-xs lg:text-sm text-gray-500 mb-2">
                    <TbMapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs lg:text-sm">
                    <span className="text-gray-600">
                      {property.units?.length || 0} units
                    </span>
                    <span className="font-medium text-gray-900">
                      {property.units?.filter(
                        (unit) => unit.status === "occupied"
                      ).length || 0}{" "}
                      occupied
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </LandlordLayout>
  );
};

export default LandlordDashboard;
