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
  TbTool,
  TbSparkles,
  TbHomeDot,
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
      color:
        "text-green-700 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
    },
    {
      value: "medium",
      label: "Medium Priority",
      description: "Should be addressed within 2-3 days",
      color:
        "text-yellow-700 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200",
    },
    {
      value: "high",
      label: "High Priority",
      description: "Urgent, affects daily living",
      color:
        "text-orange-700 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200",
    },
    {
      value: "emergency",
      label: "Emergency",
      description: "Immediate attention required",
      color:
        "text-red-700 bg-gradient-to-br from-red-50 to-pink-50 border-red-200",
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-100">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary-plot/5 blur-xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-secondary-plot/5 blur-xl pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-primary-plot/5 to-secondary-plot/5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-primary-plot/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm">
              <TbTool className="h-6 w-6 text-primary-plot" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-plot">
                New Maintenance Request
              </h2>
              <p className="text-sm text-gray-500">
                Report an issue that needs attention
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <TbX size={24} />
          </button>
        </div>

        <div className="relative z-10 p-6 space-y-6">
          {/* Property Info - Enhanced */}
          {property && unit && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-5 -mt-5 blur-lg"></div>

              <div className="relative z-10 flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TbHomeDot className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-blue-800">Request Details</h3>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-blue-700">Property:</span>
                  <p className="text-blue-600 mt-1">{property.name}</p>
                </div>
                <div>
                  <span className="font-semibold text-blue-700">Unit:</span>
                  <p className="text-blue-600 mt-1">{unit.name}</p>
                </div>
                <div>
                  <span className="font-semibold text-blue-700">Address:</span>
                  <p className="text-blue-600 mt-1">{property.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Title - Enhanced */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Issue Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Brief description of the issue (e.g., Leaking kitchen faucet)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 font-semibold placeholder-gray-400 transition-all duration-200"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-2 flex justify-between">
              <span>Keep it short and descriptive</span>
              <span>{formData.title.length}/100 characters</span>
            </p>
          </div>

          {/* Category - Enhanced */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Category *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleInputChange("category", category.value)}
                  className={`
                    p-4 border-2 rounded-xl text-sm font-semibold transition-all text-center hover:scale-105 transform
                    ${
                      formData.category === category.value
                        ? "border-primary-plot bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 text-primary-plot shadow-lg"
                        : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div>{category.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority - Enhanced */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Priority Level *
            </label>
            <div className="space-y-3">
              {priorities.map((priority) => (
                <label
                  key={priority.value}
                  className={`
                    flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 transform
                    ${
                      formData.priority === priority.value
                        ? `border-primary-plot bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 shadow-lg`
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
                    px-3 py-2 rounded-full text-xs font-bold border-2 mr-4 mt-0.5
                    ${priority.color}
                  `}
                  >
                    {priority.label}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {priority.label}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {priority.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Location - Enhanced */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Location *
            </label>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 font-semibold"
            >
              <option value="">
                Select location where the issue is occurring
              </option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Description - Enhanced */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Please provide a detailed description of the issue, including when it started, how often it occurs, and any other relevant information..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent bg-gray-50 font-semibold placeholder-gray-400 resize-none transition-all duration-200"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-2 flex justify-between">
              <span>
                Be as specific as possible to help us understand the issue
              </span>
              <span>{formData.description.length}/500 characters</span>
            </p>
          </div>

          {/* Photo Upload - Enhanced */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Photos (Optional)
            </label>
            <div
              className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                ${
                  dragActive
                    ? "border-primary-plot bg-gradient-to-br from-primary-plot/5 to-secondary-plot/5 scale-105"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }
              `}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="p-4 bg-gray-100 rounded-2xl inline-flex mb-4">
                <TbCamera className="text-gray-400" size={48} />
              </div>
              <p className="text-gray-600 mb-2 font-semibold">
                Drag and drop photos here, or{" "}
                <label className="text-primary-plot hover:text-primary-plot/80 cursor-pointer font-bold underline">
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

            {/* Uploaded Images - Enhanced */}
            {uploadedImages.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                  <TbPhoto className="mr-2" />
                  Uploaded Images ({uploadedImages.length}/5)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 group-hover:border-gray-300 transition-all duration-200"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 transform hover:scale-110"
                      >
                        <TbTrash size={14} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-3 rounded-b-xl">
                        <span className="font-semibold truncate block">
                          {image.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Status - Enhanced */}
          {submitStatus && (
            <div
              className={`
              p-6 rounded-xl border-2 relative overflow-hidden
              ${
                submitStatus.success
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                  : "bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
              }
            `}
            >
              <div
                className={`absolute top-0 right-0 w-20 h-20 rounded-full -mr-5 -mt-5 blur-lg ${
                  submitStatus.success ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              ></div>

              <div className="relative z-10 flex items-center space-x-3">
                <div
                  className={`p-3 rounded-xl ${
                    submitStatus.success ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {submitStatus.success ? (
                    <TbCheck className="text-green-600" size={20} />
                  ) : (
                    <TbAlertTriangle className="text-red-600" size={20} />
                  )}
                </div>
                <div>
                  <span
                    className={`font-bold ${
                      submitStatus.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {submitStatus.message}
                  </span>
                  {submitStatus.success && submitStatus.requestId && (
                    <p className="text-sm text-green-700 mt-1 font-medium">
                      Request ID: {submitStatus.requestId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Enhanced */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-bold shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || submitStatus?.success}
              className="flex-1 bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-4 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold flex items-center justify-center space-x-2 transform hover:scale-105 disabled:transform-none shadow-lg"
            >
              {loading ? (
                <>
                  <TbLoader2 className="animate-spin" size={20} />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <TbTool size={20} />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModal;
