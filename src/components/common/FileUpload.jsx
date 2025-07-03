import { useState } from "react";
import {
  TbUpload,
  TbX,
  TbPhoto,
  TbFile,
  TbAlertTriangle,
} from "react-icons/tb";

const FileUpload = ({
  onFilesChange,
  acceptedTypes = "image/*",
  maxFiles = 5,
  maxFileSize = 5, // MB
  allowedFormats = ["JPG", "PNG", "GIF", "PDF", "DOC", "DOCX"],
  uploadType = "images", // "images" or "documents"
  className = "",
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);
    const maxSizeBytes = maxFileSize * 1024 * 1024;

    const validFiles = fileArray.filter((file) => {
      // Check file type
      const isValidType =
        uploadType === "images"
          ? file.type.startsWith("image/")
          : allowedFormats.some((format) =>
              file.name.toLowerCase().endsWith(`.${format.toLowerCase()}`)
            );

      // Check file size
      const isValidSize = file.size <= maxSizeBytes;

      return isValidType && isValidSize;
    });

    if (validFiles.length !== fileArray.length) {
      alert(
        `Some files were skipped. Please ensure all files are valid ${uploadType} under ${maxFileSize}MB.`
      );
    }

    const newFiles = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: uploadType === "images" ? URL.createObjectURL(file) : null,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    const updatedFiles = [...uploadedFiles, ...newFiles].slice(0, maxFiles);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragActive(true);
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

    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((file) => file.id !== fileId);
      // Clean up URL object for images
      const removed = prev.find((file) => file.id === fileId);
      if (removed && removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      onFilesChange(updated);
      return updated;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    return uploadType === "images" ||
      ["jpg", "jpeg", "png", "gif", "webp"].includes(extension)
      ? TbPhoto
      : TbFile;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
          dragActive
            ? "border-primary-plot bg-primary-plot/5 scale-[1.02]"
            : "border-gray-300 hover:border-gray-400"
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-50"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() =>
          !disabled && document.getElementById("file-input").click()
        }
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={(e) => !disabled && handleFileUpload(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-4">
          <div
            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
              dragActive
                ? "bg-primary-plot text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <TbUpload className="w-6 h-6" />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-700">
              {dragActive ? `Drop ${uploadType} here` : `Upload ${uploadType}`}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Up to {maxFiles} {uploadType} (max {maxFileSize}MB each).{" "}
              {allowedFormats.join(", ")} supported.
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Uploaded {uploadType} ({uploadedFiles.length}/{maxFiles})
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uploadedFiles.map((file) => {
              const FileIcon = getFileIcon(file.name);

              return (
                <div
                  key={file.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200"
                >
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all duration-200"
                    disabled={disabled}
                  >
                    <TbX className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
