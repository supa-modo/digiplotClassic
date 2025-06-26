import { useState, useEffect } from "react";
import {
  TbX,
  TbHome,
  TbBed,
  TbBath,
  TbRuler,
  TbCurrencyDollar,
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
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "maintenance", label: "Under Maintenance" },
    { value: "unavailable", label: "Unavailable" },
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-plot/10 rounded-lg">
              <TbHome className="h-6 w-6 text-primary-plot" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {unit ? "Edit Unit" : "Add New Unit"}
              </h2>
              <p className="text-sm text-gray-600">
                Property: {property?.name || "Unknown Property"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <TbX className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Number *
                  </label>
                  <input
                    type="text"
                    name="unit_number"
                    value={formData.unit_number}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.unit_number ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="e.g. 1A, 201, Ground Floor"
                  />
                  {errors.unit_number && (
                    <p className="text-red-500 text-xs mt-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                  >
                    {unitStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                    placeholder="e.g. 1, 2, 3"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Unit Specifications */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Unit Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TbBed className="inline mr-1" size={16} />
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.bedrooms ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.bedrooms && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.bedrooms}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TbBath className="inline mr-1" size={16} />
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.bathrooms ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="1"
                    min="0"
                    step="0.5"
                  />
                  {errors.bathrooms && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.bathrooms}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TbRuler className="inline mr-1" size={16} />
                    Size (sq ft)
                  </label>
                  <input
                    type="number"
                    name="size_sqft"
                    value={formData.size_sqft}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.size_sqft ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="e.g. 800"
                    min="1"
                  />
                  {errors.size_sqft && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.size_sqft}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                  placeholder="Describe the unit features, condition, etc."
                />
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TbCurrencyDollar className="inline mr-1" size={16} />
                    Monthly Rent (KSh) *
                  </label>
                  <input
                    type="number"
                    name="rent_amount"
                    value={formData.rent_amount}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.rent_amount ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="e.g. 25000"
                    min="1"
                  />
                  {errors.rent_amount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.rent_amount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit (KSh)
                  </label>
                  <input
                    type="number"
                    name="security_deposit"
                    value={formData.security_deposit}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.security_deposit
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g. 50000"
                    min="0"
                  />
                  {errors.security_deposit && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.security_deposit}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Unit Amenities */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Unit Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleArrayToggle("amenities", amenity)}
                      className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Utilities Included */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Utilities Included
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {utilitiesList.map((utility) => (
                  <label
                    key={utility}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.utilities_included.includes(utility)}
                      onChange={() =>
                        handleArrayToggle("utilities_included", utility)
                      }
                      className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot"
                    />
                    <span className="text-sm text-gray-700">{utility}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-plot text-white rounded-lg hover:bg-primary-plot/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : unit
                ? "Update Unit"
                : "Create Unit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitModal;
