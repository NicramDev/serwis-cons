
import { Vehicle, Device } from "../utils/types";
import VehicleCard from './VehicleCard';
import DeviceCard from './DeviceCard';

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
  onViewDevice
}: VehicleListProps) => {
  // Combine vehicles and devices for display
  const hasItems = vehicles.length > 0 || devices.length > 0;
  
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
        <DeviceCard 
          key={`device-${device.id}`}
          device={device}
          delay={(index + vehicles.length) % 5 + 1}
          onEdit={onEditDevice ? () => onEditDevice(device) : undefined}
          onDelete={onDeleteDevice ? () => onDeleteDevice(device) : undefined}
          onViewDetails={onViewDevice ? () => onViewDevice(device) : undefined}
          isSelected={selectedDeviceId === device.id}
          onClick={onDeviceClick ? () => onDeviceClick(device.id) : () => {}}
          inVehicleList={true}
        />
      ))}
    </div>
  );
};

export default VehicleList;
