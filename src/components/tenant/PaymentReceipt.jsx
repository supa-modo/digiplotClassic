import { useAuth } from "../../contexts/AuthContext";
import {
  getUnitById,
  getPropertyById,
  getLandlordById,
} from "../../utils/demoData";
import { PiBuildingsBold } from "react-icons/pi";

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
    const statusClasses = {
      successful: "status-successful",
      pending: "status-pending",
      failed: "status-failed",
    };

    return (
      <span
        className={`status-badge ${
          statusClasses[status] || statusClasses.pending
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-secondary-plot">
            Payment Receipt
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="bg-primary-plot text-white px-4 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors font-medium"
            >
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          <div id="receipt-content">
            <div className="receipt-container">
              {/* Header */}
              <div className="receipt-header">
                <div className="company-logo">
                  <PiBuildingsBold size={32} />
                  <span>DIGIPLOT</span>
                </div>
                <div className="company-tagline">
                  Premium Property Management
                </div>
                <div className="receipt-title">PAYMENT RECEIPT</div>
                <div className="receipt-number">
                  Receipt #: {payment.id.toUpperCase()}
                </div>
              </div>

              {/* Body */}
              <div className="receipt-body">
                {/* Payment Information */}
                <div className="section">
                  <div className="section-title">Payment Details</div>
                  <div className="info-row">
                    <span className="info-label">Transaction ID:</span>
                    <span className="info-value">
                      {payment.mpesa_transaction_id}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Payment Date:</span>
                    <span className="info-value">
                      {new Date(payment.payment_date).toLocaleString()}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Payment Method:</span>
                    <span className="info-value">M-Pesa Mobile Money</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Status:</span>
                    <span className="info-value">
                      {getStatusBadge(payment.status)}
                    </span>
                  </div>
                </div>

                {/* Tenant Information */}
                <div className="section">
                  <div className="section-title">Tenant Information</div>
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{user?.full_name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{user?.phone}</span>
                  </div>
                </div>

                {/* Property Information */}
                <div className="section">
                  <div className="section-title">Property Information</div>
                  <div className="info-row">
                    <span className="info-label">Property:</span>
                    <span className="info-value">{property?.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Unit:</span>
                    <span className="info-value">{unit?.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Address:</span>
                    <span className="info-value">{property?.address}</span>
                  </div>
                </div>

                {/* Landlord Information */}
                <div className="section">
                  <div className="section-title">Landlord Information</div>
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{landlord?.full_name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Business:</span>
                    <span className="info-value">
                      {landlord?.business_name}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{landlord?.phone}</span>
                  </div>
                </div>

                {/* Amount Section */}
                <div className="amount-section">
                  <div className="info-row">
                    <span className="info-label">Description:</span>
                    <span className="info-value">
                      {payment.notes || "Monthly Rent Payment"}
                    </span>
                  </div>
                  <div className="total-amount">
                    KSH {payment.amount.toLocaleString()}
                  </div>
                </div>

                {/* Footer */}
                <div className="footer">
                  <p>This is an electronically generated receipt.</p>
                  <p>
                    For any queries, contact: support@digiplot.com | +254 700
                    000 000
                  </p>
                  <p>Generated on: {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
