import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  TbMenu2,
  TbX,
  TbDashboard,
  TbUsers,
  TbBuilding,
  TbCreditCard,
  TbTool,
  TbChartBar,
  TbSettings,
  TbBell,
  TbLogout,
  TbUser,
  TbHome,
  TbShield,
  TbDatabase,
  TbReportAnalytics,
  TbUserCog,
} from "react-icons/tb";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items organized by category
  const navItems = [
    {
      category: "null",
      items: [{ name: "Dashboard", href: "/admin", icon: TbDashboard }],
    },
    {
      category: "User Management",
      items: [
        { name: "Users", href: "/admin/users", icon: TbUsers },
        {
          name: "Roles & Permissions",
          href: "/admin/permissions",
          icon: TbShield,
        },
      ],
    },
    {
      category: "Property Management",
      items: [
        { name: "Properties", href: "/admin/properties", icon: TbBuilding },
        { name: "Units", href: "/admin/units", icon: TbHome },
      ],
    },
    {
      category: "Financial",
      items: [
        { name: "Payments", href: "/admin/payments", icon: TbCreditCard },
        { name: "Reports", href: "/admin/reports", icon: TbChartBar },
        {
          name: "Analytics",
          href: "/admin/analytics",
          icon: TbReportAnalytics,
        },
      ],
    },
    {
      category: "Operations",
      items: [
        { name: "Maintenance", href: "/admin/maintenance", icon: TbTool },
        { name: "System Logs", href: "/admin/logs", icon: TbDatabase },
      ],
    },
    {
      category: "null",
      items: [{ name: "Settings", href: "/admin/settings", icon: TbSettings }],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-60 lg:w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:flex lg:flex-col lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-14 lg:h-16 px-4 lg:px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <TbShield className="text-white" size={16} />
            </div>
            <span className="text-lg lg:text-xl font-bold text-red-700">
              DigiPlot Admin
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
          >
            <TbX size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 lg:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm lg:text-base">
                {user?.firstName?.[0] ||
                  user?.first_name?.[0] ||
                  user?.fullName?.[0] ||
                  "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm font-medium text-gray-900 truncate">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.fullName || "Administrator"}
              </p>
              <p className="text-xs text-red-600 truncate font-medium">
                System Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <nav>
            {navItems.map((category, index) => (
              <div key={index} className="mb-1 px-3">
                {/* Category label */}
                {category.category !== "null" && (
                  <div className="text-[0.65rem] uppercase tracking-wider text-gray-400 font-medium px-3 py-1 mb-2">
                    {category.category}
                  </div>
                )}

                {/* Category items */}
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2.5 lg:py-2 text-xs lg:text-sm font-medium rounded-lg transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-red-600 text-white"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`
                        }
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-md">
                            <IconComponent
                              size={18}
                              className={`${
                                location.pathname === item.href
                                  ? "text-white"
                                  : "text-gray-400 group-hover:text-gray-600"
                              }`}
                            />
                          </div>
                          <span className="ml-2 truncate">{item.name}</span>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>

                {/* Category separator */}
                {index < navItems.length - 1 && (
                  <div className="mx-1 my-3 border-t border-gray-200"></div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom section with logout */}
        <div className="border-t border-gray-200 px-3 py-4 flex-shrink-0">
          <div className="rounded-xl bg-gray-50 p-1.5 border border-gray-200">
            <button
              onClick={handleLogout}
              className="flex w-full justify-center items-center rounded-lg px-4 space-x-2 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-200"
            >
              <TbLogout className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden">
        {/* Header - Fixed */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-10">
          <div className="flex items-center justify-between h-14 lg:h-16 px-4 lg:px-6">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
              >
                <TbMenu2 size={20} />
              </button>
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {getGreeting()},{" "}
                  {user?.firstName || user?.first_name || "Administrator"}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <TbBell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 lg:space-x-3 p-1 lg:p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xs lg:text-sm">
                      {user?.firstName?.[0] ||
                        user?.first_name?.[0] ||
                        user?.fullName?.[0] ||
                        "A"}
                    </span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.first_name && user?.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user?.fullName || "Administrator"}
                    </p>
                    <p className="text-xs text-red-600">Admin</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area - Scrollable */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
