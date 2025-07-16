import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  TbAlertCircle,
  TbCheck,
  TbLoader2,
  TbBuilding,
  TbHome,
  TbUserCheck,
  TbId,
  TbCalendarEvent,
  TbFileText,
  TbShield,
  TbUserPlus,
} from "react-icons/tb";
import tenantService from "../../services/tenantService";
import leaseService from "../../services/leaseService";

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
    emergency_contact_name: "",
    emergency_contact_phone: "",
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
    {
      value: "active",
      label: "Active",
      color: "text-green-600 bg-green-50 border-green-200",
    },
    {
      value: "inactive",
      label: "Inactive",
      color: "text-gray-600 bg-gray-50 border-gray-200",
    },
    {
      value: "suspended",
      label: "Suspended",
      color: "text-red-600 bg-red-50 border-red-200",
    },
    {
      value: "pending",
      label: "Pending",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    },
  ];

  useEffect(() => {
    if (tenant) {
      setFormData({
        first_name: tenant.first_name || "",
        last_name: tenant.last_name || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        id_number: tenant.id_number || "",
        emergency_contact_name: tenant.emergency_contact_name || "",
        emergency_contact_phone: tenant.emergency_contact_phone || "",
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
        emergency_contact_name: "",
        emergency_contact_phone: "",
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

  const handleStatusSelect = (status) => {
    setFormData((prev) => ({
      ...prev,
      status: status,
    }));

    if (errors.status) {
      setErrors((prev) => ({
        ...prev,
        status: "",
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
      if (isEditing) {
        // Update existing tenant
        const tenantData = {
          firstName: formData.first_name,
          lastName: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          emergencyContactName: formData.emergency_contact_name,
          emergencyContactPhone: formData.emergency_contact_phone,
          status: formData.status,
        };

        const response = await tenantService.updateTenant(
          tenant.id,
          tenantData
        );
        if (response.success) {
          onSave(response.data?.tenant || response.tenant);
          onClose();
        } else {
          setErrors({ general: response.message || "Failed to update tenant" });
        }
      } else {
        // Create new tenant and lease
        const tenantData = {
          firstName: formData.first_name,
          lastName: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          emergencyContactName: formData.emergency_contact_name,
          emergencyContactPhone: formData.emergency_contact_phone,
          password: "TempPass123!", // Temporary password that tenant will change
          role: "tenant",
        };

        const tenantResponse = await tenantService.createTenant(tenantData);

        if (!tenantResponse.success) {
          setErrors({
            general: tenantResponse.message || "Failed to create tenant",
          });
          return;
        }

        const newTenant = tenantResponse.data?.tenant || tenantResponse.tenant;

        // Step 2: Create the lease to assign tenant to unit
        if (formData.unit_id && formData.lease_start_date) {
          const leaseData = {
            tenantId: newTenant.id,
            unitId: formData.unit_id,
            startDate: formData.lease_start_date,
            endDate:
              formData.lease_end_date ||
              new Date(
                new Date(formData.lease_start_date).getFullYear() + 1,
                new Date(formData.lease_start_date).getMonth(),
                new Date(formData.lease_start_date).getDate()
              )
                .toISOString()
                .split("T")[0],
            monthlyRent: parseFloat(formData.monthly_rent) || 0,
            securityDeposit: parseFloat(formData.security_deposit) || 0,
            moveInDate: formData.lease_start_date,
            notes: formData.notes,
          };

          const leaseResponse = await leaseService.createLease(leaseData);

          if (!leaseResponse.success) {
            setErrors({
              general: leaseResponse.message || "Failed to create lease",
            });
            return;
          }
        }

        onSave(newTenant);
        onClose();
      }
    } catch (error) {
      console.error("Error saving tenant:", error);
      setErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          "An error occurred while saving the tenant",
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
              <TbUserPlus size={40} className="text-white mr-3" />
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {isEditing ? "Edit Tenant" : "Add New Tenant"}
                </h2>
                <p className="text-white/80 text-sm">
                  {isEditing
                    ? "Update tenant information and lease details"
                    : "Add a new tenant to your property portfolio"}
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
              {/* Personal Information */}
              <div>
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbUser size={20} className="mr-2 text-secondary-plot" />
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border ${
                          errors.first_name
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="Enter first name"
                        disabled={isSubmitting}
                      />
                      {errors.first_name && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" /> {errors.first_name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border ${
                          errors.last_name
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="Enter last name"
                        disabled={isSubmitting}
                      />
                      {errors.last_name && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" /> {errors.last_name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <TbMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                            errors.email
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                          placeholder="Enter email address"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.email && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" /> {errors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <TbPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                            errors.phone
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                          placeholder="Enter phone number"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.phone && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" /> {errors.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <TbId className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="id_number"
                        value={formData.id_number}
                        onChange={handleInputChange}
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.id_number
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="Enter ID number"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.id_number && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" /> {errors.id_number}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbShield size={20} className="mr-2 text-secondary-plot" />
                  Emergency Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleInputChange}
                      className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                      placeholder="Enter emergency contact name"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <TbPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="emergency_contact_phone"
                        value={formData.emergency_contact_phone}
                        onChange={handleInputChange}
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                        placeholder="Enter emergency contact phone"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Property & Unit Selection */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbHome size={20} className="mr-2 text-secondary-plot" />
                  Property & Unit Assignment
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property
                    </label>
                    <select
                      name="property_id"
                      value={formData.property_id}
                      onChange={handleInputChange}
                      className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
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
                      disabled={
                        isSubmitting || !formData.property_id || selectedUnit
                      }
                    >
                      <option value="">Select a unit</option>
                      {availableUnits.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name} - KSh {unit.rent_amount?.toLocaleString()}
                          /month
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

              {/* Lease Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbCalendarEvent
                    size={20}
                    className="mr-2 text-secondary-plot"
                  />
                  Lease Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lease Start Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <TbCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          name="lease_start_date"
                          value={formData.lease_start_date}
                          onChange={handleInputChange}
                          className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                            errors.lease_start_date
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.lease_start_date && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" />{" "}
                          {errors.lease_start_date}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lease End Date
                      </label>
                      <div className="relative">
                        <TbCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          name="lease_end_date"
                          value={formData.lease_end_date}
                          onChange={handleInputChange}
                          className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rent
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                          KSh
                        </span>
                        <input
                          type="number"
                          name="monthly_rent"
                          value={formData.monthly_rent}
                          onChange={handleInputChange}
                          className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                          placeholder="Monthly rent amount"
                          min="0"
                          step="0.01"
                          disabled={isSubmitting}
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Deposit <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                          KSh
                        </span>
                        <input
                          type="number"
                          name="security_deposit"
                          value={formData.security_deposit}
                          onChange={handleInputChange}
                          className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-12 pr-4 py-2.5 rounded-lg border ${
                            errors.security_deposit
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                          placeholder="Security deposit amount"
                          min="0"
                          step="0.01"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.security_deposit && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" />{" "}
                          {errors.security_deposit}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenant Status
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tenantStatuses.map((status) => (
                        <label
                          key={status.value}
                          className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                            formData.status === status.value
                              ? status.color
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value={status.value}
                            checked={formData.status === status.value}
                            onChange={() => handleStatusSelect(status.value)}
                            className="sr-only"
                          />
                          <div
                            className={`flex items-center justify-center w-4 h-4 border-2 rounded-full mr-3 ${
                              formData.status === status.value
                                ? "border-current bg-current"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.status === status.value && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium">{status.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <div className="relative">
                      <TbFileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                        placeholder="Additional notes about the tenant..."
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
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
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <TbCheck className="mr-2 h-4 w-4" />
                    {isEditing ? "Update Tenant" : "Add Tenant"}
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

export default TenantModal;
