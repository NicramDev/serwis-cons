
import { Vehicle } from "../utils/types";
import VehicleCard from './VehicleCard';

interface VehicleListProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleClick: (vehicleId: string) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onView?: (vehicle: Vehicle) => void;
}

const VehicleList = ({ 
  vehicles, 
  selectedVehicleId, 
  onVehicleClick, 
  onEdit, 
  onDelete,
  onView
}: VehicleListProps) => {
  if (vehicles.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-border/50">
        Brak pojazdów spełniających kryteria wyszukiwania.
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto max-h-[70vh] w-full">
      {vehicles.map((vehicle, index) => (
        <VehicleCard 
          key={vehicle.id}
          vehicle={vehicle} 
          delay={index % 5 + 1}
          onEdit={() => onEdit(vehicle)}
          onDelete={() => onDelete(vehicle)}
          isSelected={selectedVehicleId === vehicle.id}
          onClick={() => onVehicleClick(vehicle.id)}
          onView={onView ? () => onView(vehicle) : undefined}
          compact={false}
        />
      ))}
    </div>
  );
};

export default VehicleList;
