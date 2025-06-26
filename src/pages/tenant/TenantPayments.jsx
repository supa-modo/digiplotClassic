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
} from "react-icons/tb";

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
      },
      pending: {
        class: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Pending",
      },
      failed: {
        class: "bg-red-100 text-red-800 border-red-200",
        text: "Failed",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${config.class}`}
      >
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
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-plot">
              Payment History
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your rent payments and view transaction history
            </p>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="mt-4 lg:mt-0 bg-primary-plot text-white px-6 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors font-medium flex items-center space-x-2"
          >
            <TbPlus size={20} />
            <span>Make Payment</span>
          </button>
        </div>

        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">
                  Monthly Rent
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  KSH {unit?.rent_amount?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <TbCreditCard className="text-blue-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Paid</p>
                <p className="text-2xl font-bold text-green-800">
                  KSH{" "}
                  {payments
                    .filter((p) => p.status === "successful")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <TbReceipt className="text-green-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">
                  Transactions
                </p>
                <p className="text-2xl font-bold text-purple-800">
                  {payments.length}
                </p>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <TbCalendar className="text-purple-700" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <TbSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by transaction ID or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
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

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <TbCalendar className="text-gray-400" size={20} />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="last3Months">Last 3 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <TbReceipt className="text-gray-300 mb-3" size={48} />
                        <p className="text-lg font-medium mb-1">
                          No payments found
                        </p>
                        <p className="text-sm">
                          {searchTerm ||
                          statusFilter !== "all" ||
                          dateFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "Make your first payment to see transaction history"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.mpesa_transaction_id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.notes || "Monthly Rent Payment"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(payment.payment_date).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          KSH {payment.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(payment.mpesa_transaction_id)}
                          <span className="text-sm text-gray-900">
                            {payment.mpesa_transaction_id.startsWith("MP")
                              ? "M-Pesa"
                              : "Card"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewReceipt(payment)}
                            className="text-primary-plot hover:text-primary-plot/80 transition-colors flex items-center space-x-1 px-2 py-1 rounded hover:bg-primary-plot/10"
                            title="View Receipt"
                          >
                            <TbReceipt size={16} />
                            <span>Receipt</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Property Info Footer */}
        {property && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">Property:</span> {property.name}
              </div>
              <div>
                <span className="font-medium">Unit:</span> {unit?.name}
              </div>
              <div>
                <span className="font-medium">Monthly Rent:</span> KSH{" "}
                {unit?.rent_amount?.toLocaleString()}
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
