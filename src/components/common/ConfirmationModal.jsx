import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbAlertTriangle,
  TbX,
  TbTrash,
  TbShieldX,
  TbAlertCircle,
  TbCircleCheck,
  TbInfoCircle,
  TbEdit,
  TbBulb,
  TbExclamationMark,
} from "react-icons/tb";
import { FiCheckCircle } from "react-icons/fi";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  type = "confirm", // confirm, delete, edit, success, error, info, warning
  title,
  message,
  itemName,
  confirmButtonText,
  cancelButtonText = "Cancel",
  showCancel = true,
  isLoading = false,
  autoClose = false,
  autoCloseDelay = 3000,
}) => {
  const [isAutoClosing, setIsAutoClosing] = React.useState(false);

  // Auto close functionality for notifications
  React.useEffect(() => {
    if (isOpen && autoClose && (type === "success" || type === "info")) {
      setIsAutoClosing(true);
      const timer = setTimeout(() => {
        onClose();
        setIsAutoClosing(false);
      }, autoCloseDelay);

      return () => {
        clearTimeout(timer);
        setIsAutoClosing(false);
      };
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose, type]);

  const getTypeConfig = () => {
    const configs = {
      confirm: {
        icon: TbAlertCircle,
        iconColor: "text-blue-500",
        headerColor: "text-blue-600",
        primaryButtonColor: "bg-blue-600 hover:bg-blue-700",
        defaultTitle: "Confirm Action",
        defaultConfirmText: "Confirm",
      },
      delete: {
        icon: TbAlertTriangle,
        iconColor: "text-red-500",
        headerColor: "text-red-600",
        primaryButtonColor: "bg-red-600 hover:bg-red-700",
        defaultTitle: "Confirm Deletion",
        defaultConfirmText: "Delete",
      },
      edit: {
        icon: TbEdit,
        iconColor: "text-orange-500",
        headerColor: "text-orange-600",
        primaryButtonColor: "bg-orange-600 hover:bg-orange-700",
        defaultTitle: "Confirm Edit",
        defaultConfirmText: "Save Changes",
      },
      success: {
        icon: FiCheckCircle,
        iconColor: "text-green-500",
        headerColor: "text-green-600",
        primaryButtonColor: "bg-green-600 hover:bg-green-700",
        defaultTitle: "Success",
        defaultConfirmText: "OK",
      },
      error: {
        icon: TbShieldX,
        iconColor: "text-red-500",
        headerColor: "text-red-600",
        primaryButtonColor: "bg-red-600 hover:bg-red-700",
        defaultTitle: "Error",
        defaultConfirmText: "OK",
      },
      info: {
        icon: TbInfoCircle,
        iconColor: "text-blue-500",
        headerColor: "text-blue-600",
        primaryButtonColor: "bg-blue-600 hover:bg-blue-700",
        defaultTitle: "Information",
        defaultConfirmText: "OK",
      },
      warning: {
        icon: TbExclamationMark,
        iconColor: "text-yellow-500",
        headerColor: "text-yellow-600",
        primaryButtonColor: "bg-yellow-600 hover:bg-yellow-700",
        defaultTitle: "Warning",
        defaultConfirmText: "Proceed",
      },
    };

    return configs[type] || configs.confirm;
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  // For notification types, don't show cancel button by default
  const shouldShowCancel =
    showCancel && !["success", "error", "info"].includes(type);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case "delete":
        return (
          <>
            Are you sure you want to delete{" "}
            {itemName ? (
              <span className="font-medium text-gray-900">"{itemName}"</span>
            ) : (
              "this item"
            )}
            ?
          </>
        );
      case "edit":
        return (
          <>
            Are you sure you want to save changes to{" "}
            {itemName ? (
              <span className="font-medium text-gray-900">"{itemName}"</span>
            ) : (
              "this item"
            )}
            ?
          </>
        );
      case "success":
        return "Operation completed successfully!";
      case "error":
        return "An error occurred while processing your request.";
      case "info":
        return "Here is some important information for you.";
      case "warning":
        return "Please review this warning before proceeding.";
      default:
        return "Are you sure you want to proceed with this action?";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-3.5"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-3 md:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <IconComponent
                    className={`block md:hidden h-5 w-5 ${config.iconColor} mr-1.5`}
                  />
                  <h3
                    className={`text-base md:text-lg font-semibold ${config.headerColor}`}
                  >
                    {title || config.defaultTitle}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded disabled:opacity-50 transition-colors"
                >
                  <TbX className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6">
              <div className="text-center mb-4">
                <IconComponent
                  className={`hidden md:block h-12 w-12 ${config.iconColor} mx-auto mb-3`}
                />

                <div className="text-gray-700 text-sm md:text-[0.95rem]">
                  {message || getDefaultMessage()}
                </div>

                {(type === "delete" || type === "warning") && (
                  <p className="text-[0.78rem] md:text-sm text-gray-500 mt-2">
                    This action cannot be undone.
                  </p>
                )}

                {type === "error" && (
                  <p className="text-[0.78rem] md:text-sm text-gray-500 mt-2">
                    Please try again or contact support if the problem persists.
                  </p>
                )}

                {autoClose &&
                  isAutoClosing &&
                  (type === "success" || type === "info") && (
                    <p className="text-[0.78rem] md:text-sm text-gray-500 mt-2">
                      This message will close automatically...
                    </p>
                  )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-3.5 md:px-4 pt-3 lg:px-6 pb-4 md:pb-[1.3rem] flex justify-center gap-1.5 md:gap-3">
              {shouldShowCancel && (
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full px-8 py-2 lg:py-2.5 text-gray-700 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {cancelButtonText}
                </button>
              )}
              <button
                onClick={onConfirm || onClose}
                disabled={isLoading}
                className={`w-full px-8 py-2 lg:py-2.5 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${config.primaryButtonColor}`}
              >
                {isLoading
                  ? `${
                      config.defaultConfirmText.endsWith("e")
                        ? config.defaultConfirmText.slice(0, -1)
                        : config.defaultConfirmText
                    }ing...`
                  : confirmButtonText || config.defaultConfirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
