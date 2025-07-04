import { useState, useEffect } from "react";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import TenantModal from "../../components/landlord/TenantModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  getTenantsForLandlord,
  getPropertiesForLandlord,
} from "../../utils/demoData";
import leaseService from "../../services/leaseService";
import {
  TbPlus,
  TbSearch,
  TbFilter,
  TbUsers,
  TbPhone,
  TbMail,
  TbCalendar,
  TbHome,
  TbCurrencyDollar,
  TbEdit,
  TbEye,
  TbUserPlus,
  TbSparkles,
  TbTrendingUp,
  TbCash,
  TbUserCheck,
  TbArrowRight,
  TbMailFilled,
  TbPhoneCall,
} from "react-icons/tb";
import { RiUserAddLine } from "react-icons/ri";
import { PiCaretDownDuotone, PiUsersDuotone } from "react-icons/pi";

const LandlordTenants = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [properties, setProperties] = useState([]);

  // Modal states
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    itemName: "",
    onConfirm: null,
    isLoading: false,
  });

  useEffect(() => {
    if (user?.id) {
      // TODO: Replace with actual user id
      const landlordTenants = getTenantsForLandlord("landlord-1");
      setTenants(landlordTenants);
      setFilteredTenants(landlordTenants);

      // Get properties with units for tenant assignment
      const landlordProperties = getPropertiesForLandlord("landlord-1");
      const propertiesWithUnits = landlordProperties.map((property) => ({
        ...property,
        units: property.units || [], // Ensure units array exists
      }));
      setProperties(propertiesWithUnits);
    }
  }, [user]);

  useEffect(() => {
    let filtered = tenants;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tenant) =>
          `${tenant.first_name} ${tenant.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tenant.phone.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((tenant) => tenant.status === statusFilter);
    }

    setFilteredTenants(filtered);
  }, [tenants, searchTerm, statusFilter]);

  const handleAddTenant = () => {
    setSelectedTenant(null);
    setShowTenantModal(true);
  };

  const handleEditTenant = (tenant) => {
    setSelectedTenant(tenant);
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
        title: "Tenant Saved",
        message: `Tenant "${tenantData.first_name} ${
          tenantData.last_name
        }" has been ${selectedTenant ? "updated" : "added"} successfully!`,
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        autoClose: true,
        isLoading: false,
      });

      // Refresh tenants list in real app
    } catch (error) {
      setConfirmationModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to save tenant. Please try again.",
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        isLoading: false,
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        label: "Active",
        class:
          "bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 border border-green-300",
      },
      inactive: {
        label: "Inactive",
        class:
          "bg-gradient-to-br from-red-100 to-red-100 text-red-700 border border-red-300",
      },
      suspended: {
        label: "Suspended",
        class:
          "bg-gradient-to-br from-red-100 to-pink-100 text-red-700 border border-red-300",
      },
      pending: {
        label: "Pending",
        class:
          "bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-300",
      },
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span
        className={`px-3 py-1 text-xs font-bold rounded-full ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  const getTenantStats = () => {
    const totalTenants = tenants.length;
    const activeTenants = tenants.filter((t) => t.status === "active").length;
    const inactiveTenants = tenants.filter(
      (t) => t.status === "inactive" || t.status === "terminated"
    ).length;
    const pendingTenants = tenants.filter((t) => t.status === "pending").length;
    const totalRevenue = tenants.reduce(
      (sum, tenant) => sum + (tenant.lease?.monthlyRent || 0),
      0
    );

    return {
      totalTenants,
      activeTenants,
      inactiveTenants,
      pendingTenants,
      totalRevenue,
    };
  };

  const stats = getTenantStats();

  return (
    <LandlordLayout>
      <div className="space-y-6">
        {/* Header - Enhanced */}
        <div className=" relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                <PiUsersDuotone className="h-7 md:h-8 w-7 md:w-8 text-secondary-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary-plot">
                  Tenant Management
                </h1>
                <p className="text-gray-600 mt-1 text-xs md:text-sm lg:text-base">
                  Manage your tenants, leases, and rental information
                </p>
              </div>
            </div>
            <button
              onClick={handleAddTenant}
              className="mt-4 lg:mt-0 bg-gradient-to-r from-secondary-600/90 to-secondary-700 text-white text-[0.8rem] md:text-[0.98rem] px-6 py-3 md:py-2.5 rounded-lg hover:shadow-lg transition-colors duration-200 font-medium space-x-2  shadow-md"
            >
              <div className="flex items-center justify-center space-x-2">
                <RiUserAddLine className="h-5 w-5 md:h-6 md:w-6" />
                <span>Add New Tenant</span>
                <TbArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </button>
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
                  <TbUsers className="h-4 w-4 text-secondary-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-secondary-600 bg-secondary-50 px-1.5 py-0.5 rounded-full">
                  Total
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Tenants
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalTenants}
                </p>
                <p className="text-[0.6rem] text-gray-500">Registered</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                  <TbUserCheck className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Active
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.activeTenants}
                </p>
                <p className="text-[0.6rem] text-green-600 font-medium">
                  Renting
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                  <TbHome className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                  Units
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Occupied
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.activeTenants}
                </p>
                <p className="text-[0.6rem] text-gray-500">With tenants</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
                  <TbCalendar className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full">
                  Pending
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Pending
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.pendingTenants}
                </p>
                <p className="text-[0.6rem] text-gray-500">Applications</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[150px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                  <TbCash className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  +8%
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
                      Total Tenants
                    </p>
                    <p className="text-2xl font-bold text-primary-plot">
                      {stats.totalTenants}
                    </p>
                    <p className="text-[0.7rem] text-gray-500 mt-1">
                      All registered
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
                    Active Tenants
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.activeTenants}
                  </p>
                  <p className="text-[0.7rem] text-green-600 mt-1 font-medium">
                    Currently renting
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-green-100 border border-green-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-green-600">
                    Active
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
                    {stats.activeTenants}
                  </p>
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    Units with tenants
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-blue-100 border border-blue-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-blue-600">
                    Units
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Pending Applications
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.pendingTenants}
                  </p>
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    Awaiting review
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-yellow-100 border border-yellow-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-yellow-600">
                    Pending
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
                    From tenant rents
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-green-100 border border-green-300 rounded-full">
                  <TbTrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-[0.65rem] font-bold text-green-600">
                    +8%
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
                  Find and organize your tenants
                </p>
              </div>
            </div>

            {/* Right side - Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-3 lg:min-w-[55%]">
              {/* Search Input */}
              <div className="w-full relative flex-1 lg:min-w-[300px]">
                <TbSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search tenants by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-[0.6rem] text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot/50 focus:border-primary-plot bg-gray-50 font-medium text-gray-500 placeholder-gray-400"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="w-full lg:w-[20%] relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-4 pr-7 py-2.5 border border-gray-300 rounded-lg appearance-none text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                >
                  <option value="all">All Tenants</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
                <PiCaretDownDuotone
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tenants List - Enhanced */}
        {filteredTenants.length === 0 ? (
          <div className="md:bg-white md:rounded-2xl md:shadow-lg md:border border-gray-100 p-4 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 md:bg-gray-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="p-3 md:p-4 bg-gray-200 rounded-2xl inline-flex mb-2 md:mb-4">
                <PiUsersDuotone className="h-16 w-16 text-secondary-plot/80" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-500 mb-2">
                {tenants.length === 0 ? "No tenants yet" : "No tenants found"}
              </h3>
              <p className="text-gray-500 text-[0.83rem] md:text-[0.9rem] mb-6 max-w-lg mx-auto">
                {tenants.length === 0
                  ? "Get started by adding your first tenant to begin managing your rental properties"
                  : "Try adjusting your search terms or filter criteria to find the tenants you're looking for"}
              </p>
              {tenants.length === 0 && (
                <button
                  onClick={handleAddTenant}
                  className="bg-gradient-to-r from-secondary-plot to-secondary-plot/80 hover:from-secondary-700 hover:to-secondary-700/90 text-white px-6 py-2.5 md:py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center space-x-2 mx-auto shadow-lg"
                >
                  <RiUserAddLine size={21} />
                  <span className="text-[0.8rem] md:text-sm">
                    Add Your First Tenant
                  </span>
                  <TbArrowRight size={17} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r to-gray-200 from-secondary-600/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTenants.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/20 transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 h-12 w-12 border border-secondary-500/20 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-secondary-plot">
                              {tenant.first_name?.[0]}
                              {tenant.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-600">
                              {tenant.first_name} {tenant.last_name}
                            </div>
                            <div className="flex items-center space-x-3 mt-1">
                              <div className="flex items-center text-[0.7rem] md:text-xs lg:text-[0.8rem] text-gray-500">
                                <TbMailFilled className="h-4 w-4 mr-1 text-gray-400" />
                                <a href={`mailto:${tenant.email}`}>
                                  {tenant.email}
                                </a>
                              </div>
                              <div className="flex items-center text-[0.7rem] md:text-xs lg:text-[0.8rem] text-gray-500">
                                <TbPhoneCall className="h-4 w-4 mr-1 text-secondary-700" />
                                <a href={`tel:${tenant.phone}`}>
                                  {tenant.phone}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-secondary-700">
                          {tenant.unit?.name || "No unit assigned"}
                        </div>
                        <div className="text-xs text-secondary-plot">
                          {tenant.property?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-secondary-700">
                          KSh{" "}
                          {tenant.lease?.monthlyRent?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-gray-500">per month</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(tenant.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button className="text-primary-plot hover:text-primary-plot/80 px-4 py-2 hover:bg-primary-plot/10 rounded-[0.3rem] transition-all duration-200">
                            <TbEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditTenant(tenant)}
                            className="text-blue-600 hover:text-blue-800 px-4 py-1.5 hover:bg-blue-100 rounded-[0.4rem] transition-all duration-200"
                          >
                            <div className="flex items-center space-x-2">
                              <TbEdit className="h-4 w-4" />
                              <span>Edit</span>
                            </div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tenant Modal */}
        {showTenantModal && (
          <TenantModal
            isOpen={showTenantModal}
            onClose={() => setShowTenantModal(false)}
            onSave={handleTenantSave}
            tenant={selectedTenant}
            properties={properties}
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
    </LandlordLayout>
  );
};

export default LandlordTenants;
