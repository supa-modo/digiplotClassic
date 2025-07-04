import TenantLayout from "../../components/tenant/TenantLayout";
import UnitInfo from "../../components/tenant/UnitInfo";
import { TbCalendarEvent, TbHomeDot } from "react-icons/tb";

const TenantUnitInfo = () => {
  return (
    <TenantLayout>
      <div className="space-y-0 lg:space-y-6">
        {/* Header - Enhanced to match landlord component style */}
        <div className="hidden lg:block relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 md:p-4 bg-gradient-to-br from-primary-600/20 to-secondary-plot/20 rounded-xl backdrop-blur-sm border border-white/20">
                  <TbHomeDot className="h-7 md:h-8 w-7 md:w-8 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-primary-600">
                    Unit Information
                  </h1>
                  <p className="text-gray-600 mt-1 text-xs md:text-sm lg:text-base">
                    View details about your rental unit and property
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center mt-1.5 text-[0.8rem] md:text-sm font-medium text-gray-600">
                <TbCalendarEvent className="h-4 w-4 mr-1.5 text-primary-600" />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
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
