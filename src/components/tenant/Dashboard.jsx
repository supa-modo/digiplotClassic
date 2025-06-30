import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  getPaymentsForTenant,
  getMaintenanceRequestsForTenant,
} from "../../utils/demoData";
import { Link } from "react-router-dom";
import {
  TbHome,
  TbCreditCard,
  TbTool,
  TbCalendar,
  TbArrowUpRight,
  TbPlus,
  TbEye,
  TbDownload,
  TbSun,
  TbMoon,
  TbSunset,
  TbCalendarEvent,
  TbBuildingSkyscraper,
  TbCoins,
  TbTools,
  TbCalendarTime,
  TbChevronRight,
  TbExclamationCircle,
  TbCheck,
  TbArrowRight,
  TbLoader2,
  TbAlertTriangle,
  TbHomeDot,
} from "react-icons/tb";
import MpesaIcon from "../common/MpesaIcon";
import { FaTools } from "react-icons/fa";
import { PiUserDuotone } from "react-icons/pi";
import { RiUserSharedLine } from "react-icons/ri";

const Dashboard = () => {
  const { user } = useAuth();
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    // Set time of day greeting
    const hours = new Date().getHours();
    if (hours < 12) setTimeOfDay("morning");
    else if (hours < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  // Get tenant data from demo data
  const payments = getPaymentsForTenant(user?.id);
  const maintenanceRequests = getMaintenanceRequestsForTenant(user?.id);
  const pendingRequests = maintenanceRequests.filter(
    (req) => req.status === "pending"
  );
  const inProgressRequests = maintenanceRequests.filter(
    (req) => req.status === "in_progress"
  );
  const lastPayment = payments
    .filter((p) => p.status === "successful")
    .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))[0];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeIcon = () => {
    if (timeOfDay === "morning") return TbSun;
    if (timeOfDay === "afternoon") return TbSunset;
    return TbMoon;
  };

  const TimeIcon = getTimeIcon();

  const recentPayments = payments.slice(0, 3);
  const recentMaintenance = maintenanceRequests.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <div className="mb-4 md:mb-6">
        <div className="px-4 flex items-baseline justify-between mb-2 lg:mb-0">
          <div className="">
            <div className="flex items-center mb-2 md:mb-3">
              <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-secondary-plot/20 to-primary-plot/20 text-[0.8rem] md:text-sm font-medium text-secondary-plot">
                <TimeIcon className="h-4 w-4 mr-1.5 text-primary-plot" />
                <span>Good {timeOfDay}</span>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-secondary-plot">
              Welcome back,{" "}
              <span className="text-primary-plot">
                {user?.firstName || "Tenant"}
              </span>
            </h1>
          </div>

          <div className="hidden md:flex items-center mt-1.5 text-[0.8rem] md:text-sm font-medium text-gray-600">
            <TbCalendarEvent className="h-4 w-4 mr-1.5 text-secondary-plot" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Premium Rent Status Card */}
      <div className="mb-10 md:px-2.5 lg:px-0">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-gradient-to-br from-primary-plot via-secondary-plot to-primary-plot/80">
          {/* Enhanced glass morphism effect */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-plot/20 blur-xl"></div>
          <div className="absolute top-1/3 right-1/3 h-24 w-24 rounded-full bg-white/5 blur-lg opacity-60"></div>
          <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-white/10 blur-md"></div>

          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="relative px-4 py-4 md:px-10 md:py-10">
            <div className="flex flex-col lg:flex-row justify-between lg:items-start space-y-4 lg:space-y-0 lg:space-x-8">
              {/* Left side - Unit info */}
              <div className="space-y-2 md:space-y-4 flex-1">
                <div className="hidden md:flex items-start space-x-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base md:text-lg lg:text-xl font-bold text-amber-200 tracking-tight">
                      {user?.unit?.name || "Unit 101"}
                    </h2>
                    <div className="flex flex-wrap items-center text-white/90 text-xs md:text-sm font-medium">
                      <span className="mx-2 text-white/60">•</span>
                      <div className="flex items-center bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        <TbBuildingSkyscraper className="mr-1.5 h-4 w-4" />
                        <span>Premium Unit</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-6 lg:mt-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-1 h-0.5 bg-white/20 rounded-full"></div>
                    <span className="text-white/60 text-[0.7rem] md:text-xs font-medium uppercase tracking-wider">
                      Monthly Rent
                    </span>
                    <div className="flex-1 h-0.5 bg-white/20 rounded-full"></div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                    <div>
                      <div className="flex items-baseline">
                        <span className="text-3xl md:text-4xl font-bold text-amber-300 tracking-tight">
                          {formatCurrency(user?.unit?.rent_amount || 50000)}
                        </span>
                        <span className="ml-2 text-amber-300 text-sm font-medium">
                          /month
                        </span>
                      </div>
                      <span className="text-white/70 text-[0.8rem] md:text-sm mt-1">
                        {/* TODO: Change to the actual due date of the tenant set on database */}
                        Due on {new Date().getDate()} of every month
                      </span>
                    </div>

                    <div className="hidden lg:block mt-4 lg:mt-0">
                      <div className="inline-flex items-center px-4 py-2 rounded-lg text-[0.8rem] md:text-sm font-medium shadow-lg bg-green-600/40 text-white ring-1 ring-green-400">
                        <TbCheck className="mr-2 h-5 w-5" />
                        <span>Up to Date</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="flex items-center">
                      <TbCalendarEvent className="h-5 w-5 text-white/80 mr-2" />
                      <span className="text-white/90 text-[0.8rem] md:text-sm">
                        Next payment due:{" "}
                      </span>
                      <span className="ml-2 font-semibold text-white text-[0.8rem] md:text-sm">
                        {formatDate(
                          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Quick Action */}
              <div className="lg:max-w-xs w-full">
                <div className="hidden lg:block space-y-1.5 md:space-y-2 bg-white/10 backdrop-blur-sm rounded-xl p-3.5 md:p-5 border border-white/20">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-3 md:mb-4">
                    <div className="flex justify-between items-center text-[0.8rem]">
                      <span className="text-white/80">Next due:</span>
                      <span className="font-bold text-amber-200 text-sm">
                        {formatCurrency(user?.unit?.rent_amount || 50000)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[0.8rem] mt-1 md:mt-2">
                      <span className="text-white/80">Due date:</span>
                      <span className="font-medium text-white text-sm">
                        {formatDate(
                          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        )}
                      </span>
                    </div>
                  </div>

                  <Link to="/tenant/payments" className="block">
                    <button className="group relative w-full overflow-hidden bg-gradient-to-r from-white to-gray-100 text-[0.9rem] md:text-[0.95rem] text-secondary-plot px-6 py-3 md:py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                      <span className="relative flex items-center justify-center font-bold">
                        <span>Pay with</span>
                        <MpesaIcon width={60} height={20} className="ml-2" />
                      </span>
                    </button>
                  </Link>

                  <p className="text-white/70 font-sans text-xs text-center">
                    Secure payment processing
                  </p>
                </div>

                <div className="lg:hidden">
                  <Link to="/tenant/payments" className="block">
                    <button className="group relative w-full overflow-hidden bg-gradient-to-r from-white to-gray-100 text-[0.9rem] md:text-[0.95rem] text-secondary-plot px-6 py-3 md:py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                      <span className="relative flex items-center justify-center font-bold">
                        <span>Pay with</span>
                        <MpesaIcon width={60} height={20} className="ml-2" />
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="mb-12 md:mx-3 lg:mx-0">
        <div className="md:bg-white md:rounded-2xl md:shadow-lg overflow-hidden relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 md:bg-gradient-to-r from-secondary-plot via-primary-plot to-secondary-plot"></div>
          <div className="absolute top-0 right-0 w-24 h-24 md:bg-primary-plot/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 md:bg-secondary-plot/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>

          {/* Content */}
          <div className="p-3 md:p-6 relative z-10">
            <div className="flex flex-wrap -mx-4">
              {/* Current Unit */}
              <div className="w-full md:w-1/2 lg:w-1/4 px-4 pb-4 lg:pb-0 mb-6 lg:mb-0 border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-br from-secondary-plot/20 to-secondary-plot/10 p-3 rounded-xl mr-4 shadow-sm">
                    <TbHome className="h-8 w-8 text-secondary-plot" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                      Current Unit
                    </h3>
                    <div className="flex items-center">
                      <p className="text-xl md:text-2xl font-bold text-secondary-plot">
                        {user?.unit?.name || "Unit 101"}
                      </p>
                    </div>
                    <div className="flex items-center mt-1.5 md:mt-2 text-xs text-gray-500">
                      <TbBuildingSkyscraper className="h-4 w-4 mr-1" />
                      <span>Premium Property</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Rent */}
              <div className="w-full md:w-1/2 lg:w-1/4 px-4 pb-4 lg:pb-0 mb-6 lg:mb-0 border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-br from-primary-plot/20 to-primary-plot/10 p-3 rounded-xl mr-4 shadow-sm">
                    <TbCoins className="h-8 w-8 text-primary-plot" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                      Monthly Rent
                    </h3>
                    <div className="flex items-baseline">
                      <p className="text-xl md:text-2xl font-bold text-primary-plot">
                        {formatCurrency(user?.unit?.rent_amount || 50000)}
                      </p>
                    </div>
                    <div className="flex items-center mt-1.5 md:mt-2 text-[0.7rem] md:text-xs text-gray-500">
                      <TbCalendar className="h-4 w-4 mr-1" />
                      <span>Due on the 1st</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance */}
              <div className="w-full md:w-1/2 lg:w-1/4 px-4 pb-4 lg:pb-0 mb-6 lg:mb-0 border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-br from-emerald-200/50 to-emerald-100/50 p-3 rounded-xl mr-4 shadow-sm">
                    <FaTools className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-0.5 md:mb-1">
                      Maintenance
                    </h3>
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className="flex items-baseline">
                          <p className="text-2xl font-bold text-secondary-plot">
                            {pendingRequests.length}
                          </p>
                          <span className="ml-1 text-xs text-gray-500">
                            pending
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-0.5 md:py-1 rounded-lg text-[0.7rem] md:text-xs font-medium ${
                          pendingRequests.length > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {pendingRequests.length > 0 ? "Active" : "None"}
                      </div>
                    </div>
                    <div className="flex items-center mt-1.5 md:mt-2 text-xs text-gray-500">
                      <TbLoader2 className="h-4 w-4 mr-1" />
                      <span>{inProgressRequests.length} in progress</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Payment */}
              <div className="w-full md:w-1/2 lg:w-1/4 px-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-br from-indigo-200/50 to-indigo-100/50 p-3 rounded-xl mr-4 shadow-sm">
                    <TbCalendarTime className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                      Last Payment
                    </h3>
                    <div className="flex items-center">
                      <p className="text-xl md:text-2xl font-bold text-secondary-plot">
                        {lastPayment
                          ? formatDate(lastPayment.payment_date)
                          : "No payments"}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 text-[0.7rem] md:text-xs text-gray-500">
                      <TbCheck className="h-4 w-4 mr-1" />
                      <span>
                        {lastPayment
                          ? formatCurrency(lastPayment.amount)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="md:bg-white md:rounded-2xl md:shadow-lg mx-1 md:mx-3 lg:mx-0 md:p-6 md:border border-gray-100 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-plot/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-secondary-plot">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <Link
              to="/tenant/payments"
              className="group relative overflow-hidden p-4 md:p-6 rounded-xl border border-gray-200 hover:border-primary-plot/30 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-primary-plot/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-plot/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center space-y-2 md:space-y-4">
                <div className="bg-green-600 p-4 rounded-xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MpesaIcon width={60} height={32} variant="white" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-plot group-hover:text-primary-plot transition-colors text-base md:text-lg">
                    Make Payment
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Pay your monthly rent securely
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/tenant/maintenance"
              className="group relative overflow-hidden p-4 md:p-6 rounded-xl border border-gray-200 hover:border-warning-plot/30 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-warning-plot/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-warning-plot/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center space-y-2 md:space-y-4">
                <div className="bg-warning-plot p-4 rounded-xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TbTool className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-plot group-hover:text-warning-plot transition-colors text-base md:text-lg">
                    Report Issue
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Submit a maintenance request
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/tenant/unit"
              className="group relative overflow-hidden p-3 md:p-6 rounded-xl border border-gray-200 hover:border-info-plot/30 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-info-plot/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-info-plot/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center space-y-2 md:space-y-4">
                <div className="bg-info-plot p-4 rounded-xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TbHomeDot className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-plot group-hover:text-info-plot transition-colors text-base md:text-lg">
                    View Your Unit
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    See your unit details
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/tenant/profile"
              className="group relative overflow-hidden p-3 md:p-6 rounded-xl border border-gray-200 hover:border-secondary-plot/30 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-secondary-plot/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-plot/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center space-y-2 md:space-y-4">
                <div className="bg-secondary-plot p-4 rounded-xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <RiUserSharedLine className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-plot group-hover:text-secondary-plot transition-colors text-base md:text-lg">
                    Update Profile
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage your account
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Payments */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-success-plot/5 rounded-full -mr-5 -mt-5 blur-lg"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-secondary-plot">
                Recent Payments
              </h3>
              <Link
                to="/tenant/payments"
                className="group flex items-center text-primary-plot hover:text-primary-plot/80 transition-colors duration-200 text-sm font-medium bg-primary-plot/5 px-3 py-1 rounded-lg border border-primary-plot/10"
              >
                <span>View all</span>
                <TbChevronRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          payment.status === "successful"
                            ? "bg-success-plot"
                            : payment.status === "pending"
                            ? "bg-warning-plot"
                            : "bg-danger-plot"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(payment.payment_date)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        payment.status === "successful"
                          ? "bg-success-plot/10 text-success-plot"
                          : payment.status === "pending"
                          ? "bg-warning-plot/10 text-warning-plot"
                          : "bg-danger-plot/10 text-danger-plot"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <TbCoins className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No payments yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Maintenance */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-warning-plot/5 rounded-full -mr-5 -mt-5 blur-lg"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-secondary-plot">
                Recent Maintenance
              </h3>
              <Link
                to="/tenant/maintenance"
                className="group flex items-center text-primary-plot hover:text-primary-plot/80 transition-colors duration-200 text-sm font-medium bg-primary-plot/5 px-3 py-1 rounded-lg border border-primary-plot/10"
              >
                <span>View all</span>
                <TbChevronRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentMaintenance.length > 0 ? (
                recentMaintenance.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          request.status === "resolved"
                            ? "bg-success-plot"
                            : request.status === "in_progress"
                            ? "bg-warning-plot"
                            : "bg-danger-plot"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {request.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(request.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        request.status === "resolved"
                          ? "bg-success-plot/10 text-success-plot"
                          : request.status === "in_progress"
                          ? "bg-warning-plot/10 text-warning-plot"
                          : "bg-danger-plot/10 text-danger-plot"
                      }`}
                    >
                      {request.status.replace("_", " ")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaTools className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No maintenance requests
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
