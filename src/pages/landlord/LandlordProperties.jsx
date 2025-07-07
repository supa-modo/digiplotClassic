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
  TbBuildingPlus,
  TbArrowRight,
  TbHomeInfinity,
  TbLayoutGrid,
  TbListDetails,
  TbRefresh,
} from "react-icons/tb";
import { PiBuildingsDuotone, PiCaretDownDuotone } from "react-icons/pi";
import { BiChevronDown } from "react-icons/bi";

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

  const handleRefresh = () => {
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
        <div className=" relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                <PiBuildingsDuotone className="h-7 md:h-8 w-7 md:w-8 text-secondary-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary-plot">
                  Properties Management
                </h1>
                <p className="text-gray-600 mt-1 text-xs md:text-sm lg:text-base">
                  Manage your properties, units, and rental information
                </p>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="bg-white border-2 border-secondary-600/20 text-secondary-600 text-[0.8rem] md:text-[0.98rem] px-4 py-3 md:py-2.5 rounded-lg hover:shadow-lg hover:bg-secondary-50 transition-all duration-200 font-medium shadow-md"
                title="Refresh Properties"
              >
                <TbRefresh className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              <button
                onClick={handleAddProperty}
                className="bg-gradient-to-r from-secondary-600/90 to-secondary-700 text-white text-[0.8rem] md:text-[0.98rem] px-6 py-3 md:py-2.5 rounded-lg hover:shadow-lg transition-colors duration-200 font-medium space-x-2 shadow-md"
              >
                <div className="flex items-center justify-center space-x-2">
                  <TbBuildingPlus className="h-5 w-5 md:h-6 md:w-6" />
                  <span>Add New Property</span>
                  <TbArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Compact & Mobile Optimized */}
        <div className="lg:py-2 relative overflow-hidden">
          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="lg:hidden flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1.5 md:px-3">
            {/* Mobile Stats Cards */}
            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-lg">
                  <TbBuilding className="h-4 w-4 text-secondary-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-secondary-600 bg-secondary-50 px-1.5 py-0.5 rounded-full">
                  Portfolio
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Properties
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalProperties}
                </p>
                <p className="text-[0.6rem] text-gray-500">Active</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                  <TbHomeInfinity className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                  Units
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Total Units
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalUnits}
                </p>
                <p className="text-[0.6rem] text-gray-500">All units</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                  <TbUsers className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  {stats.totalUnits > 0
                    ? ((stats.occupiedUnits / stats.totalUnits) * 100).toFixed(
                        0
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Occupied
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.occupiedUnits}
                </p>
                <p className="text-[0.6rem] text-green-600 font-medium">
                  Rented
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
                  <TbMapPin className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full">
                  Available
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Available
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.availableUnits}
                </p>
                <p className="text-[0.6rem] text-gray-500">Ready</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[150px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                  <TbCash className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  +15%
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Revenue
                </p>
                <p className="text-lg font-bold text-gray-900">
                  KSh {(stats.totalRevenue / 1000).toFixed(0)}K
                </p>
                <p className="text-[0.6rem] text-gray-500">Monthly</p>
              </div>
            </div>
          </div>

          {/* Desktop: Compact Grid */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4 relative z-10">
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="">
                  <div>
                    <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                      Total Properties
                    </p>
                    <p className="text-2xl font-bold text-primary-plot">
                      {stats.totalProperties}
                    </p>
                    <p className="text-[0.7rem] text-gray-500 mt-1">
                      Active properties
                    </p>
                  </div>
                </div>

                <div className="flex items-center px-2 py-1 bg-secondary-50 rounded-full">
                  <TbTrendingUp className="h-3 w-3 text-secondary-600 mr-1" />
                  <span className="text-[0.65rem] font-bold text-secondary-600">
                    Portfolio
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Total Units
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.totalUnits}
                  </p>
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    All rental units
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-indigo-100 border border-indigo-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-indigo-600">
                    Units
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Occupied Units
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.occupiedUnits}
                  </p>
                  <p className="text-[0.7rem] text-green-600 mt-1 font-medium">
                    Units rented
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-green-100 border border-green-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-green-600">
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
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Available Units
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.availableUnits}
                  </p>
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    Ready to rent
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-yellow-100 border border-yellow-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-yellow-600">
                    Vacant
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Monthly Revenue
                  </p>
                  <p className="text-xl font-bold text-secondary-700">
                    KSh {stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    From rentals
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-green-100 border border-green-300 rounded-full">
                  <TbTrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-[0.65rem] font-bold text-green-600">
                    +15%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search - Enhanced */}
        <div className="lg:bg-white pt-6 lg:rounded-[0.8rem] lg:shadow-lg lg:border lg:border-gray-200/70 px-1.5 md:px-3 lg:p-6 relative overflow-hidden">
          <div className="hidden lg:block absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center relative z-10 space-y-4 lg:space-y-0">
            {/* Left side - Icon, Title, Description */}
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-[0.6rem]">
                <TbSearch className="h-6 md:h-7 w-6 md:w-7 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-secondary-plot">
                  Search & Filter
                </h3>
                <p className="text-[0.8rem] md:text-sm text-gray-500">
                  Find and organize your properties
                </p>
              </div>
            </div>

            {/* Right side - Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-3 lg:min-w-[55%]">
              {/* Search Input */}
              <div className="relative flex-1 lg:min-w-[300px]">
                <TbSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search properties by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-[0.6rem] text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot/50 focus:border-primary-plot bg-gray-50 font-medium text-gray-500 placeholder-gray-400"
                />
              </div>

              {/* Filter and View Mode Container */}
              <div className="flex items-center space-x-3">
                {/* Filter Dropdown */}
                <div className="w-full relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-4 pr-7 py-2.5 border border-gray-300 rounded-lg appearance-none text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                  >
                    <option value="all">All Properties</option>
                    <option value="available">Has Available Units</option>
                    <option value="occupied">Has Occupied Units</option>
                    <option value="fully_occupied">Fully Occupied</option>
                  </select>
                  <PiCaretDownDuotone
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>

                {/* View Mode Toggle - Enhanced (Hidden on mobile - mobile always uses grid) */}
                <div className="hidden lg:flex items-center bg-gray-200 p-[0.2rem] rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-primary-plot to-secondary-plot text-white shadow-lg"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <TbLayoutGrid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-primary-plot to-secondary-plot text-white shadow-lg"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200 "
                    }`}
                  >
                    <TbListDetails size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List/Grid - Enhanced */}
        {filteredProperties.length === 0 ? (
          <div className="md:bg-white md:rounded-2xl md:shadow-lg md:border border-gray-100 p-4 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 md:bg-gray-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="p-3 md:p-4 bg-gray-200 rounded-2xl inline-flex mb-2 md:mb-4">
                <PiBuildingsDuotone className="h-16 w-16 text-secondary-plot/80" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-500 mb-2">
                {properties.length === 0
                  ? "No properties yet"
                  : "No properties found"}
              </h3>
              <p className="text-gray-500 text-[0.83rem] md:text-[0.9rem] mb-6 max-w-lg mx-auto">
                {properties.length === 0
                  ? "Get started by adding your first property to begin building your rental portfolio"
                  : "Try adjusting your search terms or filter criteria to find the properties you're looking for"}
              </p>
              {properties.length === 0 && (
                <button
                  onClick={handleAddProperty}
                  className="bg-gradient-to-r from-secondary-plot to-secondary-plot/80 hover:from-secondary-700 hover:to-secondary-700/90 text-white px-6 py-2.5 md:py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center space-x-2 mx-auto shadow-lg"
                >
                  <TbBuildingPlus size={21} />
                  <span className="text-[0.8rem] md:text-sm">
                    Add Your First Property
                  </span>
                  <TbArrowRight size={17} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`md:px-2.5 lg:px-0
            ${
              isMobile || viewMode === "grid"
                ? "grid grid-cols-1 lg:grid-cols-3 gap-6"
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
