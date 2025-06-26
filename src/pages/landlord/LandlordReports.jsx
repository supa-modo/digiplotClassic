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
  const landlordProperties = getPropertiesForLandlord(user?.id).map(
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
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Revenue Trends</h3>
          <div className="flex items-center space-x-2">
            <TbTrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              +{revenueGrowth.toFixed(1)}% from last month
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {monthlyRevenueData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm text-gray-600">{data.month}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                <div
                  className="bg-primary-plot h-8 rounded-full flex items-center justify-end pr-3"
                  style={{
                    width: `${(data.revenue / maxRevenue) * 100}%`,
                    minWidth: data.revenue > 0 ? "60px" : "0",
                  }}
                >
                  <span className="text-white text-sm font-medium">
                    KES {data.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Payment Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {allPayments.filter((p) => p.status === "successful").length}
            </div>
            <div className="text-sm text-green-600">Successful Payments</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {allPayments.filter((p) => p.status === "pending").length}
            </div>
            <div className="text-sm text-yellow-600">Pending Payments</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {allPayments.filter((p) => p.status === "failed").length}
            </div>
            <div className="text-sm text-red-600">Failed Payments</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOccupancyReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Occupancy Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div key={property.id} className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900">{property.name}</h4>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Occupied</span>
                    <span>
                      {propertyTenants.length}/{property.total_units}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-primary-plot h-2 rounded-full"
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
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
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Maintenance Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {maintenanceRequests.length}
            </div>
            <div className="text-sm text-blue-600">Total Requests</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingMaintenance}
            </div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {completedMaintenance}
            </div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {
                maintenanceRequests.filter((r) => r.status === "in_progress")
                  .length
              }
            </div>
            <div className="text-sm text-purple-600">In Progress</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Request Categories
        </h3>
        <div className="space-y-3">
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
                  <div className="w-20 text-sm text-gray-600 capitalize">
                    {category}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-primary-plot h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${percentage}%`, minWidth: "40px" }}
                    >
                      <span className="text-white text-xs font-medium">
                        {categoryRequests.length}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-600">
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
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Property Performance
        </h3>
        <div className="space-y-4">
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
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {property.name}
                    </h4>
                    <p className="text-sm text-gray-500">{property.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      KES {propertyRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Revenue</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-900">
                      {property.total_units}
                    </div>
                    <div className="text-sm text-gray-500">Total Units</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-900">
                      {propertyTenants.length}
                    </div>
                    <div className="text-sm text-gray-500">Occupied</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-900">
                      {(
                        (propertyTenants.length / property.total_units) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-gray-500">Occupancy</div>
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights into your property portfolio
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              onClick={() => handleExportReport("pdf")}
              className="bg-primary-plot text-white px-4 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors flex items-center space-x-2"
            >
              <TbDownload size={16} />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => handleExportReport("excel")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <TbDownload size={16} />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === "increase" ? (
                      <TbTrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : stat.changeType === "decrease" ? (
                      <TbTrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    ) : (
                      <TbClock className="h-4 w-4 text-gray-600 mr-1" />
                    )}
                    <span
                      className={`text-sm ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : stat.changeType === "decrease"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-primary-plot/10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-primary-plot" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report Type Selector */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-4 mb-6">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  reportType === type.id
                    ? "bg-primary-plot text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <type.icon size={16} />
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
    </LandlordLayout>
  );
};

export default LandlordReports;
