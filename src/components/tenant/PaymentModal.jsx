import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getTenantPayments, getUnitById } from "../../utils/demoData";
import {
  TbX,
  TbCalendar,
  TbCreditCard,
  TbDeviceMobile,
  TbAlertTriangle,
  TbInfoCircle,
  TbCheck,
  TbLoader2,
} from "react-icons/tb";

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    holderName: "",
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [overdueMonths, setOverdueMonths] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [monthsToShow, setMonthsToShow] = useState([]);

  // Get user's unit and rent amount
  const userPayments = getTenantPayments(user?.id);
  const unit = getUnitById(userPayments[0]?.unit_id);
  const monthlyRent = unit?.rent_amount || 0;

  useEffect(() => {
    if (isOpen) {
      initializePaymentData();
    }
  }, [isOpen, user]);

  const initializePaymentData = () => {
    const now = new Date();
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    setCurrentMonth(current);

    // Generate months for the next 12 months including current
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      months.push({
        key: monthKey,
        label: date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        date: date,
        isPast: i < 0,
        isCurrent: i === 0,
        isFuture: i > 0,
      });
    }
    setMonthsToShow(months);

    // Check for overdue payments
    checkOverduePayments(current);

    // Reset form
    setSelectedMonths([]);
    setPaymentMethod("mpesa");
    setMpesaPhone("");
    setCardDetails({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      holderName: "",
    });
    setPaymentStatus(null);
  };

  const checkOverduePayments = (currentMonth) => {
    const payments = getTenantPayments(user?.id);
    const paidMonths = payments
      .filter((p) => p.status === "successful")
      .map((p) => {
        const date = new Date(p.payment_date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      });

    const now = new Date();
    const overdue = [];

    // Check previous months that haven't been paid
    for (let i = 1; i <= 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!paidMonths.includes(monthKey)) {
        overdue.push({
          key: monthKey,
          label: date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          }),
          date: date,
        });
      }
    }

    // Check if current month is paid
    if (!paidMonths.includes(currentMonth)) {
      const date = new Date(now.getFullYear(), now.getMonth(), 1);
      overdue.push({
        key: currentMonth,
        label: date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        date: date,
        isCurrent: true,
      });
    }

    setOverdueMonths(overdue);

    // Auto-select overdue months
    if (overdue.length > 0) {
      setSelectedMonths(overdue.map((m) => m.key));
    }
  };

  const isMonthPaid = (monthKey) => {
    const payments = getTenantPayments(user?.id);
    return payments.some((p) => {
      const date = new Date(p.payment_date);
      const paymentMonth = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      return paymentMonth === monthKey && p.status === "successful";
    });
  };

  const toggleMonth = (monthKey) => {
    if (selectedMonths.includes(monthKey)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== monthKey));
    } else {
      setSelectedMonths([...selectedMonths, monthKey]);
    }
  };

  const calculateTotal = () => {
    return selectedMonths.length * monthlyRent;
  };

  const validateForm = () => {
    if (selectedMonths.length === 0) {
      alert("Please select at least one month to pay for.");
      return false;
    }

    if (paymentMethod === "mpesa") {
      if (!mpesaPhone.trim()) {
        alert("Please enter your M-Pesa phone number.");
        return false;
      }
      if (!/^(\+254|254|0)?[17]\d{8}$/.test(mpesaPhone.replace(/\s/g, ""))) {
        alert("Please enter a valid Kenyan phone number.");
        return false;
      }
    } else if (paymentMethod === "card") {
      if (
        !cardDetails.cardNumber.trim() ||
        !cardDetails.expiryDate.trim() ||
        !cardDetails.cvv.trim() ||
        !cardDetails.holderName.trim()
      ) {
        alert("Please fill in all card details.");
        return false;
      }
      if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ""))) {
        alert("Please enter a valid 16-digit card number.");
        return false;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
        alert("Please enter a valid expiry date (MM/YY).");
        return false;
      }
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        alert("Please enter a valid CVV.");
        return false;
      }
    }

    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setPaymentStatus(null);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate payment success (90% success rate)
      const success = Math.random() > 0.1;

      if (success) {
        // Generate mock transaction ID
        const transactionId =
          paymentMethod === "mpesa"
            ? `MP${Date.now()}${Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase()}`
            : `CD${Date.now()}${Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase()}`;

        setPaymentStatus({
          success: true,
          message: "Payment successful!",
          transactionId,
          amount: calculateTotal(),
          months: selectedMonths,
        });

        // Call success callback
        setTimeout(() => {
          onPaymentSuccess({
            transactionId,
            amount: calculateTotal(),
            months: selectedMonths,
            paymentMethod,
          });
          onClose();
        }, 2000);
      } else {
        setPaymentStatus({
          success: false,
          message: "Payment failed. Please try again.",
        });
      }
    } catch (error) {
      setPaymentStatus({
        success: false,
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-secondary-plot">
            Make Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <TbX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overdue Alert */}
          {overdueMonths.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <TbAlertTriangle className="text-orange-500 mt-0.5" size={20} />
                <div>
                  <h3 className="font-medium text-orange-800">
                    Overdue Payments
                  </h3>
                  <p className="text-orange-700 text-sm mt-1">
                    You have {overdueMonths.length} overdue payment(s). Please
                    pay to avoid late fees.
                  </p>
                  <div className="mt-2 text-sm text-orange-600">
                    {overdueMonths.map((month) => (
                      <span
                        key={month.key}
                        className="inline-block bg-orange-100 px-2 py-1 rounded mr-2 mb-1"
                      >
                        {month.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Month Selection */}
          <div>
            <h3 className="font-medium text-secondary-plot mb-3 flex items-center">
              <TbCalendar className="mr-2" size={20} />
              Select Months to Pay
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {monthsToShow.map((month) => {
                const isPaid = isMonthPaid(month.key);
                const isSelected = selectedMonths.includes(month.key);
                const isOverdue = overdueMonths.some(
                  (m) => m.key === month.key
                );

                return (
                  <button
                    key={month.key}
                    onClick={() => !isPaid && toggleMonth(month.key)}
                    disabled={isPaid}
                    className={`
                      p-3 rounded-lg border text-sm font-medium transition-all
                      ${
                        isPaid
                          ? "bg-green-50 border-green-200 text-green-600 cursor-not-allowed"
                          : isSelected
                          ? "bg-primary-plot text-white border-primary-plot"
                          : isOverdue
                          ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{month.label}</span>
                      {isPaid && <TbCheck size={16} />}
                      {isOverdue && !isPaid && <TbAlertTriangle size={16} />}
                    </div>
                    <div className="text-xs mt-1 opacity-75">
                      KSH {monthlyRent.toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Summary */}
          {selectedMonths.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-800">Payment Summary</h4>
                  <p className="text-blue-600 text-sm">
                    {selectedMonths.length} month(s) selected
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-800">
                    KSH {calculateTotal().toLocaleString()}
                  </div>
                  <div className="text-blue-600 text-sm">
                    {selectedMonths.length} × KSH {monthlyRent.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div>
            <h3 className="font-medium text-secondary-plot mb-3">
              Payment Method
            </h3>
            <div className="space-y-3">
              {/* M-Pesa Option */}
              <label
                className={`
                flex items-center p-4 border rounded-lg cursor-pointer transition-all
                ${
                  paymentMethod === "mpesa"
                    ? "border-primary-plot bg-primary-plot/5"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mpesa"
                  checked={paymentMethod === "mpesa"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <TbDeviceMobile
                  className={`mr-3 ${
                    paymentMethod === "mpesa"
                      ? "text-primary-plot"
                      : "text-gray-400"
                  }`}
                  size={24}
                />
                <div>
                  <div className="font-medium">M-Pesa Mobile Money</div>
                  <div className="text-sm text-gray-500">
                    Pay using your M-Pesa account
                  </div>
                </div>
              </label>

              {/* Card Option */}
              <label
                className={`
                flex items-center p-4 border rounded-lg cursor-pointer transition-all
                ${
                  paymentMethod === "card"
                    ? "border-primary-plot bg-primary-plot/5"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <TbCreditCard
                  className={`mr-3 ${
                    paymentMethod === "card"
                      ? "text-primary-plot"
                      : "text-gray-400"
                  }`}
                  size={24}
                />
                <div>
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-gray-500">
                    Pay using your bank card
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === "mpesa" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="0712345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                You will receive an STK push to complete the payment
              </p>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  value={cardDetails.holderName}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      holderName: e.target.value,
                    })
                  }
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      cardNumber: formatCardNumber(e.target.value),
                    })
                  }
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiryDate}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        expiryDate: formatExpiryDate(e.target.value),
                      })
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cvv: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Status */}
          {paymentStatus && (
            <div
              className={`
              p-4 rounded-lg border
              ${
                paymentStatus.success
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }
            `}
            >
              <div className="flex items-center">
                {paymentStatus.success ? (
                  <TbCheck className="mr-2" size={20} />
                ) : (
                  <TbAlertTriangle className="mr-2" size={20} />
                )}
                <span className="font-medium">{paymentStatus.message}</span>
              </div>
              {paymentStatus.success && paymentStatus.transactionId && (
                <p className="text-sm mt-2">
                  Transaction ID: {paymentStatus.transactionId}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={processPayment}
              disabled={
                loading || selectedMonths.length === 0 || paymentStatus?.success
              }
              className="flex-1 bg-primary-plot text-white px-4 py-2 rounded-lg hover:bg-primary-plot/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <TbLoader2 className="animate-spin mr-2" size={20} />
                  Processing...
                </>
              ) : (
                `Pay KSH ${calculateTotal().toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
