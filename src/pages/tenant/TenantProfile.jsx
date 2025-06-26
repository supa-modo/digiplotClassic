import { useState } from 'react';
import TenantLayout from '../../components/tenant/TenantLayout';
import { useAuth } from '../../contexts/AuthContext';
import { getUnitById, getPropertyById, getLandlordById } from '../../utils/demoData';
import {
  TbUser,
  TbMail,
  TbPhone,
  TbMapPin,
  TbCalendar,
  TbKey,
  TbBell,
  TbShield,
  TbEdit,
  TbCheck,
  TbX,
  TbCamera,
  TbUpload,
  TbEye,
  TbEyeOff,
  TbHome,
  TbUserCheck,
  TbCreditCard,
  TbFileText,
  TbSettings,
} from 'react-icons/tb';

const TenantProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [editingSection, setEditingSection] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    emergency_contact_name: user?.emergency_contact_name || '',
    emergency_contact_phone: user?.emergency_contact_phone || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [notifications, setNotifications] = useState({
    payment_reminders: true,
    maintenance_updates: true,
    property_announcements: true,
    lease_reminders: true,
    email_notifications: true,
    sms_notifications: false,
  });
  const [loading, setLoading] = useState(false);

  // Get related data
  const unit = user?.unit_id ? getUnitById(user.unit_id) : null;
  const property = unit ? getPropertyById(unit.property_id) : null;
  const landlord = property ? getLandlordById(property.landlord_id) : null;

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: TbUser },
    { id: 'account', label: 'Account Settings', icon: TbSettings },
    { id: 'unit', label: 'Unit Details', icon: TbHome },
    { id: 'notifications', label: 'Notifications', icon: TbBell },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (setting, value) => {
    setNotifications(prev => ({ ...prev, [setting]: value }));
  };

  const handleSaveSection = async (section) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, update user data
      console.log(`Saving ${section}:`, section === 'notifications' ? notifications : formData);
      
      setEditingSection(null);
      // Show success message
      alert(`${section === 'notifications' ? 'Notification preferences' : 'Information'} updated successfully!`);
    } catch (error) {
      alert('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = (section) => {
    // Reset form data
    if (section === 'personal') {
      setFormData(prev => ({
        ...prev,
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: user?.phone || '',
        emergency_contact_name: user?.emergency_contact_name || '',
        emergency_contact_phone: user?.emergency_contact_phone || '',
      }));
    } else if (section === 'password') {
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));
    }
    setEditingSection(null);
  };

  const validatePasswordChange = () => {
    if (!formData.current_password) {
      alert('Please enter your current password');
      return false;
    }
    if (formData.new_password.length < 6) {
      alert('New password must be at least 6 characters long');
      return false;
    }
    if (formData.new_password !== formData.confirm_password) {
      alert('New passwords do not match');
      return false;
    }
    return true;
  };

  const renderPersonalInfo = () => (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        {editingSection !== 'personal' && (
          <button
            onClick={() => setEditingSection('personal')}
            className="text-primary-plot hover:text-primary-plot/80 transition-colors flex items-center space-x-1"
          >
            <TbEdit size={16} />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Picture */}
        <div className="md:col-span-2 flex items-center space-x-4">
          <div className="w-20 h-20 bg-primary-plot rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xl">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{user?.first_name} {user?.last_name}</h3>
            <p className="text-sm text-gray-500">Tenant ID: {user?.id}</p>
            <button className="text-sm text-primary-plot hover:text-primary-plot/80 mt-1 flex items-center space-x-1">
              <TbCamera size={14} />
              <span>Change Photo</span>
            </button>
          </div>
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          {editingSection === 'personal' ? (
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{user?.first_name}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          {editingSection === 'personal' ? (
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{user?.last_name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="flex items-center space-x-2">
            <TbMail className="text-gray-400" size={16} />
            <span className="text-gray-900">{user?.email}</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          {editingSection === 'personal' ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
            />
          ) : (
            <div className="flex items-center space-x-2">
              <TbPhone className="text-gray-400" size={16} />
              <span className="text-gray-900">{user?.phone || 'Not provided'}</span>
            </div>
          )}
        </div>

        {/* Emergency Contact Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Name
          </label>
          {editingSection === 'personal' ? (
            <input
              type="text"
              value={formData.emergency_contact_name}
              onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{user?.emergency_contact_name || 'Not provided'}</p>
          )}
        </div>

        {/* Emergency Contact Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Phone
          </label>
          {editingSection === 'personal' ? (
            <input
              type="tel"
              value={formData.emergency_contact_phone}
              onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{user?.emergency_contact_phone || 'Not provided'}</p>
          )}
        </div>
      </div>

      {editingSection === 'personal' && (
        <div className="flex space-x-3 mt-6 pt-6 border-t">
          <button
            onClick={() => handleSaveSection('personal')}
            disabled={loading}
            className="bg-primary-plot text-white px-4 py-2 rounded-lg hover:bg-primary-plot/90 disabled:opacity-50 transition-colors font-medium flex items-center space-x-2"
          >
            <TbCheck size={16} />
            <span>Save Changes</span>
          </button>
          <button
            onClick={() => handleCancelEdit('personal')}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
          >
            <TbX size={16} />
            <span>Cancel</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          {editingSection !== 'password' && (
            <button
              onClick={() => setEditingSection('password')}
              className="text-primary-plot hover:text-primary-plot/80 transition-colors flex items-center space-x-1"
            >
              <TbEdit size={16} />
              <span>Change</span>
            </button>
          )}
        </div>

        {editingSection === 'password' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.current_password}
                  onChange={(e) => handleInputChange('current_password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <TbEyeOff size={16} /> : <TbEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={formData.new_password}
                onChange={(e) => handleInputChange('new_password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirm_password}
                onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => {
                  if (validatePasswordChange()) {
                    handleSaveSection('password');
                  }
                }}
                disabled={loading}
                className="bg-primary-plot text-white px-4 py-2 rounded-lg hover:bg-primary-plot/90 disabled:opacity-50 transition-colors font-medium flex items-center space-x-2"
              >
                <TbCheck size={16} />
                <span>Update Password</span>
              </button>
              <button
                onClick={() => handleCancelEdit('password')}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
              >
                <TbX size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-gray-600">
            <TbShield size={16} />
            <span>Password last changed: Never</span>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Created
            </label>
            <div className="flex items-center space-x-2">
              <TbCalendar className="text-gray-400" size={16} />
              <span className="text-gray-900">{new Date(user?.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
              <TbUserCheck size={14} className="mr-1" />
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUnitDetails = () => (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Unit & Property Details</h2>
      
      {property && unit && landlord ? (
        <div className="space-y-6">
          {/* Property Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Property Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                <p className="text-gray-900">{property.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="flex items-center space-x-2">
                  <TbMapPin className="text-gray-400" size={16} />
                  <span className="text-gray-900">{property.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Unit Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Unit Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
                <p className="text-gray-900">{unit.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <p className="text-gray-900 capitalize">{unit.type?.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
                <p className="text-gray-900 font-semibold">KSh {unit.rent_amount?.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <p className="text-gray-900">{unit.bedrooms}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <p className="text-gray-900">{unit.bathrooms}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <p className="text-gray-900">{unit.size} sq ft</p>
              </div>
            </div>
          </div>

          {/* Landlord Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Landlord Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{landlord.first_name} {landlord.last_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center space-x-2">
                  <TbMail className="text-gray-400" size={16} />
                  <span className="text-gray-900">{landlord.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="flex items-center space-x-2">
                  <TbPhone className="text-gray-400" size={16} />
                  <span className="text-gray-900">{landlord.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lease Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Lease Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lease Start</label>
                <p className="text-gray-900">{new Date(user?.lease_start_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lease End</label>
                <p className="text-gray-900">{new Date(user?.lease_end_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit</label>
                <p className="text-gray-900">KSh {user?.security_deposit?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <TbHome className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No unit information available</p>
        </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
        <button
          onClick={() => handleSaveSection('notifications')}
          disabled={loading}
          className="bg-primary-plot text-white px-4 py-2 rounded-lg hover:bg-primary-plot/90 disabled:opacity-50 transition-colors font-medium flex items-center space-x-2"
        >
          <TbCheck size={16} />
          <span>Save Preferences</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Email & SMS Preferences */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Delivery Methods</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.email_notifications}
                onChange={(e) => handleNotificationChange('email_notifications', e.target.checked)}
                className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot"
              />
              <span className="ml-2 text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.sms_notifications}
                onChange={(e) => handleNotificationChange('sms_notifications', e.target.checked)}
                className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot"
              />
              <span className="ml-2 text-gray-700">SMS notifications</span>
            </label>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Notification Types</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.payment_reminders}
                onChange={(e) => handleNotificationChange('payment_reminders', e.target.checked)}
                className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot"
              />
              <span className="ml-2 text-gray-700">Payment reminders</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.maintenance_updates}
                onChange={(e) => handleNotificationChange('maintenance_updates', e.target.checked)}
                className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot"
              />
              <span className="ml-2 text-gray-700">Maintenance request updates</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.property_announcements}
                onChange={(e) => handleNotificationChange('property_announcements', e.target.checked)}
                className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot"
              />
              <span className="ml-2 text-gray-700">Property announcements</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.lease_reminders}
                onChange={(e) => handleNotificationChange('lease_reminders', e.target.checked)}
                className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot"
              />
              <span className="ml-2 text-gray-700">Lease renewal reminders</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'account':
        return renderAccountSettings();
      case 'unit':
        return renderUnitDetails();
      case 'notifications':
        return renderNotifications();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <TenantLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-plot">Profile Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors
                    ${activeTab === tab.id
                      ? 'border-primary-plot text-primary-plot'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <IconComponent size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </TenantLayout>
  );
};

export default TenantProfile;
