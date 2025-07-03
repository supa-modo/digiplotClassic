import TenantLayout from "../../components/tenant/TenantLayout";
import UnitInfo from "../../components/tenant/UnitInfo";
import { TbHomeDot } from "react-icons/tb";

const TenantUnitInfo = () => {
  return (
    <TenantLayout>
      <div className="space-y-6">
        {/* Header - Enhanced to match landlord component style */}
        <div className="relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-secondary-600/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                <TbHomeDot className="h-7 md:h-8 w-7 md:w-8 text-secondary-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary-plot">
                  Unit Information
                </h1>
                <p className="text-gray-600 mt-1 text-xs md:text-sm lg:text-base">
                  View details about your rental unit and property
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* UnitInfo Component */}
        <UnitInfo />
      </div>
    </TenantLayout>
  );
};

export default TenantUnitInfo;
