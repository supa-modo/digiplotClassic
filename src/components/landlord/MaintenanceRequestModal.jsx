import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TbX,
  TbTool,
  TbHome,
  TbUser,
  TbCalendar,
  TbAlertCircle,
  TbCheck,
  TbLoader2,
  TbFileDescription,
  TbPhone,
  TbMail,
  TbBuildingPlus,
  TbExclamationMark,
  TbDropletFilled,
  TbBolt,
  TbFlame,
  TbWifi,
  TbDoorEnter,
  TbAirConditioning,
} from "react-icons/tb";
import maintenanceService from "../../services/maintenanceService";

const MaintenanceRequestModal = ({
  isOpen,
  onClose,
  onSave,
  properties = [],
}) => {
  const [formData, setFormData] = useState({
    property_id: "",
    unit_id: "",
    title: "",
    description: "",
    priority: "medium",
    category: "general",
    tenant_name: "",
    tenant_phone: "",
    tenant_email: "",
    reported_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableUnits, setAvailableUnits] = useState([]);

  const priorityLevels = [
    {
      value: "low",
      label: "Low Priority",
      color: "text-green-600 bg-green-50 border-green-200",
      icon: TbCheck,
    },
    {
      value: "medium",
      label: "Medium Priority",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      icon: TbExclamationMark,
    },
    {
      value: "high",
      label: "High Priority",
      color: "text-orange-600 bg-orange-50 border-orange-200",
      icon: TbExclamationMark,
    },
    {
      value: "urgent",
      label: "Urgent",
      color: "text-red-600 bg-red-50 border-red-200",
      icon: TbExclamationMark,
    },
  ];

  const categories = [
    { value: "general", label: "General Maintenance", icon: TbTool },
    { value: "plumbing", label: "Plumbing", icon: TbDropletFilled },
    { value: "electrical", label: "Electrical", icon: TbBolt },
    { value: "heating", label: "Heating/HVAC", icon: TbFlame },
    { value: "appliances", label: "Appliances", icon: TbHome },
    { value: "security", label: "Security/Locks", icon: TbDoorEnter },
    { value: "internet", label: "Internet/Cable", icon: TbWifi },
    { value: "ac", label: "Air Conditioning", icon: TbAirConditioning },
  ];

  useEffect(() => {
    setFormData({
      property_id: "",
      unit_id: "",
      title: "",
      description: "",
      priority: "medium",
      category: "general",
      tenant_name: "",
      tenant_phone: "",
      tenant_email: "",
      reported_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setErrors({});
  }, [isOpen]);

  useEffect(() => {
    // Get available units for the selected property
    if (formData.property_id && properties.length > 0) {
      const selectedProperty = properties.find(
        (p) => p.id === formData.property_id
      );
      if (selectedProperty && selectedProperty.units) {
        setAvailableUnits(selectedProperty.units);
      }
    } else {
      setAvailableUnits([]);
    }
  }, [formData.property_id, properties]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear available units when property changes
    if (name === "property_id") {
      setFormData((prev) => ({
        ...prev,
        unit_id: "",
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePrioritySelect = (priority) => {
    setFormData((prev) => ({
      ...prev,
      priority: priority,
    }));

    if (errors.priority) {
      setErrors((prev) => ({
        ...prev,
        priority: "",
      }));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: category,
    }));

    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.property_id) {
      newErrors.property_id = "Please select a property";
    }

    if (!formData.unit_id) {
      newErrors.unit_id = "Please select a unit";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Request title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.reported_date) {
      newErrors.reported_date = "Reported date is required";
    }

    if (
      formData.tenant_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tenant_email)
    ) {
      newErrors.tenant_email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const maintenanceData = {
        ...formData,
        status: "pending",
        created_date: new Date().toISOString(),
      };

      const response = await maintenanceService.createMaintenanceRequest(
        maintenanceData
      );

      if (response.success) {
        onSave(
          response.maintenanceRequest ||
            response.data?.maintenanceRequest || {
              ...maintenanceData,
              id: Date.now(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
        );
        onClose();
      } else {
        setErrors({
          general: response.message || "Failed to create maintenance request",
        });
      }
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      setErrors({
        general:
          error.message ||
          "An error occurred while creating the maintenance request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 bg-black/50 backdrop-blur-[1.5px] flex items-start justify-end z-50 p-3 font-outfit"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="w-[780px] h-[calc(100vh-24px)] bg-white shadow-2xl overflow-hidden rounded-3xl border border-gray-200"
        >
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-plot to-secondary-700 px-6 py-4 relative">
          <div className="relative flex justify-between items-center z-10">
            <div className="flex items-center">
              <TbTool size={40} className="text-white mr-3" />
              <div>
                <h2 className="text-white font-semibold text-lg">
                  Create Maintenance Request
                </h2>
                <p className="text-white/80 text-sm">
                  Report a new maintenance issue for a property unit
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
            >
              <TbX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-100px)]"
        >
          <div className="overflow-y-auto flex-1 px-3 md:px-6 py-5">
            <div className="space-y-6">
              {/* Property & Unit Selection */}
              <div>
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbHome size={20} className="mr-2 text-secondary-plot" />
                  Property & Unit Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="property_id"
                        value={formData.property_id}
                        onChange={handleInputChange}
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border ${
                          errors.property_id
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        disabled={isSubmitting}
                      >
                        <option value="">Select a property</option>
                        {properties.map((property) => (
                          <option key={property.id} value={property.id}>
                            {property.name}
                          </option>
                        ))}
                      </select>
                      {errors.property_id && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" />{" "}
                          {errors.property_id}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="unit_id"
                        value={formData.unit_id}
                        onChange={handleInputChange}
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border ${
                          errors.unit_id
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        disabled={isSubmitting || !formData.property_id}
                      >
                        <option value="">Select a unit</option>
                        {availableUnits.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name} - {unit.unit_type}
                          </option>
                        ))}
                      </select>
                      {errors.unit_id && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" /> {errors.unit_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbFileDescription
                    size={20}
                    className="mr-2 text-secondary-plot"
                  />
                  Request Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border ${
                        errors.title
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                      placeholder="e.g., Leaking faucet in kitchen"
                      disabled={isSubmitting}
                    />
                    {errors.title && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" /> {errors.title}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <TbFileDescription className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.description
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="Provide detailed description of the maintenance issue..."
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.description && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" /> {errors.description}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reported Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <TbCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="reported_date"
                        value={formData.reported_date}
                        onChange={handleInputChange}
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.reported_date
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.reported_date && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" />{" "}
                        {errors.reported_date}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Selection */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbTool size={20} className="mr-2 text-secondary-plot" />
                  Maintenance Category
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <label
                        key={category.value}
                        className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                          formData.category === category.value
                            ? "border-secondary-plot bg-secondary-50 text-secondary-plot"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={formData.category === category.value}
                          onChange={() => handleCategorySelect(category.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <IconComponent className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">
                            {category.label}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Priority Level */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbExclamationMark
                    size={20}
                    className="mr-2 text-secondary-plot"
                  />
                  Priority Level
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {priorityLevels.map((priority) => {
                    const IconComponent = priority.icon;
                    return (
                      <label
                        key={priority.value}
                        className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                          formData.priority === priority.value
                            ? priority.color
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={priority.value}
                          checked={formData.priority === priority.value}
                          onChange={() => handlePrioritySelect(priority.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <IconComponent className="w-5 h-5 mr-2" />
                          <span className="font-medium">{priority.label}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Tenant Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbUser size={20} className="mr-2 text-secondary-plot" />
                  Tenant Information (Optional)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenant Name
                    </label>
                    <input
                      type="text"
                      name="tenant_name"
                      value={formData.tenant_name}
                      onChange={handleInputChange}
                      className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                      placeholder="Enter tenant name"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tenant Phone
                      </label>
                      <div className="relative">
                        <TbPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="tenant_phone"
                          value={formData.tenant_phone}
                          onChange={handleInputChange}
                          className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                          placeholder="+254 712 345 678"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tenant Email
                      </label>
                      <div className="relative">
                        <TbMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="tenant_email"
                          value={formData.tenant_email}
                          onChange={handleInputChange}
                          className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                            errors.tenant_email
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                          placeholder="tenant@email.com"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.tenant_email && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" />{" "}
                          {errors.tenant_email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbFileDescription
                    size={20}
                    className="mr-2 text-secondary-plot"
                  />
                  Additional Notes
                </h3>

                <div className="relative">
                  <TbFileDescription className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                    placeholder="Any additional notes or special instructions..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit Error */}
              {errors.general && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <TbAlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-sm text-red-800">{errors.general}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-secondary-plot text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <TbCheck className="mr-2 h-4 w-4" />
                    Create Request
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MaintenanceRequestModal;
