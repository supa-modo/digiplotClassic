import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  TbHome,
  TbUser,
  TbCreditCard,
  TbTool,
  TbLogout,
  TbMenu2,
  TbX,
  TbBell,
  TbSettings,
} from "react-icons/tb";
import { PiBuildingsBold } from "react-icons/pi";

const TenantLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/tenant",
      icon: TbHome,
      current: location.pathname === "/tenant",
    },
    {
      name: "Unit Info",
      href: "/tenant/unit",
      icon: TbHome,
      current: location.pathname === "/tenant/unit",
    },
    {
      name: "Payments",
      href: "/tenant/payments",
      icon: TbCreditCard,
      current: location.pathname === "/tenant/payments",
    },
    {
      name: "Maintenance",
      href: "/tenant/maintenance",
      icon: TbTool,
      current: location.pathname === "/tenant/maintenance",
    },
    {
      name: "Profile",
      href: "/tenant/profile",
      icon: TbUser,
      current: location.pathname === "/tenant/profile",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background-plot">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 lg:hidden ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <TbX className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Mobile sidebar content */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-plot rounded-sm flex items-center justify-center">
                  <PiBuildingsBold className="text-white h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold text-secondary-plot">
                  DIGIPLOT
                </h1>
              </div>
            </div>
            <nav className="mt-8 px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? "bg-primary-plot/10 text-primary-plot border-r-2 border-primary-plot"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                >
                  <item.icon
                    className={`${
                      item.current
                        ? "text-primary-plot"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile user section */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-plot rounded-full flex items-center justify-center">
                  <TbUser className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-plot rounded-sm flex items-center justify-center">
                  <PiBuildingsBold className="text-white h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-secondary-plot">
                    DIGIPLOT
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">
                    Tenant Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? "bg-primary-plot/10 text-primary-plot border-r-2 border-primary-plot"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                >
                  <item.icon
                    className={`${
                      item.current
                        ? "text-primary-plot"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User section */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-plot rounded-full flex items-center justify-center">
                    <TbUser className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-danger-plot transition-colors p-1 rounded"
                title="Logout"
              >
                <TbLogout className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-plot lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <TbMenu2 className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <h2 className="text-xl font-semibold text-secondary-plot">
                {navigation.find((item) => item.current)?.name || "Dashboard"}
              </h2>
            </div>

            <div className="ml-4 flex items-center space-x-4">
              {/* Notifications */}
              <button className="text-gray-400 hover:text-gray-500 relative">
                <TbBell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-danger-plot rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </span>
              </button>

              {/* Settings */}
              <button className="text-gray-400 hover:text-gray-500">
                <TbSettings className="h-6 w-6" />
              </button>

              {/* User info on desktop */}
              <div className="hidden lg:flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">Tenant</p>
                </div>
                <div className="w-8 h-8 bg-primary-plot rounded-full flex items-center justify-center">
                  <TbUser className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantLayout;
