
import { formatDate } from "../utils/data";
import { ServiceRecord } from "../utils/types";
import { WrenchIcon, CarIcon, SmartphoneIcon } from "lucide-react";

interface ServiceHistoryItemProps {
  record: ServiceRecord;
  delay?: number;
}

const ServiceHistoryItem = ({ record, delay = 0 }: ServiceHistoryItemProps) => {
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
            <p className="text-sm text-muted-foreground">{formatDate(record.date)}</p>
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
