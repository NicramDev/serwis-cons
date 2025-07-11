
import { formatDate } from "../utils/formatting/dateUtils";
import { ServiceRecord } from "../utils/types";
import { WrenchIcon, CarIcon, SmartphoneIcon } from "lucide-react";

interface ServiceHistoryItemProps {
  record: ServiceRecord;
  delay?: number;
  vehicleName?: string;
  deviceName?: string;
  vehicleModel?: string;
  deviceModel?: string;
  deviceThumbnail?: string | null;
}

const ServiceHistoryItem = ({ 
  record, 
  delay = 0, 
  vehicleName,
  deviceName,
  vehicleModel,
  deviceModel,
  deviceThumbnail
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
        return 'Serwis';
      case 'inspection':
        return 'Inspekcja';
      default:
        return 'Inne';
    }
  };
  
  const recordDate = record.date instanceof Date ? record.date : new Date(record.date);
  
  // Function to clean vehicle name by removing "(Generic)" suffix
  const cleanVehicleName = (name: string) => {
    return name.replace(" (Generic)", "");
  };
  
  return (
    <div className={`glass-card rounded-xl p-4 mb-3 opacity-0 animate-fade-in ${delayClass}`}>
      <div className="flex items-center space-x-2 mb-3">
        <div className="icon-container">
          {getTypeIcon()}
        </div>
        <span className="text-xs text-muted-foreground">{formatDate(recordDate)}</span>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${getTypeColor()}`}>
          {getTypeText()}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column - Vehicle and Device info */}
        <div className="space-y-2">
          {record.vehicleId && vehicleName && (
            <p className="text-sm">
              <span className="font-medium">Pojazd:</span> {cleanVehicleName(vehicleName)}
              {vehicleModel && vehicleModel !== "Generic" ? ` (${vehicleModel})` : ''}
            </p>
          )}
          
          {record.deviceId && deviceName && (
            <div className="flex items-center gap-2">
              {deviceThumbnail ? (
                <div className="h-12 w-12 rounded-md overflow-hidden bg-background/50 flex-shrink-0 flex items-center justify-center border border-border/30">
                  <img 
                    src={deviceThumbnail} 
                    alt={deviceName} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-md overflow-hidden bg-background/50 flex-shrink-0 flex items-center justify-center border border-border/30">
                  <SmartphoneIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="text-sm">
                  <span className="font-medium">Urządzenie:</span> {deviceName}
                  {deviceModel ? ` (${deviceModel})` : ''}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Right column - Service details */}
        <div>
          <p className="text-sm font-medium mb-1">Zakres serwisu/naprawy:</p>
          <div className="pl-2">
            {record.description.split('\n').map((line, index) => (
              <p key={index} className="text-sm">- {line}</p>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-border/50 flex justify-between">
        <p className="text-xs text-muted-foreground">Technik: {record.technician}</p>
        <p className="text-base font-semibold">{record.cost.toFixed(2)} zł</p>
      </div>
    </div>
  );
};

export default ServiceHistoryItem;
