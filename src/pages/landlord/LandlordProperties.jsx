import { useState, useEffect } from "react";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import PropertyCard from "../../components/landlord/PropertyCard";
import PropertyModal from "../../components/landlord/PropertyModal";
import UnitModal from "../../components/landlord/UnitModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  getPropertiesForLandlord,
  getUnitsForProperty,
} from "../../utils/demoData";
import {
  TbPlus,
  TbSearch,
  TbFilter,
  TbBuilding,
  TbMapPin,
  TbUsers,
  TbCurrencyDollar,
  TbEye,
  TbEdit,
  TbTrash,
  TbHome,
  TbSparkles,
  TbTrendingUp,
  TbCash,
  TbHomeDot,
  TbGridDots,
  TbLayoutList,
} from "react-icons/tb";
import { PiBuildingsDuotone } from "react-icons/pi";

const LandlordProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [isMobile, setIsMobile] = useState(false);

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

  // Track screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      // TODO: Replace with actual user id
      const landlordProperties = getPropertiesForLandlord("landlord-1");
      const propertiesWithUnits = landlordProperties.map((property) => ({
        ...property,
        units: getUnitsForProperty(property.id),
      }));
      setProperties(propertiesWithUnits);
      setFilteredProperties(propertiesWithUnits);
    }
  }, [user]);

  useEffect(() => {
    let filtered = properties;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((property) => {
        const hasAvailableUnits = property.units.some(
          (unit) => unit.status === "available"
        );
        const hasOccupiedUnits = property.units.some(
          (unit) => unit.status === "occupied"
        );

        if (statusFilter === "available" && hasAvailableUnits) return true;
        if (statusFilter === "occupied" && hasOccupiedUnits) return true;
        if (
          statusFilter === "fully_occupied" &&
          hasOccupiedUnits &&
          !hasAvailableUnits
        )
          return true;
        return false;
      });
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, statusFilter]);

  const handleAddProperty = () => {
    setSelectedProperty(null);
    setShowPropertyModal(true);
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handleAddUnit = (property) => {
    setSelectedProperty(property);
    setSelectedUnit(null);
    setShowUnitModal(true);
  };

  const handleEditUnit = (property, unit) => {
    setSelectedProperty(property);
    setSelectedUnit(unit);
    setShowUnitModal(true);
  };

  const handlePropertySave = async (propertyData) => {
    setConfirmationModal((prev) => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Property saved:", propertyData);

      setShowPropertyModal(false);
      setConfirmationModal({
        isOpen: true,
        type: "success",
        title: "Property Saved",
        message: `Property "${propertyData.name}" has been ${
          selectedProperty ? "updated" : "created"
        } successfully!`,
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        autoClose: true,
        isLoading: false,
      });

      // Refresh properties list in real app
    } catch (error) {
      setConfirmationModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to save property. Please try again.",
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        isLoading: false,
      });
    }
  };

  const handleUnitSave = async (unitData) => {
    setConfirmationModal((prev) => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Unit saved:", unitData);

      setShowUnitModal(false);
      setConfirmationModal({
        isOpen: true,
        type: "success",
        title: "Unit Saved",
        message: `Unit "${unitData.name}" has been ${
          selectedUnit ? "updated" : "created"
        } successfully!`,
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        autoClose: true,
        isLoading: false,
      });

      // Refresh properties list in real app
    } catch (error) {
      setConfirmationModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to save unit. Please try again.",
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        isLoading: false,
      });
    }
  };

  const handleDeleteProperty = (property) => {
    setConfirmationModal({
      isOpen: true,
      type: "delete",
      title: "Delete Property",
      itemName: property.name,
      message: `Are you sure you want to delete "${property.name}"? This will also delete all units and associated data.`,
      onConfirm: () => confirmDeleteProperty(property),
      isLoading: false,
    });
  };

  const confirmDeleteProperty = async (property) => {
    setConfirmationModal((prev) => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Property deleted:", property);

      setConfirmationModal({
        isOpen: true,
        type: "success",
        title: "Property Deleted",
        message: `Property "${property.name}" has been deleted successfully!`,
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        autoClose: true,
        isLoading: false,
      });

      // Refresh properties list in real app
    } catch (error) {
      setConfirmationModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to delete property. Please try again.",
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        isLoading: false,
      });
    }
  };

  const getPropertyStats = () => {
    const totalProperties = properties.length;
    const totalUnits = properties.reduce(
      (sum, prop) => sum + (prop.units?.length || 0),
      0
    );
    const occupiedUnits = properties.reduce(
      (sum, prop) =>
        sum + prop.units.filter((unit) => unit.status === "occupied").length,
      0
    );
    const availableUnits = totalUnits - occupiedUnits;

    const totalRevenue = properties.reduce(
      (sum, prop) =>
        sum +
        prop.units.reduce(
          (unitSum, unit) =>
            unit.status === "occupied"
              ? unitSum + (unit.rent_amount || 0)
              : unitSum,
          0
        ),
      0
    );

    return {
      totalProperties,
      totalUnits,
      occupiedUnits,
      availableUnits,
      occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
      totalRevenue,
    };
  };

  const stats = getPropertyStats();

  return (
    <LandlordLayout>
      <div className="space-y-6">
        {/* Header - Enhanced */}
        <div className="bg-gradient-to-br from-primary-plot/5 via-secondary-plot/5 to-primary-plot/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-plot/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-plot/5 rounded-full -ml-5 -mb-5 blur-lg"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-primary-plot/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                <TbBuilding className="h-8 w-8 text-primary-plot" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Properties Management
                </h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                  Manage your properties, units, and rental information
                </p>
              </div>
            </div>
            <button
              onClick={handleAddProperty}
              className="mt-4 lg:mt-0 bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-bold flex items-center space-x-2 transform hover:scale-105 shadow-lg"
            >
              <TbPlus size={20} />
              <span>Add Property</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-blue-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                  <TbBuilding className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center px-2 py-1 bg-blue-50 rounded-full">
                  <TbTrendingUp className="h-3 w-3 text-blue-600 mr-1" />
                  <span className="text-xs font-semibold text-blue-600">
                    Portfolio
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Total Properties
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {stats.totalProperties}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active properties</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-indigo-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                  <TbHomeDot className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex items-center px-2 py-1 bg-indigo-50 rounded-full">
                  <span className="text-xs font-semibold text-indigo-600">
                    Units
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Total Units
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {stats.totalUnits}
                </p>
                <p className="text-xs text-gray-500 mt-1">All rental units</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-green-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                  <TbUsers className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex items-center px-2 py-1 bg-green-50 rounded-full">
                  <span className="text-xs font-semibold text-green-600">
                    {stats.totalUnits > 0
                      ? (
                          (stats.occupiedUnits / stats.totalUnits) *
                          100
                        ).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Occupied
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {stats.occupiedUnits}
                </p>
                <p className="text-xs text-green-600 mt-1 font-medium">
                  Units rented
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-yellow-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                  <TbMapPin className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex items-center px-2 py-1 bg-yellow-50 rounded-full">
                  <span className="text-xs font-semibold text-yellow-600">
                    Available
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Available
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {stats.availableUnits}
                </p>
                <p className="text-xs text-gray-500 mt-1">Ready to rent</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-purple-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <TbCash className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex items-center px-2 py-1 bg-green-50 rounded-full">
                  <TbTrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs font-semibold text-green-600">
                    +15%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Monthly Revenue
                </p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">
                  KSh {stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">From rentals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search - Enhanced */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <TbSearch className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Search & Filter
                </h3>
                <p className="text-sm text-gray-500">
                  Find and organize your properties
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <TbSearch
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search properties by name or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 font-semibold placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <TbFilter className="text-gray-600" size={20} />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 font-semibold"
                  >
                    <option value="all">All Properties</option>
                    <option value="available">Has Available Units</option>
                    <option value="occupied">Has Occupied Units</option>
                    <option value="fully_occupied">Fully Occupied</option>
                  </select>
                </div>
              </div>

              {/* View Mode Toggle - Enhanced (Hidden on mobile - mobile always uses grid) */}
              <div className="hidden lg:flex items-center space-x-2 bg-gray-100 p-2 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-primary-plot to-secondary-plot text-white shadow-lg"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <TbGridDots size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-primary-plot to-secondary-plot text-white shadow-lg"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <TbLayoutList size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List/Grid - Enhanced */}
        {filteredProperties.length === 0 ? (
          <div className="md:bg-white md:rounded-2xl md:shadow-lg md:border border-gray-100 p-4 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 md:bg-gray-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="p-3 md:p-4 bg-gray-100 rounded-2xl inline-flex mb-2 md:mb-4">
                <PiBuildingsDuotone className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-500 mb-2">
                {properties.length === 0
                  ? "No properties yet"
                  : "No properties found"}
              </h3>
              <p className="text-gray-500 text-sm md:text-[0.9rem] mb-6 max-w-lg mx-auto">
                {properties.length === 0
                  ? "Get started by adding your first property to begin building your rental portfolio"
                  : "Try adjusting your search terms or filter criteria to find the properties you're looking for"}
              </p>
              {properties.length === 0 && (
                <button
                  onClick={handleAddProperty}
                  className="bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-bold flex items-center space-x-2 mx-auto transform hover:scale-105 shadow-lg"
                >
                  <TbPlus size={20} />
                  <span>Add Your First Property</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`
            ${
              isMobile || viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          `}
          >
            {filteredProperties.map((property) => {
              // Force grid mode on mobile, otherwise use selected viewMode
              const effectiveViewMode = isMobile ? "grid" : viewMode;

              return (
                <PropertyCard
                  key={property.id}
                  property={property}
                  viewMode={effectiveViewMode}
                  onEdit={() => handleEditProperty(property)}
                  onAddUnit={() => handleAddUnit(property)}
                  onEditUnit={(unit) => handleEditUnit(property, unit)}
                  onDelete={() => handleDeleteProperty(property)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Property Modal */}
      {showPropertyModal && (
        <PropertyModal
          isOpen={showPropertyModal}
          onClose={() => setShowPropertyModal(false)}
          onSave={handlePropertySave}
          property={selectedProperty}
        />
      )}

      {/* Unit Modal */}
      {showUnitModal && (
        <UnitModal
          isOpen={showUnitModal}
          onClose={() => setShowUnitModal(false)}
          onSave={handleUnitSave}
          property={selectedProperty}
          unit={selectedUnit}
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
    </LandlordLayout>
  );
};

export default LandlordProperties;
