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
} from "react-icons/tb";

const UnitInfo = () => {
  const { user } = useAuth();
  const unit = getUnitById(user?.unit_id);
  const property = unit ? getPropertyById(unit.property_id) : null;

  if (!unit || !property) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
        <TbHome className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Unit Assigned
        </h3>
        <p className="text-gray-500">
          You haven't been assigned to a unit yet. Please contact your landlord.
        </p>
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
      {/* Unit Header */}
      <div className="bg-gradient-to-r from-primary-plot to-primary-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{unit.name}</h1>
            <p className="text-primary-100 flex items-center">
              <TbMapPin className="h-4 w-4 mr-1" />
              {property.address}
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">Monthly Rent</p>
            <p className="text-2xl font-bold">
              KSH {unit.rent_amount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Unit Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-secondary-plot mb-4">
              Property Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Property Name
                </label>
                <p className="text-base font-medium text-gray-900">
                  {property.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Unit Name
                </label>
                <p className="text-base font-medium text-gray-900">
                  {unit.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Address
                </label>
                <p className="text-base text-gray-900">{property.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    unit.status === "occupied"
                      ? "bg-success-plot/10 text-success-plot"
                      : unit.status === "available"
                      ? "bg-info-plot/10 text-info-plot"
                      : "bg-warning-plot/10 text-warning-plot"
                  }`}
                >
                  {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Monthly Rent
                </label>
                <p className="text-base font-semibold text-gray-900">
                  KSH {unit.rent_amount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Move-in Date
                </label>
                <p className="text-base text-gray-900">
                  {new Date(unit.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Property Description */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-secondary-plot mb-3">
              About This Property
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-secondary-plot mb-4">
              Amenities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenities.map((amenity, index) => {
                const IconComponent = amenityIcons[amenity] || TbBulb;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <IconComponent className="h-5 w-5 text-primary-plot" />
                    <span className="text-sm font-medium text-gray-700">
                      {amenity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-secondary-plot mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/tenant/payments"
                className="w-full bg-primary-plot text-white px-4 py-3 rounded-lg hover:bg-primary-plot/90 transition-colors text-center font-medium flex items-center justify-center"
              >
                <TbCurrencyDollar className="h-5 w-5 mr-2" />
                Make Payment
              </Link>
              <Link
                to="/tenant/maintenance"
                className="w-full bg-warning-plot text-white px-4 py-3 rounded-lg hover:bg-warning-plot/90 transition-colors text-center font-medium flex items-center justify-center"
              >
                <TbHome className="h-5 w-5 mr-2" />
                Report Issue
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-secondary-plot mb-4">
              Need Help?
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-gray-500">For urgent issues, contact:</p>
                <p className="font-medium text-gray-900">
                  Emergency: +254 700 000 000
                </p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Property Manager:</p>
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-gray-600">+254 712 345 678</p>
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-secondary-plot mb-4">
              Important Dates
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rent Due Date</span>
                <span className="text-sm font-medium text-gray-900">
                  15th of each month
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lease Start</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(unit.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(unit.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Images */}
      {unit.image_urls && unit.image_urls.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-secondary-plot mb-4">
            Unit Gallery
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {unit.image_urls.map((url, index) => (
              <div
                key={index}
                className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                  <TbHome className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    Image {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitInfo;
