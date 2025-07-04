import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import TenantModal from "../../components/landlord/TenantModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useAuth } from "../../contexts/AuthContext";
import leaseService from "../../services/leaseService";
import unitService from "../../services/unitService";
import paymentService from "../../services/paymentService";
import maintenanceService from "../../services/maintenanceService";
import {
  TbArrowLeft,
  TbHome,
  TbUsers,
  TbCurrencyDollar,
  TbCalendar,
  TbEdit,
  TbPlus,
  TbUserPlus,
  TbHistory,
  TbTrendingUp,
  TbCash,
  TbTools,
  TbEye,
  TbDownload,
  TbCheck,
  TbX,
  TbClock,
  TbAlertCircle,
  TbSparkles,
  TbBuildingBank,
  TbReceiptTax,
  TbCalendarEvent,
  TbPhoneCall,
  TbMail,
  TbMapPin,
} from "react-icons/tb";

const LandlordUnitDetails = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [unit, setUnit] = useState(null);
  const [leaseHistory, setLeaseHistory] = useState([]);
  const [currentLease, setCurrentLease] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    onConfirm: null,
  });

  // Fetch unit details and history
  useEffect(() => {
    if (unitId && user?.id) {
      fetchUnitDetails();
    }
  }, [unitId, user]);

  const fetchUnitDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch unit lease history (includes unit details, current lease, history, and stats)
      const leaseHistoryResponse = await leaseService.getUnitLeaseHistory(
        unitId
      );

      if (leaseHistoryResponse.success) {
        const {
          unit: unitData,
          currentLease: current,
          leaseHistory: history,
          statistics: stats,
        } = leaseHistoryResponse.data;

        setUnit(unitData);
        setCurrentLease(current);
        setLeaseHistory(history);
        setStatistics(stats);

        // Fetch payment history for this unit
        const paymentsResponse = await paymentService.getPayments({
          unitId,
          limit: 50,
        });
        if (paymentsResponse.success) {
          setPaymentHistory(paymentsResponse.data.payments || []);
        }

        // Fetch maintenance requests for this unit
        const maintenanceResponse =
          await maintenanceService.getMaintenanceRequests({
            unitId,
            limit: 20,
          });
        if (maintenanceResponse.success) {
          setMaintenanceRequests(maintenanceResponse.data.requests || []);
        }
      } else {
        setError(
          leaseHistoryResponse.message || "Failed to fetch unit details"
        );
      }
    } catch (error) {
      console.error("Error fetching unit details:", error);
      setError(error.message || "An error occurred while loading unit details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTenant = () => {
    setShowTenantModal(true);
  };

  const handleTenantSave = async (tenantData) => {
    try {
      // Refresh unit data after tenant/lease creation
      await fetchUnitDetails();

      setConfirmationModal({
        isOpen: true,
        type: "success",
        title: "Tenant Added Successfully",
        message: `${tenantData.firstName} ${tenantData.lastName} has been assigned to this unit.`,
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        autoClose: true,
      });
    } catch (error) {
      setConfirmationModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to refresh unit data. Please reload the page.",
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  const terminateLease = async (lease) => {
    setConfirmationModal({
      isOpen: true,
      type: "confirm",
      title: "Terminate Lease",
      message: `Are you sure you want to terminate the lease for ${lease.tenant?.firstName} ${lease.tenant?.lastName}? This will mark the unit as vacant.`,
      onConfirm: async () => {
        try {
          const response = await leaseService.terminateLease(lease.id, {
            terminationReason: "Terminated by landlord",
            moveOutDate: new Date().toISOString().split("T")[0],
          });

          if (response.success) {
            await fetchUnitDetails();
            setConfirmationModal({
              isOpen: true,
              type: "success",
              title: "Lease Terminated",
              message: "The lease has been terminated successfully.",
              onConfirm: () =>
                setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
              autoClose: true,
            });
          } else {
            throw new Error(response.message);
          }
        } catch (error) {
          setConfirmationModal({
            isOpen: true,
            type: "error",
            title: "Error",
            message: error.message || "Failed to terminate lease",
            onConfirm: () =>
              setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
          });
        }
      },
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        label: "Active",
        class: "bg-green-100 text-green-700 border-green-300",
      },
      expired: {
        label: "Expired",
        class: "bg-yellow-100 text-yellow-700 border-yellow-300",
      },
      terminated: {
        label: "Terminated",
        class: "bg-red-100 text-red-700 border-red-300",
      },
      pending: {
        label: "Pending",
        class: "bg-blue-100 text-blue-700 border-blue-300",
      },
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      successful: {
        label: "Paid",
        class: "bg-green-100 text-green-700 border-green-300",
        icon: TbCheck,
      },
      pending: {
        label: "Pending",
        class: "bg-yellow-100 text-yellow-700 border-yellow-300",
        icon: TbClock,
      },
      failed: {
        label: "Failed",
        class: "bg-red-100 text-red-700 border-red-300",
        icon: TbX,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.class} flex items-center gap-1`}
      >
        <IconComponent className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <LandlordLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-plot mx-auto mb-4"></div>
            <p className="text-gray-600">Loading unit details...</p>
          </div>
        </div>
      </LandlordLayout>
    );
  }

  if (error) {
    return (
      <LandlordLayout>
        <div className="text-center py-12">
          <TbAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Unit
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/landlord/units")}
            className="bg-primary-plot text-white px-4 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors"
          >
            Back to Units
          </button>
        </div>
      </LandlordLayout>
    );
  }

  if (!unit) {
    return (
      <LandlordLayout>
        <div className="text-center py-12">
          <TbHome className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unit Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The unit you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <button
            onClick={() => navigate("/landlord/units")}
            className="bg-primary-plot text-white px-4 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors"
          >
            Back to Units
          </button>
        </div>
      </LandlordLayout>
    );
  }

  return (
    <LandlordLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/landlord/units")}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <TbArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{unit.name}</h1>
              <p className="text-gray-600">{unit.property?.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!currentLease && unit.status === "vacant" && (
              <button
                onClick={handleAddTenant}
                className="bg-primary-plot text-white px-4 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors flex items-center space-x-2"
              >
                <TbUserPlus className="h-5 w-5" />
                <span>Add Tenant</span>
              </button>
            )}

            <button
              onClick={() => navigate(`/landlord/units/${unitId}/edit`)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <TbEdit className="h-5 w-5" />
              <span>Edit Unit</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  KSh {statistics.totalRevenue?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TbCash className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Tenants
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.totalLeases || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TbUsers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Lease Duration
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.averageLeaseDuration || 0} days
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TbCalendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Current Rent
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  KSh{" "}
                  {currentLease?.monthlyRent?.toLocaleString() ||
                    unit.rentAmount?.toLocaleString() ||
                    "0"}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <TbBuildingBank className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Current Tenant Section */}
        {currentLease && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <TbUsers className="h-5 w-5 text-primary-plot" />
                <span>Current Tenant</span>
              </h2>
              <button
                onClick={() => terminateLease(currentLease)}
                className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                Terminate Lease
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Tenant Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {currentLease.tenant?.firstName}{" "}
                    {currentLease.tenant?.lastName}
                  </p>
                  <p className="flex items-center space-x-2">
                    <TbMail className="h-4 w-4 text-gray-500" />
                    <span>{currentLease.tenant?.email}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <TbPhoneCall className="h-4 w-4 text-gray-500" />
                    <span>{currentLease.tenant?.phone}</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Lease Details
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Start Date:</span>{" "}
                    {new Date(currentLease.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">End Date:</span>{" "}
                    {new Date(currentLease.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Monthly Rent:</span> KSh{" "}
                    {currentLease.monthlyRent?.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Security Deposit:</span> KSh{" "}
                    {currentLease.securityDeposit?.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Status:</span>
                    {getStatusBadge(currentLease.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: "overview", name: "Overview", icon: TbHome },
                { id: "history", name: "Tenant History", icon: TbHistory },
                {
                  id: "payments",
                  name: "Payment History",
                  icon: TbCurrencyDollar,
                },
                { id: "maintenance", name: "Maintenance", icon: TbTools },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`${
                      selectedTab === tab.id
                        ? "border-primary-plot text-primary-plot"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {selectedTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Unit Information
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Type:</span> {unit.type}
                      </p>
                      <p>
                        <span className="font-medium">Bedrooms:</span>{" "}
                        {unit.bedrooms || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Bathrooms:</span>{" "}
                        {unit.bathrooms || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Area:</span>{" "}
                        {unit.area ? `${unit.area} sq ft` : "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                            unit.status === "occupied"
                              ? "bg-green-100 text-green-700"
                              : unit.status === "vacant"
                              ? "bg-blue-100 text-blue-700"
                              : unit.status === "maintenance"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {unit.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Financial Summary
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Base Rent:</span> KSh{" "}
                        {unit.rentAmount?.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Total Revenue:</span> KSh{" "}
                        {statistics.totalRevenue?.toLocaleString() || "0"}
                      </p>
                      <p>
                        <span className="font-medium">Occupancy Rate:</span>{" "}
                        {statistics.occupancyRate?.toFixed(1) || "0"}%
                      </p>
                    </div>
                  </div>
                </div>

                {unit.amenities && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Amenities
                    </h3>
                    <p className="text-gray-600">{unit.amenities}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tenant History Tab */}
            {selectedTab === "history" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Tenant History
                  </h3>
                  <span className="text-sm text-gray-500">
                    {leaseHistory.length} total leases
                  </span>
                </div>

                {leaseHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <TbUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No tenant history available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaseHistory.map((lease) => (
                      <div
                        key={lease.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-plot/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary-plot">
                                {lease.tenant?.firstName?.[0]}
                                {lease.tenant?.lastName?.[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {lease.tenant?.firstName}{" "}
                                {lease.tenant?.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {lease.tenant?.email}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(lease.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-600">
                              Duration
                            </p>
                            <p>
                              {new Date(lease.startDate).toLocaleDateString()} -{" "}
                              {new Date(lease.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">
                              Monthly Rent
                            </p>
                            <p>KSh {lease.monthlyRent?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">
                              Security Deposit
                            </p>
                            <p>KSh {lease.securityDeposit?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">
                              Total Payments
                            </p>
                            <p>{lease.payments?.length || 0} payments</p>
                          </div>
                        </div>

                        {lease.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Notes:</span>{" "}
                              {lease.notes}
                            </p>
                          </div>
                        )}

                        {lease.terminationReason && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-red-600">
                              <span className="font-medium">
                                Termination Reason:
                              </span>{" "}
                              {lease.terminationReason}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payment History Tab */}
            {selectedTab === "payments" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Payment History
                  </h3>
                  <span className="text-sm text-gray-500">
                    {paymentHistory.length} total payments
                  </span>
                </div>

                {paymentHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <TbCurrencyDollar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      No payment history available
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transaction ID
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(
                                payment.paymentDate
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.tenant
                                ? `${payment.tenant.firstName} ${payment.tenant.lastName}`
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              KSh {payment.amount?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getPaymentStatusBadge(payment.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                              {payment.mpesaTransactionId}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Maintenance Tab */}
            {selectedTab === "maintenance" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Maintenance Requests
                  </h3>
                  <span className="text-sm text-gray-500">
                    {maintenanceRequests.length} total requests
                  </span>
                </div>

                {maintenanceRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <TbTools className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No maintenance requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {maintenanceRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {request.title}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              request.status === "resolved"
                                ? "bg-green-100 text-green-700"
                                : request.status === "in_progress"
                                ? "bg-blue-100 text-blue-700"
                                : request.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {request.status?.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {request.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Category: {request.category}</span>
                          <span>Priority: {request.priority}</span>
                          <span>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showTenantModal && (
          <TenantModal
            isOpen={showTenantModal}
            onClose={() => setShowTenantModal(false)}
            onSave={handleTenantSave}
            tenant={null}
            properties={unit.property ? [unit.property] : []}
            selectedUnit={unit}
          />
        )}

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() =>
            setConfirmationModal((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={confirmationModal.onConfirm}
          type={confirmationModal.type}
          title={confirmationModal.title}
          message={confirmationModal.message}
          autoClose={confirmationModal.autoClose}
        />
      </div>
    </LandlordLayout>
  );
};

export default LandlordUnitDetails;
