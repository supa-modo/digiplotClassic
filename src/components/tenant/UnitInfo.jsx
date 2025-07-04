import { useAuth } from "../../contexts/AuthContext";
import { getUnitById, getPropertyById } from "../../utils/demoData";
import { Link } from "react-router-dom";
import {
  TbHome,
  TbCurrencyDollar,
  TbMapPin,
  TbCalendar,
  TbBulb,
  TbWifi,
  TbCar,
  TbShield,
  TbSwimming,
  TbBarbell,
  TbGardenCart,
  TbHomeDot,
  TbPhone,
  TbUser,
  TbBuildingSkyscraper,
  TbSparkles,
  TbChecks,
  TbCalendarEvent,
  TbSun,
  TbSunset,
  TbMoon,
  TbCoins,
} from "react-icons/tb";
import { useEffect, useState } from "react";
import { PiMapPinAreaDuotone } from "react-icons/pi";

const UnitInfo = () => {
  const [timeOfDay, setTimeOfDay] = useState("");
  const { user } = useAuth();
  const unit = getUnitById("unit-1");
  const property = unit ? getPropertyById(unit.property_id) : null;

  useEffect(() => {
    // Set time of day greeting
    const hours = new Date().getHours();
    if (hours < 12) setTimeOfDay("morning");
    else if (hours < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  const getTimeIcon = () => {
    if (timeOfDay === "morning") return TbSun;
    if (timeOfDay === "afternoon") return TbSunset;
    return TbMoon;
  };

  const TimeIcon = getTimeIcon();

  if (!unit || !property) {
    return (
      <div className="h-[calc(100vh-5rem)] bg-white border rounded-2xl shadow-lg flex items-center justify-center ">
        <div className=" p-8  text-center relative overflow-hidden max-w-lg w-full">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

          <TbHomeDot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base lg:text-lg font-semibold text-gray-500 mb-2">
            No Unit Assigned !
          </h3>
          <p className="text-gray-500">
            You haven't been assigned to a unit yet. Please contact your
            property landlord.
          </p>
        </div>
      </div>
    );
  }

  const amenityIcons = {
    WiFi: TbWifi,
    Parking: TbCar,
    Security: TbShield,
    "Swimming Pool": TbSwimming,
    Pool: TbSwimming,
    Gym: TbBarbell,
    Garden: TbGardenCart,
    Balcony: TbHomeDot,
  };

  const amenities = unit.amenities ? unit.amenities.split(", ") : [];

  return (
    <div className="space-y-6">
      {/* Enhanced Welcome Section */}
      <div className="mb-4 md:mb-6">
        <div className="px-4 flex items-baseline justify-between mb-2 lg:mb-0"></div>
      </div>
      {/* Unit Header - Enhanced with premium styling */}
      <div className="bg-gradient-to-br from-primary-plot via-primary-plot to-secondary-plot rounded-2xl p-4 md:p-8 text-white relative overflow-hidden shadow-xl">
        {/* Status badge - mobile screens */}
        <div className="absolute  right-3 top-3 lg:hidden items-center space-x-2">
          <div className="flex items-center px-3 py-0.5 rounded-full bg-green-500/30 border border-green-400/50 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse mr-2"></div>
            <span className="text-[0.7rem] font-medium text-green-100">
              {unit.status?.charAt(0).toUpperCase() + unit.status?.slice(1) ||
                "Occupied"}
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/5 blur-xl pointer-events-none"></div>

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-1 md:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                  <TbBuildingSkyscraper className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                    {unit.name}
                  </h1>
                  <div className="flex items-center mt-1 text-white/90">
                    <PiMapPinAreaDuotone className="h-4 w-4 mr-1" />
                    <span className="text-xs md:text-sm">
                      {property.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status badge */}
              <div className="hidden lg:flex items-center space-x-2">
                <div className="flex items-center px-3 py-1.5 rounded-full bg-green-500/30 border border-green-400/50 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse mr-2"></div>
                  <span className="text-xs font-medium text-green-100">
                    {unit.status?.charAt(0).toUpperCase() +
                      unit.status?.slice(1) || "Occupied"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-2">
                <TbCoins className="h-6 lg:h-10 w-6 lg:w-10 text-secondary-200" />
                <p className="text-3xl md:text-4xl font-bold text-secondary-200">
                  Kshs. {unit.rent_amount?.toLocaleString() || "0"}
                </p>
              </div>
              <p className="text-white/60 text-xs mt-1">per month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Details Grid - Enhanced styling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                  <TbHome className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-plot">
                    Property Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Details about your unit and property
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-xl border border-gray-100">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Property Name
                  </label>
                  <p className="text-base font-bold text-gray-900">
                    {property.name}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-xl border border-gray-100">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Unit Name
                  </label>
                  <p className="text-base font-bold text-gray-900">
                    {unit.name}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-xl border border-gray-100">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <TbMapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-base text-gray-900">
                      {property.address}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-xl border border-gray-100">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <TbChecks className="h-4 w-4 text-success-plot" />
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                        unit.status === "occupied"
                          ? "bg-success-plot/10 text-success-plot border border-success-plot/30"
                          : unit.status === "available"
                          ? "bg-info-plot/10 text-info-plot border border-info-plot/30"
                          : "bg-warning-plot/10 text-warning-plot border border-warning-plot/30"
                      }`}
                    >
                      {unit.status?.charAt(0).toUpperCase() +
                        unit.status?.slice(1) || "Occupied"}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-green-50/50 rounded-xl border border-gray-100">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Monthly Rent
                  </label>
                  <div className="flex items-center space-x-2">
                    <TbCurrencyDollar className="h-4 w-4 text-green-600" />
                    <p className="text-lg font-bold text-gray-900">
                      KES {unit.rent_amount?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-purple-50/50 rounded-xl border border-gray-100">
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Move-in Date
                  </label>
                  <div className="flex items-center space-x-2">
                    <TbCalendar className="h-4 w-4 text-purple-600" />
                    <p className="text-base text-gray-900">
                      {new Date(unit.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Description - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <TbSparkles className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary-plot">
                    About This Property
                  </h3>
                  <p className="text-sm text-gray-500">
                    Property description and features
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50/50 to-pink-50/30 rounded-xl border border-purple-100/50">
                <p className="text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                  <TbSparkles className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary-plot">
                    Amenities & Features
                  </h3>
                  <p className="text-sm text-gray-500">
                    Available facilities and services
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenities.map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity] || TbBulb;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl border border-green-100/50 hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <IconComponent className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Enhanced */}
        <div className="space-y-6">
          {/* Quick Actions - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
                  <TbSparkles className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary-plot">
                    Quick Actions
                  </h3>
                  <p className="text-sm text-gray-500">
                    Common tasks and services
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  to="/tenant/payments"
                  className="group w-full bg-gradient-to-r from-primary-plot to-secondary-plot text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center space-x-3 hover:scale-105"
                >
                  <TbCurrencyDollar className="h-5 w-5" />
                  <span>Make Payment</span>
                </Link>
                <Link
                  to="/tenant/maintenance"
                  className="group w-full bg-gradient-to-r from-warning-plot to-orange-500 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center space-x-3 hover:scale-105"
                >
                  <TbHome className="h-5 w-5" />
                  <span>Report Issue</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Information - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                  <TbPhone className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary-plot">
                    Need Help?
                  </h3>
                  <p className="text-sm text-gray-500">
                    Contact information for support
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50/50 rounded-xl border border-red-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <TbPhone className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-semibold text-red-700">
                      Emergency Contact
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">+254 700 000 000</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <TbUser className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-700">
                      Property Manager
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 mb-1">John Doe</p>
                  <p className="text-gray-600 text-sm">+254 712 345 678</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Dates - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <TbCalendar className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary-plot">
                    Important Dates
                  </h3>
                  <p className="text-sm text-gray-500">
                    Key rental information and deadlines
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50/50 to-pink-50/30 rounded-lg border border-purple-100/50">
                  <span className="text-sm font-semibold text-gray-700">
                    Rent Due Date
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    15th of each month
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 rounded-lg border border-blue-100/50">
                  <span className="text-sm font-semibold text-gray-700">
                    Lease Start
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {new Date(unit.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50/50 to-emerald-50/30 rounded-lg border border-green-100/50">
                  <span className="text-sm font-semibold text-gray-700">
                    Last Updated
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {new Date(unit.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Images - Enhanced */}
      {unit.image_urls && unit.image_urls.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                <TbHome className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary-plot">
                  Unit Gallery
                </h3>
                <p className="text-sm text-gray-500">
                  Photos and images of your unit
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {unit.image_urls.map((url, index) => (
                <div
                  key={index}
                  className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-100 to-indigo-100/50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center justify-center h-32 bg-gradient-to-br from-gray-100 to-indigo-100/50 rounded-xl">
                    <div className="text-center">
                      <TbHome className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-500 font-medium">
                        Image {index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitInfo;
