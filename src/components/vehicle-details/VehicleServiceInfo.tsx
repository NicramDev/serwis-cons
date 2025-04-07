
import { useState } from 'react';
import { Vehicle, ServiceRecord, Device } from '../../utils/types';
import { formatDate } from '../../utils/formatting/dateUtils';
import { CalendarDays, FileText, Filter } from 'lucide-react';
import ServiceRecordList from '../ServiceRecordList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface VehicleServiceInfoProps {
  vehicle: Vehicle;
  services?: ServiceRecord[];
  devices?: Device[];
  onOpenAttachment?: (url: string) => void;
}

const VehicleServiceInfo = ({ 
  vehicle, 
  services = [], 
  devices = [], 
  onOpenAttachment = () => {} 
}: VehicleServiceInfoProps) => {
  const [filterType, setFilterType] = useState<'all' | 'vehicle' | 'device'>('all');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  
  // Filter services based on selection
  const filteredServices = services.filter(service => {
    if (filterType === 'all') return true;
    if (filterType === 'vehicle') return !service.deviceId;
    if (filterType === 'device') {
      return selectedDeviceId ? service.deviceId === selectedDeviceId : service.deviceId !== undefined;
    }
    return true;
  });
  
  // Get device names for select options
  const deviceOptions = devices.filter(device => device.vehicleId === vehicle.id);

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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground/80">Historia serwisów</h3>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtruj:</span>
          </div>
        </div>
        
        {/* Service filter options */}
        <div className="mb-4 p-4 bg-white/60 rounded-lg border border-border/30 backdrop-blur-sm">
          <div className="mb-3">
            <RadioGroup 
              defaultValue="all" 
              className="flex gap-4"
              value={filterType}
              onValueChange={(value) => setFilterType(value as 'all' | 'vehicle' | 'device')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">Wszystkie</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vehicle" id="vehicle" />
                <Label htmlFor="vehicle">Tylko pojazd</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="device" id="device" />
                <Label htmlFor="device">Urządzenia</Label>
              </div>
            </RadioGroup>
          </div>
          
          {filterType === 'device' && deviceOptions.length > 0 && (
            <div className="mt-3">
              <Select 
                value={selectedDeviceId || ''} 
                onValueChange={(value) => setSelectedDeviceId(value || null)}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Wybierz urządzenie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Wszystkie urządzenia</SelectItem>
                  {deviceOptions.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        {services && filteredServices.length > 0 ? (
          <ServiceRecordList 
            services={filteredServices} 
            devices={devices} 
            onOpenAttachment={onOpenAttachment} 
          />
        ) : (
          <div className="border border-border/50 rounded-lg p-8 text-center bg-white/50 backdrop-blur-sm shadow-sm">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {filterType === 'all' ? 'Brak historii serwisowej dla tego pojazdu' : 
               filterType === 'vehicle' ? 'Brak historii serwisowej dla tego pojazdu' : 
               'Brak historii serwisowej dla wybranego urządzenia'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleServiceInfo;
