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
  TbLoader2,
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
        iconColor: "text-blue-600",
        iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
        headerColor: "text-blue-600",
        primaryButtonColor:
          "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
        defaultTitle: "Confirm Action",
        defaultConfirmText: "Confirm",
        decorativeColor: "bg-blue-500/5",
      },
      delete: {
        icon: TbAlertTriangle,
        iconColor: "text-red-600",
        iconBg: "bg-gradient-to-br from-red-100 to-pink-100",
        headerColor: "text-red-600",
        primaryButtonColor:
          "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700",
        defaultTitle: "Confirm Deletion",
        defaultConfirmText: "Delete",
        decorativeColor: "bg-red-500/5",
      },
      edit: {
        icon: TbEdit,
        iconColor: "text-orange-600",
        iconBg: "bg-gradient-to-br from-orange-100 to-yellow-100",
        headerColor: "text-orange-600",
        primaryButtonColor:
          "bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700",
        defaultTitle: "Confirm Edit",
        defaultConfirmText: "Save Changes",
        decorativeColor: "bg-orange-500/5",
      },
      success: {
        icon: FiCheckCircle,
        iconColor: "text-green-600",
        iconBg: "bg-gradient-to-br from-green-100 to-emerald-100",
        headerColor: "text-green-600",
        primaryButtonColor:
          "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
        defaultTitle: "Success",
        defaultConfirmText: "OK",
        decorativeColor: "bg-green-500/5",
      },
      error: {
        icon: TbShieldX,
        iconColor: "text-red-600",
        iconBg: "bg-gradient-to-br from-red-100 to-pink-100",
        headerColor: "text-red-600",
        primaryButtonColor:
          "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700",
        defaultTitle: "Error",
        defaultConfirmText: "OK",
        decorativeColor: "bg-red-500/5",
      },
      info: {
        icon: TbInfoCircle,
        iconColor: "text-blue-600",
        iconBg: "bg-gradient-to-br from-blue-100 to-cyan-100",
        headerColor: "text-blue-600",
        primaryButtonColor:
          "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
        defaultTitle: "Information",
        defaultConfirmText: "OK",
        decorativeColor: "bg-blue-500/5",
      },
      warning: {
        icon: TbExclamationMark,
        iconColor: "text-yellow-600",
        iconBg: "bg-gradient-to-br from-yellow-100 to-orange-100",
        headerColor: "text-yellow-600",
        primaryButtonColor:
          "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700",
        defaultTitle: "Warning",
        defaultConfirmText: "Proceed",
        decorativeColor: "bg-yellow-500/5",
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
              <span className="font-bold text-gray-900">"{itemName}"</span>
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
              <span className="font-bold text-gray-900">"{itemName}"</span>
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative elements */}
            <div
              className={`absolute -top-20 -right-20 h-40 w-40 rounded-full ${config.decorativeColor} blur-xl pointer-events-none`}
            ></div>
            <div
              className={`absolute bottom-0 left-0 h-32 w-32 rounded-full ${config.decorativeColor} blur-xl pointer-events-none`}
            ></div>

            {/* Header */}
            <div className="relative z-10 px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <IconComponent
                    className={`h-8 md:h-10 w-8 md:w-10 ${config.iconColor}`}
                  />

                  <div>
                    <h3
                      className={`text-lg md:text-xl font-bold ${config.headerColor}`}
                    >
                      {title || config.defaultTitle}
                    </h3>
                    {isAutoClosing && (
                      <p className="text-xs md:text-[0.8rem] text-gray-500">
                        Auto-closing in {Math.ceil(autoCloseDelay / 1000)}s...
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-all duration-200"
                >
                  <TbX className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-2.5 py-2.5 md:px-5 md:py-5">
              <div className="text-center">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {message || getDefaultMessage()}
                </p>

                {type === "delete" && (
                  <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-center  text-red-700">
                      <span className="text-[0.8rem] md:text-sm font-semibold">
                        This action cannot be undone
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="relative z-10 px-2.5 py-2.5 md:px-5 md:py-5 bg-gray-50/50 border-t border-gray-100">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
                {shouldShowCancel && (
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="w-full px-8 py-2.5 md:py-2 text-sm md:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                  >
                    {cancelButtonText}
                  </button>
                )}
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`w-full px-8 py-2.5 md:py-2 text-sm md:text-base text-white rounded-lg  disabled:opacity-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${config.primaryButtonColor}`}
                >
                  {isLoading ? (
                    <>
                      <TbLoader2 className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>
                      {confirmButtonText || config.defaultConfirmText}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Auto-close progress bar */}
            {isAutoClosing && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{
                    duration: autoCloseDelay / 1000,
                    ease: "linear",
                  }}
                  className={`h-full ${
                    config.primaryButtonColor.split(" ")[0]
                  } rounded`}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
