import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbBuilding,
  TbMapPin,
  TbUsers,
  TbHome,
  TbEdit,
  TbPlus,
  TbEye,
  TbChevronDown,
  TbChevronUp,
  TbCurrencyDollar,
  TbCalendar,
  TbBed,
  TbBath,
  TbRuler,
  TbTrash,
  TbChevronLeft,
  TbChevronRight,
  TbCoins,
  TbHomeDot,
  TbHomeX,
  TbHomePlus,
} from "react-icons/tb";
import {
  PiBuildingsDuotone,
  PiMapPinAreaDuotone,
  PiUsersDuotone,
} from "react-icons/pi";

// Property Image Carousel Component
const PropertyImageCarousel = ({ images, altText, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (!images || images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [images, isHovered]);

  // Handle manual navigation
  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index, e) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  // If no images, show default building icon
  if (!images || images.length === 0) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${className}`}
      >
        <PiBuildingsDuotone className="h-20 w-20 text-gray-400" />
      </div>
    );
  }

  // Single image
  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className} group`}>
        <motion.img
          src={images[0]}
          alt={altText}
          className="w-full h-full object-cover "
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            opacity: { duration: 0.6, ease: "easeOut" },
          }}
        />
        {/* Subtle overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-black/0"
          whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    );
  }

  // Multiple images with carousel
  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Framer Motion Image Transitions */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={`carousel-${currentIndex}-${images[currentIndex]}`}
            src={images[currentIndex]}
            alt={`${altText} - Image ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                opacity: { duration: 0.9, ease: "easeInOut" },
                scale: { duration: 0.8, ease: "easeInOut" },
              },
            }}
            loading={currentIndex === 0 ? "eager" : "lazy"}
          />
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <motion.button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 z-20"
        whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <TbChevronLeft className="h-4 w-4" />
      </motion.button>

      <motion.button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 z-20"
        whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <TbChevronRight className="h-4 w-4" />
      </motion.button>

      {/* Slide Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={(e) => goToSlide(index, e)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-white shadow-lg" : "bg-white/50"
            }`}
            whileHover={{
              scale: 1.25,
              backgroundColor:
                index === currentIndex
                  ? "#ffffff"
                  : "rgba(255, 255, 255, 0.75)",
            }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: index === currentIndex ? 1.1 : 1,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium z-20 backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Progress Bar Animation */}
      {!isHovered && images.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-20">
          <motion.div
            className="h-full bg-white/80"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentIndex + 1) / images.length) * 100}%`,
            }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        </div>
      )}
    </div>
  );
};

const PropertyCard = ({
  property,
  viewMode,
  onEdit,
  onAddUnit,
  onEditUnit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const getUnitStats = () => {
    const total = property.units?.length || 0;
    const occupied =
      property.units?.filter((unit) => unit.status === "occupied").length || 0;
    const available = total - occupied;
    const revenue =
      property.units?.reduce(
        (sum, unit) =>
          unit.status === "occupied" ? sum + (unit.rent_amount || 0) : sum,
        0
      ) || 0;

    return { total, occupied, available, revenue };
  };

  const stats = getUnitStats();

  const handleViewUnits = () => {
    navigate(`/landlord/properties/${property.id}/units`);
  };

  const formatCurrency = (amount) => {
    return `KSh ${amount?.toLocaleString() || 0}`;
  };

  const getOccupancyRate = () => {
    return stats.total > 0
      ? Math.round((stats.occupied / stats.total) * 100)
      : 0;
  };

  const getOccupancyColor = () => {
    const rate = getOccupancyRate();
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  //list view
  if (viewMode === "list") {
    return (
      <motion.div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Property Image */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <PropertyImageCarousel
              images={property.image_urls}
              altText={property.name}
              className="h-48 lg:h-full lg:rounded-l-2xl"
            />
          </div>

          {/* Property Content */}
          <div className="flex-1 p-6">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base md:text-lg lg:text-xl font-bold text-secondary-plot group-hover:text-primary-plot transition-colors">
                        {property.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getOccupancyColor()} bg-gray-50`}
                      >
                        {getOccupancyRate()}% Occupied
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <PiMapPinAreaDuotone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-xs md:text-[0.8rem]">
                        {property.address}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onEdit}
                      className="border hover:bg-gray-200 text-secondary-plot  p-3 rounded-lg text-sm font-medium shadow-md"
                    >
                      <TbEdit className="h-5 w-5" />
                    </button>
                    {onDelete && (
                      <button
                        onClick={onDelete}
                        className="border hover:bg-red-600 text-red-600 hover:text-white p-3 rounded-lg text-sm font-medium shadow-md"
                      >
                        <TbTrash className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-secondary-plot/10 to-secondary-plot/20 rounded-xl p-4 border border-secondary-plot/10">
                    <div className="flex items-center gap-2 mb-1">
                      <TbHomeDot className="h-4 w-4 text-secondary-plot" />
                      <span className="text-xs font-medium text-secondary-plot">
                        Total Units
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-secondary-plot">
                      {stats.total}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-secondary-plot/10 to-secondary-plot/20 rounded-xl p-4 border border-secondary-plot/10">
                    <div className="flex items-center gap-2 mb-1">
                      <PiUsersDuotone className="h-4 w-4 text-secondary-plot" />
                      <span className="text-xs font-medium text-secondary-plot">
                        Occupied
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-secondary-plot">
                      {stats.occupied}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-secondary-plot/10 to-secondary-plot/20 rounded-xl p-4 border border-secondary-plot/10">
                    <div className="flex items-center gap-2 mb-1">
                      <TbHomeX className="h-4 w-4 text-secondary-plot" />
                      <span className="text-xs font-medium text-secondary-plot">
                        Vacant Units
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-secondary-plot">
                      {stats.available}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-secondary-plot/10 to-secondary-plot/20 rounded-xl p-4 border border-secondary-plot/10">
                    <div className="flex items-center gap-2 mb-1">
                      <TbCoins className="h-4 w-4 text-secondary-plot" />
                      <span className="text-xs font-medium text-secondary-plot">
                        Monthly Revenue
                      </span>
                    </div>
                    <div className="text-lg font-bold text-secondary-700">
                      {formatCurrency(stats.revenue)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleViewUnits}
                  className="w-full border-2 border-secondary-plot/50  bg-gradient-to-r from-secondary-plot to-secondary-plot/80 text-white px-4 py-2.5 md:py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <TbHomeDot className="h-4 md:h-5 w-4 md:w-5" />
                    <span className="text-[0.8rem] md:text-sm">
                      View All Units ({stats.total})
                    </span>
                  </div>
                </button>

                <button
                  onClick={onAddUnit}
                  className="w-full border-2 border-secondary-700 text-secondary-700 px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-secondary-600 hover:border-secondary-600 hover:text-white transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <TbHomePlus className="h-4 md:h-5 w-4 md:w-5" />
                    <span className="text-[0.8rem] md:text-sm">
                      Add New Unit
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Property Image Carousel */}
      <PropertyImageCarousel
        images={property.image_urls}
        altText={property.name}
        className="h-64 *: rounded-t-2xl"
      />

      <div className="p-4 md:p-6">
        {/* Property Header */}
        <div className="flex items-start justify-between mb-1 md:mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-secondary-plot group-hover:text-primary-plot transition-colors">
                {property.name}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getOccupancyColor()} bg-gray-50`}
              >
                {getOccupancyRate()}% Occupied
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <PiMapPinAreaDuotone className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-xs md:text-[0.8rem]">
                {property.address}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Edit Property"
            >
              <TbEdit className="h-5 md:h-6 w-5 md:w-6" />
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete Property"
              >
                <TbTrash className="h-5 md:h-6 md:w-6 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Revenue Section */}
        <div className="bg-gradient-to-r from-secondary-600/15 to-primary-600/10 rounded-xl p-4 border border-purple-100 mb-4 md:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TbCoins className="h-4 w-4 text-secondary-600" />
                <span className="text-[0.7rem] md:text-xs font-medium text-secondary-600">
                  Monthly Revenue
                </span>
              </div>
              <div className="text-lg md:text-xl font-bold text-secondary-plot">
                {formatCurrency(stats.revenue)}
              </div>
            </div>
            <div>
              <div className="text-[0.7rem] md:text-xs font-medium text-secondary-600">
                Occupied
              </div>
              <div className="text-lg md:text-xl font-bold text-secondary-plot">
                {stats.occupied}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[0.7rem] md:text-xs font-medium text-secondary-600">
                Vacant
              </div>
              <div className="text-lg md:text-xl font-bold text-secondary-plot">
                {stats.available}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-2">
          <button
            onClick={handleViewUnits}
            className="w-full border-2 border-secondary-plot/50  bg-gradient-to-r from-secondary-plot to-secondary-plot/80 text-white px-4 py-2.5 md:py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <TbHomeDot className="h-4 md:h-5 w-4 md:w-5" />
              <span className="text-[0.8rem] md:text-sm">
                View All Units ({stats.total})
              </span>
            </div>
          </button>

          <button
            onClick={onAddUnit}
            className="w-full border-2 border-secondary-700 text-secondary-700 px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-secondary-600 hover:border-secondary-600 hover:text-white transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <TbHomePlus className="h-4 md:h-5 w-4 md:w-5" />
              <span className="text-[0.8rem] md:text-sm">Add New Unit</span>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
