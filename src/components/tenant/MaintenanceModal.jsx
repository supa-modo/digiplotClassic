import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUnitById, getPropertyById } from "../../utils/demoData";
import {
  TbX,
  TbCamera,
  TbUpload,
  TbAlertTriangle,
  TbInfoCircle,
  TbCheck,
  TbLoader2,
  TbTrash,
  TbPhoto,
} from "react-icons/tb";

const MaintenanceModal = ({ isOpen, onClose, onRequestSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    location: "",
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Get user's unit and property info
  const unit = user?.unit_id ? getUnitById(user.unit_id) : null;
  const property = unit ? getPropertyById(unit.property_id) : null;

  const categories = [
    { value: "plumbing", label: "Plumbing", icon: "🔧" },
    { value: "electrical", label: "Electrical", icon: "⚡" },
    { value: "hvac", label: "Heating/Cooling", icon: "🌡️" },
    { value: "appliances", label: "Appliances", icon: "🏠" },
    { value: "security", label: "Security", icon: "🔒" },
    { value: "structural", label: "Structural", icon: "🏗️" },
    { value: "cleaning", label: "Cleaning", icon: "🧹" },
    { value: "pest_control", label: "Pest Control", icon: "🐛" },
    { value: "other", label: "Other", icon: "📝" },
  ];

  const priorities = [
    {
      value: "low",
      label: "Low Priority",
      description: "Non-urgent, can wait a few days",
      color: "text-green-600 bg-green-50 border-green-200",
    },
    {
      value: "medium",
      label: "Medium Priority",
      description: "Should be addressed within 2-3 days",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    },
    {
      value: "high",
      label: "High Priority",
      description: "Urgent, affects daily living",
      color: "text-orange-600 bg-orange-50 border-orange-200",
    },
    {
      value: "emergency",
      label: "Emergency",
      description: "Immediate attention required",
      color: "text-red-600 bg-red-50 border-red-200",
    },
  ];

  const locations = [
    "Living Room",
    "Kitchen",
    "Bedroom 1",
    "Bedroom 2",
    "Bedroom 3",
    "Bathroom",
    "Guest Bathroom",
    "Balcony",
    "Terrace",
    "Parking Area",
    "Storage Room",
    "Utility Room",
    "Entrance",
    "Exterior",
    "Other",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const isValid =
        file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValid;
    });

    if (validFiles.length !== fileArray.length) {
      alert(
        "Some files were skipped. Please ensure all files are images under 5MB."
      );
    }

    const newImages = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setUploadedImages((prev) => [...prev, ...newImages].slice(0, 5)); // Max 5 images
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages((prev) => {
      const updated = prev.filter((img) => img.id !== imageId);
      // Clean up URL object
      const removed = prev.find((img) => img.id === imageId);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Please enter a title for your maintenance request.");
      return false;
    }
    if (!formData.description.trim()) {
      alert("Please provide a description of the issue.");
      return false;
    }
    if (!formData.category) {
      alert("Please select a category for your request.");
      return false;
    }
    if (!formData.location.trim()) {
      alert("Please specify the location of the issue.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success (95% success rate)
      const success = Math.random() > 0.05;

      if (success) {
        const requestId = `MR${Date.now()}${Math.random()
          .toString(36)
          .substring(2, 6)
          .toUpperCase()}`;

        setSubmitStatus({
          success: true,
          message: "Maintenance request submitted successfully!",
          requestId,
        });

        // Call success callback
        setTimeout(() => {
          onRequestSuccess({
            id: requestId,
            ...formData,
            images: uploadedImages.length,
            status: "pending",
            createdAt: new Date().toISOString(),
          });
          resetForm();
          onClose();
        }, 2000);
      } else {
        setSubmitStatus({
          success: false,
          message: "Failed to submit request. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      location: "",
    });
    setUploadedImages([]);
    setSubmitStatus(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-secondary-plot">
            New Maintenance Request
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <TbX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Property Info */}
          {property && unit && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Request for:</h3>
              <div className="text-sm text-blue-700">
                <p>
                  <span className="font-medium">Property:</span> {property.name}
                </p>
                <p>
                  <span className="font-medium">Unit:</span> {unit.name}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {property.address}
                </p>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Brief description of the issue (e.g., Leaking kitchen faucet)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleInputChange("category", category.value)}
                  className={`
                    p-3 border rounded-lg text-sm font-medium transition-all text-center
                    ${
                      formData.category === category.value
                        ? "border-primary-plot bg-primary-plot/5 text-primary-plot"
                        : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="text-lg mb-1">{category.icon}</div>
                  <div>{category.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level *
            </label>
            <div className="space-y-2">
              {priorities.map((priority) => (
                <label
                  key={priority.value}
                  className={`
                    flex items-start p-3 border rounded-lg cursor-pointer transition-all
                    ${
                      formData.priority === priority.value
                        ? `border-primary-plot bg-primary-plot/5`
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`
                    px-2 py-1 rounded-full text-xs font-medium border mr-3 mt-0.5
                    ${priority.color}
                  `}
                  >
                    {priority.label}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {priority.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {priority.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
            >
              <option value="">Select location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Please provide a detailed description of the issue, including when it started, how often it occurs, and any other relevant information..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (Optional)
            </label>
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center transition-colors
                ${
                  dragActive
                    ? "border-primary-plot bg-primary-plot/5"
                    : "border-gray-300 hover:border-gray-400"
                }
              `}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <TbCamera className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-600 mb-2">
                Drag and drop photos here, or{" "}
                <label className="text-primary-plot hover:text-primary-plot/80 cursor-pointer font-medium">
                  browse files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="sr-only"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">
                Upload up to 5 images (max 5MB each). JPG, PNG, GIF supported.
              </p>
            </div>

            {/* Uploaded Images */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Uploaded Images ({uploadedImages.length}/5)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TbTrash size={12} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                        {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Status */}
          {submitStatus && (
            <div
              className={`
              p-4 rounded-lg border
              ${
                submitStatus.success
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }
            `}
            >
              <div className="flex items-center">
                {submitStatus.success ? (
                  <TbCheck className="mr-2" size={20} />
                ) : (
                  <TbAlertTriangle className="mr-2" size={20} />
                )}
                <span className="font-medium">{submitStatus.message}</span>
              </div>
              {submitStatus.success && submitStatus.requestId && (
                <p className="text-sm mt-2">
                  Request ID: {submitStatus.requestId}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || submitStatus?.success}
              className="flex-1 bg-primary-plot text-white px-4 py-2 rounded-lg hover:bg-primary-plot/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <TbLoader2 className="animate-spin mr-2" size={20} />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModal;
