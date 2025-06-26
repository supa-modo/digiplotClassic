import { useAuth } from "../../contexts/AuthContext";
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
} from "react-icons/tb";

const Dashboard = () => {
  const { user } = useAuth();

  // Get tenant data from demo data
  const payments = getPaymentsForTenant(user?.id);
  const maintenanceRequests = getMaintenanceRequestsForTenant(user?.id);
  const pendingRequests = maintenanceRequests.filter(
    (req) => req.status === "pending"
  );
  const lastPayment = payments
    .filter((p) => p.status === "successful")
    .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))[0];

  const stats = [
    {
      name: "Current Unit",
      value: user?.unit?.name || "Not Assigned",
      icon: TbHome,
      color: "primary-plot",
      bgColor: "primary-plot/10",
    },
    {
      name: "Monthly Rent",
      value: `KSH ${user?.unit?.rent_amount?.toLocaleString() || "0"}`,
      icon: TbCreditCard,
      color: "success-plot",
      bgColor: "success-plot/10",
    },
    {
      name: "Pending Maintenance",
      value: pendingRequests.length.toString(),
      icon: TbTool,
      color: "warning-plot",
      bgColor: "warning-plot/10",
    },
    {
      name: "Last Payment",
      value: lastPayment
        ? new Date(lastPayment.payment_date).toLocaleDateString()
        : "No payments",
      icon: TbCalendar,
      color: "info-plot",
      bgColor: "info-plot/10",
    },
  ];

  const quickActions = [
    {
      title: "Make Payment",
      description: "Pay your monthly rent via M-Pesa",
      icon: TbCreditCard,
      color: "bg-primary-plot",
      href: "/tenant/payments",
    },
    {
      title: "Report Issue",
      description: "Submit a maintenance request",
      icon: TbTool,
      color: "bg-warning-plot",
      href: "/tenant/maintenance",
    },
    {
      title: "View Unit",
      description: "See your unit details",
      icon: TbEye,
      color: "bg-info-plot",
      href: "/tenant/unit",
    },
    {
      title: "Update Profile",
      description: "Manage your account",
      icon: TbEye,
      color: "bg-secondary-plot",
      href: "/tenant/profile",
    },
  ];

  const recentPayments = payments.slice(0, 3);
  const recentMaintenance = maintenanceRequests.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-plot to-primary-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-primary-100">
          Here's an overview of your rental account and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`bg-${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                <p className="text-lg font-semibold text-secondary-plot">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-secondary-plot">
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group p-4 rounded-lg border border-gray-200 hover:border-primary-plot/30 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className={`${action.color} p-3 rounded-lg text-white group-hover:scale-105 transition-transform duration-200`}
                >
                  <action.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-plot group-hover:text-primary-plot transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-plot">
              Recent Payments
            </h3>
            <Link
              to="/tenant/payments"
              className="text-primary-plot hover:text-primary-600 text-sm font-medium flex items-center"
            >
              View all <TbArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentPayments.length > 0 ? (
              recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        payment.status === "successful"
                          ? "bg-success-plot"
                          : payment.status === "pending"
                          ? "bg-warning-plot"
                          : "bg-danger-plot"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        KSH {payment.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
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
              <p className="text-gray-500 text-sm text-center py-4">
                No payments yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Maintenance */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-plot">
              Recent Maintenance
            </h3>
            <Link
              to="/tenant/maintenance"
              className="text-primary-plot hover:text-primary-600 text-sm font-medium flex items-center"
            >
              View all <TbArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentMaintenance.length > 0 ? (
              recentMaintenance.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        request.status === "resolved"
                          ? "bg-success-plot"
                          : request.status === "in_progress"
                          ? "bg-warning-plot"
                          : "bg-danger-plot"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {request.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
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
              <p className="text-gray-500 text-sm text-center py-4">
                No maintenance requests
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
