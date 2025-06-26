import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  TbMenu2,
  TbX,
  TbDashboard,
  TbBuilding,
  TbUsers,
  TbCreditCard,
  TbTool,
  TbChartBar,
  TbSettings,
  TbBell,
  TbLogout,
  TbUser,
  TbHome,
} from "react-icons/tb";

const LandlordLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/landlord", icon: TbDashboard },
    { name: "Properties", href: "/landlord/properties", icon: TbBuilding },
    { name: "Tenants", href: "/landlord/tenants", icon: TbUsers },
    { name: "Payments", href: "/landlord/payments", icon: TbCreditCard },
    { name: "Maintenance", href: "/landlord/maintenance", icon: TbTool },
    { name: "Reports", href: "/landlord/reports", icon: TbChartBar },
    { name: "Settings", href: "/landlord/settings", icon: TbSettings },
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
    <div className="min-h-screen bg-gray-50 lg:flex">
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
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:flex lg:flex-col lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-plot rounded-lg flex items-center justify-center">
              <TbHome className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-secondary-plot">
              DigiPlot
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <TbX size={24} />
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-plot rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.first_name?.[0] || user?.full_name?.[0] || "L"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.full_name || "Landlord"}
              </p>
              <p className="text-xs text-gray-500 truncate">Landlord Account</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-primary-plot text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <IconComponent
                  size={20}
                  className={`mr-3 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <TbLogout size={20} className="mr-3 text-gray-400" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <TbMenu2 size={24} />
            </button>

            {/* Greeting */}
            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold text-gray-900">
                {getGreeting()},{" "}
                {user?.first_name ||
                  user?.full_name?.split(" ")[0] ||
                  "Landlord"}
                !
              </h1>
            </div>

            {/* Header actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <TbBell size={20} />
                <span className="absolute top-0 right-0 block h-2 w-2 bg-red-400 rounded-full"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <TbUser size={20} />
                  <span className="hidden sm:block text-sm font-medium">
                    Profile
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default LandlordLayout;
