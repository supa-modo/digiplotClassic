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
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${config.class}`}
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
      },
      medium: {
        class: "bg-yellow-50 text-yellow-700 border-yellow-200",
        text: "Medium",
      },
      high: {
        class: "bg-orange-50 text-orange-700 border-orange-200",
        text: "High",
      },
      emergency: {
        class: "bg-red-50 text-red-700 border-red-200",
        text: "Emergency",
      },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded border ${config.class}`}
      >
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
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-plot">
              Maintenance Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Submit and track maintenance requests for your unit
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 lg:mt-0 bg-primary-plot text-white px-6 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors font-medium flex items-center space-x-2"
          >
            <TbPlus size={20} />
            <span>New Request</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {requests.filter((r) => r.status === "pending").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-200 rounded-lg">
                <TbClock className="text-yellow-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-blue-800">
                  {requests.filter((r) => r.status === "in_progress").length}
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <TbSettings className="text-blue-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Resolved</p>
                <p className="text-2xl font-bold text-green-800">
                  {requests.filter((r) => r.status === "resolved").length}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <TbCheck className="text-green-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-purple-800">
                  {requests.length}
                </p>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <TbMessageCircle className="text-purple-700" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <TbSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search requests by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <TbFilter className="text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
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

        {/* Requests Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <TbMessageCircle
                          className="text-gray-300 mb-3"
                          size={48}
                        />
                        <p className="text-lg font-medium mb-1">
                          No maintenance requests found
                        </p>
                        <p className="text-sm">
                          {searchTerm ||
                          statusFilter !== "all" ||
                          categoryFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "Submit your first maintenance request to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {request.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {request.description}
                          </div>
                          {request.image_url && (
                            <div className="flex items-center mt-2 text-xs text-gray-400">
                              <TbPhoto size={12} className="mr-1" />
                              <span>Has photo</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {getCategoryIcon(request.category)}
                          </span>
                          <span className="text-sm text-gray-900 capitalize">
                            {request.category?.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(request.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(request.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="text-primary-plot hover:text-primary-plot/80 transition-colors flex items-center space-x-1 px-2 py-1 rounded hover:bg-primary-plot/10"
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

        {/* Property Info Footer */}
        {property && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">Property:</span> {property.name}
              </div>
              <div>
                <span className="font-medium">Unit:</span> {unit?.name}
              </div>
              <div>
                <span className="font-medium">For assistance call:</span> +254
                700 000 000
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

      {/* Request Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-secondary-plot">
                Request Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <TbX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedRequest.title}
                  </h3>
                  <div className="flex items-center space-x-3 mb-4">
                    {getStatusBadge(selectedRequest.status)}
                    {getPriorityBadge(selectedRequest.priority)}
                    <span className="text-sm text-gray-500">
                      {getCategoryIcon(selectedRequest.category)}{" "}
                      {selectedRequest.category?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{selectedRequest.description}</p>
              </div>

              {selectedRequest.response_notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Landlord Response
                  </h4>
                  <p className="text-blue-700">
                    {selectedRequest.response_notes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Created:</span>
                  <div>
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-500">
                    Last Updated:
                  </span>
                  <div>
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
