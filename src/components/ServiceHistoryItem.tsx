
import { formatDate } from "../utils/data";
import { ServiceRecord } from "../utils/types";
import { WrenchIcon, CarIcon, SmartphoneIcon, InfoIcon } from "lucide-react";

interface ServiceHistoryItemProps {
  record: ServiceRecord;
  delay?: number;
  vehicleName?: string;
  deviceName?: string;
  vehicleModel?: string;
  deviceModel?: string;
}

const ServiceHistoryItem = ({ 
  record, 
  delay = 0, 
  vehicleName,
  deviceName,
  vehicleModel,
  deviceModel
}: ServiceHistoryItemProps) => {
  const delayClass = `staggered-delay-${delay}`;
  
  const getTypeIcon = () => {
    if (record.vehicleId) {
      return <CarIcon className="h-5 w-5" />;
    } else if (record.deviceId) {
      return <SmartphoneIcon className="h-5 w-5" />;
    } else {
      return <WrenchIcon className="h-5 w-5" />;
    }
  };
  
  const getTypeLabel = () => {
    if (record.vehicleId) {
      return "Pojazd";
    } else if (record.deviceId) {
      return "Urządzenie";
    } else {
      return "Inne";
    }
  };
  
  const getTypeColor = () => {
    switch (record.type) {
      case 'repair':
        return 'bg-orange-100 text-orange-700';
      case 'maintenance':
        return 'bg-blue-100 text-blue-700';
      case 'inspection':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getTypeText = () => {
    switch (record.type) {
      case 'repair':
        return 'Naprawa';
      case 'maintenance':
        return 'Konserwacja';
      case 'inspection':
        return 'Inspekcja';
      default:
        return 'Inne';
    }
  };
  
  // Ensure that date is properly handled (it may be a string when loaded from localStorage)
  const recordDate = record.date instanceof Date ? record.date : new Date(record.date);
  
  return (
    <div className={`glass-card rounded-xl p-6 mb-4 opacity-0 animate-fade-in ${delayClass}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="icon-container mr-3">
            {getTypeIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-primary">{getTypeLabel()}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor()}`}>
                {getTypeText()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{formatDate(recordDate)}</p>
            
            {/* Clear information about what device/vehicle this service is for */}
            {record.vehicleId && vehicleName && (
              <p className="text-sm font-bold mt-1 flex items-center">
                <span className="text-primary">Pojazd:</span>
                <span className="ml-1">{vehicleName}{vehicleModel ? ` (${vehicleModel})` : ''}</span>
              </p>
            )}
            
            {record.deviceId && deviceName && (
              <div>
                <p className="text-sm font-bold mt-1 flex items-center">
                  <span className="text-primary">Urządzenie:</span>
                  <span className="ml-1">{deviceName}{deviceModel ? ` (${deviceModel})` : ''}</span>
                </p>
                {vehicleName && (
                  <p className="text-sm font-bold mt-1 flex items-center">
                    <span className="text-primary">Z pojazdu:</span>
                    <span className="ml-1">{vehicleName}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{record.cost.toFixed(2)} zł</p>
          <p className="text-sm text-muted-foreground">Technik: {record.technician}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm">{record.description}</p>
      </div>
    </div>
  );
};

export default ServiceHistoryItem;
