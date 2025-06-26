import { useState, useEffect } from "react";
import LandlordLayout from "../../components/landlord/LandlordLayout";
import PropertyCard from "../../components/landlord/PropertyCard";
import PropertyModal from "../../components/landlord/PropertyModal";
import UnitModal from "../../components/landlord/UnitModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  getPropertiesForLandlord,
  getUnitsForProperty,
} from "../../utils/demoData";
import {
  TbPlus,
  TbSearch,
  TbFilter,
  TbBuilding,
  TbMapPin,
  TbUsers,
  TbCurrencyDollar,
  TbEye,
  TbEdit,
  TbTrash,
  TbHome,
} from "react-icons/tb";

const LandlordProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    if (user?.id) {
      const landlordProperties = getPropertiesForLandlord(user.id);
      const propertiesWithUnits = landlordProperties.map((property) => ({
        ...property,
        units: getUnitsForProperty(property.id),
      }));
      setProperties(propertiesWithUnits);
      setFilteredProperties(propertiesWithUnits);
    }
  }, [user]);

  useEffect(() => {
    let filtered = properties;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((property) => {
        const hasAvailableUnits = property.units.some(
          (unit) => unit.status === "available"
        );
        const hasOccupiedUnits = property.units.some(
          (unit) => unit.status === "occupied"
        );

        if (statusFilter === "available" && hasAvailableUnits) return true;
        if (statusFilter === "occupied" && hasOccupiedUnits) return true;
        if (
          statusFilter === "fully_occupied" &&
          hasOccupiedUnits &&
          !hasAvailableUnits
        )
          return true;
        return false;
      });
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, statusFilter]);

  const handleAddProperty = () => {
    setSelectedProperty(null);
    setShowPropertyModal(true);
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handleAddUnit = (property) => {
    setSelectedProperty(property);
    setSelectedUnit(null);
    setShowUnitModal(true);
  };

  const handleEditUnit = (property, unit) => {
    setSelectedProperty(property);
    setSelectedUnit(unit);
    setShowUnitModal(true);
  };

  const handlePropertySave = (propertyData) => {
    console.log("Property saved:", propertyData);
    // In real app, this would update the backend
    setShowPropertyModal(false);
    // Refresh properties list
  };

  const handleUnitSave = (unitData) => {
    console.log("Unit saved:", unitData);
    // In real app, this would update the backend
    setShowUnitModal(false);
    // Refresh properties list
  };

  const getPropertyStats = () => {
    const totalProperties = properties.length;
    const totalUnits = properties.reduce(
      (sum, prop) => sum + prop.units.length,
      0
    );
    const occupiedUnits = properties.reduce(
      (sum, prop) =>
        sum + prop.units.filter((unit) => unit.status === "occupied").length,
      0
    );
    const availableUnits = totalUnits - occupiedUnits;
    const totalRevenue = properties.reduce(
      (sum, prop) =>
        sum +
        prop.units.reduce(
          (unitSum, unit) =>
            unit.status === "occupied"
              ? unitSum + (unit.rent_amount || 0)
              : unitSum,
          0
        ),
      0
    );

    return {
      totalProperties,
      totalUnits,
      occupiedUnits,
      availableUnits,
      occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
      totalRevenue,
    };
  };

  const stats = getPropertyStats();

  return (
    <LandlordLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Properties Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your properties, units, and rental information
            </p>
          </div>
          <button
            onClick={handleAddProperty}
            className="mt-4 lg:mt-0 bg-primary-plot text-white px-6 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors font-medium flex items-center space-x-2"
          >
            <TbPlus size={20} />
            <span>Add Property</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Properties
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProperties}
                </p>
              </div>
              <TbBuilding className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUnits}
                </p>
              </div>
              <TbHome className="h-8 w-8 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.occupiedUnits}
                </p>
              </div>
              <TbUsers className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.availableUnits}
                </p>
              </div>
              <TbMapPin className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-xl font-bold text-gray-900">
                  KSh {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <TbCurrencyDollar className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <TbSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-2">
                <TbFilter className="text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-plot focus:border-transparent"
                >
                  <option value="all">All Properties</option>
                  <option value="available">Has Available Units</option>
                  <option value="occupied">Has Occupied Units</option>
                  <option value="fully_occupied">Fully Occupied</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-plot text-white"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <TbBuilding size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-plot text-white"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <TbHome size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Properties List/Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <TbBuilding className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {properties.length === 0
                ? "No properties yet"
                : "No properties found"}
            </h3>
            <p className="text-gray-500 mb-6">
              {properties.length === 0
                ? "Get started by adding your first property"
                : "Try adjusting your search or filter criteria"}
            </p>
            {properties.length === 0 && (
              <button
                onClick={handleAddProperty}
                className="bg-primary-plot text-white px-6 py-2 rounded-lg hover:bg-primary-plot/90 transition-colors font-medium"
              >
                Add Your First Property
              </button>
            )}
          </div>
        ) : (
          <div
            className={`
            ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          `}
          >
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                viewMode={viewMode}
                onEdit={() => handleEditProperty(property)}
                onAddUnit={() => handleAddUnit(property)}
                onEditUnit={(unit) => handleEditUnit(property, unit)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Modal */}
      {showPropertyModal && (
        <PropertyModal
          isOpen={showPropertyModal}
          onClose={() => setShowPropertyModal(false)}
          onSave={handlePropertySave}
          property={selectedProperty}
        />
      )}

      {/* Unit Modal */}
      {showUnitModal && (
        <UnitModal
          isOpen={showUnitModal}
          onClose={() => setShowUnitModal(false)}
          onSave={handleUnitSave}
          property={selectedProperty}
          unit={selectedUnit}
        />
      )}
    </LandlordLayout>
  );
};

export default LandlordProperties;
