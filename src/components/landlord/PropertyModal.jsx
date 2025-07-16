import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TbX,
  TbBuilding,
  TbMapPin,
  TbPhone,
  TbMail,
  TbUser,
  TbEdit,
  TbPlus,
  TbAlertCircle,
  TbCheck,
  TbLoader2,
  TbHome,
  TbCalendar,
  TbParkingCircle,
  TbStar,
  TbPhoto,
  TbBuildingPlus,
  TbWorld,
  TbFileDescription,
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
              <TbBuildingPlus size={40} className="text-white mr-3" />
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {isEditing ? "Edit Property" : "Add New Property"}
                </h2>
                <p className="text-white/80 text-sm">
                  {isEditing
                    ? "Update property information and details"
                    : "Create a new property in your portfolio"}
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
                  <TbHome size={20} className="mr-2 text-secondary-plot" />
                  Basic Information
                </h3>

                <div className="space-y-4">
                  {/* Property Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border ${
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                      placeholder="e.g., Sunset Gardens Apartments"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" /> {errors.name}
                      </div>
                    )}
                  </div>

                  {/* Property Type and Year Built */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                      </label>
                      <select
                        name="property_type"
                        value={formData.property_type}
                        onChange={handleInputChange}
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
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
                        <TbCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="year_built"
                          value={formData.year_built}
                          onChange={handleInputChange}
                          min="1800"
                          max={new Date().getFullYear()}
                          className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                            errors.year_built
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                          placeholder="2020"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.year_built && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" /> {errors.year_built}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total Floors and Parking */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                        placeholder="5"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parking Spaces
                      </label>
                      <div className="relative">
                        <TbParkingCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="parking_spaces"
                          value={formData.parking_spaces}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                          placeholder="20"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Description
                    </label>
                    <div className="relative">
                      <TbFileDescription className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                        placeholder="Describe the property's features, location advantages, and unique characteristics..."
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbMapPin size={20} className="mr-2 text-secondary-plot" />
                  Location Information
                </h3>

                <div className="space-y-4">
                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border ${
                        errors.address
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                      placeholder="123 Main Street, Kilimani"
                      disabled={isSubmitting}
                    />
                    {errors.address && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" /> {errors.address}
                      </div>
                    )}
                  </div>

                  {/* City, State, Postal Code, Country */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border ${
                          errors.city
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="Nairobi"
                        disabled={isSubmitting}
                      />
                      {errors.city && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <TbAlertCircle className="mr-1" /> {errors.city}
                        </div>
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
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
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
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
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
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                        placeholder="Kenya"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbMail size={20} className="mr-2 text-secondary-plot" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <TbPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleInputChange}
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                        placeholder="+254 712 345 678"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <div className="relative">
                      <TbMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.contact_email
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="contact@property.com"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.contact_email && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" />{" "}
                        {errors.contact_email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Manager */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbUser size={20} className="mr-2 text-secondary-plot" />
                  Property Manager (Optional)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager Name
                    </label>
                    <input
                      type="text"
                      name="manager_name"
                      value={formData.manager_name}
                      onChange={handleInputChange}
                      className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager Phone
                    </label>
                    <div className="relative">
                      <TbPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="manager_phone"
                        value={formData.manager_phone}
                        onChange={handleInputChange}
                        className="w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors"
                        placeholder="+254 712 345 678"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager Email
                    </label>
                    <div className="relative">
                      <TbMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="manager_email"
                        value={formData.manager_email}
                        onChange={handleInputChange}
                        className={`w-full text-[0.93rem] bg-neutral-100 text-neutral-900 pl-10 pr-4 py-2.5 rounded-lg border ${
                          errors.manager_email
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-1 focus:outline-none focus:ring-secondary-plot focus:border-secondary-plot transition-colors`}
                        placeholder="manager@property.com"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.manager_email && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <TbAlertCircle className="mr-1" />{" "}
                        {errors.manager_email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Images */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbPhoto size={20} className="mr-2 text-secondary-plot" />
                  Property Images
                </h3>

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
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-neutral-700 mb-4 flex items-center">
                  <TbStar size={20} className="mr-2 text-secondary-plot" />
                  Property Amenities
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
                        onChange={() => handleAmenityToggle(amenity)}
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
                    {isEditing ? "Update Property" : "Create Property"}
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

export default PropertyModal;
