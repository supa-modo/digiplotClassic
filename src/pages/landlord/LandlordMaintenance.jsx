import { useState, useEffect } from "react";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import { useAuth } from "../../contexts/AuthContext";
import {
  demoMaintenanceRequests,
  demoTenants,
  demoUnits,
  demoProperties,
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
} from "react-icons/tb";
import { FaTools } from "react-icons/fa";

const LandlordMaintenance = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
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

  return (
    <LandlordLayout>
      <div className="min-h-screen relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-plot/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-plot/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative p-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 mb-6 border border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-plot to-secondary-plot bg-clip-text text-transparent">
                  Maintenance Management
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Track and manage property maintenance requests
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <button className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 font-semibold flex items-center space-x-2">
                  <TbCalendar size={20} />
                  <span>Schedule</span>
                </button>
                <button className="bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center space-x-2">
                  <TbPlus size={20} />
                  <span>Add Request</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaTools className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.pending}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <TbClock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.inProgress}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TbProgressCheck className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.completed}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <TbCheckbox className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    High Priority
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.high}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <TbAlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Emergency
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.emergency}
                  </p>
                  {stats.emergency > 0 && (
                    <p className="text-xs text-red-600 mt-1 font-semibold">
                      Needs immediate attention
                    </p>
                  )}
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <TbAlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <TbSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search maintenance requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <TbFilter className="text-gray-400" size={20} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
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
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
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
                    <div className="text-xs text-gray-500">
                      ID: {request.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LandlordLayout>
  );
};

export default LandlordMaintenance;
