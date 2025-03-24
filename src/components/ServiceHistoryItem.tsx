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
  
  const recordDate = record.date instanceof Date ? record.date : new Date(record.date);
  
  return (
    <div className={`glass-card rounded-xl p-2 mb-3 opacity-0 animate-fade-in ${delayClass}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <div className="icon-container">
              {getTypeIcon()}
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(recordDate)}</span>
          </div>
          
          <div className="ml-7">
            {record.vehicleId && vehicleName && (
              <p className="text-sm">
                <span className="font-medium">Pojazd:</span> {vehicleName}{vehicleModel ? ` (${vehicleModel})` : ''}
              </p>
            )}
            
            {record.deviceId && deviceName && (
              <p className="text-sm">
                <span className="font-medium">Urządzenie:</span> {deviceName}{deviceModel ? ` (${deviceModel})` : ''}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <span className={`text-xs px-2 py-0.5 rounded-full mb-1 ${getTypeColor()}`}>
            {getTypeText()}
          </span>
          <p className="text-base font-semibold">{record.cost.toFixed(2)} zł</p>
          <p className="text-xs text-muted-foreground">Technik: {record.technician}</p>
        </div>
      </div>
      <div className="mt-1 ml-7">
        <p className="text-sm">{record.description}</p>
      </div>
    </div>
  );
};

export default ServiceHistoryItem;
