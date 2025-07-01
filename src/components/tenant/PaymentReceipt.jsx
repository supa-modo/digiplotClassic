import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  getUnitById,
  getPropertyById,
  getLandlordById,
} from "../../utils/demoData";
import {
  TbX,
  TbPrinter,
  TbReceipt,
  TbSparkles,
  TbCheck,
  TbClock,
  TbAlertTriangle,
  TbDownload,
  TbShare,
} from "react-icons/tb";
import { PiBuildingsDuotone } from "react-icons/pi";

const PaymentReceipt = ({ payment, onClose, showPrintPreview = false }) => {
  const { user } = useAuth();
  const unit = getUnitById(payment.unit_id);
  const property = unit ? getPropertyById(unit.property_id) : null;
  const landlord = property ? getLandlordById(property.landlord_id) : null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const receiptContent = document.getElementById("receipt-content").innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt - ${payment.mpesa_transaction_id}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #333;
            }
            .receipt-container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border: 1px solid #ddd;
              border-radius: 8px;
              overflow: hidden;
            }
            .receipt-header {
              background: linear-gradient(135deg, #01818d, #016a74);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .receipt-body {
              padding: 30px;
            }
            .company-logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            .company-tagline {
              font-size: 12px;
              opacity: 0.9;
            }
            .receipt-title {
              font-size: 28px;
              font-weight: bold;
              margin: 20px 0 10px 0;
            }
            .receipt-number {
              font-size: 14px;
              opacity: 0.9;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #01818d;
              margin-bottom: 10px;
              border-bottom: 2px solid #01818d;
              padding-bottom: 5px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding: 5px 0;
            }
            .info-label {
              font-weight: 600;
              color: #64748B;
            }
            .info-value {
              font-weight: 500;
            }
            .amount-section {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .total-amount {
              font-size: 24px;
              font-weight: bold;
              color: #01818d;
              text-align: center;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-successful {
              background: #dcfce7;
              color: #16a34a;
            }
            .status-pending {
              background: #fef3c7;
              color: #d97706;
            }
            .status-failed {
              background: #fee2e2;
              color: #dc2626;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .receipt-container { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          ${receiptContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      successful: {
        icon: TbCheck,
        className: "bg-green-100 text-green-800 border border-green-200",
        label: "Successful",
      },
      pending: {
        icon: TbClock,
        className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        label: "Pending",
      },
      failed: {
        icon: TbAlertTriangle,
        className: "bg-red-100 text-red-800 border border-red-200",
        label: "Failed",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.className}`}
      >
        <IconComponent className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      {payment && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-3xl bg-gradient-to-br from-primary-plot/5 via-secondary-plot/5 to-primary-plot/5 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50 overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-20 -right-20 w-40 h-40 bg-primary-plot/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 -right-16 w-32 h-32 bg-secondary-plot/10 rounded-full blur-2xl" />
            <div className="absolute top-1/2 -right-24 w-48 h-48 bg-gradient-to-r from-primary-plot/5 to-secondary-plot/5 rounded-full blur-3xl" />

            {/* Content Container */}
            <div className="relative h-full flex flex-col bg-white/95 backdrop-blur-xl">
              {/* Header */}
              <div className="flex-shrink-0 relative px-8 py-6 bg-gradient-to-r from-primary-plot via-secondary-plot to-primary-plot border-b border-white/20">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                      <TbReceipt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Payment Receipt
                        <TbSparkles className="w-5 h-5 text-yellow-300" />
                      </h2>
                      <p className="text-white/80 text-sm mt-1">
                        Transaction ID: {payment.mpesa_transaction_id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handlePrint}
                      className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 text-white hover:bg-white/30 transition-all duration-200 hover:scale-105"
                      title="Print Receipt"
                    >
                      <TbPrinter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={onClose}
                      className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 text-white hover:bg-white/30 transition-all duration-200 hover:scale-105"
                    >
                      <TbX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Receipt Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div id="receipt-content">
                  <div className="receipt-container bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Receipt Header */}
                    <div className="receipt-header bg-gradient-to-r from-primary-plot to-secondary-plot text-white p-8 text-center">
                      <div className="company-logo flex items-center justify-center gap-3 mb-2">
                        <PiBuildingsDuotone className="text-3xl" />
                        <span className="text-2xl font-bold">DigiPlot</span>
                      </div>
                      <div className="company-tagline text-white/80 text-sm mb-6">
                        Digital Property Management Platform
                      </div>
                      <div className="receipt-title text-3xl font-bold mb-2">
                        Payment Receipt
                      </div>
                      <div className="receipt-number text-white/90">
                        Receipt #: {payment.mpesa_transaction_id}
                      </div>
                    </div>

                    {/* Receipt Body */}
                    <div className="receipt-body p-8 space-y-8">
                      {/* Payment Status */}
                      <div className="text-center">
                        {getStatusBadge(payment.status)}
                      </div>

                      {/* Payment Details */}
                      <div className="section">
                        <div className="section-title text-lg font-semibold text-primary-plot border-b-2 border-primary-plot pb-2 mb-4">
                          Payment Details
                        </div>
                        <div className="space-y-3">
                          <div className="info-row flex justify-between py-2">
                            <span className="info-label font-medium text-gray-600">
                              Amount Paid:
                            </span>
                            <span className="info-value font-semibold text-gray-900">
                              {formatCurrency(payment.amount)}
                            </span>
                          </div>
                          <div className="info-row flex justify-between py-2">
                            <span className="info-label font-medium text-gray-600">
                              Payment Method:
                            </span>
                            <span className="info-value font-medium text-gray-900">
                              M-Pesa
                            </span>
                          </div>
                          <div className="info-row flex justify-between py-2">
                            <span className="info-label font-medium text-gray-600">
                              Transaction ID:
                            </span>
                            <span className="info-value font-mono text-sm text-gray-900">
                              {payment.mpesa_transaction_id}
                            </span>
                          </div>
                          <div className="info-row flex justify-between py-2">
                            <span className="info-label font-medium text-gray-600">
                              Payment Date:
                            </span>
                            <span className="info-value font-medium text-gray-900">
                              {formatDate(payment.payment_date)}
                            </span>
                          </div>
                          <div className="info-row flex justify-between py-2">
                            <span className="info-label font-medium text-gray-600">
                              Payment For:
                            </span>
                            <span className="info-value font-medium text-gray-900 capitalize">
                              {payment.payment_type} - {payment.period}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Property & Unit Information */}
                      {property && unit && (
                        <div className="section">
                          <div className="section-title text-lg font-semibold text-primary-plot border-b-2 border-primary-plot pb-2 mb-4">
                            Property Information
                          </div>
                          <div className="space-y-3">
                            <div className="info-row flex justify-between py-2">
                              <span className="info-label font-medium text-gray-600">
                                Property:
                              </span>
                              <span className="info-value font-medium text-gray-900">
                                {property.name}
                              </span>
                            </div>
                            <div className="info-row flex justify-between py-2">
                              <span className="info-label font-medium text-gray-600">
                                Unit:
                              </span>
                              <span className="info-value font-medium text-gray-900">
                                {unit.unit_number} ({unit.unit_type})
                              </span>
                            </div>
                            <div className="info-row flex justify-between py-2">
                              <span className="info-label font-medium text-gray-600">
                                Address:
                              </span>
                              <span className="info-value font-medium text-gray-900 text-right">
                                {property.address}, {property.city}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tenant Information */}
                      <div className="section">
                        <div className="section-title text-lg font-semibold text-primary-plot border-b-2 border-primary-plot pb-2 mb-4">
                          Tenant Information
                        </div>
                        <div className="space-y-3">
                          <div className="info-row flex justify-between py-2">
                            <span className="info-label font-medium text-gray-600">
                              Name:
                            </span>
                            <span className="info-value font-medium text-gray-900">
                              {user?.firstName} {user?.lastName}
                            </span>
                          </div>
                          <div className="info-row flex justify-between py-2">
                            <span className="info-label font-medium text-gray-600">
                              Email:
                            </span>
                            <span className="info-value font-medium text-gray-900">
                              {user?.email}
                            </span>
                          </div>
                          {user?.phone && (
                            <div className="info-row flex justify-between py-2">
                              <span className="info-label font-medium text-gray-600">
                                Phone:
                              </span>
                              <span className="info-value font-medium text-gray-900">
                                {user.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Landlord Information */}
                      {landlord && (
                        <div className="section">
                          <div className="section-title text-lg font-semibold text-primary-plot border-b-2 border-primary-plot pb-2 mb-4">
                            Landlord Information
                          </div>
                          <div className="space-y-3">
                            <div className="info-row flex justify-between py-2">
                              <span className="info-label font-medium text-gray-600">
                                Name:
                              </span>
                              <span className="info-value font-medium text-gray-900">
                                {landlord.firstName} {landlord.lastName}
                              </span>
                            </div>
                            <div className="info-row flex justify-between py-2">
                              <span className="info-label font-medium text-gray-600">
                                Contact:
                              </span>
                              <span className="info-value font-medium text-gray-900">
                                {landlord.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Amount Breakdown */}
                      <div className="amount-section bg-gradient-to-r from-primary-plot/5 to-secondary-plot/5 rounded-2xl p-6 border border-primary-plot/10">
                        <div className="total-amount text-center">
                          <div className="text-sm text-gray-600 mb-2">
                            Total Amount Paid
                          </div>
                          <div className="text-4xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
                            {formatCurrency(payment.amount)}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="footer text-center border-t border-gray-200 pt-6">
                        <p className="text-sm text-gray-500 mb-2">
                          Thank you for your payment!
                        </p>
                        <p className="text-xs text-gray-400">
                          This is a computer-generated receipt. No signature
                          required.
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Generated on {formatDate(new Date().toISOString())}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 font-medium bg-white/70 backdrop-blur-sm hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Close
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-plot to-secondary-plot text-white hover:from-primary-plot/90 hover:to-secondary-plot/90 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:scale-105 shadow-lg"
                  >
                    <TbPrinter className="w-5 h-5" />
                    Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentReceipt;
