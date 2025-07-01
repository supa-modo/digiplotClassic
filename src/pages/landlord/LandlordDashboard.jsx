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
  TbSparkles,
  TbTrendingUp,
  TbCash,
  TbHomeDot,
  TbSun,
  TbMoon,
  TbSunset,
  TbCalendarEvent,
  TbCoins,
} from "react-icons/tb";
import { PiBuildingsDuotone, PiUsersDuotone } from "react-icons/pi";
import { FaTools } from "react-icons/fa";

const LandlordDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    properties: [],
    tenants: [],
    maintenanceRequests: [],
    payments: [],
    stats: {},
  });

  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    // Set time of day greeting
    const hours = new Date().getHours();
    if (hours < 12) setTimeOfDay("morning");
    else if (hours < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

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

  const getTimeIcon = () => {
    if (timeOfDay === "morning") return TbSun;
    if (timeOfDay === "afternoon") return TbSunset;
    return TbMoon;
  };

  const TimeIcon = getTimeIcon();

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
      icon: PiBuildingsDuotone,
      color: "secondary-plot",
      href: "/landlord/properties?action=new",
    },
    {
      title: "Add Tenant",
      description: "Register a new tenant",
      icon: PiUsersDuotone,
      color: "secondary-plot",
      href: "/landlord/tenants?action=new",
    },
    {
      title: "View Reports",
      description: "Financial and occupancy reports",
      icon: TbChartBar,
      color: "secondary-plot",
      href: "/landlord/reports",
    },
    {
      title: "Maintenance",
      description: "Manage maintenance requests",
      icon: FaTools,
      color: "secondary-plot",
      href: "/landlord/maintenance",
    },
  ];

  return (
    <LandlordLayout>
      <div className="space-y-6">
        {/* Enhanced Welcome Section */}
        <div className="mb-4 md:mb-6">
          <div className="px-4 flex items-baseline justify-between mb-2 lg:mb-0">
            <div className="">
              <div className="flex items-center mb-2 md:mb-3">
                <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-700/20 to-amber-500/30 text-[0.8rem] md:text-sm font-medium text-amber-600">
                  <TimeIcon className="h-4 w-4 mr-1.5 text-amber-600" />
                  <span>Good {timeOfDay}</span>
                </div>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-secondary-plot">
                Welcome back,{" "}
                <span className="text-amber-700/90">
                  {user?.firstName + " " + user?.lastName}
                </span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                Monitor & manage your properties, tenants, and revenue performance
              </p>
            </div>

            <div className="hidden md:flex items-center mt-1.5 text-[0.8rem] md:text-sm font-medium text-gray-600">
              <TbCalendarEvent className="h-5 w-5 mr-1.5 text-secondary-600" />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        {/* Stats Grid - Enhanced */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Total Properties */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-blue-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                    <PiBuildingsDuotone className="h-10 w-10 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[0.8rem] font-semibold text-gray-600">
                      Properties
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {dashboardData.stats.totalProperties || 0}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <TbHomeDot className="h-3 w-3 mr-1" />
                      {dashboardData.stats.totalUnits || 0} total units
                    </p>
                  </div>
                </div>
                <div className="flex items-center px-2 py-1 bg-blue-50 rounded-full">
                  <TbTrendingUp className="h-3 w-3 text-blue-600 mr-1" />
                  <span className="text-xs font-semibold text-blue-600">
                    +5%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Tenants */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-green-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                    <PiUsersDuotone className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[0.8rem] font-semibold text-gray-600">
                      Tenants
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {dashboardData.stats.totalTenants || 0}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      Occupancy Rate
                    </p>
                  </div>
                </div>

                <div className="flex items-center px-2 py-1 bg-green-50 rounded-full">
                  <span className="text-xs font-semibold text-green-600">
                    {dashboardData.stats.occupancyRate?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-yellow-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                    <TbCoins className="h-10 w-10 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-[0.8rem] font-semibold text-gray-600">
                      Revenue
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {formatCurrency(dashboardData.stats.monthlyRevenue || 0)}
                    </p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>

                <div className="flex items-center px-2 py-1 bg-green-50 rounded-full">
                  <TbArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs font-semibold text-green-600">
                    +12%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Maintenance */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-red-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl">
                    <TbTool className="h-10 w-10 text-red-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Pending
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {dashboardData.stats.pendingMaintenance || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      Maintenance requests
                    </p>
                  </div>
                  <div></div>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl">
                  <TbTool className="h-6 w-6 text-red-600" />
                </div>
                {dashboardData.stats.pendingMaintenance > 0 && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Enhanced */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary-100 to-secondary-100 border border-secondary-500/20 rounded-xl">
                  <TbSparkles className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Quick Actions
                  </h2>
                  <p className="text-sm text-gray-500">
                    Frequently used operations
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <a
                      key={index}
                      href={action.href}
                      className="group p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                    >
                      <div
                        className={`w-12 h-12 bg-${action.color} rounded-xl flex items-center justify-center mb-3 transition-transform shadow-lg`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-secondary-700 text-sm mb-1">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {action.description}
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                  <TbCalendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Recent Activity
                  </h2>
                  <p className="text-sm text-gray-500">
                    Latest updates and changes
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {getRecentActivity().length > 0 ? (
                  getRecentActivity().map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100"
                    >
                      <div
                        className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                          activity.color === "success"
                            ? "bg-green-500"
                            : activity.color === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.message}
                        </p>
                        {activity.amount && (
                          <p className="text-sm font-bold text-green-600">
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
                  <div className="text-center py-8">
                    <div className="p-4 bg-gray-100 rounded-2xl inline-flex">
                      <TbCalendar className="h-12 w-12 text-gray-300" />
                    </div>
                    <p className="mt-3 text-sm text-gray-500 font-medium">
                      No recent activity
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Activity will appear here as it happens
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Overview - Enhanced */}
        {dashboardData.properties.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                    <TbBuilding className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Properties Overview
                    </h2>
                    <p className="text-sm text-gray-500">
                      Your property portfolio at a glance
                    </p>
                  </div>
                </div>
                <a
                  href="/landlord/properties"
                  className="flex items-center space-x-2 text-primary-plot hover:text-primary-plot/80 text-sm font-semibold px-4 py-2 bg-primary-plot/5 rounded-lg hover:bg-primary-plot/10 transition-all duration-200"
                >
                  <span>View all</span>
                  <TbEye className="h-4 w-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {dashboardData.properties.slice(0, 3).map((property) => (
                  <div
                    key={property.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary-plot/30 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-gray-50 to-blue-50/30"
                  >
                    <h3 className="font-bold text-gray-900 mb-3 text-base">
                      {property.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <TbMapPin className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                      <span className="truncate">{property.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 bg-blue-100 rounded-full">
                          <span className="text-xs font-bold text-blue-700">
                            {property.units?.length || 0} units
                          </span>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-100 rounded-full">
                        <span className="text-xs font-bold text-green-700">
                          {property.units?.filter(
                            (unit) => unit.status === "occupied"
                          ).length || 0}{" "}
                          occupied
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </LandlordLayout>
  );
};

export default LandlordDashboard;
