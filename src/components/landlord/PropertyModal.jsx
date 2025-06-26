import { useState, useEffect } from "react";
import {
  TbX,
  TbBuilding,
  TbMapPin,
  TbPhone,
  TbMail,
  TbUser,
} from "react-icons/tb";

const PropertyModal = ({ isOpen, onClose, onSave, property }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Kenya",
    description: "",
    property_type: "residential",
    year_built: "",
    total_floors: "",
    parking_spaces: "",
    amenities: [],
    contact_phone: "",
    contact_email: "",
    manager_name: "",
    manager_phone: "",
    manager_email: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amenitiesList = [
    "WiFi",
    "Parking",
    "Security",
    "Swimming Pool",
    "Gym",
    "Elevator",
    "Laundry",
    "Garden",
    "Balcony",
    "Air Conditioning",
    "Heating",
    "Generator",
    "CCTV",
    "Intercom",
    "Playground",
  ];

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || "",
        address: property.address || "",
        city: property.city || "",
        state: property.state || "",
        postal_code: property.postal_code || "",
        country: property.country || "Kenya",
        description: property.description || "",
        property_type: property.property_type || "residential",
        year_built: property.year_built || "",
        total_floors: property.total_floors || "",
        parking_spaces: property.parking_spaces || "",
        amenities: property.amenities || [],
        contact_phone: property.contact_phone || "",
        contact_email: property.contact_email || "",
        manager_name: property.manager_name || "",
        manager_phone: property.manager_phone || "",
        manager_email: property.manager_email || "",
      });
    } else {
      // Reset form for new property
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "Kenya",
        description: "",
        property_type: "residential",
        year_built: "",
        total_floors: "",
        parking_spaces: "",
        amenities: [],
        contact_phone: "",
        contact_email: "",
        manager_name: "",
        manager_phone: "",
        manager_email: "",
      });
    }
    setErrors({});
  }, [property, isOpen]);

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

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Property name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (
      formData.contact_email &&
      !/\S+@\S+\.\S+/.test(formData.contact_email)
    ) {
      newErrors.contact_email = "Please enter a valid email address";
    }

    if (
      formData.manager_email &&
      !/\S+@\S+\.\S+/.test(formData.manager_email)
    ) {
      newErrors.manager_email = "Please enter a valid email address";
    }

    if (
      formData.year_built &&
      (formData.year_built < 1800 ||
        formData.year_built > new Date().getFullYear())
    ) {
      newErrors.year_built = "Please enter a valid year";
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
        id: property?.id || Date.now(),
        created_at: property?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      onClose();
    } catch (error) {
      console.error("Error saving property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-plot/10 rounded-lg">
              <TbBuilding className="h-6 w-6 text-primary-plot" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {property ? "Edit Property" : "Add New Property"}
              </h2>
              <p className="text-sm text-gray-600">
                {property
                  ? "Update property information"
                  : "Enter property details below"}
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
                    Property Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter property name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed">Mixed Use</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.address ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter full address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.city ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/County
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                    placeholder="Enter state or county"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                    placeholder="Enter postal code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <input
                    type="number"
                    name="year_built"
                    value={formData.year_built}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.year_built ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="e.g. 2020"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                  {errors.year_built && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.year_built}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    name="total_floors"
                    value={formData.total_floors}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                    placeholder="e.g. 3"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Spaces
                  </label>
                  <input
                    type="number"
                    name="parking_spaces"
                    value={formData.parking_spaces}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                    placeholder="e.g. 10"
                    min="0"
                  />
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
                  placeholder="Enter property description..."
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300 text-primary-plot focus:ring-primary-plot"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                    placeholder="e.g. +254 700 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.contact_email
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="contact@property.com"
                  />
                  {errors.contact_email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contact_email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    name="manager_name"
                    value={formData.manager_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                    placeholder="Property manager name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Phone
                  </label>
                  <input
                    type="tel"
                    name="manager_phone"
                    value={formData.manager_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                    placeholder="Manager phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Email
                  </label>
                  <input
                    type="email"
                    name="manager_email"
                    value={formData.manager_email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent ${
                      errors.manager_email
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="manager@property.com"
                  />
                  {errors.manager_email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.manager_email}
                    </p>
                  )}
                </div>
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
                : property
                ? "Update Property"
                : "Create Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyModal;
