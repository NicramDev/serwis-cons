
import { useState } from 'react';
import { Vehicle, Device } from "../utils/types";
import VehicleCard from './VehicleCard';
import DeviceCard from './DeviceCard';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
  devices?: Device[];
  selectedVehicleId: string | null;
  selectedDeviceId?: string | null;
  onVehicleClick: (vehicleId: string) => void;
  onDeviceClick?: (deviceId: string) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onView?: (vehicle: Vehicle) => void;
  onEditDevice?: (device: Device) => void;
  onDeleteDevice?: (device: Device) => void;
  onViewDevice?: (device: Device) => void;
  onAddDeviceService?: (deviceId: string) => void;
}

const VehicleList = ({ 
  vehicles, 
  devices = [],
  selectedVehicleId, 
  selectedDeviceId,
  onVehicleClick, 
  onDeviceClick,
  onEdit, 
  onDelete,
  onView,
  onEditDevice,
  onDeleteDevice,
  onViewDevice,
  onAddDeviceService
}: VehicleListProps) => {
  // Combine vehicles and devices for display
  const hasItems = vehicles.length > 0 || devices.length > 0;
  
  // Track which device's service menu is open
  const [expandedDeviceId, setExpandedDeviceId] = useState<string | null>(null);
  
  const toggleDeviceMenu = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDeviceId(expandedDeviceId === deviceId ? null : deviceId);
  };
  
  if (!hasItems) {
    return (
      <div className="p-4 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-border/50">
        Brak pojazdów i urządzeń spełniających kryteria wyszukiwania.
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[70vh]">
      {/* Display vehicles */}
      {vehicles.map((vehicle, index) => (
        <VehicleCard 
          key={`vehicle-${vehicle.id}`}
          vehicle={vehicle} 
          delay={index % 5 + 1}
          onEdit={() => onEdit(vehicle)}
          onDelete={() => onDelete(vehicle)}
          isSelected={selectedVehicleId === vehicle.id}
          onClick={() => onVehicleClick(vehicle.id)}
          onView={onView ? () => onView(vehicle) : undefined}
          compact={true}
        />
      ))}
      
      {/* Display devices */}
      {devices.map((device, index) => (
        <div key={`device-${device.id}`} className="relative">
          <DeviceCard 
            device={device}
            delay={(index + vehicles.length) % 5 + 1}
            onEdit={onEditDevice ? () => onEditDevice(device) : undefined}
            onDelete={onDeleteDevice ? () => onDeleteDevice(device) : undefined}
            onViewDetails={onViewDevice ? () => onViewDevice(device) : undefined}
            isSelected={selectedDeviceId === device.id}
            onClick={onDeviceClick ? () => onDeviceClick(device.id) : () => {}}
            inVehicleList={true}
          />
          {onAddDeviceService && (
            <div className="absolute right-0 -top-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-6 w-6 rounded-full shadow-sm bg-primary text-primary-foreground hover:bg-primary/80"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddDeviceService(device.id);
                }}
              >
                <PlusCircle className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VehicleList;
