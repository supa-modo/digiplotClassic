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
  TbCoins,
  TbSparkles,
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-100">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary-plot/5 blur-xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-secondary-plot/5 blur-xl pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-primary-plot/5 to-secondary-plot/5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-primary-plot/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm">
              <TbCoins className="h-6 w-6 text-primary-plot" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-plot">
                Make Payment
              </h2>
              <p className="text-sm text-gray-500">
                Pay your rent securely and easily
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <TbX size={24} />
          </button>
        </div>

        <div className="relative z-10 p-6 space-y-6">
          {/* Overdue Alert */}
          {overdueMonths.length > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full -mr-5 -mt-5 blur-lg"></div>

              <div className="relative z-10 flex items-start space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TbAlertTriangle className="text-orange-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-orange-800 mb-2">
                    Overdue Payments Detected
                  </h3>
                  <p className="text-orange-700 text-sm mb-3">
                    You have {overdueMonths.length} overdue payment(s). Please
                    pay to avoid late fees.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {overdueMonths.map((month) => (
                      <span
                        key={month.key}
                        className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full border border-orange-200"
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
          <div className="bg-white rounded-xl border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-5 -mt-5 blur-lg"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                  <TbCalendar className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-plot">
                    Select Months to Pay
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose which months you want to pay for
                  </p>
                </div>
              </div>

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
                        p-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 hover:scale-105 disabled:hover:scale-100
                        ${
                          isPaid
                            ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-green-700 cursor-not-allowed"
                            : isSelected
                            ? "bg-gradient-to-br from-primary-plot to-secondary-plot text-white border-primary-plot shadow-lg"
                            : isOverdue
                            ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                            : "bg-gradient-to-br from-gray-50 to-blue-50/30 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wide">
                          {month.label}
                        </span>
                        {isPaid && (
                          <TbCheck size={16} className="text-green-600" />
                        )}
                        {isOverdue && !isPaid && <TbAlertTriangle size={16} />}
                      </div>
                      <div className="text-lg font-bold">
                        KES {monthlyRent.toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          {selectedMonths.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-5 -mt-5 blur-lg"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <TbSparkles className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800">Payment Summary</h4>
                    <p className="text-blue-600 text-sm">
                      {selectedMonths.length} month(s) selected
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-800">
                    KES {calculateTotal().toLocaleString()}
                  </div>
                  <div className="text-blue-600 text-sm">
                    {selectedMonths.length} × KES {monthlyRent.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -mr-5 -mt-5 blur-lg"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <TbCreditCard className="text-purple-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-plot">
                    Payment Method
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose your preferred payment option
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* M-Pesa Option */}
                <label
                  className={`
                  flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105
                  ${
                    paymentMethod === "mpesa"
                      ? "border-primary-plot bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50/30"
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
                  <div
                    className={`p-3 rounded-xl mr-4 ${
                      paymentMethod === "mpesa" ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <TbDeviceMobile
                      className={
                        paymentMethod === "mpesa"
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                      size={24}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">
                      M-Pesa Mobile Money
                    </div>
                    <div className="text-sm text-gray-500">
                      Pay using your M-Pesa account instantly
                    </div>
                  </div>
                  {paymentMethod === "mpesa" && (
                    <div className="w-6 h-6 bg-primary-plot rounded-full flex items-center justify-center">
                      <TbCheck className="text-white" size={14} />
                    </div>
                  )}
                </label>

                {/* Card Option */}
                <label
                  className={`
                  flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105
                  ${
                    paymentMethod === "card"
                      ? "border-primary-plot bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50/30"
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
                  <div
                    className={`p-3 rounded-xl mr-4 ${
                      paymentMethod === "card" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <TbCreditCard
                      className={
                        paymentMethod === "card"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                      size={24}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">
                      Credit/Debit Card
                    </div>
                    <div className="text-sm text-gray-500">
                      Pay using your bank card securely
                    </div>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="w-6 h-6 bg-primary-plot rounded-full flex items-center justify-center">
                      <TbCheck className="text-white" size={14} />
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === "mpesa" && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <label className="block text-sm font-bold text-green-800 mb-3">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="0712345678"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-semibold"
              />
              <p className="text-xs text-green-700 mt-2 font-medium">
                💚 You will receive an STK push to complete the payment
              </p>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-blue-800 mb-3">
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
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-800 mb-3">
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
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-blue-800 mb-3">
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
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-800 mb-3">
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
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Status */}
          {paymentStatus && (
            <div
              className={`
              p-6 rounded-xl border-2 relative overflow-hidden
              ${
                paymentStatus.success
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                  : "bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
              }
            `}
            >
              <div
                className={`absolute top-0 right-0 w-20 h-20 rounded-full -mr-5 -mt-5 blur-lg ${
                  paymentStatus.success ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              ></div>

              <div className="relative z-10 flex items-center space-x-3">
                <div
                  className={`p-3 rounded-xl ${
                    paymentStatus.success ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {paymentStatus.success ? (
                    <TbCheck className="text-green-600" size={20} />
                  ) : (
                    <TbAlertTriangle className="text-red-600" size={20} />
                  )}
                </div>
                <div>
                  <span
                    className={`font-bold ${
                      paymentStatus.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {paymentStatus.message}
                  </span>
                  {paymentStatus.success && paymentStatus.transactionId && (
                    <p className="text-sm text-green-700 mt-1 font-medium">
                      Transaction ID: {paymentStatus.transactionId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-bold shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={processPayment}
              disabled={
                loading || selectedMonths.length === 0 || paymentStatus?.success
              }
              className="flex-1 bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-4 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold flex items-center justify-center space-x-2 transform hover:scale-105 disabled:transform-none shadow-lg"
            >
              {loading ? (
                <>
                  <TbLoader2 className="animate-spin" size={20} />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <TbCoins size={20} />
                  <span>Pay KES {calculateTotal().toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
