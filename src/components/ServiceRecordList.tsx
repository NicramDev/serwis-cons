import { ServiceRecord } from "../utils/types";
import { formatDate } from "../utils/data";
import { Wrench, Hammer, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ServiceRecordListProps {
  services: ServiceRecord[];
}

const ServiceRecordList = ({ services }: ServiceRecordListProps) => {
  if (services.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-border/50">
        Brak historii serwisowej dla tego pojazdu.
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'repair':
        return <Wrench className="h-4 w-4" />;
      case 'maintenance':
        return <Hammer className="h-4 w-4" />;
      case 'inspection':
        return <FileCheck className="h-4 w-4" />;
      default:
        return <Hammer className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'repair':
        return "Naprawa";
      case 'maintenance':
        return "Serwis";
      case 'inspection':
        return "Przegląd";
      default:
        return "Inne";
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'repair':
        return "destructive";
      case 'maintenance':
        return "default";
      case 'inspection':
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div key={service.id} className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-border/50 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={getTypeBadgeVariant(service.type)} className="flex items-center gap-1">
                  {getTypeIcon(service.type)}
                  {getTypeText(service.type)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(new Date(service.date))}
                </span>
              </div>
              <h3 className="mt-2 font-medium">{service.deviceName}</h3>
              <p className="text-sm text-muted-foreground">Miejsce: {service.location}</p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-primary">{service.cost.toFixed(2)} PLN</div>
              <div className="text-xs text-muted-foreground">Wykonał: {service.technician}</div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-border/30">
            <p className="text-sm whitespace-pre-line">{service.description}</p>
          </div>
          
          {service.images && service.images.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/30">
              <div className="flex flex-wrap gap-2">
                {service.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Service image ${idx}`} 
                    className="h-16 w-16 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ServiceRecordList;
