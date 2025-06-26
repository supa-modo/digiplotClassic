import { useState, useEffect } from "react";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import { useAuth } from "../../contexts/AuthContext";
import { getTenantsForLandlord, getTenantPayments } from "../../utils/demoData";
import {
  TbCreditCard,
  TbSearch,
  TbFilter,
  TbDownload,
  TbEye,
  TbCalendar,
  TbUser,
  TbHome,
  TbMoneybag,
  TbReceipt,
  TbTrendingUp,
  TbTrendingDown,
} from "react-icons/tb";

const LandlordPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    if (user?.id) {
      const tenants = getTenantsForLandlord(user.id);
      const allPayments = tenants.flatMap((tenant) =>
        getTenantPayments(tenant.id).map((payment) => ({
          ...payment,
          tenant_name: `${tenant.first_name} ${tenant.last_name}`,
          tenant_email: tenant.email,
          unit_number: tenant.unit?.unit_number,
          property_name: tenant.property?.name,
        }))
      );

      setPayments(
        allPayments.sort(
          (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
        )
      );
      setFilteredPayments(
        allPayments.sort(
          (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
        )
      );
    }
  }, [user]);

  useEffect(() => {
    let filtered = payments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.tenant_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.transaction_id
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.unit_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    // Apply date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const startDate = new Date();

      switch (dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          startDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(
        (payment) => new Date(payment.payment_date) >= startDate
      );
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, dateRange]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      successful: { label: "Successful", class: "bg-green-100 text-green-800" },
      pending: { label: "Pending", class: "bg-yellow-100 text-yellow-800" },
      failed: { label: "Failed", class: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    if (
      method?.toLowerCase().includes("mpesa") ||
      method?.toLowerCase().includes("m-pesa")
    ) {
      return (
        <span className="text-green-600 font-semibold text-xs">M-PESA</span>
      );
    }
    return <TbCreditCard className="h-4 w-4 text-blue-600" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentStats = () => {
    const successful = filteredPayments.filter(
      (p) => p.status === "successful"
    );
    const totalRevenue = successful.reduce((sum, p) => sum + p.amount, 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonth = successful.filter((p) => {
      const date = new Date(p.payment_date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    const lastMonth = successful.filter((p) => {
      const date = new Date(p.payment_date);
      const lastMonthDate = new Date(currentYear, currentMonth - 1);
      return (
        date.getMonth() === lastMonthDate.getMonth() &&
        date.getFullYear() === lastMonthDate.getFullYear()
      );
    });

    const monthlyRevenue = thisMonth.reduce((sum, p) => sum + p.amount, 0);
    const lastMonthRevenue = lastMonth.reduce((sum, p) => sum + p.amount, 0);
    const growthPercentage =
      lastMonthRevenue > 0
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    return {
      totalPayments: filteredPayments.length,
      successfulPayments: successful.length,
      totalRevenue,
      monthlyRevenue,
      growthPercentage,
      pendingPayments: filteredPayments.filter((p) => p.status === "pending")
        .length,
      failedPayments: filteredPayments.filter((p) => p.status === "failed")
        .length,
    };
  };

  const stats = getPaymentStats();

  return (
    <LandlordLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Payment Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track rental payments, revenue, and transaction history
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2">
              <TbDownload size={20} />
              <span>Export</span>
            </button>
            <button className="bg-primary-plot text-white px-6 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors font-medium flex items-center space-x-2">
              <TbReceipt size={20} />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Payments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPayments}
                </p>
              </div>
              <TbCreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.successfulPayments}
                </p>
              </div>
              <TbMoneybag className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <TbTrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  {stats.growthPercentage >= 0 ? (
                    <TbTrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TbTrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-xs ${
                      stats.growthPercentage >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.abs(stats.growthPercentage).toFixed(1)}%
                  </span>
                </div>
              </div>
              <TbCalendar className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingPayments}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {stats.failedPayments} failed
                </p>
              </div>
              <TbReceipt className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <TbSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-2">
                <TbFilter className="text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="successful">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <TbCalendar className="text-gray-400" size={20} />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last 3 Months</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <TbCreditCard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No payments found
            </h3>
            <p className="text-gray-500">
              {payments.length === 0
                ? "No payment history available"
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.transaction_id}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {payment.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-plot rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {payment.tenant_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.tenant_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.tenant_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.unit_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.property_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.payment_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(payment.payment_method)}
                          <span className="ml-2 text-sm text-gray-900">
                            {payment.payment_method}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(payment.payment_date).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="text-primary-plot hover:text-primary-plot/80 p-1"
                            title="View Details"
                          >
                            <TbEye size={16} />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Download Receipt"
                          >
                            <TbDownload size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </LandlordLayout>
  );
};

export default LandlordPayments;
