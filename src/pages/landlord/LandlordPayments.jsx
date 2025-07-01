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
      // TODO: Replace with actual user id
      const tenants = getTenantsForLandlord("landlord-1");
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
      successful: {
        label: "Successful",
        class:
          "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md",
        icon: "✓",
      },
      pending: {
        label: "Pending",
        class:
          "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-md",
        icon: "⏳",
      },
      failed: {
        label: "Failed",
        class: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md",
        icon: "✗",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full gap-1.5 ${config.class}`}
      >
        <span>{config.icon}</span>
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
        <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-lg">
          <span className="text-green-600 font-bold text-xs">M-PESA</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded-lg">
        <TbCreditCard className="h-4 w-4 text-blue-600" />
      </div>
    );
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
      <div className="min-h-screen bg-gradient-to-br from-primary-plot/5 via-secondary-plot/5 to-primary-plot/5 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-plot/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-plot/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative p-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 mb-6 border border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
                  Payment Management
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Track rental payments, revenue, and transaction history
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <button className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 font-semibold flex items-center space-x-2">
                  <TbDownload size={20} />
                  <span>Export</span>
                </button>
                <button className="bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center space-x-2">
                  <TbReceipt size={20} />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Total Payments
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.totalPayments}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TbCreditCard className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Successful
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.successfulPayments}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <TbMoneybag className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent mt-2">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TbTrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    This Month
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-2">
                    {formatCurrency(stats.monthlyRevenue)}
                  </p>
                  <div className="flex items-center mt-2">
                    {stats.growthPercentage >= 0 ? (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-lg">
                        <TbTrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs font-semibold text-green-600">
                          {Math.abs(stats.growthPercentage).toFixed(1)}%
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-red-50 rounded-lg">
                        <TbTrendingDown className="h-3 w-3 text-red-600" />
                        <span className="text-xs font-semibold text-red-600">
                          {Math.abs(stats.growthPercentage).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <TbCalendar className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.pendingPayments}
                  </p>
                  <p className="text-xs text-red-600 mt-1 font-semibold">
                    {stats.failedPayments} failed
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <TbReceipt className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 mb-6 border border-white/20">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <TbFilter className="text-gray-400" size={20} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
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
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
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
            <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-12 text-center border border-white/20">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                <TbCreditCard className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No payments found
              </h3>
              <p className="text-gray-600">
                {payments.length === 0
                  ? "No payment history available"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-primary-plot/10 to-secondary-plot/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tenant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Unit
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-gradient-to-r hover:from-primary-plot/5 hover:to-secondary-plot/5 transition-all"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {payment.transaction_id}
                          </div>
                          <div className="text-sm text-gray-600">
                            ID: {payment.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-plot to-secondary-plot rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                {payment.tenant_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {payment.tenant_name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {payment.tenant_email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {payment.unit_number}
                          </div>
                          <div className="text-sm text-gray-600">
                            {payment.property_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
                            {formatCurrency(payment.amount)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {payment.payment_type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getPaymentMethodIcon(payment.payment_method)}
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {payment.payment_method}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {new Date(
                              payment.payment_date
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(payment.payment_date).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              className="text-primary-plot hover:text-primary-plot/80 p-2 rounded-lg hover:bg-primary-plot/10 transition-all"
                              title="View Details"
                            >
                              <TbEye size={16} />
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all"
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
      </div>
    </LandlordLayout>
  );
};

export default LandlordPayments;
