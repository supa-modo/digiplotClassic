import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbX,
  TbHome,
  TbBed,
  TbBath,
  TbRuler,
  TbCurrencyDollar,
  TbEdit,
  TbPlus,
  TbSparkles,
  TbAlertTriangle,
  TbCheck,
  TbLoader2,
  TbBuilding,
  TbStar,
} from "react-icons/tb";

const UnitModal = ({ isOpen, onClose, onSave, property, unit }) => {
  const [formData, setFormData] = useState({
    unit_number: "",
    unit_type: "apartment",
    bedrooms: "",
    bathrooms: "",
    size_sqft: "",
    rent_amount: "",
    security_deposit: "",
    status: "available",
    floor_number: "",
    description: "",
    amenities: [],
    utilities_included: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!unit;

  const unitTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "studio", label: "Studio" },
    { value: "single_room", label: "Single Room" },
    { value: "bedsitter", label: "Bedsitter" },
    { value: "one_bedroom", label: "One Bedroom" },
    { value: "two_bedroom", label: "Two Bedroom" },
    { value: "three_bedroom", label: "Three Bedroom" },
    { value: "penthouse", label: "Penthouse" },
    { value: "duplex", label: "Duplex" },
    { value: "office", label: "Office Space" },
    { value: "shop", label: "Shop/Retail" },
  ];

  const unitStatuses = [
    { value: "available", label: "Available", color: "text-green-600" },
    { value: "occupied", label: "Occupied", color: "text-blue-600" },
    {
      value: "maintenance",
      label: "Under Maintenance",
      color: "text-orange-600",
    },
    { value: "unavailable", label: "Unavailable", color: "text-red-600" },
  ];

  const amenitiesList = [
    "Balcony",
    "Air Conditioning",
    "Heating",
    "Furnished",
    "Semi-Furnished",
    "Kitchen Appliances",
    "Washer/Dryer",
    "Parking Space",
    "Storage",
    "Garden Access",
    "Sea View",
    "City View",
    "High-Speed Internet",
    "Cable TV",
    "Security System",
  ];

  const utilitiesList = [
    "Water",
    "Electricity",
    "Gas",
    "Internet",
    "Cable TV",
    "Garbage Collection",
    "Security",
    "Maintenance",
  ];

  useEffect(() => {
    if (unit) {
      setFormData({
        unit_number: unit.unit_number || "",
        unit_type: unit.unit_type || "apartment",
        bedrooms: unit.bedrooms || "",
        bathrooms: unit.bathrooms || "",
        size_sqft: unit.size_sqft || "",
        rent_amount: unit.rent_amount || "",
        security_deposit: unit.security_deposit || "",
        status: unit.status || "available",
        floor_number: unit.floor_number || "",
        description: unit.description || "",
        amenities: unit.amenities || [],
        utilities_included: unit.utilities_included || [],
      });
    } else {
      // Reset form for new unit
      setFormData({
        unit_number: "",
        unit_type: "apartment",
        bedrooms: "",
        bathrooms: "",
        size_sqft: "",
        rent_amount: "",
        security_deposit: "",
        status: "available",
        floor_number: "",
        description: "",
        amenities: [],
        utilities_included: [],
      });
    }
    setErrors({});
  }, [unit, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleArrayToggle = (array, item) => {
    setFormData((prev) => ({
      ...prev,
      [array]: prev[array].includes(item)
        ? prev[array].filter((a) => a !== item)
        : [...prev[array], item],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.unit_number.trim()) {
      newErrors.unit_number = "Unit number is required";
    }

    if (!formData.rent_amount || formData.rent_amount <= 0) {
      newErrors.rent_amount = "Valid rent amount is required";
    }

    if (formData.bedrooms && formData.bedrooms < 0) {
      newErrors.bedrooms = "Bedrooms cannot be negative";
    }

    if (formData.bathrooms && formData.bathrooms < 0) {
      newErrors.bathrooms = "Bathrooms cannot be negative";
    }

    if (formData.size_sqft && formData.size_sqft <= 0) {
      newErrors.size_sqft = "Size must be greater than 0";
    }

    if (formData.security_deposit && formData.security_deposit < 0) {
      newErrors.security_deposit = "Security deposit cannot be negative";
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSave({
        ...formData,
        id: unit?.id || Date.now(),
        property_id: property?.id,
        rent_amount: parseFloat(formData.rent_amount),
        security_deposit: parseFloat(formData.security_deposit) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        size_sqft: parseInt(formData.size_sqft) || 0,
        floor_number: parseInt(formData.floor_number) || 1,
        created_at: unit?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      onClose();
    } catch (error) {
      console.error("Error saving unit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      unit_number: "",
      unit_type: "apartment",
      bedrooms: "",
      bathrooms: "",
      size_sqft: "",
      rent_amount: "",
      security_deposit: "",
      status: "available",
      floor_number: "",
      description: "",
      amenities: [],
      utilities_included: [],
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
                        <TbHome className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {isEditing ? "Edit Unit" : "Add New Unit"}
                        <TbSparkles className="w-5 h-5 text-yellow-300" />
                      </h2>
                      <p className="text-white/80 text-sm mt-1">
                        {property?.name && `Property: ${property.name}`}
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
                  {/* Basic Information */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbBuilding className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Basic Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit Number *
                        </label>
                        <input
                          type="text"
                          name="unit_number"
                          value={formData.unit_number}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.unit_number
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          } focus:ring-4 focus:outline-none`}
                          placeholder="e.g., A101"
                          disabled={isSubmitting}
                        />
                        {errors.unit_number && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.unit_number}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit Type
                        </label>
                        <select
                          name="unit_type"
                          value={formData.unit_type}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          disabled={isSubmitting}
                        >
                          {unitTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
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
                          {unitStatuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Unit Details */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbRuler className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Unit Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bedrooms
                        </label>
                        <div className="relative">
                          <TbBed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleInputChange}
                            min="0"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                              errors.bedrooms
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                            } focus:ring-4 focus:outline-none`}
                            placeholder="0"
                            disabled={isSubmitting}
                          />
                        </div>
                        {errors.bedrooms && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.bedrooms}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bathrooms
                        </label>
                        <div className="relative">
                          <TbBath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleInputChange}
                            min="0"
                            step="0.5"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                              errors.bathrooms
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                            } focus:ring-4 focus:outline-none`}
                            placeholder="0"
                            disabled={isSubmitting}
                          />
                        </div>
                        {errors.bathrooms && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.bathrooms}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Size (sq ft)
                        </label>
                        <input
                          type="number"
                          name="size_sqft"
                          value={formData.size_sqft}
                          onChange={handleInputChange}
                          min="0"
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.size_sqft
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          } focus:ring-4 focus:outline-none`}
                          placeholder="1000"
                          disabled={isSubmitting}
                        />
                        {errors.size_sqft && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.size_sqft}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Floor Number
                        </label>
                        <input
                          type="number"
                          name="floor_number"
                          value={formData.floor_number}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="1"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbCurrencyDollar className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Pricing
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Rent *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            KSh
                          </span>
                          <input
                            type="number"
                            name="rent_amount"
                            value={formData.rent_amount}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                              errors.rent_amount
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                            } focus:ring-4 focus:outline-none`}
                            placeholder="25000"
                            disabled={isSubmitting}
                          />
                        </div>
                        {errors.rent_amount && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.rent_amount}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Security Deposit
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
                            min="0"
                            step="0.01"
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                              errors.security_deposit
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                            } focus:ring-4 focus:outline-none`}
                            placeholder="50000"
                            disabled={isSubmitting}
                          />
                        </div>
                        {errors.security_deposit && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.security_deposit}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbStar className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Description
                      </h3>
                    </div>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm resize-none"
                      placeholder="Describe the unit's features, location within the property, and any special characteristics..."
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Amenities */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbStar className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Amenities
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {amenitiesList.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() =>
                              handleArrayToggle("amenities", amenity)
                            }
                            className="w-4 h-4 text-primary-plot bg-white/70 border-gray-300 rounded focus:ring-primary-plot focus:ring-2"
                            disabled={isSubmitting}
                          />
                          <span className="text-sm text-gray-700">
                            {amenity}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Utilities Included */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbHome className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Utilities Included
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {utilitiesList.map((utility) => (
                        <label
                          key={utility}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.utilities_included.includes(
                              utility
                            )}
                            onChange={() =>
                              handleArrayToggle("utilities_included", utility)
                            }
                            className="w-4 h-4 text-primary-plot bg-white/70 border-gray-300 rounded focus:ring-primary-plot focus:ring-2"
                            disabled={isSubmitting}
                          />
                          <span className="text-sm text-gray-700">
                            {utility}
                          </span>
                        </label>
                      ))}
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
                          {isEditing ? "Update Unit" : "Create Unit"}
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

export default UnitModal;
