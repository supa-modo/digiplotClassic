import { useState, useEffect } from 'react';
import LandlordLayout from '../../components/landlord/LandlordLayout';
import { useAuth } from '../../contexts/AuthContext';
import { getTenantsForLandlord } from '../../utils/demoData';
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
} from 'react-icons/tb';

const LandlordTenants = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      filtered = filtered.filter(tenant =>
        `${tenant.first_name} ${tenant.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tenant => tenant.status === statusFilter);
    }

    setFilteredTenants(filtered);
  }, [tenants, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', class: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactive', class: 'bg-gray-100 text-gray-800' },
      suspended: { label: 'Suspended', class: 'bg-red-100 text-red-800' },
      pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  return (
    <LandlordLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
            <p className="text-gray-600 mt-1">
              Manage your tenants, leases, and rental information
            </p>
          </div>
          <button className="mt-4 lg:mt-0 bg-primary-plot text-white px-6 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors font-medium flex items-center space-x-2">
            <TbUserPlus size={20} />
            <span>Add Tenant</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                <p className="text-2xl font-bold text-gray-900">{tenants.length}</p>
              </div>
              <TbUsers className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tenants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tenants.filter(t => t.status === 'active').length}
                </p>
              </div>
              <TbUsers className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupied Units</p>
                <p className="text-2xl font-bold text-gray-900">{tenants.length}</p>
              </div>
              <TbHome className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  KSh {tenants.reduce((sum, tenant) => sum + (tenant.unit?.rent_amount || 0), 0).toLocaleString()}
                </p>
              </div>
              <TbCurrencyDollar className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-2">
                <TbFilter className="text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
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

        {/* Tenants List */}
        {filteredTenants.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <TbUsers className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tenants.length === 0 ? 'No tenants yet' : 'No tenants found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {tenants.length === 0
                ? 'Get started by adding your first tenant'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Move In Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-plot rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {tenant.first_name[0]}{tenant.last_name[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {tenant.first_name} {tenant.last_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <TbMail className="h-3 w-3 mr-1" />
                              {tenant.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <TbPhone className="h-3 w-3 mr-1" />
                              {tenant.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {tenant.unit?.unit_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tenant.property?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          KSh {tenant.unit?.rent_amount?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">per month</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(tenant.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <TbCalendar className="h-4 w-4 mr-1" />
                          {tenant.lease_start_date ? new Date(tenant.lease_start_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-primary-plot hover:text-primary-plot/80 p-1">
                            <TbEye size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1">
                            <TbEdit size={16} />
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