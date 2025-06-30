import { useState, useEffect } from "react";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import { useAuth } from "../../contexts/AuthContext";
import { getTenantsForLandlord } from "../../utils/demoData";
import {
  TbPlus,
  TbSearch,
  TbFilter,
  TbUsers,
  TbPhone,
  TbMail,
  TbCalendar,
  TbHome,
  TbCurrencyDollar,
  TbEdit,
  TbEye,
  TbUserPlus,
  TbSparkles,
  TbTrendingUp,
  TbCash,
  TbUserCheck,
} from "react-icons/tb";

const LandlordTenants = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (user?.id) {
      const landlordTenants = getTenantsForLandlord(user.id);
      setTenants(landlordTenants);
      setFilteredTenants(landlordTenants);
    }
  }, [user]);

  useEffect(() => {
    let filtered = tenants;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tenant) =>
          `${tenant.first_name} ${tenant.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tenant.phone.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((tenant) => tenant.status === statusFilter);
    }

    setFilteredTenants(filtered);
  }, [tenants, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        label: "Active",
        class:
          "bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 border border-green-200",
      },
      inactive: {
        label: "Inactive",
        class:
          "bg-gradient-to-br from-gray-50 to-slate-50 text-gray-700 border border-gray-200",
      },
      suspended: {
        label: "Suspended",
        class:
          "bg-gradient-to-br from-red-50 to-pink-50 text-red-700 border border-red-200",
      },
      pending: {
        label: "Pending",
        class:
          "bg-gradient-to-br from-yellow-50 to-orange-50 text-yellow-700 border border-yellow-200",
      },
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span
        className={`px-3 py-1 text-xs font-bold rounded-full ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <LandlordLayout>
      <div className="space-y-6">
        {/* Header - Enhanced */}
        <div className="bg-gradient-to-br from-primary-plot/5 via-secondary-plot/5 to-primary-plot/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-plot/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-plot/5 rounded-full -ml-5 -mb-5 blur-lg"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-primary-plot/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                <TbUsers className="h-8 w-8 text-primary-plot" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Tenant Management
                </h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                  Manage your tenants, leases, and rental information
                </p>
              </div>
            </div>
            <button className="mt-4 lg:mt-0 bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-bold flex items-center space-x-2 transform hover:scale-105 shadow-lg">
              <TbUserPlus size={20} />
              <span>Add Tenant</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-blue-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                  <TbUsers className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center px-2 py-1 bg-blue-50 rounded-full">
                  <TbTrendingUp className="h-3 w-3 text-blue-600 mr-1" />
                  <span className="text-xs font-semibold text-blue-600">
                    Total
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Total Tenants
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {tenants.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  All registered tenants
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-green-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                  <TbUserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex items-center px-2 py-1 bg-green-50 rounded-full">
                  <span className="text-xs font-semibold text-green-600">
                    Active
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Active Tenants
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {tenants.filter((t) => t.status === "active").length}
                </p>
                <p className="text-xs text-green-600 mt-1 font-medium">
                  Currently renting
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-purple-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <TbHome className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex items-center px-2 py-1 bg-purple-50 rounded-full">
                  <span className="text-xs font-semibold text-purple-600">
                    Units
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Occupied Units
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {tenants.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Units with tenants</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full -mr-5 -mt-5 blur-lg group-hover:bg-yellow-500/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                  <TbCash className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex items-center px-2 py-1 bg-green-50 rounded-full">
                  <TbTrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs font-semibold text-green-600">
                    +8%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Monthly Revenue
                </p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">
                  KSh{" "}
                  {tenants
                    .reduce(
                      (sum, tenant) => sum + (tenant.unit?.rent_amount || 0),
                      0
                    )
                    .toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">From tenant rents</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search - Enhanced */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <TbSearch className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Search & Filter
                </h3>
                <p className="text-sm text-gray-500">
                  Find specific tenants quickly
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <TbSearch
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search tenants by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 font-semibold placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <TbFilter className="text-gray-600" size={20} />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 font-semibold"
                  >
                    <option value="all">All Tenants</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tenants List - Enhanced */}
        {filteredTenants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="p-6 bg-gray-100 rounded-2xl inline-flex mb-6">
                <TbUsers className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {tenants.length === 0 ? "No tenants yet" : "No tenants found"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {tenants.length === 0
                  ? "Get started by adding your first tenant to begin managing your rental properties"
                  : "Try adjusting your search terms or filter criteria to find the tenants you're looking for"}
              </p>
              {tenants.length === 0 && (
                <button className="bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-bold flex items-center space-x-2 mx-auto transform hover:scale-105 shadow-lg">
                  <TbUserPlus size={20} />
                  <span>Add Your First Tenant</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTenants.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/20 transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-primary-plot/20 to-secondary-plot/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-plot">
                              {tenant.first_name?.[0]}
                              {tenant.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              {tenant.first_name} {tenant.last_name}
                            </div>
                            <div className="flex items-center space-x-3 mt-1">
                              <div className="flex items-center text-xs text-gray-500">
                                <TbMail className="h-3 w-3 mr-1" />
                                <span>{tenant.email}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <TbPhone className="h-3 w-3 mr-1" />
                                <span>{tenant.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {tenant.unit?.name || "No unit assigned"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tenant.property?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          KSh{" "}
                          {tenant.unit?.rent_amount?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-gray-500">per month</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(tenant.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button className="text-primary-plot hover:text-primary-plot/80 p-2 hover:bg-primary-plot/5 rounded-lg transition-all duration-200">
                            <TbEye className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-all duration-200">
                            <TbEdit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </LandlordLayout>
  );
};

export default LandlordTenants;
