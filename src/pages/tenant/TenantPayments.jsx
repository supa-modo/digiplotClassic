import { useState } from "react";
import TenantLayout from "../../components/tenant/TenantLayout";
import PaymentModal from "../../components/tenant/PaymentModal";
import PaymentReceipt from "../../components/tenant/PaymentReceipt";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  getTenantPayments,
  getUnitById,
  getPropertyById,
} from "../../utils/demoData";
import {
  TbPlus,
  TbReceipt,
  TbEye,
  TbDownload,
  TbCreditCard,
  TbDeviceMobile,
  TbSearch,
  TbFilter,
  TbCalendar,
  TbCheck,
  TbLoader2,
  TbX,
  TbCoins,
} from "react-icons/tb";
import MpesaIcon from "../../components/common/MpesaIcon";

const TenantPayments = () => {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Modal states
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    itemName: "",
    onConfirm: null,
    isLoading: false,
  });

  // Get payments and related data
  const payments = getTenantPayments(user?.id) || [];
  const unit = payments.length > 0 ? getUnitById(payments[0].unit_id) : null;
  const property = unit ? getPropertyById(unit.property_id) : null;

  const handlePaymentSuccess = async (paymentData) => {
    setConfirmationModal((prev) => ({ ...prev, isLoading: true }));

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Payment successful:", paymentData);

      setShowPaymentModal(false);
      setConfirmationModal({
        isOpen: true,
        type: "success",
        title: "Payment Successful",
        message: `Your payment of KSh ${paymentData.amount?.toLocaleString()} has been processed successfully. Transaction ID: ${
          paymentData.transactionId || "PMT" + Date.now()
        }`,
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        autoClose: true,
        isLoading: false,
      });

      // Refresh payments data here
    } catch (error) {
      setConfirmationModal({
        isOpen: true,
        type: "error",
        title: "Payment Failed",
        message:
          "Your payment could not be processed. Please check your payment details and try again.",
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        isLoading: false,
      });
    }
  };

  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceipt(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      successful: {
        class: "bg-green-100 text-green-800 border-green-200",
        text: "Successful",
        icon: TbCheck,
      },
      pending: {
        class: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Pending",
        icon: TbLoader2,
      },
      failed: {
        class: "bg-red-100 text-red-800 border-red-200",
        text: "Failed",
        icon: TbX,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${config.class}`}
      >
        <IconComponent size={12} className="mr-1" />
        {config.text}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    if (method && method.toLowerCase().includes("mpesa")) {
      return <TbDeviceMobile className="text-green-600" size={16} />;
    }
    return <TbCreditCard className="text-blue-600" size={16} />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  // Filter payments based on search and filters
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.mpesa_transaction_id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const paymentDate = new Date(payment.payment_date);
      const now = new Date();

      switch (dateFilter) {
        case "thisMonth":
          matchesDate =
            paymentDate.getMonth() === now.getMonth() &&
            paymentDate.getFullYear() === now.getFullYear();
          break;
        case "lastMonth":
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          matchesDate =
            paymentDate.getMonth() === lastMonth.getMonth() &&
            paymentDate.getFullYear() === lastMonth.getFullYear();
          break;
        case "last3Months":
          const threeMonthsAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 3
          );
          matchesDate = paymentDate >= threeMonthsAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <TenantLayout>
      <div className="space-y-6">
        {/* Header - Enhanced to match landlord component style */}
        <div className="relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                <TbReceipt className="h-7 md:h-8 w-7 md:w-8 text-secondary-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary-plot">
                  Payment History
                </h1>
                <p className="text-gray-600 mt-1 text-xs md:text-sm lg:text-base">
                  Manage your rent payments and view transaction history
                </p>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-gradient-to-r from-secondary-600/90 to-secondary-700 text-white text-[0.8rem] md:text-[0.98rem] px-6 py-3 md:py-2.5 rounded-lg hover:shadow-lg transition-colors duration-200 font-medium space-x-2 shadow-md"
              >
                <div className="flex items-center justify-center space-x-2">
                  <TbPlus className="h-5 w-5 md:h-6 md:w-6" />
                  <span>Make Payment</span>
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
                <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                  <TbCreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                  Monthly
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Monthly Rent
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(unit?.rent_amount || 0).replace(
                    "KES ",
                    "KSh "
                  )}
                </p>
                <p className="text-[0.6rem] text-gray-500">Due monthly</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                  <TbReceipt className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  Paid
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Total Paid
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(
                    payments
                      .filter((p) => p.status === "successful")
                      .reduce((sum, p) => sum + p.amount, 0)
                  ).replace("KES ", "KSh ")}
                </p>
                <p className="text-[0.6rem] text-green-600 font-medium">
                  Successful
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
                  <TbCoins className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                  Total
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Transactions
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {payments.length}
                </p>
                <p className="text-[0.6rem] text-gray-500">All time</p>
              </div>
            </div>
          </div>

          {/* Desktop: Compact Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-4 relative z-10">
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Monthly Rent
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {formatCurrency(unit?.rent_amount || 0)}
                  </p>
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    Due monthly
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-blue-100 border border-blue-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-blue-600">
                    Monthly
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Total Paid
                  </p>
                  <p className="text-xl font-bold text-secondary-700">
                    {formatCurrency(
                      payments
                        .filter((p) => p.status === "successful")
                        .reduce((sum, p) => sum + p.amount, 0)
                    )}
                  </p>
                  <p className="text-[0.7rem] text-green-600 mt-1 font-medium">
                    Successfully processed
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-green-100 border border-green-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-green-600">
                    Paid
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Transactions
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {payments.length}
                  </p>
                  <p className="text-[0.7rem] text-gray-500 mt-1">All time</p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-purple-100 border border-purple-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-purple-600">
                    Total
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
                  Find specific payments quickly
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
                  placeholder="Search by transaction ID or notes..."
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
                </div>

                {/* Date Range Filter */}
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-4 pr-7 py-2.5 border border-gray-300 rounded-lg appearance-none text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                  >
                    <option value="all">All Time</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="last3Months">Last 3 Months</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Payments Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-plot/10 to-secondary-plot/10">
            <h3 className="text-lg font-bold text-secondary-plot">
              Payment Transactions
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Complete history of your payments
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Transaction Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <TbReceipt className="text-gray-400" size={32} />
                        </div>
                        <p className="text-xl font-semibold text-gray-600 mb-2">
                          No payments found
                        </p>
                        <p className="text-sm text-gray-500 max-w-md">
                          {searchTerm ||
                          statusFilter !== "all" ||
                          dateFilter !== "all"
                            ? "Try adjusting your search or filters to find what you're looking for"
                            : "Make your first payment to see transaction history here"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment, index) => (
                    <tr
                      key={payment.id}
                      className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div>
                          <div className="text-sm font-bold text-gray-900 mb-1">
                            {payment.mpesa_transaction_id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.notes || "Monthly Rent Payment"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {new Date(
                              payment.payment_date
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(
                              payment.payment_date
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          {getPaymentMethodIcon(payment.mpesa_transaction_id)}
                          <span className="text-sm font-medium text-gray-900">
                            {payment.mpesa_transaction_id.startsWith("MP")
                              ? "M-Pesa"
                              : "Card"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => handleViewReceipt(payment)}
                          className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-plot/10 to-secondary-plot/10 text-primary-plot hover:from-primary-plot hover:to-secondary-plot hover:text-white rounded-lg transition-all duration-200 font-semibold border border-primary-plot/20 hover:border-transparent"
                          title="View Receipt"
                        >
                          <TbReceipt size={16} />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Property Info Footer */}
        {property && (
          <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-plot/5 rounded-full -mr-8 -mt-8 blur-lg"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Property:</span>
                  <span className="text-gray-900 font-medium">
                    {property.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Unit:</span>
                  <span className="text-gray-900 font-medium">
                    {unit?.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">
                    Monthly Rent:
                  </span>
                  <span className="text-gray-900 font-bold text-lg">
                    {formatCurrency(unit?.rent_amount || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Receipt Modal */}
      {showReceipt && selectedPayment && (
        <PaymentReceipt
          payment={selectedPayment}
          onClose={() => {
            setShowReceipt(false);
            setSelectedPayment(null);
          }}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={confirmationModal.onConfirm}
        type={confirmationModal.type}
        title={confirmationModal.title}
        message={confirmationModal.message}
        itemName={confirmationModal.itemName}
        isLoading={confirmationModal.isLoading}
        autoClose={confirmationModal.autoClose}
      />
    </TenantLayout>
  );
};

export default TenantPayments;
