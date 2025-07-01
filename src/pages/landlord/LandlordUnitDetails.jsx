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
  TbSparkles,
  TbTrendingUp,
  TbHomeDot,
  TbCoins,
} from "react-icons/tb";
import { demoData } from "../../utils/demoData";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import TenantModal from "../../components/landlord/TenantModal";

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

  const [showTenantModal, setShowTenantModal] = useState(false);

  const handleAddTenant = () => {
    setShowTenantModal(true);
  };

  const handleTenantSave = async (tenantData) => {
    setConfirmationModal((prev) => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Tenant saved:", tenantData);

      setShowTenantModal(false);
      setConfirmationModal({
        isOpen: true,
        type: "success",
        title: "Tenant Added",
        message: `Tenant "${tenantData.first_name} ${tenantData.last_name}" has been successfully added to this unit!`,
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        autoClose: true,
        isLoading: false,
      });

      // Refresh unit data in real app
    } catch (error) {
      setConfirmationModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to add tenant. Please try again.",
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        isLoading: false,
      });
    }
  };

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
    { id: "overview", name: "Overview", icon: TbEye },
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
      "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold gap-1.5";
    switch (status) {
      case "occupied":
        return `${baseClasses} bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md`;
      case "vacant":
        return `${baseClasses} bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md`;
      case "maintenance":
        return `${baseClasses} bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-md`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md`;
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
      <LandlordLayout>
        <div className="min-h-screen relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-plot/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-plot/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <div className="relative flex items-center justify-center h-64">
            <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-12 border border-white/20 text-center">
              <TbUser className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Unit not found
              </h3>
              <p className="text-gray-500 mb-6">
                The requested unit could not be found.
              </p>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-plot to-secondary-plot text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <TbArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </LandlordLayout>
    );
  }

  return (
    <LandlordLayout>
      <div className="min-h-screen relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-plot/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-plot/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative space-y-6 p-6">
          {/* Enhanced Header */}
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-plot/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-plot/5 rounded-full -ml-5 -mb-5 blur-lg"></div>

              <div className="relative p-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() =>
                      navigate(`/landlord/properties/${property?.id}/units`)
                    }
                    className="inline-flex items-center text-sm text-gray-500 hover:text-primary-plot transition-colors duration-300 bg-white/50 px-3 py-2 rounded-lg hover:bg-white/80"
                  >
                    <TbArrowLeft className="h-4 w-4 mr-1" />
                    Back to Units
                  </button>
                  <div className="flex items-center space-x-3">
                    {unit.status === "vacant" && (
                      <button
                        onClick={handleAddTenant}
                        className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <TbUserPlus className="h-4 w-4 mr-2" />
                        Add Tenant
                      </button>
                    )}
                    <button
                      onClick={handleEditUnit}
                      className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <TbEdit className="h-4 w-4 mr-2" />
                      Edit Unit
                    </button>
                    <button
                      onClick={handleDeleteUnit}
                      className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <TbTrash className="h-4 w-4 mr-2" />
                      Delete Unit
                    </button>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="p-3 bg-gradient-to-br from-primary-plot to-secondary-plot rounded-xl shadow-lg">
                        <TbHomeDot className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
                          {unit.name}
                        </h1>
                        <p className="text-gray-600 text-lg">
                          {property?.name} • {property?.address}
                        </p>
                      </div>
                      <span className={getStatusBadge(unit.status)}>
                        {getStatusIcon(unit.status)}
                        {unit.status.charAt(0).toUpperCase() +
                          unit.status.slice(1)}
                      </span>
                    </div>
                    {unit.description && (
                      <p className="text-gray-600 bg-gray-50/50 p-4 rounded-xl">
                        {unit.description}
                      </p>
                    )}
                  </div>
                  <div className="bg-gradient-to-br from-primary-plot/10 to-secondary-plot/10 rounded-xl p-6 text-center border border-primary-plot/20">
                    <div className="flex items-center justify-center mb-2">
                      <TbCoins className="h-6 w-6 text-primary-plot mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        Monthly Rent
                      </span>
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
                      KSh {unit.rent_amount?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">per month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                    <TbBed className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Bedrooms
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {unit.bedrooms || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-green-500/10 transition-colors"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                    <TbBath className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Bathrooms
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {unit.bathrooms || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-purple-500/10 transition-colors"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                    <TbRuler className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Area
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {unit.area ? `${unit.area} sqft` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-yellow-500/10 transition-colors"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                    <TbPaywall className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Total Payments
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    KSh{" "}
                    {payments
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

              <div className="border-b border-gray-200/50 relative">
                <nav className="-mb-px flex space-x-0 px-6 overflow-x-auto">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative whitespace-nowrap py-4 px-6 border-b-2 font-semibold text-sm flex items-center space-x-2 transition-all duration-300 ${
                          activeTab === tab.id
                            ? "border-primary-plot text-primary-plot bg-primary-plot/5"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            activeTab === tab.id
                              ? "bg-primary-plot/10"
                              : "bg-transparent group-hover:bg-gray-100"
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span>{tab.name}</span>
                        {activeTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-plot to-secondary-plot"></div>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6 relative">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* Unit Images */}
                    <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                          <TbPhoto className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Unit Images
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {unit.image_urls && unit.image_urls.length > 0 ? (
                          unit.image_urls.map((url, index) => (
                            <div
                              key={index}
                              className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              <img
                                src={url}
                                alt={`${unit.name} - Image ${index + 1}`}
                                className="w-full h-48 object-cover"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="col-span-3 bg-white/50 rounded-xl p-12 text-center border border-gray-200">
                            <TbPhoto className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-500 font-medium">
                              No images available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                          <TbSparkles className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Amenities
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {unit.amenities ? (
                          unit.amenities.split(",").map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105"
                            >
                              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                                {getAmenityIcon(amenity.trim())}
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {amenity.trim()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-4 text-center py-12">
                            <TbSparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-500 font-medium">
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
                      <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-8 border border-gray-100">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-plot to-secondary-plot rounded-full flex items-center justify-center shadow-lg">
                              <TbUser className="h-10 w-10 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {currentTenant.full_name}
                              </h3>
                              <p className="text-gray-600 mb-1">
                                {currentTenant.email}
                              </p>
                              <p className="text-gray-600">
                                {currentTenant.phone}
                              </p>
                            </div>
                          </div>
                          <div className="text-right bg-white/60 p-4 rounded-xl border border-gray-200">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                              Lease Start
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {currentTenant.lease_start_date}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white/60 rounded-xl p-6 border border-gray-200">
                            <p className="text-sm font-medium text-gray-600 mb-2">
                              Monthly Rent
                            </p>
                            <p className="text-2xl font-bold text-primary-plot">
                              KSh {unit.rent_amount?.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-6 border border-gray-200">
                            <p className="text-sm font-medium text-gray-600 mb-2">
                              Security Deposit
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              KSh{" "}
                              {currentTenant.security_deposit?.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-6 border border-gray-200">
                            <p className="text-sm font-medium text-gray-600 mb-2">
                              Lease Status
                            </p>
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
                              <TbCircleCheck className="h-4 w-4 mr-1" />
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-12 text-center border border-gray-200">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                          <TbUser className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          No current tenant
                        </h3>
                        <p className="text-gray-600 mb-8">
                          This unit is currently vacant.
                        </p>
                        <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-plot to-secondary-plot text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                          <TbUserPlus className="h-4 w-4 mr-2" />
                          Add Tenant
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Tenant History Tab */}
                {activeTab === "history" && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                        <TbCalendarEvent className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Tenant History
                      </h3>
                    </div>
                    {tenantHistory.length > 0 ? (
                      <div className="space-y-4">
                        {tenantHistory.map((tenant) => (
                          <div
                            key={tenant.id}
                            className="bg-white/60 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                                  <TbUser className="h-6 w-6 text-gray-500" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900">
                                    {tenant.full_name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {tenant.email}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                    tenant.status === "active"
                                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                      : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                                  }`}
                                >
                                  {tenant.status.charAt(0).toUpperCase() +
                                    tenant.status.slice(1)}
                                </span>
                                <p className="text-sm text-gray-500 mt-2">
                                  {tenant.lease_start_date} -{" "}
                                  {tenant.lease_end_date || "Present"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-12 text-center border border-gray-200">
                        <TbCalendarEvent className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">
                          No tenant history available
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment History Tab */}
                {activeTab === "payments" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                          <TbPaywall className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Payment History
                        </h3>
                      </div>
                      <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 rounded-xl p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total Collected
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          KSh{" "}
                          {payments
                            .reduce((sum, p) => sum + p.amount, 0)
                            .toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {payments.length > 0 ? (
                      <div className="bg-white/60 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                              <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                  Tenant
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                  Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                  Receipt
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white/50 divide-y divide-gray-200">
                              {payments.map((payment) => {
                                const tenant = demoData.tenants.find(
                                  (t) => t.id === payment.tenant_id
                                );
                                return (
                                  <tr
                                    key={payment.id}
                                    className="hover:bg-white/70 transition-colors"
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {new Date(
                                        payment.payment_date
                                      ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {tenant?.full_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                      KSh {payment.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                          payment.status === "successful"
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                            : payment.status === "pending"
                                            ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white"
                                            : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                                        }`}
                                      >
                                        {payment.status
                                          .charAt(0)
                                          .toUpperCase() +
                                          payment.status.slice(1)}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      <button className="inline-flex items-center text-primary-plot hover:text-primary-plot/80 font-medium">
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
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-12 text-center border border-gray-200">
                        <TbReceipt className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">
                          No payment history available
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Maintenance Tab */}
                {activeTab === "maintenance" && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                        <TbTool className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Maintenance Requests
                      </h3>
                    </div>
                    {maintenanceRequests.length > 0 ? (
                      <div className="space-y-4">
                        {maintenanceRequests.map((request) => {
                          const tenant = demoData.tenants.find(
                            (t) => t.id === request.tenant_id
                          );
                          return (
                            <div
                              key={request.id}
                              className="bg-white/60 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 mb-2">
                                    {request.title}
                                  </h4>
                                  <p className="text-gray-600 mb-3">
                                    {request.description}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Submitted by {tenant?.full_name} on{" "}
                                    {new Date(
                                      request.created_at
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <span
                                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                    request.status === "resolved"
                                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                      : request.status === "in_progress"
                                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                      : "bg-gradient-to-r from-yellow-500 to-amber-600 text-white"
                                  }`}
                                >
                                  {request.status
                                    .replace("_", " ")
                                    .charAt(0)
                                    .toUpperCase() + request.status.slice(1)}
                                </span>
                              </div>
                              {request.image_url && (
                                <div className="mt-4">
                                  <img
                                    src={request.image_url}
                                    alt="Maintenance request"
                                    className="w-32 h-32 object-cover rounded-xl shadow-md"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-12 text-center border border-gray-200">
                        <TbTool className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">
                          No maintenance requests for this unit
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tenant Modal */}
          {showTenantModal && (
            <TenantModal
              isOpen={showTenantModal}
              onClose={() => setShowTenantModal(false)}
              onSave={handleTenantSave}
              properties={[{ ...property, units: [unit] }]}
              selectedUnit={unit}
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
        </div>
      </div>
    </LandlordLayout>
  );
};

export default LandlordUnitDetails;
