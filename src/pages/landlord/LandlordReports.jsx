import { useState, useEffect } from "react";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import { useAuth } from "../../contexts/AuthContext";
import {
  TbChartLine,
  TbCurrencyDollar,
  TbUsers,
  TbBuildingSkyscraper,
  TbDownload,
  TbCalendar,
  TbTrendingUp,
  TbTrendingDown,
  TbHome,
  TbTools,
  TbClock,
} from "react-icons/tb";
import {
  demoPayments,
  demoMaintenanceRequests,
  demoUsers,
  demoTenants,
  demoProperties,
  demoUnits,
  getPropertiesForLandlord,
  getTenantsForLandlord,
  getTenantById,
  getPropertyById,
  getUnitById,
} from "../../utils/demoData";

const LandlordReports = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [reportType, setReportType] = useState("financial");

  // Get landlord's data
  // TODO: Replace with actual user id
  const landlordProperties = getPropertiesForLandlord("landlord-1").map(
    (property) => {
      const units = demoUnits.filter(
        (unit) => unit.property_id === property.id
      );
      return {
        ...property,
        total_units: units.length,
      };
    }
  );
  const allPayments = demoPayments;
  const allMaintenance = demoMaintenanceRequests;
  const allTenants = getTenantsForLandlord(user?.id);

  // Calculate financial metrics
  const totalRevenue = allPayments
    .filter((payment) => payment.status === "successful")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const monthlyRevenue = allPayments
    .filter((payment) => {
      const paymentDate = new Date(payment.payment_date);
      const currentMonth = new Date().getMonth();
      return (
        payment.status === "successful" &&
        paymentDate.getMonth() === currentMonth
      );
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  const previousMonthRevenue = allPayments
    .filter((payment) => {
      const paymentDate = new Date(payment.payment_date);
      const previousMonth = new Date().getMonth() - 1;
      return (
        payment.status === "successful" &&
        paymentDate.getMonth() === previousMonth
      );
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  const revenueGrowth =
    previousMonthRevenue > 0
      ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 0;

  // Calculate occupancy rate
  const totalUnits = landlordProperties.reduce(
    (sum, property) => sum + property.total_units,
    0
  );
  const occupiedUnits = allTenants.length;
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

  // Maintenance statistics
  const maintenanceRequests = allMaintenance.filter((request) => {
    const unit = getUnitById(request.unit_id);
    const property = unit ? getPropertyById(unit.property_id) : null;
    return property && property.landlord_id === user?.id;
  });

  const pendingMaintenance = maintenanceRequests.filter(
    (request) => request.status === "pending"
  ).length;
  const completedMaintenance = maintenanceRequests.filter(
    (request) => request.status === "resolved"
  ).length;

  // Monthly revenue data for chart
  const monthlyRevenueData = Array.from({ length: 6 }, (_, index) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - index));

    const monthPayments = allPayments.filter((payment) => {
      const paymentDate = new Date(payment.payment_date);
      return (
        payment.status === "successful" &&
        paymentDate.getMonth() === month.getMonth() &&
        paymentDate.getFullYear() === month.getFullYear()
      );
    });

    return {
      month: month.toLocaleDateString("en-US", { month: "short" }),
      revenue: monthPayments.reduce((sum, payment) => sum + payment.amount, 0),
    };
  });

  const maxRevenue = Math.max(
    ...monthlyRevenueData.map((data) => data.revenue)
  );

  const stats = [
    {
      title: "Total Revenue",
      value: `KES ${totalRevenue.toLocaleString()}`,
      change: `+${revenueGrowth.toFixed(1)}%`,
      changeType: revenueGrowth >= 0 ? "increase" : "decrease",
      icon: TbCurrencyDollar,
    },
    {
      title: "Properties",
      value: landlordProperties.length.toString(),
      change: "Active",
      changeType: "neutral",
      icon: TbBuildingSkyscraper,
    },
    {
      title: "Occupancy Rate",
      value: `${occupancyRate.toFixed(1)}%`,
      change: `${occupiedUnits}/${totalUnits} units`,
      changeType: occupancyRate > 80 ? "increase" : "decrease",
      icon: TbHome,
    },
    {
      title: "Maintenance",
      value: maintenanceRequests.length.toString(),
      change: `${pendingMaintenance} pending`,
      changeType: pendingMaintenance > 0 ? "decrease" : "increase",
      icon: TbTools,
    },
  ];

  const reportTypes = [
    { id: "financial", label: "Financial Reports", icon: TbCurrencyDollar },
    { id: "occupancy", label: "Occupancy Reports", icon: TbUsers },
    { id: "maintenance", label: "Maintenance Reports", icon: TbTools },
    {
      id: "property",
      label: "Property Performance",
      icon: TbBuildingSkyscraper,
    },
  ];

  const handleExportReport = (format) => {
    // Simulate export functionality
    const exportData = {
      period: selectedPeriod,
      type: reportType,
      generatedAt: new Date().toISOString(),
      totalRevenue,
      monthlyRevenue,
      occupancyRate,
      maintenanceRequests: maintenanceRequests.length,
      properties: landlordProperties.length,
    };

    console.log(`Exporting ${format} report:`, exportData);
    // In a real app, this would trigger a download
  };

  const renderFinancialReport = () => (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
            Revenue Trends
          </h3>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <TbTrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">
              +{revenueGrowth.toFixed(1)}% from last month
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {monthlyRevenueData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm text-gray-600 font-medium">
                {data.month}
              </div>
              <div className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-10 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-plot to-secondary-plot h-10 rounded-full flex items-center justify-end pr-4 transition-all duration-700"
                  style={{
                    width: `${(data.revenue / maxRevenue) * 100}%`,
                    minWidth: data.revenue > 0 ? "80px" : "0",
                  }}
                >
                  <span className="text-white text-sm font-semibold">
                    KES {data.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Payment Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {allPayments.filter((p) => p.status === "successful").length}
            </div>
            <div className="text-sm font-semibold text-green-600 mt-2">
              Successful Payments
            </div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              {allPayments.filter((p) => p.status === "pending").length}
            </div>
            <div className="text-sm font-semibold text-yellow-600 mt-2">
              Pending Payments
            </div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              {allPayments.filter((p) => p.status === "failed").length}
            </div>
            <div className="text-sm font-semibold text-red-600 mt-2">
              Failed Payments
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOccupancyReport = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Occupancy Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {landlordProperties.map((property) => {
            const propertyUnits = demoUnits.filter(
              (unit) => unit.property_id === property.id
            );
            const propertyTenants = allTenants.filter(
              (tenant) => tenant.property_id === property.id
            );
            const occupancyRate =
              (propertyTenants.length / property.total_units) * 100;

            return (
              <div
                key={property.id}
                className="p-6 bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 rounded-xl border border-primary-plot/20 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <h4 className="font-bold text-gray-900 text-lg">
                  {property.name}
                </h4>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">Occupied</span>
                    <span className="font-bold text-gray-900">
                      {propertyTenants.length}/{property.total_units}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div
                      className="bg-gradient-to-r from-primary-plot to-secondary-plot h-3 rounded-full transition-all duration-700"
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mt-2">
                    {occupancyRate.toFixed(1)}% occupied
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderMaintenanceReport = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Maintenance Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {maintenanceRequests.length}
            </div>
            <div className="text-sm font-semibold text-blue-600 mt-2">
              Total Requests
            </div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              {pendingMaintenance}
            </div>
            <div className="text-sm font-semibold text-yellow-600 mt-2">
              Pending
            </div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {completedMaintenance}
            </div>
            <div className="text-sm font-semibold text-green-600 mt-2">
              Completed
            </div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              {
                maintenanceRequests.filter((r) => r.status === "in_progress")
                  .length
              }
            </div>
            <div className="text-sm font-semibold text-purple-600 mt-2">
              In Progress
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Request Categories
        </h3>
        <div className="space-y-4">
          {["plumbing", "electrical", "hvac", "appliances", "other"].map(
            (category) => {
              const categoryRequests = maintenanceRequests.filter(
                (request) => request.category === category
              );
              const percentage =
                maintenanceRequests.length > 0
                  ? (categoryRequests.length / maintenanceRequests.length) * 100
                  : 0;

              return (
                <div key={category} className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-semibold text-gray-700 capitalize">
                    {category}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-plot to-secondary-plot h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-700"
                      style={{ width: `${percentage}%`, minWidth: "50px" }}
                    >
                      <span className="text-white text-xs font-semibold">
                        {categoryRequests.length}
                      </span>
                    </div>
                  </div>
                  <div className="w-16 text-sm font-semibold text-gray-600">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );

  const renderPropertyReport = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Property Performance
        </h3>
        <div className="space-y-6">
          {landlordProperties.map((property) => {
            const propertyPayments = allPayments.filter((payment) => {
              const tenant = getTenantById(payment.tenant_id);
              return tenant && tenant.property_id === property.id;
            });

            const propertyRevenue = propertyPayments
              .filter((p) => p.status === "successful")
              .reduce((sum, payment) => sum + payment.amount, 0);

            const propertyTenants = allTenants.filter(
              (tenant) => tenant.property_id === property.id
            );

            return (
              <div
                key={property.id}
                className="bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-primary-plot/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-xl">
                      {property.name}
                    </h4>
                    <p className="text-gray-600 mt-1">{property.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
                      KES {propertyRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Total Revenue
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-primary-plot/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {property.total_units}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Total Units
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {propertyTenants.length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Occupied</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {(
                        (propertyTenants.length / property.total_units) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Occupancy</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <LandlordLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary-plot/5 via-secondary-plot/5 to-primary-plot/5 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-plot/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-plot/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative space-y-6 p-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
                  Reports & Analytics
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Comprehensive insights into your property portfolio
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <button
                  onClick={() => handleExportReport("pdf")}
                  className="bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center space-x-2"
                >
                  <TbDownload size={20} />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => handleExportReport("excel")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center space-x-2"
                >
                  <TbDownload size={20} />
                  <span>Export Excel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-3">
                      {stat.changeType === "increase" ? (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-lg">
                          <TbTrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-semibold text-green-600">
                            {stat.change}
                          </span>
                        </div>
                      ) : stat.changeType === "decrease" ? (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-red-50 rounded-lg">
                          <TbTrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-xs font-semibold text-red-600">
                            {stat.change}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded-lg">
                          <TbClock className="h-4 w-4 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-600">
                            {stat.change}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-primary-plot/10 to-secondary-plot/10 rounded-xl">
                    <stat.icon className="h-8 w-8 text-primary-plot" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Report Type Selector */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
            <div className="flex items-center space-x-4 mb-8">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                    reportType === type.id
                      ? "bg-gradient-to-r from-primary-plot to-secondary-plot text-white shadow-lg"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-primary-plot/10 hover:to-secondary-plot/10 hover:text-primary-plot"
                  }`}
                >
                  <type.icon size={20} />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            {/* Report Content */}
            {reportType === "financial" && renderFinancialReport()}
            {reportType === "occupancy" && renderOccupancyReport()}
            {reportType === "maintenance" && renderMaintenanceReport()}
            {reportType === "property" && renderPropertyReport()}
          </div>
        </div>
      </div>
    </LandlordLayout>
  );
};

export default LandlordReports;
