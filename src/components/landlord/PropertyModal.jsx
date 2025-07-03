import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbX,
  TbBuilding,
  TbMapPin,
  TbPhone,
  TbMail,
  TbUser,
  TbEdit,
  TbPlus,
  TbSparkles,
  TbAlertTriangle,
  TbCheck,
  TbLoader2,
  TbHome,
  TbCalendar,
  TbParkingCircle,
  TbStar,
  TbPhoto,
} from "react-icons/tb";
import propertyService from "../../services/propertyService";
import FileUpload from "../common/FileUpload";

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
    image_urls: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const isEditing = !!property;

  const propertyTypes = [
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "mixed", label: "Mixed Use" },
    { value: "industrial", label: "Industrial" },
  ];

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
        image_urls: property.image_urls || [],
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
        image_urls: [],
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

  const handleImagesChange = (files) => {
    setUploadedImages(files);
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
      let response;
      if (isEditing) {
        // Update existing property
        response = await propertyService.updateProperty(property.id, formData);
      } else {
        // Create new property
        response = await propertyService.createProperty(formData);
      }

      if (response.success) {
        // Handle image uploads if there are any
        if (uploadedImages.length > 0) {
          try {
            const propertyId =
              response.property?.id || response.data?.property?.id;
            if (propertyId) {
              const imageFormData = new FormData();
              uploadedImages.forEach((imageFile) => {
                imageFormData.append("images", imageFile.file);
              });

              await propertyService.uploadImages(propertyId, imageFormData);
            }
          } catch (uploadError) {
            console.warn(
              "Property created but image upload failed:",
              uploadError
            );
          }
        }

        // Pass the property data from the API response
        onSave(
          response.property ||
            response.data?.property || {
              ...formData,
              id: property?.id || Date.now(),
              created_at: property?.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
        );
        onClose();
      } else {
        setErrors({ general: response.message || "Failed to save property" });
      }
    } catch (error) {
      console.error("Error saving property:", error);
      setErrors({
        general: error.message || "An error occurred while saving the property",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
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
      image_urls: [],
    });
    setErrors({});
    setUploadedImages([]);
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
                        <TbBuilding className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {isEditing ? "Edit Property" : "Add New Property"}
                        <TbSparkles className="w-5 h-5 text-yellow-300" />
                      </h2>
                      <p className="text-white/80 text-sm mt-1">
                        {isEditing
                          ? "Update property information and details"
                          : "Create a new property in your portfolio"}
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
                        <TbHome className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Basic Information
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.name
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          } focus:ring-4 focus:outline-none`}
                          placeholder="e.g., Sunset Gardens Apartments"
                          disabled={isSubmitting}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Property Type
                          </label>
                          <select
                            name="property_type"
                            value={formData.property_type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                            disabled={isSubmitting}
                          >
                            {propertyTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Year Built
                          </label>
                          <div className="relative">
                            <TbCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="number"
                              name="year_built"
                              value={formData.year_built}
                              onChange={handleInputChange}
                              min="1800"
                              max={new Date().getFullYear()}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                                errors.year_built
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                  : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                              } focus:ring-4 focus:outline-none`}
                              placeholder="2020"
                              disabled={isSubmitting}
                            />
                          </div>
                          {errors.year_built && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                              <TbAlertTriangle className="w-4 h-4" />
                              {errors.year_built}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Floors
                          </label>
                          <input
                            type="number"
                            name="total_floors"
                            value={formData.total_floors}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                            placeholder="5"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parking Spaces
                          </label>
                          <div className="relative">
                            <TbParkingCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="number"
                              name="parking_spaces"
                              value={formData.parking_spaces}
                              onChange={handleInputChange}
                              min="0"
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                              placeholder="20"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbMapPin className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Location
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.address
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          } focus:ring-4 focus:outline-none`}
                          placeholder="123 Main Street, Kilimani"
                          disabled={isSubmitting}
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                              errors.city
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                            } focus:ring-4 focus:outline-none`}
                            placeholder="Nairobi"
                            disabled={isSubmitting}
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                              <TbAlertTriangle className="w-4 h-4" />
                              {errors.city}
                            </p>
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                            placeholder="Nairobi County"
                            disabled={isSubmitting}
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                            placeholder="00100"
                            disabled={isSubmitting}
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                            placeholder="Kenya"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbPhone className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Contact Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="contact_phone"
                          value={formData.contact_phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="+254 712 345 678"
                          disabled={isSubmitting}
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
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.contact_email
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          } focus:ring-4 focus:outline-none`}
                          placeholder="contact@property.com"
                          disabled={isSubmitting}
                        />
                        {errors.contact_email && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.contact_email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Property Manager */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbUser className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Property Manager (Optional)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Manager Name
                        </label>
                        <input
                          type="text"
                          name="manager_name"
                          value={formData.manager_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="John Doe"
                          disabled={isSubmitting}
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
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20 focus:ring-4 focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="+254 712 345 678"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Manager Email
                        </label>
                        <input
                          type="email"
                          name="manager_email"
                          value={formData.manager_email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                            errors.manager_email
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                              : "border-gray-200 focus:border-primary-plot focus:ring-primary-plot/20"
                          } focus:ring-4 focus:outline-none`}
                          placeholder="manager@property.com"
                          disabled={isSubmitting}
                        />
                        {errors.manager_email && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <TbAlertTriangle className="w-4 h-4" />
                            {errors.manager_email}
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
                      placeholder="Describe the property's features, location advantages, and unique characteristics..."
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Property Images */}
                  <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-plot to-secondary-plot rounded-lg flex items-center justify-center">
                        <TbPhoto className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Property Images
                      </h3>
                    </div>

                    <FileUpload
                      onFilesChange={handleImagesChange}
                      acceptedTypes="image/*"
                      maxFiles={8}
                      maxFileSize={10}
                      allowedFormats={["JPG", "JPEG", "PNG", "WEBP", "GIF"]}
                      uploadType="images"
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
                        Property Amenities
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
                            onChange={() => handleAmenityToggle(amenity)}
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
                          {isEditing ? "Update Property" : "Create Property"}
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

export default PropertyModal;
