import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TbX,
  TbHome,
  TbBed,
  TbBath,
  TbRuler,
  TbCurrencyDollar,
  TbEdit,
  TbPlus,
  TbAlertCircle,
  TbCheck,
  TbLoader2,
  TbBuilding,
  TbStar,
  TbHomePlus,
  TbFileDescription,
} from "react-icons/tb";
import unitService from "../../services/unitService";

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
    {
      value: "available",
      label: "Available",
      color: "text-green-600 bg-green-50 border-green-200",
    },
    {
      value: "occupied",
      label: "Occupied",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      value: "maintenance",
      label: "Under Maintenance",
      color: "text-orange-600 bg-orange-50 border-orange-200",
    },
    {
      value: "unavailable",
      label: "Unavailable",
      color: "text-red-600 bg-red-50 border-red-200",
    },
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
      // Prepare unit data with proper type conversion
      const unitData = {
        ...formData,
        property_id: property?.id,
        rent_amount: parseFloat(formData.rent_amount),
        security_deposit: parseFloat(formData.security_deposit) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        size_sqft: parseInt(formData.size_sqft) || 0,
        floor_number: parseInt(formData.floor_number) || 1,
      };

      let response;
      if (isEditing) {
        // Update existing unit
        response = await unitService.updateUnit(unit.id, unitData);
      } else {
        // Create new unit
        response = await unitService.createUnit(unitData);
      }

      if (response.success) {
        // Pass the unit data from the API response
        onSave(
          response.unit ||
            response.data?.unit || {
              ...unitData,
              id: unit?.id || Date.now(),
              created_at: unit?.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
        );
        onClose();
      } else {
        setErrors({ general: response.message || "Failed to save unit" });
      }
    } catch (error) {
      console.error("Error saving unit:", error);
      setErrors({
        general: error.message || "An error occurred while saving the unit",
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
              <TbHomePlus size={40} className="text-white mr-3" />
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {isEditing ? "Edit Unit" : "Add New Unit"}
                </h2>
                <p className="text-white/80 text-sm">
                  {property?.name && `Property: ${property.name}`}
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
              {/* Basic Information */}
              <div>
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbBuilding size={20} className="mr-2 text-secondary-plot" />
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="unit_number"
                        value={formData.unit_number}
                        onChange={handleInputChange}
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border ${
                          errors.unit_number
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="e.g., A101"
                        disabled={isSubmitting}
                      />
                      {errors.unit_number && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" />{" "}
                          {errors.unit_number}
                        </div>
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
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
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
                        Floor Number
                      </label>
                      <input
                        type="number"
                        name="floor_number"
                        value={formData.floor_number}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                        placeholder="1"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Description
                    </label>
                    <div className="relative">
                      <TbFileDescription className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                        placeholder="Describe the unit's features, location within the property, and any special characteristics..."
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Unit Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbRuler size={20} className="mr-2 text-secondary-plot" />
                  Unit Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <div className="relative">
                      <TbBed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        min="0"
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.bedrooms
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="0"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.bedrooms && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" /> {errors.bedrooms}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <div className="relative">
                      <TbBath className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        min="0"
                        step="0.5"
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.bathrooms
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="0"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.bathrooms && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" /> {errors.bathrooms}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size (sq ft)
                    </label>
                    <div className="relative">
                      <TbRuler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        name="size_sqft"
                        value={formData.size_sqft}
                        onChange={handleInputChange}
                        min="0"
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.size_sqft
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="1000"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.size_sqft && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" /> {errors.size_sqft}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbCurrencyDollar
                    size={20}
                    className="mr-2 text-secondary-plot"
                  />
                  Pricing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Rent <span className="text-red-500">*</span>
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
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-12 pr-4 py-2.5 rounded-lg border ${
                          errors.rent_amount
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="25000"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.rent_amount && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" /> {errors.rent_amount}
                      </div>
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
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-12 pr-4 py-2.5 rounded-lg border ${
                          errors.security_deposit
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="50000"
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
              </div>

              {/* Unit Status */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbStar size={20} className="mr-2 text-secondary-plot" />
                  Unit Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {unitStatuses.map((status) => (
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

              {/* Amenities */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbStar size={20} className="mr-2 text-secondary-plot" />
                  Unit Amenities
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenitiesList.map((amenity) => (
                    <label
                      key={amenity}
                      className="relative flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 border-gray-200 bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleArrayToggle("amenities", amenity)}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <div
                        className={`flex items-center justify-center w-4 h-4 border-2 rounded-full mr-3 ${
                          formData.amenities.includes(amenity)
                            ? "border-secondary-plot bg-secondary-plot"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.amenities.includes(amenity) && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Utilities Included */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbHome size={20} className="mr-2 text-secondary-plot" />
                  Utilities Included
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {utilitiesList.map((utility) => (
                    <label
                      key={utility}
                      className="relative flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 border-gray-200 bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={formData.utilities_included.includes(utility)}
                        onChange={() =>
                          handleArrayToggle("utilities_included", utility)
                        }
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <div
                        className={`flex items-center justify-center w-4 h-4 border-2 rounded-full mr-3 ${
                          formData.utilities_included.includes(utility)
                            ? "border-secondary-plot bg-secondary-plot"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.utilities_included.includes(utility) && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">{utility}</span>
                    </label>
                  ))}
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
                    {isEditing ? "Update Unit" : "Create Unit"}
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

export default UnitModal;
