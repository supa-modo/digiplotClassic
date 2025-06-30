import { useState } from "react";
import TenantLayout from "../../components/tenant/TenantLayout";
import { useAuth } from "../../contexts/AuthContext";
import {
  getUnitById,
  getPropertyById,
  getLandlordById,
} from "../../utils/demoData";
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
  TbBuildingSkyscraper,
} from "react-icons/tb";

const TenantProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [editingSection, setEditingSection] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    emergency_contact_name: user?.emergency_contact_name || "",
    emergency_contact_phone: user?.emergency_contact_phone || "",
    current_password: "",
    new_password: "",
    confirm_password: "",
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
    { id: "personal", label: "Personal Info", icon: TbUser },
    { id: "account", label: "Account Settings", icon: TbSettings },
    { id: "unit", label: "Unit Details", icon: TbHome },
    { id: "notifications", label: "Notifications", icon: TbBell },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (setting, value) => {
    setNotifications((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSaveSection = async (section) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real app, update user data
      console.log(
        `Saving ${section}:`,
        section === "notifications" ? notifications : formData
      );

      setEditingSection(null);
      // Show success message
      alert(
        `${
          section === "notifications"
            ? "Notification preferences"
            : "Information"
        } updated successfully!`
      );
    } catch (error) {
      alert("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = (section) => {
    // Reset form data
    if (section === "personal") {
      setFormData((prev) => ({
        ...prev,
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone: user?.phone || "",
        emergency_contact_name: user?.emergency_contact_name || "",
        emergency_contact_phone: user?.emergency_contact_phone || "",
      }));
    } else if (section === "password") {
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }));
    }
    setEditingSection(null);
  };

  const validatePasswordChange = () => {
    if (!formData.current_password) {
      alert("Please enter your current password");
      return false;
    }
    if (formData.new_password.length < 6) {
      alert("New password must be at least 6 characters long");
      return false;
    }
    if (formData.new_password !== formData.confirm_password) {
      alert("New passwords do not match");
      return false;
    }
    return true;
  };

  const renderPersonalInfo = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-plot/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-secondary-plot">
            Personal Information
          </h2>
          {editingSection !== "personal" && (
            <button
              onClick={() => setEditingSection("personal")}
              className="bg-primary-plot/10 text-primary-plot hover:bg-primary-plot/20 transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg border border-primary-plot/20"
            >
              <TbEdit size={16} />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture */}
          <div className="md:col-span-2 flex items-center space-x-6 p-6 bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 rounded-xl border border-primary-plot/10">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-plot to-secondary-plot rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-secondary-plot mb-1">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Tenant ID: {user?.id}
              </p>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                  <TbUserCheck size={14} className="mr-1" />
                  Active Tenant
                </span>
                <button className="text-sm text-primary-plot hover:text-primary-plot/80 flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-primary-plot/10 transition-colors">
                  <TbCamera size={14} />
                  <span>Change Photo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              {editingSection === "personal" ? (
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                />
              ) : (
                <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                  {user?.first_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                <TbMail className="text-gray-400" size={18} />
                <span className="text-gray-900">{user?.email}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full border border-green-200">
                  Verified
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emergency Contact Name
              </label>
              {editingSection === "personal" ? (
                <input
                  type="text"
                  value={formData.emergency_contact_name}
                  onChange={(e) =>
                    handleInputChange("emergency_contact_name", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                />
              ) : (
                <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                  {user?.emergency_contact_name || "Not provided"}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              {editingSection === "personal" ? (
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                />
              ) : (
                <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                  {user?.last_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              {editingSection === "personal" ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                />
              ) : (
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <TbPhone className="text-gray-400" size={18} />
                  <span className="text-gray-900">
                    {user?.phone || "Not provided"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emergency Contact Phone
              </label>
              {editingSection === "personal" ? (
                <input
                  type="tel"
                  value={formData.emergency_contact_phone}
                  onChange={(e) =>
                    handleInputChange("emergency_contact_phone", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                />
              ) : (
                <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                  {user?.emergency_contact_phone || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </div>

        {editingSection === "personal" && (
          <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => handleSaveSection("personal")}
              disabled={loading}
              className="bg-primary-plot text-white px-6 py-3 rounded-lg hover:bg-primary-plot/90 disabled:opacity-50 transition-colors font-semibold flex items-center space-x-2 shadow-lg"
            >
              <TbCheck size={18} />
              <span>Save Changes</span>
            </button>
            <button
              onClick={() => handleCancelEdit("personal")}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center space-x-2"
            >
              <TbX size={18} />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-8">
      {/* Password Change */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full -mr-8 -mt-8 blur-lg"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                <TbShield className="text-orange-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary-plot">
                  Security Settings
                </h2>
                <p className="text-sm text-gray-500">
                  Change your password and security preferences
                </p>
              </div>
            </div>
            {editingSection !== "password" && (
              <button
                onClick={() => setEditingSection("password")}
                className="bg-primary-plot/10 text-primary-plot hover:bg-primary-plot/20 transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg border border-primary-plot/20"
              >
                <TbEdit size={16} />
                <span>Change Password</span>
              </button>
            )}
          </div>

          {editingSection === "password" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.current_password}
                    onChange={(e) =>
                      handleInputChange("current_password", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent pr-12 bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <TbEyeOff size={18} />
                    ) : (
                      <TbEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.new_password}
                  onChange={(e) =>
                    handleInputChange("new_password", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) =>
                    handleInputChange("confirm_password", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex space-x-3 pt-6">
                <button
                  onClick={() => {
                    if (validatePasswordChange()) {
                      handleSaveSection("password");
                    }
                  }}
                  disabled={loading}
                  className="bg-primary-plot text-white px-6 py-3 rounded-lg hover:bg-primary-plot/90 disabled:opacity-50 transition-colors font-semibold flex items-center space-x-2 shadow-lg"
                >
                  <TbCheck size={18} />
                  <span>Update Password</span>
                </button>
                <button
                  onClick={() => handleCancelEdit("password")}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center space-x-2"
                >
                  <TbX size={18} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100">
              <TbShield className="text-green-600" size={20} />
              <div>
                <span className="text-gray-900 font-medium">
                  Password Protection
                </span>
                <p className="text-sm text-gray-500">Last changed: Never</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 blur-lg"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
              <TbUser className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-plot">
                Account Information
              </h2>
              <p className="text-sm text-gray-500">
                Your account details and status
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Created
              </label>
              <div className="flex items-center space-x-3">
                <TbCalendar className="text-gray-400" size={18} />
                <span className="text-gray-900 font-medium">
                  {new Date(user?.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Status
              </label>
              <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                <TbUserCheck size={14} className="mr-1" />
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUnitDetails = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
            <TbHome className="text-green-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary-plot">
              Unit & Property Details
            </h2>
            <p className="text-sm text-gray-500">
              Information about your rental unit and property
            </p>
          </div>
        </div>

        {property && unit && landlord ? (
          <div className="space-y-8">
            {/* Property Information */}
            <div className="p-6 bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 rounded-xl border border-primary-plot/10">
              <h3 className="text-lg font-bold text-secondary-plot mb-4 flex items-center">
                <TbBuildingSkyscraper
                  className="mr-2 text-primary-plot"
                  size={20}
                />
                Property Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Property Name
                  </label>
                  <p className="text-gray-900 font-medium">{property.name}</p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <TbMapPin className="text-gray-400" size={16} />
                    <span className="text-gray-900">{property.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Unit Information */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <h3 className="text-lg font-bold text-secondary-plot mb-4 flex items-center">
                <TbHome className="mr-2 text-blue-600" size={20} />
                Unit Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Unit Number
                  </label>
                  <p className="text-gray-900 font-medium">{unit.name}</p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Type
                  </label>
                  <p className="text-gray-900 capitalize">
                    {unit.type?.replace("_", " ")}
                  </p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Monthly Rent
                  </label>
                  <p className="text-gray-900 font-bold text-lg">
                    KSh {unit.rent_amount?.toLocaleString()}
                  </p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <p className="text-gray-900 font-medium">{unit.bedrooms}</p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <p className="text-gray-900 font-medium">{unit.bathrooms}</p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Size
                  </label>
                  <p className="text-gray-900 font-medium">{unit.size} sq ft</p>
                </div>
              </div>
            </div>

            {/* Landlord Information */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <h3 className="text-lg font-bold text-secondary-plot mb-4 flex items-center">
                <TbUser className="mr-2 text-purple-600" size={20} />
                Landlord Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {landlord.first_name} {landlord.last_name}
                  </p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <TbMail className="text-gray-400" size={16} />
                    <span className="text-gray-900">{landlord.email}</span>
                  </div>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <div className="flex items-center space-x-2">
                    <TbPhone className="text-gray-400" size={16} />
                    <span className="text-gray-900">{landlord.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lease Information */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
              <h3 className="text-lg font-bold text-secondary-plot mb-4 flex items-center">
                <TbFileText className="mr-2 text-orange-600" size={20} />
                Lease Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Lease Start
                  </label>
                  <p className="text-gray-900 font-medium">
                    {new Date(user?.lease_start_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Lease End
                  </label>
                  <p className="text-gray-900 font-medium">
                    {new Date(user?.lease_end_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="px-4 py-3 bg-white rounded-lg border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Security Deposit
                  </label>
                  <p className="text-gray-900 font-bold">
                    KSh {user?.security_deposit?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <TbHome className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg">
              No unit information available
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
              <TbBell className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-plot">
                Notification Preferences
              </h2>
              <p className="text-sm text-gray-500">
                Manage how you receive updates and alerts
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSaveSection("notifications")}
            disabled={loading}
            className="bg-primary-plot text-white px-6 py-3 rounded-lg hover:bg-primary-plot/90 disabled:opacity-50 transition-colors font-semibold flex items-center space-x-2 shadow-lg"
          >
            <TbCheck size={18} />
            <span>Save Preferences</span>
          </button>
        </div>

        <div className="space-y-8">
          {/* Email & SMS Preferences */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h3 className="text-lg font-bold text-secondary-plot mb-4">
              Delivery Methods
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <TbMail className="text-blue-600" size={20} />
                  <div>
                    <span className="text-gray-900 font-medium">
                      Email notifications
                    </span>
                    <p className="text-sm text-gray-500">
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email_notifications}
                  onChange={(e) =>
                    handleNotificationChange(
                      "email_notifications",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot w-5 h-5"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <TbPhone className="text-green-600" size={20} />
                  <div>
                    <span className="text-gray-900 font-medium">
                      SMS notifications
                    </span>
                    <p className="text-sm text-gray-500">
                      Receive updates via text message
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sms_notifications}
                  onChange={(e) =>
                    handleNotificationChange(
                      "sms_notifications",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot w-5 h-5"
                />
              </label>
            </div>
          </div>

          {/* Notification Types */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <h3 className="text-lg font-bold text-secondary-plot mb-4">
              Notification Types
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <TbCreditCard className="text-green-600" size={20} />
                  <span className="text-gray-900 font-medium">
                    Payment reminders
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.payment_reminders}
                  onChange={(e) =>
                    handleNotificationChange(
                      "payment_reminders",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot w-5 h-5"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <TbSettings className="text-blue-600" size={20} />
                  <span className="text-gray-900 font-medium">
                    Maintenance updates
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.maintenance_updates}
                  onChange={(e) =>
                    handleNotificationChange(
                      "maintenance_updates",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot w-5 h-5"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <TbBell className="text-yellow-600" size={20} />
                  <span className="text-gray-900 font-medium">
                    Property announcements
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.property_announcements}
                  onChange={(e) =>
                    handleNotificationChange(
                      "property_announcements",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot w-5 h-5"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <TbFileText className="text-purple-600" size={20} />
                  <span className="text-gray-900 font-medium">
                    Lease reminders
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.lease_reminders}
                  onChange={(e) =>
                    handleNotificationChange(
                      "lease_reminders",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot w-5 h-5"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return renderPersonalInfo();
      case "account":
        return renderAccountSettings();
      case "unit":
        return renderUnitDetails();
      case "notifications":
        return renderNotifications();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <TenantLayout>
      <div className="p-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-secondary-plot mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your account information and preferences
            </p>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 overflow-x-auto">
            <nav className="flex space-x-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap
                      ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-primary-plot to-secondary-plot text-white shadow-lg transform scale-105"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }
                    `}
                  >
                    <IconComponent size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">{renderTabContent()}</div>
      </div>
    </TenantLayout>
  );
};

export default TenantProfile;
