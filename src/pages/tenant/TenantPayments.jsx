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
      <div className="p-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-secondary-plot mb-2">
                Payment History
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your rent payments and view transaction history
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold flex items-center space-x-3 transform hover:scale-105"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                <TbPlus size={20} />
                <span>Make Payment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-8 rounded-2xl border border-blue-200 shadow-lg">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-300/20 rounded-full -mr-8 -mt-8 blur-lg"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-400/10 rounded-full -ml-4 -mb-4 blur-md"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-700 text-sm font-semibold uppercase tracking-wide">
                    Monthly Rent
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">
                    {formatCurrency(unit?.rent_amount || 0)}
                  </p>
                </div>
                <div className="p-4 bg-blue-200/50 rounded-xl backdrop-blur-sm">
                  <TbCreditCard className="text-blue-700" size={28} />
                </div>
              </div>
              <div className="flex items-center text-blue-600 text-sm">
                <TbCalendar size={14} className="mr-1" />
                <span>Due monthly</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 p-8 rounded-2xl border border-green-200 shadow-lg">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-300/20 rounded-full -mr-8 -mt-8 blur-lg"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-400/10 rounded-full -ml-4 -mb-4 blur-md"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-green-700 text-sm font-semibold uppercase tracking-wide">
                    Total Paid
                  </p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {formatCurrency(
                      payments
                        .filter((p) => p.status === "successful")
                        .reduce((sum, p) => sum + p.amount, 0)
                    )}
                  </p>
                </div>
                <div className="p-4 bg-green-200/50 rounded-xl backdrop-blur-sm">
                  <TbReceipt className="text-green-700" size={28} />
                </div>
              </div>
              <div className="flex items-center text-green-600 text-sm">
                <TbCheck size={14} className="mr-1" />
                <span>Successfully processed</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-100 p-8 rounded-2xl border border-purple-200 shadow-lg">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-300/20 rounded-full -mr-8 -mt-8 blur-lg"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-400/10 rounded-full -ml-4 -mb-4 blur-md"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-700 text-sm font-semibold uppercase tracking-wide">
                    Transactions
                  </p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    {payments.length}
                  </p>
                </div>
                <div className="p-4 bg-purple-200/50 rounded-xl backdrop-blur-sm">
                  <TbCoins className="text-purple-700" size={28} />
                </div>
              </div>
              <div className="flex items-center text-purple-600 text-sm">
                <TbCalendar size={14} className="mr-1" />
                <span>All time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-plot/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                <TbFilter className="text-gray-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary-plot">
                  Search & Filter
                </h3>
                <p className="text-sm text-gray-500">
                  Find specific payments quickly
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <TbSearch
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by transaction ID or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="successful">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex items-center space-x-3">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors font-medium"
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

        {/* Enhanced Payments Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
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
          <div className="mt-8 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-lg relative overflow-hidden">
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
