import { useState, useEffect } from "react";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import { useAuth } from "../../contexts/AuthContext";
import {
  TbSettings,
  TbUser,
  TbKey,
  TbCreditCard,
  TbBell,
  TbMail,
  TbPhone,
  TbMapPin,
  TbEye,
  TbEyeOff,
  TbCheck,
  TbX,
  TbEdit,
  TbShield,
  TbApi,
  TbArrowRight,
} from "react-icons/tb";
import { PiCaretDownDuotone, PiGearDuotone } from "react-icons/pi";
import { FaSave } from "react-icons/fa";

const LandlordSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Kenya",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [mpesaSettings, setMpesaSettings] = useState({
    consumer_key: "",
    consumer_secret: "",
    shortcode: "",
    passkey: "",
    callback_url: "",
    environment: "sandbox",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    payment_alerts: true,
    maintenance_alerts: true,
    tenant_alerts: true,
    financial_reports: true,
    marketing_emails: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        postal_code: user.postal_code || "",
        country: user.country || "Kenya",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const tabs = [
    { id: "profile", label: "Profile", icon: TbUser },
    { id: "security", label: "Security", icon: TbShield },
    { id: "mpesa", label: "M-Pesa Settings", icon: TbCreditCard },
    { id: "notifications", label: "Notifications", icon: TbBell },
    { id: "api", label: "API Keys", icon: TbApi },
  ];

  const handleProfileSave = async () => {
    setSaveStatus("saving");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveStatus("saved");
      setIsEditing(false);
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setSaveStatus("password-mismatch");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }

    setSaveStatus("saving");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveStatus("saved");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleMpesaSave = async () => {
    setSaveStatus("saving");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleNotificationSave = async () => {
    setSaveStatus("saving");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const renderProfile = () => (
    <div className="space-y-8">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="w-32 h-32 bg-gradient-to-br from-primary-plot to-secondary-plot rounded-full flex items-center justify-center shadow-xl">
          <span className="text-white font-bold text-3xl">
            {profileData.first_name[0] || "L"}
            {profileData.last_name[0] || ""}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Profile Picture</h3>
          <p className="text-gray-600 mb-4">Update your profile picture</p>
          <button className="bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold">
            Change Photo
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 rounded-2xl p-8 border border-primary-plot/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Personal Information
          </h3>
          <button
            onClick={() =>
              isEditing ? handleProfileSave() : setIsEditing(true)
            }
            className="bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center space-x-2"
          >
            {isEditing ? <FaSave size={16} /> : <TbEdit size={16} />}
            <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={profileData.first_name}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  first_name: e.target.value,
                }))
              }
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all ${
                !isEditing ? "bg-gray-50" : "bg-white/80 backdrop-blur-sm"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={profileData.last_name}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  last_name: e.target.value,
                }))
              }
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all ${
                !isEditing ? "bg-gray-50" : "bg-white/80 backdrop-blur-sm"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all ${
                !isEditing ? "bg-gray-50" : "bg-white/80 backdrop-blur-sm"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, phone: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all ${
                !isEditing ? "bg-gray-50" : "bg-white/80 backdrop-blur-sm"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={profileData.address}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, address: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all ${
                !isEditing ? "bg-gray-50" : "bg-white/80 backdrop-blur-sm"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={profileData.city}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, city: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all ${
                !isEditing ? "bg-gray-50" : "bg-white/80 backdrop-blur-sm"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State/County
            </label>
            <input
              type="text"
              value={profileData.state}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, state: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all ${
                !isEditing ? "bg-gray-50" : "bg-white/80 backdrop-blur-sm"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, bio: e.target.value }))
              }
              disabled={!isEditing}
              rows={4}
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent transition-all ${
                !isEditing ? "bg-gray-50" : "bg-white/80 backdrop-blur-sm"
              }`}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 rounded-2xl p-8 border border-primary-plot/20">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Change Password
        </h3>
        <div className="max-w-md space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.current_password}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    current_password: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-plot transition-colors"
              >
                {showPasswords.current ? (
                  <TbEyeOff size={20} />
                ) : (
                  <TbEye size={20} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    new_password: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-plot transition-colors"
              >
                {showPasswords.new ? (
                  <TbEyeOff size={20} />
                ) : (
                  <TbEye size={20} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirm_password}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirm_password: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-plot transition-colors"
              >
                {showPasswords.confirm ? (
                  <TbEyeOff size={20} />
                ) : (
                  <TbEye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordChange}
            className="bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Two-Factor Authentication
        </h3>
        <div className="flex items-center justify-between p-6 border border-blue-200 rounded-xl bg-white/80 backdrop-blur-sm">
          <div>
            <p className="font-semibold text-gray-900 text-lg">
              SMS Authentication
            </p>
            <p className="text-gray-600 mt-1">
              Receive verification codes via SMS
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-plot/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-plot"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderMpesaSettings = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
        <div className="flex items-start">
          <TbShield className="h-6 w-6 text-yellow-600 mt-1 mr-3" />
          <div>
            <h4 className="text-lg font-bold text-yellow-800">
              Important Security Notice
            </h4>
            <p className="text-yellow-700 mt-1">
              Your M-Pesa credentials are encrypted and stored securely. Only
              use production credentials in live environment.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 rounded-2xl p-8 border border-primary-plot/20">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          M-Pesa Integration Settings
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Environment
            </label>
            <select
              value={mpesaSettings.environment}
              onChange={(e) =>
                setMpesaSettings((prev) => ({
                  ...prev,
                  environment: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-white/80 backdrop-blur-sm"
            >
              <option value="sandbox">Sandbox (Testing)</option>
              <option value="production">Production (Live)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Consumer Key
              </label>
              <input
                type="text"
                value={mpesaSettings.consumer_key}
                onChange={(e) =>
                  setMpesaSettings((prev) => ({
                    ...prev,
                    consumer_key: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-white/80 backdrop-blur-sm"
                placeholder="Enter your consumer key"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Consumer Secret
              </label>
              <input
                type="password"
                value={mpesaSettings.consumer_secret}
                onChange={(e) =>
                  setMpesaSettings((prev) => ({
                    ...prev,
                    consumer_secret: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-white/80 backdrop-blur-sm"
                placeholder="Enter your consumer secret"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shortcode
              </label>
              <input
                type="text"
                value={mpesaSettings.shortcode}
                onChange={(e) =>
                  setMpesaSettings((prev) => ({
                    ...prev,
                    shortcode: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-white/80 backdrop-blur-sm"
                placeholder="e.g. 174379"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Passkey
              </label>
              <input
                type="password"
                value={mpesaSettings.passkey}
                onChange={(e) =>
                  setMpesaSettings((prev) => ({
                    ...prev,
                    passkey: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-white/80 backdrop-blur-sm"
                placeholder="Enter your passkey"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Callback URL
              </label>
              <input
                type="url"
                value={mpesaSettings.callback_url}
                onChange={(e) =>
                  setMpesaSettings((prev) => ({
                    ...prev,
                    callback_url: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-white/80 backdrop-blur-sm"
                placeholder="https://yourdomain.com/api/mpesa/callback"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleMpesaSave}
              className="bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
            >
              Save M-Pesa Settings
            </button>
            <button className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 font-semibold">
              Test Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 rounded-2xl p-8 border border-primary-plot/20">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Notification Preferences
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-md transition-all">
            <div>
              <p className="font-semibold text-gray-900 text-lg">
                Email Notifications
              </p>
              <p className="text-gray-600 mt-1">
                Receive notifications via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.email_notifications}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    email_notifications: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-plot/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-plot"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-md transition-all">
            <div>
              <p className="font-semibold text-gray-900 text-lg">
                SMS Notifications
              </p>
              <p className="text-gray-600 mt-1">
                Receive notifications via SMS
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.sms_notifications}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    sms_notifications: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-plot/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-plot"></div>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-900 mb-4 text-xl">
              Alert Types
            </h4>

            {[
              {
                key: "payment_alerts",
                label: "Payment Alerts",
                description: "New payments and payment failures",
              },
              {
                key: "maintenance_alerts",
                label: "Maintenance Alerts",
                description: "New maintenance requests and updates",
              },
              {
                key: "tenant_alerts",
                label: "Tenant Alerts",
                description: "New tenant registrations and updates",
              },
              {
                key: "financial_reports",
                label: "Financial Reports",
                description: "Monthly and quarterly financial summaries",
              },
              {
                key: "marketing_emails",
                label: "Marketing Emails",
                description: "Product updates and promotional content",
              },
            ].map((alert) => (
              <div
                key={alert.key}
                className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-primary-plot/5 hover:to-secondary-plot/5 rounded-xl transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {alert.label}
                  </p>
                  <p className="text-xs text-gray-600">{alert.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings[alert.key]}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        [alert.key]: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-plot/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-plot"></div>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handleNotificationSave}
            className="bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
          >
            Save Notification Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderApiKeys = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start">
          <TbApi className="h-6 w-6 text-blue-600 mt-1 mr-3" />
          <div>
            <h4 className="text-lg font-bold text-blue-800">API Integration</h4>
            <p className="text-blue-700 mt-1">
              Use these API keys to integrate with third-party applications.
              Keep your secret keys secure.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 rounded-2xl p-8 border border-primary-plot/20 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Public API Key
          </label>
          <div className="flex">
            <input
              type="text"
              value="1234"
              readOnly
              className="flex-1 px-4 py-3 border border-gray-200 rounded-l-xl bg-gray-50 text-gray-600"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-primary-plot/10 to-secondary-plot/10 border border-l-0 border-gray-200 rounded-r-xl hover:bg-gradient-to-r hover:from-primary-plot/20 hover:to-secondary-plot/20 transition-all text-sm font-semibold text-primary-plot">
              Copy
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Secret API Key
          </label>
          <div className="flex">
            <input
              type="password"
              value="123"
              readOnly
              className="flex-1 px-4 py-3 border border-gray-200 rounded-l-xl bg-gray-50 text-gray-600"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-primary-plot/10 to-secondary-plot/10 border border-l-0 border-gray-200 rounded-r-xl hover:bg-gradient-to-r hover:from-primary-plot/20 hover:to-secondary-plot/20 transition-all text-sm font-semibold text-primary-plot">
              Copy
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Webhook URL
          </label>
          <div className="flex">
            <input
              type="text"
              value="https://yourdomain.com/api/webhooks"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-primary-plot to-secondary-plot text-white border border-l-0 border-primary-plot rounded-r-xl hover:shadow-lg transition-all text-sm font-semibold">
              Save
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                Regenerate API Keys
              </h4>
              <p className="text-gray-600 mt-1">
                Warning: Regenerating API keys will invalidate existing
                integrations. Make sure to update all connected applications.
              </p>
            </div>
            <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold">
              Regenerate Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <LandlordLayout>
      <div className="space-y-6">
        {/* Header - Enhanced */}
        <div className=" relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                <PiGearDuotone className="h-7 md:h-8 w-7 md:w-8 text-secondary-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary-plot">
                  Settings
                </h1>
                <p className="text-gray-600 mt-1 text-xs md:text-sm lg:text-base">
                  Manage your account settings, preferences, and integrations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button className="bg-white border border-gray-300 text-gray-700 text-[0.8rem] md:text-[0.9rem] px-4 py-3 md:py-2.5 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium">
                <div className="flex items-center justify-center space-x-2">
                  <TbApi className="h-4 w-4 md:h-5 md:w-5" />
                  <span>API Keys</span>
                </div>
              </button>
              <button className="bg-gradient-to-r from-secondary-600/90 to-secondary-700 text-white text-[0.8rem] md:text-[0.98rem] px-6 py-3 md:py-2.5 rounded-lg hover:shadow-lg transition-colors duration-200 font-medium space-x-2  shadow-md">
                <div className="flex items-center justify-center space-x-2">
                  <TbShield className="h-5 w-5 md:h-6 md:w-6" />
                  <span>Security Settings</span>
                  <TbArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {saveStatus && (
          <div
            className={`mb-6 p-6 rounded-2xl flex items-center space-x-3 shadow-lg ${
              saveStatus === "saved"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200"
                : saveStatus === "saving"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200"
                : "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200"
            }`}
          >
            {saveStatus === "saved" && <TbCheck className="h-6 w-6" />}
            {saveStatus === "saving" && (
              <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full"></div>
            )}
            {saveStatus === "error" && <TbX className="h-6 w-6" />}
            {saveStatus === "password-mismatch" && <TbX className="h-6 w-6" />}
            <span className="font-semibold">
              {saveStatus === "saved" && "Settings saved successfully!"}
              {saveStatus === "saving" && "Saving changes..."}
              {saveStatus === "error" &&
                "Error saving settings. Please try again."}
              {saveStatus === "password-mismatch" && "Passwords do not match."}
            </span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-primary-plot to-secondary-plot text-white shadow-lg"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-primary-plot/10 hover:to-secondary-plot/10 hover:text-primary-plot"
                      }`}
                    >
                      <IconComponent className="mr-3 h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
              {activeTab === "profile" && renderProfile()}
              {activeTab === "security" && renderSecurity()}
              {activeTab === "mpesa" && renderMpesaSettings()}
              {activeTab === "notifications" && renderNotifications()}
              {activeTab === "api" && renderApiKeys()}
            </div>
          </div>
        </div>
      </div>
    </LandlordLayout>
  );
};

export default LandlordSettings;
