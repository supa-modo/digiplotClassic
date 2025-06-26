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
} from "react-icons/tb";
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
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-primary-plot rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-2xl">
            {profileData.first_name[0] || "L"}
            {profileData.last_name[0] || ""}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
          <p className="text-sm text-gray-500 mb-3">
            Update your profile picture
          </p>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Change Photo
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Personal Information
          </h3>
          <button
            onClick={() =>
              isEditing ? handleProfileSave() : setIsEditing(true)
            }
            className="bg-primary-plot text-white px-4 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors text-sm flex items-center space-x-2"
          >
            {isEditing ? <FaSave size={16} /> : <TbEdit size={16} />}
            <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                !isEditing ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                !isEditing ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                !isEditing ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, phone: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                !isEditing ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={profileData.address}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, address: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                !isEditing ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={profileData.city}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, city: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                !isEditing ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State/County
            </label>
            <input
              type="text"
              value={profileData.state}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, state: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                !isEditing ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, bio: e.target.value }))
              }
              disabled={!isEditing}
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                !isEditing ? "bg-gray-50" : ""
              }`}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Change Password
        </h3>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswords.current ? (
                  <TbEyeOff size={16} />
                ) : (
                  <TbEye size={16} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswords.new ? (
                  <TbEyeOff size={16} />
                ) : (
                  <TbEye size={16} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswords.confirm ? (
                  <TbEyeOff size={16} />
                ) : (
                  <TbEye size={16} />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordChange}
            className="bg-primary-plot text-white px-6 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Two-Factor Authentication
        </h3>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">SMS Authentication</p>
            <p className="text-sm text-gray-500">
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
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <TbShield className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">
              Important Security Notice
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              Your M-Pesa credentials are encrypted and stored securely. Only
              use production credentials in live environment.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          M-Pesa Integration Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
            >
              <option value="sandbox">Sandbox (Testing)</option>
              <option value="production">Production (Live)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                placeholder="Enter your consumer key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                placeholder="Enter your consumer secret"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                placeholder="e.g. 174379"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                placeholder="Enter your passkey"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                placeholder="https://yourdomain.com/api/mpesa/callback"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleMpesaSave}
              className="bg-primary-plot text-white px-6 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors"
            >
              Save M-Pesa Settings
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Test Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Notification Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">
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

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-500">
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

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Alert Types</h4>

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
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {alert.label}
                  </p>
                  <p className="text-xs text-gray-500">{alert.description}</p>
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
            className="bg-primary-plot text-white px-6 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors"
          >
            Save Notification Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderApiKeys = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <TbApi className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">
              API Integration
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Use these API keys to integrate with third-party applications.
              Keep your secret keys secure.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Public API Key
          </label>
          <div className="flex">
            <input
              type="text"
              value="pk_test_1234567890abcdef"
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-600"
            />
            <button className="px-4 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-300 transition-colors text-sm">
              Copy
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secret API Key
          </label>
          <div className="flex">
            <input
              type="password"
              value="sk_test_abcdef1234567890"
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-600"
            />
            <button className="px-4 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-300 transition-colors text-sm">
              Copy
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL
          </label>
          <div className="flex">
            <input
              type="text"
              value="https://yourdomain.com/api/webhooks"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
            />
            <button className="px-4 py-2 bg-primary-plot text-white border border-l-0 border-primary-plot rounded-r-lg hover:bg-primary-plot/90 transition-colors text-sm">
              Save
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Regenerate API Keys</h4>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm">
              Regenerate Keys
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Warning: Regenerating API keys will invalidate existing
            integrations. Make sure to update all connected applications.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <LandlordLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings, preferences, and integrations
          </p>
        </div>

        {/* Status Messages */}
        {saveStatus && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              saveStatus === "saved"
                ? "bg-green-50 text-green-800 border border-green-200"
                : saveStatus === "saving"
                ? "bg-blue-50 text-blue-800 border border-blue-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {saveStatus === "saved" && <TbCheck className="h-5 w-5" />}
            {saveStatus === "saving" && (
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
            )}
            {saveStatus === "error" && <TbX className="h-5 w-5" />}
            {saveStatus === "password-mismatch" && <TbX className="h-5 w-5" />}
            <span>
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
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-plot text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border p-6">
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
