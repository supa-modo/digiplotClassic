import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TbUsers,
  TbUserPlus,
  TbUserCheck,
  TbUserX,
  TbBuilding,
  TbHome,
  TbCreditCard,
  TbTool,
  TbChartBar,
  TbArrowUpRight,
  TbArrowDownRight,
  TbPlus,
  TbEye,
  TbSettings,
  TbShield,
  TbDatabase,
  TbLoader2,
  TbRefresh,
} from "react-icons/tb";
import userService from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load user statistics
      const statsResponse = await userService.getUserStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Load recent users
      const usersResponse = await userService.getUsers({ limit: 5 });
      if (usersResponse.success) {
        setRecentUsers(usersResponse.data.users || []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: "Add User",
      description: "Create a new user account",
      href: "/admin/users",
      action: "create",
      icon: TbUserPlus,
      color: "bg-blue-500",
    },
    {
      name: "Manage Users",
      description: "View and manage all users",
      href: "/admin/users",
      icon: TbUsers,
      color: "bg-green-500",
    },
    {
      name: "System Settings",
      description: "Configure system settings",
      href: "/admin/settings",
      icon: TbSettings,
      color: "bg-purple-500",
    },
    {
      name: "View Reports",
      description: "Access system reports",
      href: "/admin/reports",
      icon: TbChartBar,
      color: "bg-orange-500",
    },
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "landlord":
        return "bg-amber-100 text-amber-800";
      case "tenant":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()},{" "}
                {user?.firstName || user?.first_name || "Administrator"}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome to the DigiPlot admin dashboard. Here's what's happening
                with your system today.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadDashboardData}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TbRefresh className="-ml-0.5 mr-2 h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TbUsers className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.total || 0}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          <TbArrowUpRight className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                          <span className="sr-only">Increased by</span>
                          12%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <TbUserCheck className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Users
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.active || 0}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          <TbArrowUpRight className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                          <span className="sr-only">Increased by</span>
                          8%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <TbBuilding className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Landlords
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.landlords || 0}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          <TbArrowUpRight className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                          <span className="sr-only">Increased by</span>
                          5%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TbHome className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tenants
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.tenants || 0}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          <TbArrowUpRight className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                          <span className="sr-only">Increased by</span>
                          15%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Common administrative tasks and shortcuts
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Link
                      key={action.name}
                      to={action.href}
                      className="relative group bg-white p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-800">
                            {action.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {action.description}
                          </p>
                        </div>
                        <div className="ml-2">
                          <TbArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Users
                </h3>
                <Link
                  to="/admin/users"
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentUsers.length === 0 ? (
                <div className="text-center py-6">
                  <TbUsers className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="mt-2 text-sm text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-red-800">
                            {(
                              user.firstName?.[0] ||
                              user.email?.[0] ||
                              "U"
                            ).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.fullName || "Unknown User"}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${getRoleColor(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                          <span
                            className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${getStatusColor(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">System Status</h3>
          <p className="mt-1 text-sm text-gray-500">
            Current system health and status indicators
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Database Status */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TbDatabase className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-sm text-green-600">Connected</p>
              </div>
            </div>

            {/* Authentication Status */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TbShield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Authentication
                </p>
                <p className="text-sm text-green-600">Active</p>
              </div>
            </div>

            {/* API Status */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TbDatabase className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  API Services
                </p>
                <p className="text-sm text-green-600">Operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
