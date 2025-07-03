import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbX,
  TbUser,
  TbMail,
  TbPhone,
  TbMapPin,
  TbCalendar,
  TbCurrencyDollar,
  TbEdit,
  TbPlus,
  TbSparkles,
  TbAlertTriangle,
  TbCheck,
  TbLoader2,
  TbBuilding,
  TbHome,
  TbUserCheck,
  TbId,
  TbCalendarEvent,
  TbFileText,
  TbShield,
} from "react-icons/tb";
import tenantService from "../../services/tenantService";

const TenantModal = ({
  isOpen,
  onClose,
  onSave,
  tenant,
  properties = [],
  selectedUnit = null,
}) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    id_number: "",
    date_of_birth: "",
    address: "",
    city: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    occupation: "",
    employer: "",
    monthly_income: "",
    unit_id: selectedUnit?.id || "",
    property_id: selectedUnit?.property_id || "",
    lease_start_date: "",
    lease_end_date: "",
    security_deposit: "",
    monthly_rent: selectedUnit?.rent_amount || "",
    status: "active",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableUnits, setAvailableUnits] = useState([]);

  const isEditing = !!tenant;

  const tenantStatuses = [
    { value: "active", label: "Active", color: "text-green-600" },
    { value: "inactive", label: "Inactive", color: "text-gray-600" },
    { value: "suspended", label: "Suspended", color: "text-red-600" },
    { value: "pending", label: "Pending", color: "text-yellow-600" },
  ];

  useEffect(() => {
    if (tenant) {
      setFormData({
        first_name: tenant.first_name || "",
        last_name: tenant.last_name || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        id_number: tenant.id_number || "",
        date_of_birth: tenant.date_of_birth || "",
        address: tenant.address || "",
        city: tenant.city || "",
        emergency_contact_name: tenant.emergency_contact_name || "",
        emergency_contact_phone: tenant.emergency_contact_phone || "",
        occupation: tenant.occupation || "",
        employer: tenant.employer || "",
        monthly_income: tenant.monthly_income || "",
        unit_id: tenant.unit_id || "",
        property_id: tenant.property_id || "",
        lease_start_date: tenant.lease_start_date || "",
        lease_end_date: tenant.lease_end_date || "",
        security_deposit: tenant.security_deposit || "",
        monthly_rent: tenant.monthly_rent || "",
        status: tenant.status || "active",
        notes: tenant.notes || "",
      });
    } else {
      // Reset form for new tenant
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        id_number: "",
        date_of_birth: "",
        address: "",
        city: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        occupation: "",
        employer: "",
        monthly_income: "",
        unit_id: selectedUnit?.id || "",
        property_id: selectedUnit?.property_id || "",
        lease_start_date: "",
        lease_end_date: "",
        security_deposit: "",
        monthly_rent: selectedUnit?.rent_amount || "",
        status: "active",
        notes: "",
      });
    }
    setErrors({});
  }, [tenant, isOpen, selectedUnit]);

  useEffect(() => {
    // Get available units for the selected property
    if (formData.property_id && properties.length > 0) {
      const selectedProperty = properties.find(
        (p) => p.id === formData.property_id
      );
      if (selectedProperty && selectedProperty.units) {
        const units = selectedProperty.units.filter(
          (unit) => unit.status === "vacant" || unit.id === formData.unit_id
        );
        setAvailableUnits(units);
      }
    }
  }, [formData.property_id, properties, formData.unit_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update rent amount when unit changes
    if (name === "unit_id") {
      const selectedProperty = properties.find(
        (p) => p.id === formData.property_id
      );
      if (selectedProperty && selectedProperty.units) {
        const selectedUnitData = selectedProperty.units.find(
          (u) => u.id === value
        );
        if (selectedUnitData) {
          setFormData((prev) => ({
            ...prev,
            monthly_rent: selectedUnitData.rent_amount || "",
          }));
        }
      }
    }

    // Update available units when property changes
    if (name === "property_id") {
      setFormData((prev) => ({
        ...prev,
        unit_id: "",
        monthly_rent: "",
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.id_number.trim()) {
      newErrors.id_number = "ID number is required";
    }

    if (!formData.unit_id) {
      newErrors.unit_id = "Please select a unit";
    }

    if (!formData.lease_start_date) {
      newErrors.lease_start_date = "Lease start date is required";
    }

    if (
      !formData.security_deposit ||
      parseFloat(formData.security_deposit) < 0
    ) {
      newErrors.security_deposit =
        "Please enter a valid security deposit amount";
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
      // Prepare tenant data with proper type conversion
      const tenantData = {
        ...formData,
        security_deposit: parseFloat(formData.security_deposit) || 0,
        monthly_rent: parseFloat(formData.monthly_rent) || 0,
        monthly_income: parseFloat(formData.monthly_income) || 0,
      };

      let response;
      if (isEditing) {
        // Update existing tenant
        response = await tenantService.updateTenant(tenant.id, tenantData);
      } else {
        // Create new tenant
        response = await tenantService.createTenant(tenantData);
      }

      if (response.success) {
        // If unit assignment is needed and not editing, assign the tenant to the unit
        if (!isEditing && formData.unit_id && formData.lease_start_date) {
          const assignmentData = {
            lease_start_date: formData.lease_start_date,
            lease_end_date: formData.lease_end_date,
            security_deposit: parseFloat(formData.security_deposit) || 0,
            monthly_rent: parseFloat(formData.monthly_rent) || 0,
          };

          await tenantService.assignUnit(
            response.tenant.id,
            formData.unit_id,
            assignmentData
          );
        }

        // Pass the tenant data from the API response
        onSave(response.tenant || response.data?.tenant || tenantData);
        onClose();
      } else {
        setErrors({ general: response.message || "Failed to save tenant" });
      }
    } catch (error) {
      console.error("Error saving tenant:", error);
      setErrors({
        general: error.message || "An error occurred while saving the tenant",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      id_number: "",
      date_of_birth: "",
      address: "",
      city: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      occupation: "",
      employer: "",
      monthly_income: "",
      unit_id: "",
      property_id: "",
      lease_start_date: "",
      lease_end_date: "",
      security_deposit: "",
      monthly_rent: "",
      status: "active",
      notes: "",
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
            className="fixed right-0 top-0 h-full w-full max-w-4xl bg-gradient-to-br from-primary-plot/5 via-secondary-plot/5 to-primary-plot/5 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50 overflow-hidden"
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
                        <TbUserCheck className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {isEditing ? "Edit Tenant" : "Add New Tenant"}
                        <TbSparkles className="w-5 h-5 text-yellow-300" />
                      </h2>
                      <p className="text-white/80 text-sm mt-1">
                        {isEditing
                          ? "Update tenant information and lease details"
                          : "Add a new tenant to your property portfolio"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
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
                  <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                        <TbUser className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
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
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.first_name
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          }`}
                          placeholder="Enter first name"
                          disabled={isSubmitting}
                        />
                        {errors.first_name && (
                          <div className="flex items-center mt-2 text-sm text-red-600">
                            <TbAlertTriangle className="w-4 h-4 mr-1" />
                            {errors.first_name}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.last_name
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          }`}
                          placeholder="Enter last name"
                          disabled={isSubmitting}
                        />
                        {errors.last_name && (
                          <div className="flex items-center mt-2 text-sm text-red-600">
                            <TbAlertTriangle className="w-4 h-4 mr-1" />
                            {errors.last_name}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.email
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          }`}
                          placeholder="Enter email address"
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <div className="flex items-center mt-2 text-sm text-red-600">
                            <TbAlertTriangle className="w-4 h-4 mr-1" />
                            {errors.email}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.phone
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          }`}
                          placeholder="Enter phone number"
                          disabled={isSubmitting}
                        />
                        {errors.phone && (
                          <div className="flex items-center mt-2 text-sm text-red-600">
                            <TbAlertTriangle className="w-4 h-4 mr-1" />
                            {errors.phone}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ID Number *
                        </label>
                        <input
                          type="text"
                          name="id_number"
                          value={formData.id_number}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.id_number
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          }`}
                          placeholder="Enter ID number"
                          disabled={isSubmitting}
                        />
                        {errors.id_number && (
                          <div className="flex items-center mt-2 text-sm text-red-600">
                            <TbAlertTriangle className="w-4 h-4 mr-1" />
                            {errors.id_number}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Enter address"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Enter city"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                        <TbShield className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Emergency Contact
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergency_contact_name"
                          value={formData.emergency_contact_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Enter emergency contact name"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="emergency_contact_phone"
                          value={formData.emergency_contact_phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Enter emergency contact phone"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                        <TbBuilding className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Employment Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Occupation
                        </label>
                        <input
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Enter occupation"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employer
                        </label>
                        <input
                          type="text"
                          name="employer"
                          value={formData.employer}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Enter employer"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Income
                        </label>
                        <input
                          type="number"
                          name="monthly_income"
                          value={formData.monthly_income}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Enter monthly income"
                          min="0"
                          step="0.01"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property & Unit Selection */}
                  <div className="bg-gradient-to-br from-yellow-50/50 to-orange-50/30 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                        <TbHome className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Property & Unit Assignment
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property
                        </label>
                        <select
                          name="property_id"
                          value={formData.property_id}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          disabled={isSubmitting || selectedUnit}
                        >
                          <option value="">Select a property</option>
                          {properties.map((property) => (
                            <option key={property.id} value={property.id}>
                              {property.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit *
                        </label>
                        <select
                          name="unit_id"
                          value={formData.unit_id}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.unit_id
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          }`}
                          disabled={
                            isSubmitting ||
                            !formData.property_id ||
                            selectedUnit
                          }
                        >
                          <option value="">Select a unit</option>
                          {availableUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name} - KSh{" "}
                              {unit.rent_amount?.toLocaleString()}/month
                            </option>
                          ))}
                        </select>
                        {errors.unit_id && (
                          <div className="flex items-center mt-2 text-sm text-red-600">
                            <TbAlertTriangle className="w-4 h-4 mr-1" />
                            {errors.unit_id}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lease Information */}
                  <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-gray-100 to-blue-100 rounded-xl">
                        <TbCalendarEvent className="h-6 w-6 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Lease Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lease Start Date *
                        </label>
                        <input
                          type="date"
                          name="lease_start_date"
                          value={formData.lease_start_date}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.lease_start_date
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          }`}
                          disabled={isSubmitting}
                        />
                        {errors.lease_start_date && (
                          <div className="flex items-center mt-2 text-sm text-red-600">
                            <TbAlertTriangle className="w-4 h-4 mr-1" />
                            {errors.lease_start_date}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lease End Date
                        </label>
                        <input
                          type="date"
                          name="lease_end_date"
                          value={formData.lease_end_date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Rent
                        </label>
                        <input
                          type="number"
                          name="monthly_rent"
                          value={formData.monthly_rent}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Monthly rent amount"
                          min="0"
                          step="0.01"
                          disabled={isSubmitting}
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Security Deposit *
                        </label>
                        <input
                          type="number"
                          name="security_deposit"
                          value={formData.security_deposit}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.security_deposit
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          }`}
                          placeholder="Security deposit amount"
                          min="0"
                          step="0.01"
                          disabled={isSubmitting}
                        />
                        {errors.security_deposit && (
                          <div className="flex items-center mt-2 text-sm text-red-600">
                            <TbAlertTriangle className="w-4 h-4 mr-1" />
                            {errors.security_deposit}
                          </div>
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
                          disabled={isSubmitting}
                        >
                          {tenantStatuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                        placeholder="Additional notes about the tenant..."
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 font-medium bg-white/70 backdrop-blur-sm hover:scale-105"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-plot to-secondary-plot text-white hover:from-primary-plot/90 hover:to-secondary-plot/90 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:scale-105 shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <TbLoader2 className="w-5 h-5 animate-spin" />
                          {isEditing ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <TbCheck className="w-5 h-5" />
                          {isEditing ? "Update Tenant" : "Add Tenant"}
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

export default TenantModal;
