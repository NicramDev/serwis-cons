
import { Vehicle } from "../utils/types";
import VehicleCard from './VehicleCard';

interface VehicleListProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleClick: (vehicleId: string) => void;
  onViewDetails: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

const VehicleList = ({ 
  vehicles, 
  selectedVehicleId, 
  onVehicleClick, 
  onViewDetails, 
  onEdit, 
  onDelete 
}: VehicleListProps) => {
  if (vehicles.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-border/50">
        Brak pojazdów spełniających kryteria wyszukiwania.
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[70vh]">
      {vehicles.map((vehicle, index) => (
        <VehicleCard 
          key={vehicle.id}
          vehicle={vehicle} 
          delay={index % 5 + 1}
          onViewDetails={() => onViewDetails(vehicle)}
          onEdit={() => onEdit(vehicle)}
          onDelete={() => onDelete(vehicle)}
          isSelected={selectedVehicleId === vehicle.id}
          onClick={() => onVehicleClick(vehicle.id)}
          compact={true}
        />
      ))}
    </div>
  );
};

export default VehicleList;
