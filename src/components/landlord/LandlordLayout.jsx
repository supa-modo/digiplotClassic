import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  TbCoins,
  TbTools,
} from "react-icons/tb";
import {
  PiBuildingsBold,
  PiBuildingsDuotone,
  PiGearDuotone,
  PiUsersDuotone,
} from "react-icons/pi";
import { BiSupport } from "react-icons/bi";
import { LuLogOut } from "react-icons/lu";
import { MdSpaceDashboard } from "react-icons/md";
import { FaTools } from "react-icons/fa";

const LandlordLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items organized by category
  const navItems = [
    {
      category: "null",
      items: [{ name: "Dashboard", href: "/landlord", icon: MdSpaceDashboard }],
    },
    {
      category: "Property Management",
      items: [
        {
          name: "Properties",
          href: "/landlord/properties",
          icon: PiBuildingsDuotone,
        },
        { name: "Tenants", href: "/landlord/tenants", icon: PiUsersDuotone },
      ],
    },
    {
      category: "Financial",
      items: [
        { name: "Payments", href: "/landlord/payments", icon: TbCoins },
        { name: "Reports", href: "/landlord/reports", icon: TbChartBar },
      ],
    },
    {
      category: "Operations",
      items: [
        { name: "Maintenance", href: "/landlord/maintenance", icon: FaTools },
      ],
    },
    {
      category: "null",
      items: [
        { name: "Settings", href: "/landlord/settings", icon: PiGearDuotone },
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

  const getUserInitials = () => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return (first + last).toUpperCase() || "T";
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
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-amber-800 to-amber-800/90 border-r border-gray-200">
            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>

            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/5 blur-xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 -left-20 h-40 w-40 rounded-full bg-primary-plot/10 blur-xl pointer-events-none"></div>

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
                  <div className="w-10 h-10 bg-white rounded-[0.35rem] flex items-center justify-center">
                    <PiBuildingsBold className="text-primary-plot h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">DIGIPLOT</h1>
                    <p className="text-xs text-white/70 font-medium">
                      Landlord Portal
                    </p>
                  </div>
                </div>
              </div>

              {/* User profile card - Mobile */}
              <div className="mx-4 mb-6">
                <div className="flex items-center">
                  {/* Avatar with initials */}
                  <div className="relative">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white/30 to-white/10 shadow-lg backdrop-blur-sm border border-white/20">
                      <span className="text-sm font-bold text-white tracking-wide">
                        {getUserInitials()}
                      </span>
                    </div>
                  </div>

                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.firstName + " " + user?.lastName || "Tenant"}
                    </p>

                    {/* Status badge */}
                    <div className="mt-1.5 flex items-center">
                      <div className="flex items-center px-2 py-0.5 rounded-full bg-green-500/30 border border-green-400/50">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse mr-1.5"></div>
                        <span className="text-[0.65rem] font-medium text-green-100">
                          Property Owner
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="px-4">
                {navItems.map((category, index) => (
                  <div key={index} className="mb-1">
                    {/* Category label */}
                    {category.category !== "null" && (
                      <div className="text-[0.65rem] uppercase tracking-wider text-white/60 font-medium px-3 py-1 mb-2">
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
                                ? "bg-white/20 text-white border-r-2 border-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`
                          }
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-md">
                              <item.icon
                                size={22}
                                className={`${
                                  location.pathname === item.href
                                    ? "text-white"
                                    : "text-white/70 group-hover:text-white"
                                }`}
                              />
                            </div>
                            <span className="ml-3">{item.name}</span>
                          </div>
                        </NavLink>
                      ))}
                    </div>

                    {/* Category separator */}
                    {index < navItems.length - 1 && (
                      <div className="mx-1 my-3 border-t border-white/20"></div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Help and Support link */}
            <div className="mb-3">
              <button className="w-full text-center text-sm text-white/70 hover:text-white transition-colors duration-200">
                <div className="flex items-center justify-center">
                  <BiSupport className="w-5 h-5 mr-2" />
                  <span>Help & Support ?</span>
                </div>
              </button>
            </div>

            {/* Mobile user section */}
            <div className="border-t border-white/20 px-4 py-4">
              <div className="rounded-xl bg-gray-50 p-1.5 border border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex w-full justify-center items-center rounded-lg px-4 space-x-2 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-200"
                >
                  <LuLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-amber-800 to-amber-800/90 border-r border-gray-200">
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/5 blur-xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 -left-20 h-40 w-40 rounded-full bg-primary-plot/10 blur-xl pointer-events-none"></div>

          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-[0.35rem] flex items-center justify-center">
                  <PiBuildingsBold className="text-primary-plot h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">DIGIPLOT</h1>
                  <p className="text-xs text-white/70 font-medium">
                    Landlord Portal
                  </p>
                </div>
              </div>
            </div>

            {/* User profile card - Desktop */}
            <div className="mx-3.5 mb-8">
              <div className="flex items-center">
                {/* Avatar with initials */}
                <div className="relative">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white/30 to-white/10 shadow-lg backdrop-blur-sm border border-white/20">
                    <span className="text-base font-bold text-white tracking-wide">
                      {getUserInitials()}
                    </span>
                  </div>
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.firstName + " " + user?.lastName || "Landlord"}
                  </p>

                  {/* Status badge */}
                  <div className="mt-1.5 flex items-center">
                    <div className="flex items-center px-2.5 py-1 rounded-full bg-green-500/30 border border-green-400/50">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse mr-2"></div>
                      <span className="text-xs font-medium text-green-100">
                        Property Owner
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4">
              {navItems.map((category, index) => (
                <div key={index} className="mb-1">
                  {/* Category label */}
                  {category.category !== "null" && (
                    <div className="text-[0.65rem] uppercase tracking-wider text-white/60 font-medium px-3 py-1 mb-2">
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
                          `flex items-center px-3 py-2 text-sm font-medium rounded-[0.6rem] transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-white/20 text-white border-r-2 border-white"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                          }`
                        }
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-md">
                            <item.icon
                              size={22}
                              className={`${
                                location.pathname === item.href
                                  ? "text-white"
                                  : "text-white/70 group-hover:text-white"
                              }`}
                            />
                          </div>
                          <span className="ml-3">{item.name}</span>
                        </div>
                      </NavLink>
                    ))}
                  </div>

                  {/* Category separator */}
                  {index < navItems.length - 1 && (
                    <div className="mx-1 my-3 border-t border-white/20"></div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Help and Support link */}
          <div className="mb-3">
            <button className="w-full text-center text-sm text-white/70 hover:text-white transition-colors duration-200">
              <div className="flex items-center justify-center">
                <BiSupport className="w-5 h-5 mr-2" />
                <span>Help & Support ?</span>
              </div>
            </button>
          </div>

          {/* Bottom section with logout */}
          <div className="border-t border-white/20 px-4 py-4">
            <div className="rounded-xl bg-gray-50 p-1.5 border border-gray-200">
              <button
                onClick={handleLogout}
                className="flex w-full justify-center items-center rounded-lg px-4 space-x-2 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-200"
              >
                <LuLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1 overflow-hidden">
        {/* Top header - Fixed */}
        <div className="lg:hidden relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
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
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[0.5rem] font-bold text-white">2</span>
                </span>
              </button>

              {/* Settings */}
              <button className="text-gray-400 hover:text-gray-500">
                <TbSettings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content - Scrollable */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none scrollbar-hide lg:scrollbar-default bg-background-plot">
          <div className="py-6">
            <div className="max-w-screen-2xl mx-auto px-2 md:px-0">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandlordLayout;
