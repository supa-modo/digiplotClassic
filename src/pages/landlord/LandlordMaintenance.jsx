import { useState, useEffect } from "react";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import MaintenanceRequestModal from "../../components/landlord/MaintenanceRequestModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  demoMaintenanceRequests,
  demoTenants,
  demoUnits,
  demoProperties,
  getPropertiesForLandlord,
} from "../../utils/demoData";
import {
  TbTools,
  TbSearch,
  TbFilter,
  TbEye,
  TbEdit,
  TbCalendar,
  TbHome,
  TbUser,
  TbClock,
  TbCheckbox,
  TbProgressCheck,
  TbAlertTriangle,
  TbPlus,
  TbMessage,
  TbPhone,
  TbArrowRight,
  TbTrendingUp,
} from "react-icons/tb";
import { PiCaretDownDuotone, PiWrenchDuotone } from "react-icons/pi";
import { FaTools } from "react-icons/fa";

const LandlordMaintenance = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [landlordProperties, setLandlordProperties] = useState([]);

  useEffect(() => {
    if (user?.id) {
      // Get properties for this landlord
      const properties = getPropertiesForLandlord("landlord-1"); // TODO: Use actual user id
      const propertiesWithUnits = properties.map((property) => ({
        ...property,
        units: demoUnits.filter((unit) => unit.property_id === property.id),
      }));
      setLandlordProperties(propertiesWithUnits);

      // Filter maintenance requests for the logged-in landlord's properties
      const landlordRequests = demoMaintenanceRequests
        .map((request) => {
          const tenant = demoTenants.find((t) => t.id === request.tenant_id);
          const unit = tenant
            ? demoUnits.find((u) => u.id === tenant.unit_id)
            : null;
          const property = unit
            ? demoProperties.find((p) => p.id === unit.property_id)
            : null;

          // Only include requests for properties owned by this landlord
          if (property && property.landlord_id === user?.id) {
            return {
              ...request,
              tenant_name: tenant
                ? `${tenant.first_name} ${tenant.last_name}`
                : "Unknown",
              tenant_email: tenant?.email,
              tenant_phone: tenant?.phone,
              unit_number: unit?.unit_number,
              property_name: property?.name,
            };
          }
          return null;
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setRequests(landlordRequests);
      setFilteredRequests(landlordRequests);
    }
  }, [user]);

  useEffect(() => {
    let filtered = requests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.tenant_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.unit_number
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.property_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (request) => request.priority === priorityFilter
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (request) => request.category === categoryFilter
      );
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Pending",
        class:
          "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-md",
        icon: <TbClock className="h-3 w-3" />,
      },
      in_progress: {
        label: "In Progress",
        class:
          "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md",
        icon: <TbProgressCheck className="h-3 w-3" />,
      },
      completed: {
        label: "Completed",
        class:
          "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md",
        icon: <TbCheckbox className="h-3 w-3" />,
      },
      cancelled: {
        label: "Cancelled",
        class:
          "bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-md",
        icon: <TbAlertTriangle className="h-3 w-3" />,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full gap-1.5 ${config.class}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: {
        label: "Low",
        class:
          "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
      },
      medium: {
        label: "Medium",
        class:
          "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200",
      },
      high: {
        label: "High",
        class:
          "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200",
      },
      emergency: {
        label: "Emergency",
        class: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md",
      },
    };

    const config = priorityConfig[priority] || priorityConfig.low;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-lg ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      plumbing: "🔧",
      electrical: "⚡",
      hvac: "❄️",
      cleaning: "🧹",
      appliances: "📱",
      security: "🔒",
      other: "🔨",
    };
    return categoryIcons[category] || categoryIcons.other;
  };

  const getMaintenanceStats = () => {
    return {
      total: filteredRequests.length,
      pending: filteredRequests.filter((r) => r.status === "pending").length,
      inProgress: filteredRequests.filter((r) => r.status === "in_progress")
        .length,
      completed: filteredRequests.filter((r) => r.status === "completed")
        .length,
      high: filteredRequests.filter((r) => r.priority === "high").length,
      emergency: filteredRequests.filter((r) => r.priority === "emergency")
        .length,
    };
  };

  const stats = getMaintenanceStats();

  const handleAddRequest = () => {
    setShowMaintenanceModal(true);
  };

  const handleMaintenanceRequestSave = (newRequest) => {
    // Add the new request to the list
    const requestWithId = {
      ...newRequest,
      id: Date.now().toString(),
      status: "pending",
      created_at: new Date().toISOString(),
    };

    setRequests((prev) => [requestWithId, ...prev]);
    setFilteredRequests((prev) => [requestWithId, ...prev]);
    setShowMaintenanceModal(false);
  };

  return (
    <LandlordLayout>
      <div className="space-y-6">
        {/* Header - Enhanced */}
        <div className=" relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                <PiWrenchDuotone className="h-7 md:h-8 w-7 md:w-8 text-secondary-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary-plot">
                  Maintenance Management
                </h1>
                <p className="text-gray-600 mt-1 text-xs md:text-sm lg:text-base">
                  Track and manage property maintenance requests
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button className="bg-white border border-gray-300 text-gray-700 text-[0.8rem] md:text-[0.9rem] px-4 py-3 md:py-2.5 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium">
                <div className="flex items-center justify-center space-x-2">
                  <TbCalendar className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Schedule</span>
                </div>
              </button>
              <button
                onClick={handleAddRequest}
                className="bg-gradient-to-r from-secondary-600/90 to-secondary-700 text-white text-[0.8rem] md:text-[0.98rem] px-6 py-3 md:py-2.5 rounded-lg hover:shadow-lg transition-colors duration-200 font-medium space-x-2  shadow-md"
              >
                <div className="flex items-center justify-center space-x-2">
                  <TbPlus className="h-5 w-5 md:h-6 md:w-6" />
                  <span>Add Request</span>
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
                  <FaTools className="h-4 w-4 text-secondary-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-secondary-600 bg-secondary-50 px-1.5 py-0.5 rounded-full">
                  Total
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Requests
                </p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-[0.6rem] text-gray-500">All requests</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
                  <TbClock className="h-4 w-4 text-yellow-600" />
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
                  {stats.pending}
                </p>
                <p className="text-[0.6rem] text-yellow-600 font-medium">
                  Awaiting
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                  <TbProgressCheck className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  In Progress
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.inProgress}
                </p>
                <p className="text-[0.6rem] text-blue-600 font-medium">
                  Working
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                  <TbCheckbox className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  Done
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Completed
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.completed}
                </p>
                <p className="text-[0.6rem] text-green-600 font-medium">
                  Finished
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                  <TbAlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full">
                  High
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  High Priority
                </p>
                <p className="text-xl font-bold text-gray-900">{stats.high}</p>
                <p className="text-[0.6rem] text-orange-600 font-medium">
                  Urgent
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[140px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg">
                  <TbAlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                  Emergency
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Emergency
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.emergency}
                </p>
                <p className="text-[0.6rem] text-red-600 font-medium">
                  Critical
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Compact Grid */}
          <div className="hidden lg:grid lg:grid-cols-6 gap-4 relative z-10">
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="">
                  <div>
                    <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                      Total Requests
                    </p>
                    <p className="text-2xl font-bold text-primary-plot">
                      {stats.total}
                    </p>
                    <p className="text-[0.7rem] text-gray-500 mt-1">
                      All requests
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
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.pending}
                  </p>
                  <p className="text-[0.7rem] text-yellow-600 mt-1 font-medium">
                    Awaiting action
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
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.inProgress}
                  </p>
                  <p className="text-[0.7rem] text-blue-600 mt-1 font-medium">
                    Being worked on
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-blue-100 border border-blue-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-blue-600">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.completed}
                  </p>
                  <p className="text-[0.7rem] text-green-600 mt-1 font-medium">
                    Successfully done
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-green-100 border border-green-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-green-600">
                    Done
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    High Priority
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.high}
                  </p>
                  <p className="text-[0.7rem] text-orange-600 mt-1 font-medium">
                    Needs attention
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-orange-100 border border-orange-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-orange-600">
                    High
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Emergency
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {stats.emergency}
                  </p>
                  <p className="text-[0.7rem] text-red-600 mt-1 font-medium">
                    Critical issues
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-red-100 border border-red-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-red-600">
                    Emergency
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
                  Find and organize maintenance requests
                </p>
              </div>
            </div>

            {/* Right side - Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-3 lg:min-w-[60%]">
              {/* Search Input */}
              <div className="relative flex-1 lg:min-w-[300px]">
                <TbSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search maintenance requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-[0.6rem] text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot/50 focus:border-primary-plot bg-gray-50 font-medium text-gray-500 placeholder-gray-400"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Status Filter */}
                <div className="w-full sm:w-auto relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-auto pl-4 pr-7 py-2.5 border border-gray-300 rounded-lg appearance-none text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <PiCaretDownDuotone
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>

                {/* Priority Filter */}
                <div className="w-full sm:w-auto relative">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full sm:w-auto pl-4 pr-7 py-2.5 border border-gray-300 rounded-lg appearance-none text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                  >
                    <option value="all">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                  </select>
                  <PiCaretDownDuotone
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>

                {/* Category Filter */}
                <div className="w-full sm:w-auto relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full sm:w-auto pl-4 pr-7 py-2.5 border border-gray-300 rounded-lg appearance-none text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                  >
                    <option value="all">All Categories</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="hvac">HVAC</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="appliances">Appliances</option>
                    <option value="security">Security</option>
                    <option value="other">Other</option>
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

        {/* Maintenance Requests */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-12 text-center border border-white/20">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <FaTools className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No maintenance requests found
            </h3>
            <p className="text-gray-600">
              {requests.length === 0
                ? "No maintenance requests available"
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getCategoryIcon(request.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {request.title}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {request.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(request.priority)}
                    {getStatusBadge(request.status)}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {request.description}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-plot/5 to-secondary-plot/5 rounded-xl mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-plot to-secondary-plot rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">
                        {request.tenant_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {request.tenant_name}
                      </p>
                      <p className="text-gray-600 text-xs">
                        Unit {request.unit_number} • {request.property_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-primary-plot hover:bg-primary-plot/10 rounded-lg transition-all"
                      title="Call Tenant"
                    >
                      <TbPhone size={16} />
                    </button>
                    <button
                      className="p-2 text-primary-plot hover:bg-primary-plot/10 rounded-lg transition-all"
                      title="Send Message"
                    >
                      <TbMessage size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <TbCalendar size={16} />
                    <span>
                      Created:{" "}
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {request.urgency_level && (
                    <div className="flex items-center space-x-1">
                      <TbClock size={16} />
                      <span className="capitalize">
                        {request.urgency_level}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center space-x-2 text-sm">
                      <TbEye size={16} />
                      <span>View Details</span>
                    </button>
                    <button className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 font-semibold flex items-center space-x-2 text-sm">
                      <TbEdit size={16} />
                      <span>Update</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">ID: {request.id}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Maintenance Request Modal */}
      <MaintenanceRequestModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        onSave={handleMaintenanceRequestSave}
        properties={landlordProperties}
      />
    </LandlordLayout>
  );
};

export default LandlordMaintenance;
