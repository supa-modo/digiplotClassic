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
  TbArrowRight,
  TbCash,
  TbCheck,
  TbClock,
  TbX,
} from "react-icons/tb";
import { PiCaretDownDuotone, PiReceiptDuotone } from "react-icons/pi";

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
        label: "Completed",
        class: "bg-green-100 border border-green-300 text-green-600 ",
        icon: <TbCheck className="h-4 w-4" />,
      },
      pending: {
        label: "Pending",
        class: "bg-yellow-100 border border-yellow-300 text-yellow-600 ",
        icon: <TbClock className="h-4 w-4" />,
      },
      failed: {
        label: "Failed",
        class: "bg-red-100 border border-red-300 text-red-600 ",
        icon: <TbX className="h-4 w-4" />,
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
      <div className="space-y-6">
        {/* Header - Enhanced */}
        <div className=" relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                <PiReceiptDuotone className="h-7 md:h-8 w-7 md:w-8 text-secondary-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary-plot">
                  Payment Management
                </h1>
                <p className="text-gray-600 mt-1 text-xs md:text-sm lg:text-base">
                  Track rental payments, revenue, and transaction history
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button className="bg-white border border-gray-300 text-gray-700 text-[0.8rem] md:text-[0.9rem] px-4 py-3 md:py-2.5 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium">
                <div className="flex items-center justify-center space-x-2">
                  <TbDownload className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Export</span>
                </div>
              </button>
              <button className="bg-gradient-to-r from-secondary-600/90 to-secondary-700 text-white text-[0.8rem] md:text-[0.98rem] px-6 py-3 md:py-2.5 rounded-lg hover:shadow-lg transition-colors duration-200 font-medium space-x-2  shadow-md">
                <div className="flex items-center justify-center space-x-2">
                  <TbReceipt className="h-5 w-5 md:h-6 md:w-6" />
                  <span>Generate Report</span>
                  <TbArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Compact & Mobile Optimized */}
        <div className="lg:py-2 relative overflow-hidden">
          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="lg:hidden flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1.5 md:px-3">
            {/* Mobile Stats Cards */}
            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-lg">
                  <TbCreditCard className="h-4 w-4 text-secondary-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-secondary-600 bg-secondary-50 px-1.5 py-0.5 rounded-full">
                  Total
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Payments
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalPayments}
                </p>
                <p className="text-[0.6rem] text-gray-500">All transactions</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                  <TbMoneybag className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  Success
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Successful
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.successfulPayments}
                </p>
                <p className="text-[0.6rem] text-green-600 font-medium">
                  Completed
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[150px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                  <TbTrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  Total
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Revenue
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue).replace("KES ", "KSh ")}
                </p>
                <p className="text-[0.6rem] text-gray-500">All time</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[150px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
                  <TbCalendar className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  {Math.abs(stats.growthPercentage).toFixed(1)}%
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  This Month
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(stats.monthlyRevenue).replace("KES ", "KSh ")}
                </p>
                <p className="text-[0.6rem] text-gray-500">Monthly</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                  <TbReceipt className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full">
                  Pending
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Pending
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.pendingPayments}
                </p>
                <p className="text-[0.6rem] text-red-600 font-medium">
                  {stats.failedPayments} failed
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Compact Grid */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4 relative z-10">
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="">
                  <div>
                    <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                      Total Payments
                    </p>
                    <p className="text-2xl font-bold text-primary-plot">
                      {stats.totalPayments}
                    </p>
                    <p className="text-[0.7rem] text-gray-500 mt-1">
                      All transactions
                    </p>
                  </div>
                </div>

                <div className="flex items-center px-2 py-1 bg-secondary-50 rounded-full">
                  <TbTrendingUp className="h-3 w-3 text-secondary-600 mr-1" />
                  <span className="text-[0.65rem] font-bold text-secondary-600">
                    Total
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Successful
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.successfulPayments}
                  </p>
                  <p className="text-[0.7rem] text-green-600 mt-1 font-medium">
                    Completed payments
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-green-100 border border-green-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-green-600">
                    Success
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Total Revenue
                  </p>
                  <p className="text-xl font-bold text-secondary-700">
                    {formatCurrency(stats.totalRevenue).replace("KES ", "KSh ")}
                  </p>
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    All time earnings
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-purple-100 border border-purple-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-purple-600">
                    Revenue
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    This Month
                  </p>
                  <p className="text-xl font-bold text-secondary-700">
                    {formatCurrency(stats.monthlyRevenue).replace(
                      "KES ",
                      "KSh "
                    )}
                  </p>
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    Monthly earnings
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-green-100 border border-green-300 rounded-full">
                  <TbTrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-[0.65rem] font-bold text-green-600">
                    {Math.abs(stats.growthPercentage).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.pendingPayments}
                  </p>
                  <p className="text-[0.7rem] text-red-600 mt-1 font-medium">
                    {stats.failedPayments} failed
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-orange-100 border border-orange-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-orange-600">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search - Enhanced */}
        <div className="lg:bg-white pt-6 lg:rounded-[0.8rem] lg:shadow-lg lg:border lg:border-gray-200/70 px-1.5 md:px-3 lg:p-6 relative overflow-hidden">
          <div className="hidden lg:block absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center relative z-10 space-y-4 lg:space-y-0">
            {/* Left side - Icon, Title, Description */}
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-[0.6rem]">
                <TbSearch className="h-6 md:h-7 w-6 md:w-7 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-secondary-plot">
                  Search & Filter
                </h3>
                <p className="text-[0.8rem] md:text-sm text-gray-500">
                  Find and organize payments
                </p>
              </div>
            </div>

            {/* Right side - Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-3 lg:min-w-[65%]">
              {/* Search Input */}
              <div className="relative flex-1 lg:min-w-[300px]">
                <TbSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-[0.6rem] text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot/50 focus:border-primary-plot bg-gray-50 font-medium text-gray-500 placeholder-gray-400"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex items-center space-x-3">
                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-4 pr-7 py-2.5 border border-gray-300 rounded-lg appearance-none text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                  >
                    <option value="all">All Status</option>
                    <option value="successful">Successful</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <PiCaretDownDuotone
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>

                {/* Date Range Filter */}
                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="pl-4 pr-7 py-2.5 border border-gray-300 rounded-lg appearance-none text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last 3 Months</option>
                  </select>
                  <PiCaretDownDuotone
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
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
                <thead className="bg-gradient-to-r to-gray-200 from-secondary-600/20">
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
                      className="hover:bg-gradient-to-r hover:to-secondary-plot/5 hover:from-primary-600/5 transition-colors duration-300"
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
                            <div className="text-[0.78rem] text-gray-600">
                              {payment.tenant_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {payment.unit_number || "Unit-21A"}
                        </div>
                        <div className="text-[0.78rem] text-gray-600">
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
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-secondary-plot">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </div>
                        <div className="text-[0.78rem] font-medium text-gray-500">
                          {new Date(payment.paymentDate).toLocaleTimeString(
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
    </LandlordLayout>
  );
};

export default LandlordPayments;
