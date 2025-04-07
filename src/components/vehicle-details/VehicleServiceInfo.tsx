
import { Vehicle, ServiceRecord, Device } from '../../utils/types';
import { formatDate } from '../../utils/formatting/dateUtils';
import { CalendarDays, FileText } from 'lucide-react';
import ServiceRecordList from '../ServiceRecordList';

interface VehicleServiceInfoProps {
  vehicle: Vehicle;
  services?: ServiceRecord[];
  devices?: Device[];
}

const VehicleServiceInfo = ({ vehicle, services = [], devices = [] }: VehicleServiceInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-foreground/60">Ubezpieczenie OC/AC</p>
              <p className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {vehicle.insuranceExpiryDate 
                  ? formatDate(new Date(vehicle.insuranceExpiryDate)) 
                  : 'Brak danych'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          {vehicle.insuranceReminderDays && (
            <p className="mt-2 text-xs text-muted-foreground">
              Przypomnienie: {vehicle.insuranceReminderDays} dni przed wygaśnięciem
            </p>
          )}
        </div>

        <div className="p-5 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-foreground/60">Przegląd ważny do</p>
              <p className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {vehicle.inspectionExpiryDate 
                  ? formatDate(new Date(vehicle.inspectionExpiryDate)) 
                  : 'Brak danych'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          {vehicle.inspectionReminderDays && (
            <p className="mt-2 text-xs text-muted-foreground">
              Przypomnienie: {vehicle.inspectionReminderDays} dni przed wygaśnięciem
            </p>
          )}
        </div>

        <div className="p-5 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-foreground/60">Serwis ważny do</p>
              <p className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {vehicle.serviceExpiryDate 
                  ? formatDate(new Date(vehicle.serviceExpiryDate)) 
                  : 'Brak danych'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          {vehicle.serviceReminderDays && (
            <p className="mt-2 text-xs text-muted-foreground">
              Przypomnienie: {vehicle.serviceReminderDays} dni przed wygaśnięciem
            </p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-lg font-semibold mb-3 text-foreground/80">Historia serwisów</h3>
        {services && services.length > 0 ? (
          <ServiceRecordList services={services} devices={devices} />
        ) : (
          <div className="border border-border/50 rounded-lg p-8 text-center bg-white/50 backdrop-blur-sm shadow-sm">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Brak historii serwisowej dla tego pojazdu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleServiceInfo;
