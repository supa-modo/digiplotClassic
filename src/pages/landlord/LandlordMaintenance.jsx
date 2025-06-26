import { useState, useEffect } from "react";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import { useAuth } from "../../contexts/AuthContext";
import { getMaintenanceRequestsForLandlord } from "../../utils/demoData";
import {
  TbTool,
  TbSearch,
  TbFilter,
  TbUser,
  TbHome,
  TbCalendar,
  TbEdit,
  TbEye,
  TbMessage,
  TbClock,
  TbCheck,
  TbX,
  TbAlertCircle,
  TbTools,
} from "react-icons/tb";

const LandlordMaintenance = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (user?.id) {
      const maintenanceRequests = getMaintenanceRequestsForLandlord(user.id);
      setRequests(
        maintenanceRequests.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );
      setFilteredRequests(
        maintenanceRequests.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );
    }
  }, [user]);

  useEffect(() => {
    let filtered = requests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.tenant_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.unit_number?.toLowerCase().includes(searchTerm.toLowerCase())
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
        class: "bg-yellow-100 text-yellow-800",
        icon: TbClock,
      },
      in_progress: {
        label: "In Progress",
        class: "bg-blue-100 text-blue-800",
        icon: TbTool,
      },
      resolved: {
        label: "Resolved",
        class: "bg-green-100 text-green-800",
        icon: TbCheck,
      },
      rejected: {
        label: "Rejected",
        class: "bg-red-100 text-red-800",
        icon: TbX,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.class}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { label: "Low", class: "bg-gray-100 text-gray-800" },
      medium: { label: "Medium", class: "bg-blue-100 text-blue-800" },
      high: { label: "High", class: "bg-orange-100 text-orange-800" },
      emergency: { label: "Emergency", class: "bg-red-100 text-red-800" },
    };

    const config = priorityConfig[priority] || priorityConfig.low;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}
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
      appliances: "🏠",
      security: "🔒",
      structural: "🏗️",
      cleaning: "🧹",
      pest_control: "🐛",
      other: "🔧",
    };

    return categoryIcons[category] || "🔧";
  };

  const getRequestStats = () => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      inProgress: requests.filter((r) => r.status === "in_progress").length,
      resolved: requests.filter((r) => r.status === "resolved").length,
      emergency: requests.filter((r) => r.priority === "emergency").length,
      thisWeek: requests.filter((r) => {
        const requestDate = new Date(r.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return requestDate >= weekAgo;
      }).length,
    };
  };

  const stats = getRequestStats();

  const handleStatusUpdate = (requestId, newStatus) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus,
              updated_at: new Date().toISOString(),
            }
          : request
      )
    );
  };

  return (
    <LandlordLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Maintenance Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage property maintenance requests
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <TbTool className="h-8 w-8 text-gray-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <TbClock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.inProgress}
                </p>
              </div>
              <TbTools className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.resolved}
                </p>
              </div>
              <TbCheck className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emergency</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.emergency}
                </p>
              </div>
              <TbAlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.thisWeek}
                </p>
              </div>
              <TbCalendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <TbSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="hvac">HVAC</option>
                  <option value="appliances">Appliances</option>
                  <option value="security">Security</option>
                  <option value="structural">Structural</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="pest_control">Pest Control</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Requests */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <TbTool className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No maintenance requests
            </h3>
            <p className="text-gray-500">
              {requests.length === 0
                ? "No maintenance requests have been submitted"
                : "No requests match your current filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg border hover:border-gray-300 transition-colors"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getCategoryIcon(request.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {request.title}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {request.category.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {request.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <TbUser className="h-4 w-4 mr-2" />
                      <span>{request.tenant_name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <TbHome className="h-4 w-4 mr-2" />
                      <span>
                        {request.unit_number} - {request.property_name}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <TbCalendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {request.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <TbHome className="h-4 w-4 mr-2" />
                        <span>{request.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Photos */}
                  {request.photos && request.photos.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {request.photos.length} photo(s) attached
                      </p>
                      <div className="flex space-x-2">
                        {request.photos.slice(0, 3).map((photo, index) => (
                          <div
                            key={index}
                            className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"
                          >
                            <span className="text-gray-400 text-xs">IMG</span>
                          </div>
                        ))}
                        {request.photos.length > 3 && (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-xs">
                              +{request.photos.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-primary-plot hover:text-primary-plot/80 p-1"
                        title="View Details"
                      >
                        <TbEye size={16} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Add Comment"
                      >
                        <TbMessage size={16} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Edit"
                      >
                        <TbEdit size={16} />
                      </button>
                    </div>

                    {request.status === "pending" && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleStatusUpdate(request.id, "in_progress")
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                        >
                          Start Work
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(request.id, "rejected")
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {request.status === "in_progress" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(request.id, "resolved")
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LandlordLayout>
  );
};

export default LandlordMaintenance;
