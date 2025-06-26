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
} from "react-icons/tb";
import { demoData } from "../../utils/demoData";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import ConfirmationModal from "../../components/common/ConfirmationModal";

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
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/landlord/properties")}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <TbArrowLeft className="h-4 w-4 mr-1" />
                Back to Properties
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-plot/10 rounded-lg">
                <TbBuilding className="h-6 w-6 text-primary-plot" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {property.name}
                </h1>
                <p className="text-sm text-gray-500">{property.address}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <TbHome className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Total Units
                  </span>
                </div>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {units.length}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <TbCircleCheck className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Occupied
                  </span>
                </div>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {units.filter((u) => u.status === "occupied").length}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <TbCircleX className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Vacant
                  </span>
                </div>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {units.filter((u) => u.status === "vacant").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6">
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-plot focus:border-primary-plot"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-plot focus:border-primary-plot"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-plot focus:border-primary-plot"
              >
                <option value="name">Sort by Name</option>
                <option value="rent">Sort by Rent</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>

            {/* Add Unit Button */}
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-plot hover:bg-primary-plot/90">
              <TbPlus className="h-4 w-4 mr-2" />
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
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Unit Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {unit.image_urls && unit.image_urls.length > 0 ? (
                    <img
                      src={unit.image_urls[0]}
                      alt={unit.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <TbHome className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={getStatusBadge(unit.status)}>
                      {unit.status.charAt(0).toUpperCase() +
                        unit.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Unit Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {unit.name}
                    </h3>
                    {getStatusIcon(unit.status)}
                  </div>

                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {unit.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Monthly Rent
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        KSh {unit.rent_amount?.toLocaleString()}
                      </span>
                    </div>

                    {currentTenant && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Current Tenant
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {currentTenant.full_name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Bedrooms</span>
                      <span className="text-sm font-medium text-gray-900">
                        {unit.bedrooms || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => navigate(`/landlord/units/${unit.id}`)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <TbEye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <TbEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUnit(unit)}
                      className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      title="Delete Unit"
                    >
                      <TbTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredUnits.length === 0 && (
          <div className="bg-white shadow rounded-lg p-12">
            <div className="text-center">
              <TbHome className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No units found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Get started by adding your first unit to this property."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-plot hover:bg-primary-plot/90">
                    <TbPlus className="h-4 w-4 mr-2" />
                    Add First Unit
                  </button>
                </div>
              )}
            </div>
          </div>
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
    </LandlordLayout>
  );
};

export default LandlordUnits;
