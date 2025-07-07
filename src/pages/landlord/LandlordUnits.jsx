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
  TbArrowRight,
  TbTrendingUp,
  TbHomeDot,
  TbHomeX,
  TbHomePlus,
  TbArrowBackUp,
  TbPhoneCall,
  TbHomeExclamation,
  TbTool,
} from "react-icons/tb";
import {
  PiBuildingsDuotone,
  PiCaretDownDuotone,
  PiMapPinAreaDuotone,
} from "react-icons/pi";
import { demoData } from "../../utils/demoData";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import TenantModal from "../../components/landlord/TenantModal";
import { RiUserAddLine } from "react-icons/ri";

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
        return <TbCircleCheck className="h-5 w-5 " />;
      case "vacant":
        return <TbCircleX className="h-5 w-5" />;
      case "maintenance":
        return <TbTool className="h-5 w-5" />;
      default:
        return <TbCircleX className="h-5 w-5 text-gray-700" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center text-white px-4 py-1 md:py-1.5 rounded-full text-[0.65rem] md:text-xs font-semibold gap-1.5";
    switch (status) {
      case "occupied":
        return `${baseClasses} bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md`;
      case "vacant":
        return `${baseClasses} bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md`;
      case "maintenance":
        return `${baseClasses} bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md`;
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

  const getUnitStats = () => {
    const totalUnits = units.length;
    const occupiedUnits = units.filter((u) => u.status === "occupied").length;
    const vacantUnits = units.filter((u) => u.status === "vacant").length;
    const maintenanceUnits = units.filter(
      (u) => u.status === "maintenance"
    ).length;
    const totalRevenue = units
      .filter((u) => u.status === "occupied")
      .reduce((sum, unit) => sum + (unit.rent_amount || 0), 0);

    return {
      totalUnits,
      occupiedUnits,
      vacantUnits,
      maintenanceUnits,
      totalRevenue,
      occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
    };
  };

  const stats = getUnitStats();

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
    <>
      <LandlordLayout>
        <div className="space-y-6">
          {/* Header - Enhanced */}
          <div className=" relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 md:p-4 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                    <PiBuildingsDuotone className="h-7 md:h-8 w-7 md:w-8 text-secondary-600" />
                  </div>
                  <div>
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary-plot">
                      {property.name}
                    </h1>
                    <div className="flex items-center text-gray-500 mt-1">
                      <PiMapPinAreaDuotone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-xs md:text-sm lg:text-[0.9rem] font-medium">
                        {property.address}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex  items-center gap-6 lg:gap-10 mb-3">
                  <div className="hidden md:flex items-center   underline underline-offset-8 decoration-secondary-700/30 decoration-2">
                    <button
                      onClick={() => navigate("/landlord/properties")}
                      className="inline-flex items-center font-medium text-sm text-gray-500 hover:text-primary-plot transition-colors"
                    >
                      <TbArrowBackUp size={21} className="mr-2" />
                      Back to Properties
                    </button>
                  </div>
                  <button className="w-full md:w-auto mt-4 lg:mt-0 bg-gradient-to-r from-secondary-600/90 to-secondary-700 text-white text-[0.8rem] md:text-[0.98rem] px-6 py-3 md:py-2.5 rounded-lg hover:shadow-lg transition-colors duration-200 font-medium space-x-2  shadow-md">
                    <div className="flex items-center justify-center space-x-2">
                      <TbHomePlus className="h-5 w-5 md:h-6 md:w-6" />
                      <span>Add New Unit</span>
                      <TbArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                  </button>
                </div>
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
                    <TbHomeDot className="h-4 w-4 text-secondary-600" />
                  </div>
                  <span className="text-[0.65rem] font-bold text-secondary-600 bg-secondary-50 px-1.5 py-0.5 rounded-full">
                    Total
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                    Units
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
                    <TbCircleCheck className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                    {stats.occupancyRate.toFixed(0)}%
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
                  <div className="p-2 bg-gradient-to-br from-red-100 to-rose-100 rounded-lg">
                    <TbHomeX className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-[0.65rem] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                    Vacant
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                    Vacant
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.vacantUnits}
                  </p>
                  <p className="text-[0.6rem] text-gray-500">Available</p>
                </div>
              </div>

              <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-lg">
                    <TbClock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span className="text-[0.65rem] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full">
                    Maintenance
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                    Maintenance
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.maintenanceUnits}
                  </p>
                  <p className="text-[0.6rem] text-gray-500">In repair</p>
                </div>
              </div>

              <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[150px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                    <TbTrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                    +12%
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
                        Total Units
                      </p>
                      <p className="text-2xl font-bold text-primary-plot">
                        {stats.totalUnits}
                      </p>
                      <p className="text-[0.7rem] text-gray-500 mt-1">
                        All rental units
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center px-2 py-1 bg-secondary-50 rounded-full">
                    <TbTrendingUp className="h-3 w-3 text-secondary-600 mr-1" />
                    <span className="text-[0.65rem] font-bold text-secondary-600">
                      Total
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
                      Currently rented
                    </p>
                  </div>
                  <div className="flex items-center px-2 py-0.5 bg-green-100 border border-green-300 rounded-full">
                    <span className="text-[0.65rem] font-bold text-green-600">
                      {stats.occupancyRate.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                      Vacant Units
                    </p>
                    <p className="text-2xl font-bold text-primary-plot">
                      {stats.vacantUnits}
                    </p>
                    <p className="text-[0.7rem] text-gray-500 mt-1">
                      Ready to rent
                    </p>
                  </div>
                  <div className="flex items-center px-2 py-0.5 bg-red-100 border border-red-300 rounded-full">
                    <span className="text-[0.65rem] font-bold text-red-600">
                      Vacant
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                      Maintenance
                    </p>
                    <p className="text-2xl font-bold text-primary-plot">
                      {stats.maintenanceUnits}
                    </p>
                    <p className="text-[0.7rem] text-gray-500 mt-1">
                      Under repair
                    </p>
                  </div>
                  <div className="flex items-center px-2 py-0.5 bg-yellow-100 border border-yellow-300 rounded-full">
                    <span className="text-[0.65rem] font-bold text-yellow-600">
                      Maintenance
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
                      From occupied units
                    </p>
                  </div>
                  <div className="flex items-center px-2 py-0.5 bg-green-100 border border-green-300 rounded-full">
                    <TbTrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-[0.65rem] font-bold text-green-600">
                      +12%
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
                <div className="">
                  <h3 className="text-base md:text-lg font-bold text-secondary-plot">
                    Search & Filter
                  </h3>
                  <p className="text-[0.8rem] md:text-sm text-gray-500 line-clamp-1">
                    Find and organize units available in {property.name}
                  </p>
                </div>
              </div>

              {/* Right side - Search and Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-3 lg:min-w-[60%]">
                {/* Search Input */}
                <div className="relative flex-1 lg:min-w-[250px]">
                  <TbSearch
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search units..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-[0.6rem] text-[0.83rem] md:text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot/50 focus:border-primary-plot bg-gray-50 font-medium text-gray-500 placeholder-gray-400"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex items-center space-x-3">
                  {/* Status Filter */}
                  <div className="w-full md:w-auto relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full md:w-auto pl-4 pr-7 py-2.5 mb-1 md:mb-0.5 border border-gray-300 rounded-lg appearance-none text-[0.83rem] md:text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                    >
                      <option value="all">All Statuses</option>
                      <option value="occupied">Occupied</option>
                      <option value="vacant">Vacant</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                    <PiCaretDownDuotone
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>

                  {/* Sort Filter */}
                  <div className="w-full md:w-auto relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full md:w-auto pl-4 pr-7 py-2.5 mb-1 md:mb-0.5 border border-gray-300 rounded-lg appearance-none text-[0.83rem] md:text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="rent">Sort by Rent</option>
                      <option value="status">Sort by Status</option>
                    </select>
                    <PiCaretDownDuotone
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Units Grid */}
          {filteredUnits.length === 0 ? (
            <div className="md:bg-white md:rounded-2xl md:shadow-lg md:border border-gray-100 p-4 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 md:bg-gray-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

              <div className="relative z-10">
                <div className="p-3 md:p-4 bg-gray-200 rounded-2xl inline-flex mb-2 md:mb-4">
                  <TbHome className="h-16 w-16 text-secondary-plot/80" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-500 mb-2">
                  No units found
                </h3>
                <p className="text-gray-500 text-[0.83rem] md:text-[0.9rem] mb-6 max-w-lg mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "Get started by adding your first unit to this property."}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <button className="bg-gradient-to-r from-secondary-plot to-secondary-plot/80 hover:from-secondary-700 hover:to-secondary-700/90 text-white px-6 py-2.5 md:py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center space-x-2 mx-auto shadow-lg">
                    <TbHomePlus size={21} />
                    <span className="text-[0.8rem] md:text-sm">
                      Add First Unit
                    </span>
                    <TbArrowRight size={17} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUnits.map((unit) => {
                const currentTenant = getCurrentTenant(unit.id);

                return (
                  <div
                    key={unit.id}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    {/* Unit Image */}
                    <div className="relative">
                      {unit.image_urls && unit.image_urls.length > 0 ? (
                        <img
                          src={unit.image_urls[0]}
                          alt={unit.name}
                          className="w-full h-64 object-cover"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <TbHomeExclamation className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={getStatusBadge(unit.status)}>
                          {getStatusIcon(unit.status)}
                          {unit.status.charAt(0).toUpperCase() +
                            unit.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Unit Info */}
                    <div className="p-3 md:p-4 lg:p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg md:text-xl font-bold text-primary-600">
                          {unit.name}
                        </h3>
                        {unit.status === "vacant" && (
                          <button
                            onClick={() => handleAddTenantToUnit(unit)}
                            className="bg-gradient-to-r from-secondary-700 to-secondary-600 text-white px-3 py-1.5 rounded-full text-[0.7rem] md:text-xs font-semibold hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-center gap-1">
                              <RiUserAddLine className="h-4 w-4" />
                              <span className="text-[0.7rem] md:text-xs">
                                Assign to Tenant
                              </span>
                              <TbArrowRight size={16} className="" />
                            </div>
                          </button>
                        )}
                      </div>

                      <p className="mt-2 text-gray-600 text-[0.8rem] md:text-sm line-clamp-1">
                        {unit.description}
                      </p>

                      <div className="mt-3 md:mt-6 space-y-3">
                        <div className="flex items-center justify-between p-3 border border-primary-plot/20 bg-gradient-to-r from-primary-plot/10 to-secondary-plot/10 rounded-xl">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-secondary-plot">
                              Monthly Rent
                            </span>
                            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
                              KSh {unit.rent_amount?.toLocaleString()}
                            </span>
                          </div>
                          <hr className="w-10 border-gray-400 rotate-90" />

                          {!currentTenant ? (
                            <div className="flex flex-1 max-w-[55%] flex-col gap-1.5 justify-between">
                              <span className="text-sm md:text-[0.95rem] font-semibold text-secondary-600 truncate">
                                {/*  TODO: To fix this later */}
                                {/* {currentTenant.fullName || "Demo Tenant Name"} */}
                                Demo Tenant Name Long Sample
                              </span>
                              {/* tenant phone number */}
                              <a
                                href={`tel:+254712345678`}
                                className="flex items-center gap-2 text-[0.8rem] md:text-sm font-semibold text-secondary-plot"
                              >
                                <TbPhoneCall className="h-4 w-4" />
                                {/* {currentTenant.phoneNumber || "N/A"} */}
                                <span className="underline underline-offset-4">
                                  +254712345678
                                </span>
                              </a>
                            </div>
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              No Tenant Assigned !
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 space-y-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/landlord/units/${unit.id}`)
                            }
                            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 lg:py-3 bg-gradient-to-r from-secondary-700 via-secondary-700/80 to-secondary-800/80 text-sm md:text-[0.9rem] text-white font-medium rounded-[0.65rem] hover:shadow-lg transition-all duration-300"
                          >
                            <TbHomeDot className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                            View Unit Details
                          </button>
                          <button className="inline-flex items-center px-3 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 font-medium rounded-[0.65rem] transition-all duration-300 hover:shadow-lg">
                            <TbEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUnit(unit)}
                            className="inline-flex items-center px-3 py-2.5 border border-red-400 text-red-700 bg-red-200 hover:bg-red-500 hover:text-white hover:border-red-600 font-medium rounded-[0.65rem] transition-all duration-300 hover:shadow-lg"
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
          )}
        </div>
      </LandlordLayout>
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
    </>
  );
};

export default LandlordUnits;
