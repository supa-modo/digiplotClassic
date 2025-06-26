import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/tb";

const PropertyCard = ({
  property,
  viewMode,
  onEdit,
  onAddUnit,
  onEditUnit,
  onDelete,
}) => {
  const [showUnits, setShowUnits] = useState(false);
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: "Available", class: "bg-green-100 text-green-800" },
      occupied: { label: "Occupied", class: "bg-blue-100 text-blue-800" },
      vacant: { label: "Vacant", class: "bg-green-100 text-green-800" },
      maintenance: {
        label: "Maintenance",
        class: "bg-yellow-100 text-yellow-800",
      },
      unavailable: { label: "Unavailable", class: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || statusConfig.available;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return `KSh ${amount?.toLocaleString() || 0}`;
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg border hover:border-gray-300 transition-colors">
        {/* Main Property Info */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {property.name}
                </h3>
                <span className="text-sm text-gray-500">ID: {property.id}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <TbMapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.address}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {stats.total}
                  </div>
                  <div className="text-xs text-gray-500">Total Units</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {stats.occupied}
                  </div>
                  <div className="text-xs text-gray-500">Occupied</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {stats.available}
                  </div>
                  <div className="text-xs text-gray-500">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">
                    {formatCurrency(stats.revenue)}
                  </div>
                  <div className="text-xs text-gray-500">Monthly Revenue</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handleViewUnits}
                className="px-3 py-2 bg-primary-plot text-white rounded-lg hover:bg-primary-plot/90 transition-colors text-sm font-medium"
                title="View All Units"
              >
                <TbEye size={16} className="mr-1 inline" />
                View Units
              </button>
              <button
                onClick={onEdit}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit Property"
              >
                <TbEdit size={18} />
              </button>
              <button
                onClick={onAddUnit}
                className="p-2 text-primary-plot hover:bg-primary-plot/10 rounded-lg transition-colors"
                title="Add Unit"
              >
                <TbPlus size={18} />
              </button>
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Property"
                >
                  <TbTrash size={18} />
                </button>
              )}
              <button
                onClick={() => setShowUnits(!showUnits)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Toggle Units"
              >
                {showUnits ? (
                  <TbChevronUp size={18} />
                ) : (
                  <TbChevronDown size={18} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Units List */}
        {showUnits && property.units && property.units.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">
              Units ({property.units.length})
            </h4>
            <div className="space-y-3">
              {property.units.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">
                        {unit.name}
                      </span>
                      {getStatusBadge(unit.status)}
                      <span className="text-sm text-gray-600">{unit.type}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center">
                        <TbBed className="h-3 w-3 mr-1" />
                        {unit.bedrooms} bed
                      </span>
                      <span className="flex items-center">
                        <TbBath className="h-3 w-3 mr-1" />
                        {unit.bathrooms} bath
                      </span>
                      <span className="flex items-center">
                        <TbRuler className="h-3 w-3 mr-1" />
                        {unit.area} sqft
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(unit.rent_amount)}
                    </div>
                    <button
                      onClick={() => onEditUnit(unit)}
                      className="text-xs text-primary-plot hover:text-primary-plot/80 mt-1"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg border hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      {/* Property Image Placeholder */}
      <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
        <TbBuilding className="h-12 w-12 text-gray-400" />
      </div>

      <div className="p-6">
        {/* Property Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {property.name}
            </h3>
            <div className="flex items-center text-gray-600">
              <TbMapPin className="h-4 w-4 mr-1" />
              <span className="text-sm truncate">{property.address}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Edit Property"
            >
              <TbEdit size={16} />
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1 text-red-400 hover:text-red-600 transition-colors"
                title="Delete Property"
              >
                <TbTrash size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {stats.total}
            </div>
            <div className="text-xs text-gray-500">Total Units</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">
              {stats.occupied}
            </div>
            <div className="text-xs text-gray-500">Occupied</div>
          </div>
        </div>

        {/* Revenue */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Monthly Revenue</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(stats.revenue)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Occupancy Rate</span>
            <span className="font-semibold text-gray-900">
              {stats.total > 0
                ? Math.round((stats.occupied / stats.total) * 100)
                : 0}
              %
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleViewUnits}
            className="w-full bg-primary-plot text-white px-3 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors text-sm font-medium"
          >
            <TbEye className="h-4 w-4 mr-1 inline" />
            View Units ({stats.total})
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onAddUnit}
              className="flex-1 border border-primary-plot text-primary-plot px-3 py-2 rounded-lg hover:bg-primary-plot/10 transition-colors text-sm font-medium"
            >
              <TbPlus className="h-4 w-4 mr-1 inline" />
              Add Unit
            </button>
            <button
              onClick={() => setShowUnits(!showUnits)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              title="Preview Units"
            >
              <TbEye className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Units Preview */}
        {showUnits && property.units && property.units.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Units</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {property.units.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {unit.name}
                    </span>
                    {getStatusBadge(unit.status)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">
                      {formatCurrency(unit.rent_amount)}
                    </span>
                    <button
                      onClick={() => onEditUnit(unit)}
                      className="text-primary-plot hover:text-primary-plot/80"
                    >
                      <TbEdit size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
