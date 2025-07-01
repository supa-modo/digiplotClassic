import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbX,
  TbUser,
  TbMail,
  TbPhone,
  TbShield,
  TbLoader2,
  TbEye,
  TbEyeOff,
  TbCheck,
  TbAlertTriangle,
  TbUserPlus,
  TbEdit,
  TbStar,
  TbSparkles,
} from "react-icons/tb";

const UserModal = ({
  isOpen,
  onClose,
  onSave,
  user = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "tenant",
    phone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    status: "active",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!user;

  // Populate form when editing
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        role: user.role || "tenant",
        phone: user.phone || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactPhone: user.emergencyContactPhone || "",
        status: user.status || "active",
      });
    } else {
      // Reset form for creating new user
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "tenant",
        phone: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        status: "active",
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.role) newErrors.role = "Role is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation (only required for new users)
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (formData.password) {
      // If editing and password is provided, validate it
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = "Phone number should be at least 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare data for submission
    const submitData = { ...formData };

    // If editing and no password provided, remove password fields
    if (isEditing && !formData.password) {
      delete submitData.password;
      delete submitData.confirmPassword;
    }

    onSave(submitData);
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "tenant",
      phone: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      status: "active",
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-gradient-to-br from-primary-plot/5 via-secondary-plot/5 to-primary-plot/5 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50 overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-20 -right-20 w-40 h-40 bg-primary-plot/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 -right-16 w-32 h-32 bg-secondary-plot/10 rounded-full blur-2xl" />
            <div className="absolute top-1/2 -right-24 w-48 h-48 bg-gradient-to-r from-primary-plot/5 to-secondary-plot/5 rounded-full blur-3xl" />

            {/* Content Container */}
            <div className="relative h-full flex flex-col bg-white/95 backdrop-blur-xl">
              {/* Header */}
              <div className="flex-shrink-0 relative px-8 py-6 bg-gradient-to-r from-primary-plot via-secondary-plot to-primary-plot border-b border-white/20">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                      {isEditing ? (
                        <TbEdit className="w-6 h-6 text-white" />
                      ) : (
                        <TbUserPlus className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {isEditing ? "Edit User" : "Create New User"}
                        <TbSparkles className="w-5 h-5 text-yellow-300" />
                      </h2>
                      <p className="text-white/80 text-sm mt-1">
                        {isEditing
                          ? "Update user information and permissions"
                          : "Add a new user to the system"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 text-white hover:bg-white/30 transition-all duration-200 hover:scale-105"
                  >
                    <TbX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  {/* Personal Information */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbUser className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Personal Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.firstName
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          } focus:ring-4 focus:outline-none`}
                          disabled={loading}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.lastName
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          } focus:ring-4 focus:outline-none`}
                          disabled={loading}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbMail className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Contact Information
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.email
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          } focus:ring-4 focus:outline-none`}
                          disabled={loading}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.phone
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          } focus:ring-4 focus:outline-none`}
                          disabled={loading}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Security & Access */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbShield className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Security & Access
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role *
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.role
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          } focus:ring-4 focus:outline-none`}
                          disabled={loading}
                        >
                          <option value="tenant">Tenant</option>
                          <option value="landlord">Landlord</option>
                          <option value="admin">Admin</option>
                        </select>
                        {errors.role && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.role}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          disabled={loading}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="mt-6 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {isEditing
                            ? "New Password (leave blank to keep current)"
                            : "Password *"}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                              errors.password
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                            } focus:ring-4 focus:outline-none`}
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                          >
                            {showPassword ? (
                              <TbEyeOff size={20} />
                            ) : (
                              <TbEye size={20} />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.password}
                          </p>
                        )}
                      </div>

                      {(formData.password || !isEditing) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password {!isEditing && "*"}
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                                errors.confirmPassword
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                  : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                              } focus:ring-4 focus:outline-none`}
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                              {showConfirmPassword ? (
                                <TbEyeOff size={20} />
                              ) : (
                                <TbEye size={20} />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                              <TbAlertTriangle className="w-4 h-4" />
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbPhone className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Emergency Contact (Optional)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 font-medium bg-white/70 backdrop-blur-sm hover:scale-105"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-plot to-secondary-plot text-white hover:from-primary-plot/90 hover:to-secondary-plot/90 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:scale-105 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <TbLoader2 className="w-5 h-5 animate-spin" />
                          {isEditing ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <TbCheck className="w-5 h-5" />
                          {isEditing ? "Update User" : "Create User"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserModal;
