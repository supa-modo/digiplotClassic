import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  TbArrowLeft,
  TbEdit,
  TbTrash,
  TbUser,
  TbCalendarEvent,
  TbTool,
  TbPhoto,
  TbBed,
  TbBath,
  TbRuler,
  TbWifi,
  TbCar,
  TbShield,
  TbDroplet,
  TbBolt,
  TbDownload,
  TbEye,
  TbCircleCheck,
  TbCircleX,
  TbClock,
  TbUserPlus,
  TbReceipt,
  TbPaywall,
} from "react-icons/tb";
import { demoData } from "../../utils/demoData";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const LandlordUnitDetails = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

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

  // Get unit and related data
  const unit = demoData.units.find((u) => u.id === unitId);
  const property = unit
    ? demoData.properties.find((p) => p.id === unit.property_id)
    : null;
  const currentTenant = demoData.tenants.find(
    (t) => t.unit_id === unitId && t.status === "active"
  );
  const tenantHistory = demoData.tenants.filter((t) => t.unit_id === unitId);
  const payments = demoData.payments.filter((p) => p.unit_id === unitId);
  const maintenanceRequests = demoData.maintenanceRequests.filter(
    (mr) => mr.unit_id === unitId
  );

  const tabs = [
    { id: "overview", name: "Overview", icon: TbUser },
    { id: "tenant", name: "Current Tenant", icon: TbUser },
    { id: "history", name: "Tenant History", icon: TbCalendarEvent },
    { id: "payments", name: "Payment History", icon: TbPaywall },
    { id: "maintenance", name: "Maintenance", icon: TbTool },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "occupied":
        return <TbCircleCheck className="h-5 w-5 text-green-500" />;
      case "vacant":
        return <TbCircleX className="h-5 w-5 text-red-500" />;
      case "maintenance":
        return <TbClock className="h-5 w-5 text-yellow-500" />;
      default:
        return <TbCircleX className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "occupied":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "vacant":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "maintenance":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      wifi: TbWifi,
      parking: TbCar,
      security: TbShield,
      water: TbDroplet,
      electricity: TbBolt,
    };
    const IconComponent = iconMap[amenity.toLowerCase()] || TbCircleCheck;
    return <IconComponent className="h-4 w-4" />;
  };

  const handleEditUnit = () => {
    setConfirmationModal({
      isOpen: true,
      type: "edit",
      title: "Edit Unit",
      itemName: unit.name,
      message: `Do you want to edit "${unit.name}"? You will be redirected to the edit form.`,
      onConfirm: () => {
        setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
        // Navigate to edit page or open edit modal
        console.log("Navigate to edit unit:", unit.id);
      },
      isLoading: false,
    });
  };

  const handleDeleteUnit = () => {
    setConfirmationModal({
      isOpen: true,
      type: "delete",
      title: "Delete Unit",
      itemName: unit.name,
      message: `Are you sure you want to delete "${unit.name}"? This will permanently remove all unit data, tenant history, and payment records.`,
      onConfirm: () => confirmDeleteUnit(),
      isLoading: false,
    });
  };

  const confirmDeleteUnit = async () => {
    setConfirmationModal((prev) => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Unit deleted:", unit);

      setConfirmationModal({
        isOpen: true,
        type: "success",
        title: "Unit Deleted",
        message: `Unit "${unit.name}" has been deleted successfully. You will be redirected to the units list.`,
        onConfirm: () => {
          setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
          navigate(`/landlord/properties/${property?.id}/units`);
        },
        isLoading: false,
      });

      // In real app, this would update the backend
    } catch (error) {
      setConfirmationModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to delete unit. Please try again.",
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        isLoading: false,
      });
    }
  };

  if (!unit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <TbUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Unit not found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            The requested unit could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <LandlordLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    navigate(`/landlord/properties/${property?.id}/units`)
                  }
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <TbArrowLeft className="h-4 w-4 mr-1" />
                  Back to Units
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEditUnit}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <TbEdit className="h-4 w-4 mr-2" />
                  Edit Unit
                </button>
                <button
                  onClick={handleDeleteUnit}
                  className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  <TbTrash className="h-4 w-4 mr-2" />
                  Delete Unit
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {unit.name}
                  </h1>
                  <span className={getStatusBadge(unit.status)}>
                    {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {property?.name} • {property?.address}
                </p>
                <p className="mt-2 text-gray-600">{unit.description}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-plot">
                  KSh {unit.rent_amount?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">per month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-primary-plot text-primary-plot"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
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
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Unit Images */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Unit Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {unit.image_urls && unit.image_urls.length > 0 ? (
                      unit.image_urls.map((url, index) => (
                        <div
                          key={index}
                          className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden"
                        >
                          <img
                            src={url}
                            alt={`${unit.name} - Image ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 bg-gray-100 rounded-lg p-12 text-center">
                        <TbPhoto className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          No images available
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <TbBed className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-600">
                          Bedrooms
                        </span>
                      </div>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {unit.bedrooms || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <TbBath className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-600">
                          Bathrooms
                        </span>
                      </div>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {unit.bathrooms || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <TbRuler className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-600">
                          Area
                        </span>
                      </div>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {unit.area ? `${unit.area} sqft` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {unit.amenities ? (
                      unit.amenities.split(",").map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                        >
                          {getAmenityIcon(amenity.trim())}
                          <span className="text-sm text-gray-700">
                            {amenity.trim()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-center py-8">
                        <p className="text-sm text-gray-500">
                          No amenities listed
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Current Tenant Tab */}
            {activeTab === "tenant" && (
              <div className="space-y-6">
                {currentTenant ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-primary-plot rounded-full flex items-center justify-center">
                          <TbUser className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {currentTenant.full_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {currentTenant.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {currentTenant.phone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Lease Start</p>
                        <p className="font-medium">
                          {currentTenant.lease_start_date}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Monthly Rent</p>
                        <p className="text-lg font-semibold">
                          KSh {unit.rent_amount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Security Deposit
                        </p>
                        <p className="text-lg font-semibold">
                          KSh {currentTenant.security_deposit?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lease Status</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TbUser className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No current tenant
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This unit is currently vacant.
                    </p>
                    <div className="mt-6">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-plot hover:bg-primary-plot/90">
                        <TbUserPlus className="h-4 w-4 mr-2" />
                        Add Tenant
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tenant History Tab */}
            {activeTab === "history" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Tenant History
                </h3>
                {tenantHistory.length > 0 ? (
                  <div className="space-y-4">
                    {tenantHistory.map((tenant) => (
                      <div
                        key={tenant.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <TbUser className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {tenant.full_name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {tenant.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                tenant.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {tenant.status.charAt(0).toUpperCase() +
                                tenant.status.slice(1)}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">
                              {tenant.lease_start_date} -{" "}
                              {tenant.lease_end_date || "Present"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TbCalendarEvent className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No tenant history available
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === "payments" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Payment History
                  </h3>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Collected</p>
                    <p className="text-2xl font-bold text-green-600">
                      KSh{" "}
                      {payments
                        .reduce((sum, p) => sum + p.amount, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>

                {payments.length > 0 ? (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
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
                            Receipt
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment) => {
                          const tenant = demoData.tenants.find(
                            (t) => t.id === payment.tenant_id
                          );
                          return (
                            <tr key={payment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(
                                  payment.payment_date
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {tenant?.full_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                KSh {payment.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    payment.status === "successful"
                                      ? "bg-green-100 text-green-800"
                                      : payment.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {payment.status.charAt(0).toUpperCase() +
                                    payment.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="inline-flex items-center text-primary-plot hover:text-primary-plot/80">
                                  <TbDownload className="h-4 w-4 mr-1" />
                                  Download
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TbReceipt className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No payment history available
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === "maintenance" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Maintenance Requests
                </h3>
                {maintenanceRequests.length > 0 ? (
                  <div className="space-y-4">
                    {maintenanceRequests.map((request) => {
                      const tenant = demoData.tenants.find(
                        (t) => t.id === request.tenant_id
                      );
                      return (
                        <div
                          key={request.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {request.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {request.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                Submitted by {tenant?.full_name} on{" "}
                                {new Date(
                                  request.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                request.status === "resolved"
                                  ? "bg-green-100 text-green-800"
                                  : request.status === "in_progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {request.status
                                .replace("_", " ")
                                .charAt(0)
                                .toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          {request.image_url && (
                            <div className="mt-3">
                              <img
                                src={request.image_url}
                                alt="Maintenance request"
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TbTool className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No maintenance requests for this unit
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

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
      </div>
    </LandlordLayout>
  );
};

export default LandlordUnitDetails;
