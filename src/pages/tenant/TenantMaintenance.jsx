import { useState } from "react";
import TenantLayout from "../../components/tenant/TenantLayout";
import MaintenanceModal from "../../components/tenant/MaintenanceModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  getMaintenanceRequestsForTenant,
  getUnitById,
  getPropertyById,
} from "../../utils/demoData";
import {
  TbPlus,
  TbSearch,
  TbFilter,
  TbCalendar,
  TbSettings,
  TbEye,
  TbPhoto,
  TbClock,
  TbCheck,
  TbAlertTriangle,
  TbX,
  TbMessageCircle,
  TbExclamationCircle,
} from "react-icons/tb";

const TenantMaintenance = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

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

  // Get maintenance requests and related data
  const requests = getMaintenanceRequestsForTenant(user?.id) || [];
  const unit = user?.unit_id ? getUnitById(user.unit_id) : null;
  const property = unit ? getPropertyById(unit.property_id) : null;

  const handleRequestSuccess = async (requestData) => {
    setConfirmationModal((prev) => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Maintenance request submitted:", requestData);

      setShowModal(false);
      setConfirmationModal({
        isOpen: true,
        type: "success",
        title: "Request Submitted",
        message: `Your maintenance request "${requestData.title}" has been submitted successfully. You will receive updates on its progress.`,
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        autoClose: true,
        isLoading: false,
      });

      // Refresh requests data here
    } catch (error) {
      setConfirmationModal({
        isOpen: true,
        type: "error",
        title: "Submission Failed",
        message: "Failed to submit your maintenance request. Please try again.",
        onConfirm: () =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
        isLoading: false,
      });
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        class: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Pending",
        icon: TbClock,
      },
      in_progress: {
        class: "bg-blue-100 text-blue-800 border-blue-200",
        text: "In Progress",
        icon: TbSettings,
      },
      resolved: {
        class: "bg-green-100 text-green-800 border-green-200",
        text: "Resolved",
        icon: TbCheck,
      },
      cancelled: {
        class: "bg-gray-100 text-gray-800 border-gray-200",
        text: "Cancelled",
        icon: TbX,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${config.class}`}
      >
        <IconComponent size={12} className="mr-1" />
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: {
        class: "bg-green-50 text-green-700 border-green-200",
        text: "Low",
        icon: TbCheck,
      },
      medium: {
        class: "bg-yellow-50 text-yellow-700 border-yellow-200",
        text: "Medium",
        icon: TbClock,
      },
      high: {
        class: "bg-orange-50 text-orange-700 border-orange-200",
        text: "High",
        icon: TbAlertTriangle,
      },
      emergency: {
        class: "bg-red-50 text-red-700 border-red-200",
        text: "Emergency",
        icon: TbExclamationCircle,
      },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${config.class}`}
      >
        <IconComponent size={12} className="mr-1" />
        {config.text}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      plumbing: "🔧",
      electrical: "⚡",
      hvac: "🌡️",
      appliances: "🏠",
      security: "🔒",
      structural: "🏗️",
      cleaning: "🧹",
      pest_control: "🐛",
      other: "📝",
    };

    return categoryIcons[category] || "📝";
  };

  // Filter requests based on search and filters
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" || request.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "hvac", label: "Heating/Cooling" },
    { value: "appliances", label: "Appliances" },
    { value: "security", label: "Security" },
    { value: "structural", label: "Structural" },
    { value: "cleaning", label: "Cleaning" },
    { value: "pest_control", label: "Pest Control" },
    { value: "other", label: "Other" },
  ];

  return (
    <TenantLayout>
      <div className="space-y-6">
        {/* Header - Enhanced to match landlord component style */}
        <div className="relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                <TbSettings className="h-7 md:h-8 w-7 md:w-8 text-secondary-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary-plot">
                  Maintenance Requests
                </h1>
                <p className="text-gray-600 mt-1 text-xs md:text-sm lg:text-base">
                  Submit and track maintenance requests for your unit
                </p>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-secondary-600/90 to-secondary-700 text-white text-[0.8rem] md:text-[0.98rem] px-6 py-3 md:py-2.5 rounded-lg hover:shadow-lg transition-colors duration-200 font-medium space-x-2 shadow-md"
              >
                <div className="flex items-center justify-center space-x-2">
                  <TbPlus className="h-5 w-5 md:h-6 md:w-6" />
                  <span>New Request</span>
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
            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[120px]">
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
                  {requests.filter((r) => r.status === "pending").length}
                </p>
                <p className="text-[0.6rem] text-gray-500">Awaiting</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[120px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                  <TbSettings className="h-4 w-4 text-blue-600" />
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
                  {requests.filter((r) => r.status === "in_progress").length}
                </p>
                <p className="text-[0.6rem] text-blue-600 font-medium">
                  Working
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[120px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                  <TbCheck className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  Done
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Resolved
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {requests.filter((r) => r.status === "resolved").length}
                </p>
                <p className="text-[0.6rem] text-green-600 font-medium">
                  Complete
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-w-[120px]">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
                  <TbMessageCircle className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-[0.65rem] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                  Total
                </span>
              </div>
              <div className="text-center">
                <p className="text-[0.7rem] font-semibold text-gray-600 mb-0.5">
                  Total
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {requests.length}
                </p>
                <p className="text-[0.6rem] text-gray-500">All time</p>
              </div>
            </div>
          </div>

          {/* Desktop: Compact Grid */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-4 relative z-10">
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-[0.8rem] shadow-sm border border-gray-200/70 p-4 group hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[0.8rem] font-bold text-secondary-plot mb-1">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {requests.filter((r) => r.status === "pending").length}
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
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {requests.filter((r) => r.status === "in_progress").length}
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
                    Resolved
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {requests.filter((r) => r.status === "resolved").length}
                  </p>
                  <p className="text-[0.7rem] text-green-600 mt-1 font-medium">
                    Completed
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
                    Total
                  </p>
                  <p className="text-2xl font-bold text-primary-plot">
                    {requests.length}
                  </p>
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    All requests
                  </p>
                </div>
                <div className="flex items-center px-2 py-0.5 bg-purple-100 border border-purple-300 rounded-full">
                  <span className="text-[0.65rem] font-bold text-purple-600">
                    Total
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
                  Find specific maintenance requests quickly
                </p>
              </div>
            </div>

            {/* Right side - Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-3 lg:min-w-[65%]">
              {/* Search Input */}
              <div className="relative flex-1 lg:min-w-[300px]">
                <TbSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search requests by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-[0.6rem] text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot/50 focus:border-primary-plot bg-gray-50 font-medium text-gray-500 placeholder-gray-400"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex items-center space-x-3">
                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-4 pr-7 py-2.5 border border-gray-300 rounded-lg appearance-none text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="pl-4 pr-7 py-2.5 border border-gray-300 rounded-lg appearance-none text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-primary-plot focus:border-primary-plot bg-gray-50 font-semibold whitespace-nowrap text-gray-600"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Requests Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-plot/10 to-secondary-plot/10">
            <h3 className="text-lg font-bold text-secondary-plot">
              Maintenance Requests
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Track the status of all your maintenance requests
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Date Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <TbMessageCircle
                            className="text-gray-400"
                            size={32}
                          />
                        </div>
                        <p className="text-xl font-semibold text-gray-600 mb-2">
                          No maintenance requests found
                        </p>
                        <p className="text-sm text-gray-500 max-w-md">
                          {searchTerm ||
                          statusFilter !== "all" ||
                          categoryFilter !== "all"
                            ? "Try adjusting your search or filters to find what you're looking for"
                            : "Submit your first maintenance request to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request, index) => (
                    <tr
                      key={request.id}
                      className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div>
                          <div className="text-sm font-bold text-gray-900 mb-1">
                            {request.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2 mb-2">
                            {request.description}
                          </div>
                          {request.image_url && (
                            <div className="flex items-center text-xs text-primary-plot bg-primary-plot/10 px-2 py-1 rounded-full w-fit">
                              <TbPhoto size={12} className="mr-1" />
                              <span>Has photo</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            {getCategoryIcon(request.category)}
                          </span>
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {request.category?.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {getPriorityBadge(request.priority)}
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {new Date(request.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(request.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-plot/10 to-secondary-plot/10 text-primary-plot hover:from-primary-plot hover:to-secondary-plot hover:text-white rounded-lg transition-all duration-200 font-semibold border border-primary-plot/20 hover:border-transparent"
                          title="View Details"
                        >
                          <TbEye size={16} />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Property Info Footer */}
        {property && (
          <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-plot/5 rounded-full -mr-8 -mt-8 blur-lg"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Property:</span>
                  <span className="text-gray-900 font-medium">
                    {property.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Unit:</span>
                  <span className="text-gray-900 font-medium">
                    {unit?.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">
                    For assistance call:
                  </span>
                  <span className="text-gray-900 font-bold">
                    +254 700 000 000
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Maintenance Modal */}
      {showModal && (
        <MaintenanceModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onRequestSuccess={handleRequestSuccess}
        />
      )}

      {/* Enhanced Request Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h2 className="text-xl font-bold text-secondary-plot">
                  Request Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Complete information about your maintenance request
                </p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <TbX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {selectedRequest.title}
                  </h3>
                  <div className="flex items-center space-x-3 mb-4">
                    {getStatusBadge(selectedRequest.status)}
                    {getPriorityBadge(selectedRequest.priority)}
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full border border-gray-200">
                      {getCategoryIcon(selectedRequest.category)}{" "}
                      <span className="ml-1 capitalize">
                        {selectedRequest.category?.replace("_", " ")}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedRequest.description}
                </p>
              </div>

              {selectedRequest.response_notes && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                    <TbMessageCircle className="mr-2" size={18} />
                    Landlord Response
                  </h4>
                  <p className="text-blue-700 leading-relaxed">
                    {selectedRequest.response_notes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">
                    Created:
                  </span>
                  <div className="text-gray-900 font-medium mt-1">
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">
                    Last Updated:
                  </span>
                  <div className="text-gray-900 font-medium mt-1">
                    {new Date(selectedRequest.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
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
    </TenantLayout>
  );
};

export default TenantMaintenance;
