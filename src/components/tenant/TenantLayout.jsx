import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
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

  // Navigation items organized by category
  const navItems = [
    {
      category: "null",
      items: [
        {
          name: "Dashboard",
          href: "/tenant",
          icon: TbHome,
        },
      ],
    },
    {
      category: "Property",
      items: [
        {
          name: "Unit Info",
          href: "/tenant/unit",
          icon: TbHome,
        },
      ],
    },
    {
      category: "Services",
      items: [
        {
          name: "Payments",
          href: "/tenant/payments",
          icon: TbCreditCard,
        },
        {
          name: "Maintenance",
          href: "/tenant/maintenance",
          icon: TbTool,
        },
      ],
    },
    {
      category: "null",
      items: [
        {
          name: "Profile",
          href: "/tenant/profile",
          icon: TbUser,
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getCurrentPageName = () => {
    const currentNav = navItems
      .flatMap((category) => category.items)
      .find((item) => item.href === location.pathname);
    return currentNav?.name || "Dashboard";
  };

  return (
    <div className="h-screen bg-background-plot flex overflow-hidden">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
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
              <div className="flex-shrink-0 flex items-center px-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-plot rounded-sm flex items-center justify-center">
                    <PiBuildingsBold className="text-white h-5 w-5" />
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

              {/* Mobile Navigation */}
              <nav className="px-4">
                {navItems.map((category, index) => (
                  <div key={index} className="mb-1">
                    {/* Category label */}
                    {category.category !== "null" && (
                      <div className="text-[0.65rem] uppercase tracking-wider text-gray-400 font-medium px-3 py-1 mb-2">
                        {category.category}
                      </div>
                    )}

                    {/* Category items */}
                    <div className="space-y-1">
                      {category.items.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
                            ${
                              isActive
                                ? "bg-primary-plot/10 text-primary-plot border-r-2 border-primary-plot"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`
                          }
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-md">
                              <item.icon
                                className={`h-5 w-5 ${
                                  location.pathname === item.href
                                    ? "text-primary-plot"
                                    : "text-gray-400 group-hover:text-gray-500"
                                }`}
                              />
                            </div>
                            <span className="ml-2">{item.name}</span>
                          </div>
                        </NavLink>
                      ))}
                    </div>

                    {/* Category separator */}
                    {index < navItems.length - 1 && (
                      <div className="mx-1 my-3 border-t border-gray-200"></div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Mobile user section */}
            <div className="border-t border-gray-200 px-4 py-4">
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
        </div>
      )}

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
            <nav className="flex-1 px-4">
              {navItems.map((category, index) => (
                <div key={index} className="mb-1">
                  {/* Category label */}
                  {category.category !== "null" && (
                    <div className="text-[0.65rem] uppercase tracking-wider text-gray-400 font-medium px-3 py-1 mb-2">
                      {category.category}
                    </div>
                  )}

                  {/* Category items */}
                  <div className="space-y-1">
                    {category.items.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-primary-plot/10 text-primary-plot border-r-2 border-primary-plot"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`
                        }
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-md">
                            <item.icon
                              className={`h-5 w-5 ${
                                location.pathname === item.href
                                  ? "text-primary-plot"
                                  : "text-gray-400 group-hover:text-gray-500"
                              }`}
                            />
                          </div>
                          <span className="ml-2">{item.name}</span>
                        </div>
                      </NavLink>
                    ))}
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
          <div className="border-t border-gray-200 px-4 py-4">
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
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1 overflow-hidden">
        {/* Top header - Fixed */}
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
                {getCurrentPageName()}
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

        {/* Page content - Scrollable */}
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
