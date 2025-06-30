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
      <div className="p-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-secondary-plot mb-2">
                Maintenance Requests
              </h1>
              <p className="text-gray-600 text-lg">
                Submit and track maintenance requests for your unit
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <button
                onClick={() => setShowModal(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold flex items-center space-x-3 transform hover:scale-105"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                <TbPlus size={20} />
                <span>New Request</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-yellow-100 to-orange-100 p-8 rounded-2xl border border-yellow-200 shadow-lg">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-300/20 rounded-full -mr-8 -mt-8 blur-lg"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-yellow-400/10 rounded-full -ml-4 -mb-4 blur-md"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-yellow-700 text-sm font-semibold uppercase tracking-wide">
                    Pending
                  </p>
                  <p className="text-3xl font-bold text-yellow-900 mt-1">
                    {requests.filter((r) => r.status === "pending").length}
                  </p>
                </div>
                <div className="p-4 bg-yellow-200/50 rounded-xl backdrop-blur-sm">
                  <TbClock className="text-yellow-700" size={28} />
                </div>
              </div>
              <div className="flex items-center text-yellow-600 text-sm">
                <TbClock size={14} className="mr-1" />
                <span>Awaiting review</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-8 rounded-2xl border border-blue-200 shadow-lg">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-300/20 rounded-full -mr-8 -mt-8 blur-lg"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-400/10 rounded-full -ml-4 -mb-4 blur-md"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-700 text-sm font-semibold uppercase tracking-wide">
                    In Progress
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">
                    {requests.filter((r) => r.status === "in_progress").length}
                  </p>
                </div>
                <div className="p-4 bg-blue-200/50 rounded-xl backdrop-blur-sm">
                  <TbSettings className="text-blue-700" size={28} />
                </div>
              </div>
              <div className="flex items-center text-blue-600 text-sm">
                <TbSettings size={14} className="mr-1" />
                <span>Being worked on</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 p-8 rounded-2xl border border-green-200 shadow-lg">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-300/20 rounded-full -mr-8 -mt-8 blur-lg"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-400/10 rounded-full -ml-4 -mb-4 blur-md"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-green-700 text-sm font-semibold uppercase tracking-wide">
                    Resolved
                  </p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {requests.filter((r) => r.status === "resolved").length}
                  </p>
                </div>
                <div className="p-4 bg-green-200/50 rounded-xl backdrop-blur-sm">
                  <TbCheck className="text-green-700" size={28} />
                </div>
              </div>
              <div className="flex items-center text-green-600 text-sm">
                <TbCheck size={14} className="mr-1" />
                <span>Completed</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-100 p-8 rounded-2xl border border-purple-200 shadow-lg">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-300/20 rounded-full -mr-8 -mt-8 blur-lg"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-400/10 rounded-full -ml-4 -mb-4 blur-md"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-700 text-sm font-semibold uppercase tracking-wide">
                    Total
                  </p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    {requests.length}
                  </p>
                </div>
                <div className="p-4 bg-purple-200/50 rounded-xl backdrop-blur-sm">
                  <TbMessageCircle className="text-purple-700" size={28} />
                </div>
              </div>
              <div className="flex items-center text-purple-600 text-sm">
                <TbMessageCircle size={14} className="mr-1" />
                <span>All requests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-plot/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                <TbFilter className="text-gray-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary-plot">
                  Search & Filter
                </h3>
                <p className="text-sm text-gray-500">
                  Find specific maintenance requests quickly
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <TbSearch
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search requests by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors font-medium"
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

        {/* Enhanced Requests Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
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
          <div className="mt-8 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-lg relative overflow-hidden">
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
