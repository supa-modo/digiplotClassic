import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  TbBuilding,
  TbPlus,
  TbEdit,
  TbEye,
  TbTrash,
  TbUsers,
  TbCalendarEvent,
  TbFilter,
  TbSearch,
  TbArrowLeft,
  TbHome,
  TbUser,
  TbCircleCheck,
  TbCircleX,
  TbClock,
  TbUserPlus,
} from "react-icons/tb";
import { demoData } from "../../utils/demoData";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import TenantModal from "../../components/landlord/TenantModal";

const LandlordUnits = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

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
  const [selectedUnitForTenant, setSelectedUnitForTenant] = useState(null);

  // Get property and its units from demo data
  const property = demoData.properties.find((p) => p.id === propertyId);
  const units = demoData.units.filter((u) => u.property_id === propertyId);

  // Filter and sort units
  const filteredUnits = units
    .filter((unit) => {
      const matchesSearch =
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || unit.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rent":
          return b.rent_amount - a.rent_amount;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

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

  const getCurrentTenant = (unitId) => {
    return demoData.tenants.find(
      (t) => t.unit_id === unitId && t.status === "active"
    );
  };

  const handleDeleteUnit = (unit) => {
    setConfirmationModal({
      isOpen: true,
      type: "delete",
      title: "Delete Unit",
      itemName: unit.name,
      message: `Are you sure you want to delete "${unit.name}"? This will also remove all associated tenant and payment data.`,
      onConfirm: () => confirmDeleteUnit(unit),
      isLoading: false,
    });
  };

  const confirmDeleteUnit = async (unit) => {
    setConfirmationModal((prev) => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Unit deleted:", unit);

      setConfirmationModal({
        isOpen: true,
        type: "success",
        title: "Unit Deleted",
        message: `Unit "${unit.name}" has been deleted successfully.`,
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        autoClose: true,
        isLoading: false,
      });

      // Refresh units list in real app
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

  const handleAddTenantToUnit = (unit) => {
    setSelectedUnitForTenant(unit);
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
        message: `Tenant "${tenantData.first_name} ${tenantData.last_name}" has been successfully added to ${selectedUnitForTenant?.name}!`,
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        autoClose: true,
        isLoading: false,
      });

      // Refresh units list in real app
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

  if (!property) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <TbBuilding className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Property not found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            The requested property could not be found.
          </p>
          <div className="mt-6">
            <Link
              to="/landlord/properties"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-plot hover:bg-primary-plot/90"
            >
              <TbArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LandlordLayout>
      <div className="min-h-screen relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-plot/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-plot/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative space-y-6 p-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/landlord/properties")}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-primary-plot transition-colors"
                >
                  <TbArrowLeft className="h-4 w-4 mr-1" />
                  Back to Properties
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-primary-plot to-secondary-plot rounded-xl shadow-lg">
                  <TbBuilding className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
                    {property.name}
                  </h1>
                  <p className="text-gray-600 text-lg">{property.address}</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <TbHome className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <span className="text-sm font-medium text-blue-600">
                        Total Units
                      </span>
                      <p className="text-2xl font-bold text-blue-900">
                        {units.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <TbCircleCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <span className="text-sm font-medium text-green-600">
                        Occupied
                      </span>
                      <p className="text-2xl font-bold text-green-900">
                        {units.filter((u) => u.status === "occupied").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <TbCircleX className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <span className="text-sm font-medium text-red-600">
                        Vacant
                      </span>
                      <p className="text-2xl font-bold text-red-900">
                        {units.filter((u) => u.status === "vacant").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search units..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-plot focus:border-primary-plot transition-all bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-plot focus:border-primary-plot transition-all bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="occupied">Occupied</option>
                  <option value="vacant">Vacant</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              {/* Sort */}
              <div className="sm:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-plot focus:border-primary-plot transition-all bg-white/50 backdrop-blur-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rent">Sort by Rent</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>

              {/* Add Unit Button */}
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-plot to-secondary-plot text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <TbPlus className="h-5 w-5 mr-2" />
                Add Unit
              </button>
            </div>
          </div>

          {/* Units Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => {
              const currentTenant = getCurrentTenant(unit.id);

              return (
                <div
                  key={unit.id}
                  className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  {/* Unit Image */}
                  <div className="relative">
                    {unit.image_urls && unit.image_urls.length > 0 ? (
                      <img
                        src={unit.image_urls[0]}
                        alt={unit.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <TbHome className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={getStatusBadge(unit.status)}>
                        {getStatusIcon(unit.status)}
                        {unit.status.charAt(0).toUpperCase() +
                          unit.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Unit Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">
                        {unit.name}
                      </h3>
                      {getStatusIcon(unit.status)}
                    </div>

                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {unit.description}
                    </p>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-plot/10 to-secondary-plot/10 rounded-xl">
                        <span className="text-sm font-medium text-gray-600">
                          Monthly Rent
                        </span>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
                          KSh {unit.rent_amount?.toLocaleString()}
                        </span>
                      </div>

                      {currentTenant && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                          <span className="text-sm font-medium text-blue-600">
                            Current Tenant
                          </span>
                          <span className="text-sm font-semibold text-blue-900">
                            {currentTenant.full_name}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-600">
                          Bedrooms
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {unit.bedrooms || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 space-y-2">
                      {unit.status === "vacant" && (
                        <button
                          onClick={() => handleAddTenantToUnit(unit)}
                          className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                          <TbUserPlus className="h-4 w-4 mr-2" />
                          Add Tenant
                        </button>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/landlord/units/${unit.id}`)}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-primary-plot to-secondary-plot text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                          <TbEye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                        <button className="inline-flex items-center px-3 py-2.5 border border-gray-200 text-gray-700 bg-white/50 hover:bg-white font-medium rounded-xl transition-all duration-300 hover:shadow-md">
                          <TbEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUnit(unit)}
                          className="inline-flex items-center px-3 py-2.5 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-medium rounded-xl transition-all duration-300 hover:shadow-md"
                          title="Delete Unit"
                        >
                          <TbTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredUnits.length === 0 && (
            <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-12 border border-white/20">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                  <TbHome className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No units found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "Get started by adding your first unit to this property."}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-plot to-secondary-plot text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <TbPlus className="h-5 w-5 mr-2" />
                    Add First Unit
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tenant Modal */}
          {showTenantModal && (
            <TenantModal
              isOpen={showTenantModal}
              onClose={() => setShowTenantModal(false)}
              onSave={handleTenantSave}
              properties={[{ ...property, units: [selectedUnitForTenant] }]}
              selectedUnit={selectedUnitForTenant}
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

export default LandlordUnits;
