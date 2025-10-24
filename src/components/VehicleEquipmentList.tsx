import React from 'react';
import { VehicleEquipment } from '../utils/types';
import { Box } from 'lucide-react';
import VehicleEquipmentCard from './VehicleEquipmentCard';

interface VehicleEquipmentListProps {
  vehicleEquipment: VehicleEquipment[];
  onEditVehicleEquipment?: (ve: VehicleEquipment) => void;
  onDeleteVehicleEquipment?: (ve: VehicleEquipment) => void;
  onViewVehicleEquipment?: (ve: VehicleEquipment) => void;
  onOpenAttachment?: (url: string) => void;
  onMoveVehicleEquipment?: (ve: VehicleEquipment) => void;
}

const VehicleEquipmentList = ({ 
  vehicleEquipment,
  onEditVehicleEquipment,
  onDeleteVehicleEquipment,
  onViewVehicleEquipment,
  onOpenAttachment,
  onMoveVehicleEquipment
}: VehicleEquipmentListProps) => {
  if (vehicleEquipment.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Box className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Brak equipment w nowej bazie</p>
      </div>
    );
  }

  const sortedVehicleEquipment = [...vehicleEquipment].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="space-y-3">
      {sortedVehicleEquipment.map((ve, index) => (
        <VehicleEquipmentCard
          key={ve.id}
          vehicleEquipment={ve}
          onEdit={onEditVehicleEquipment}
          onDelete={onDeleteVehicleEquipment}
          onViewDetails={onViewVehicleEquipment}
          onAttachmentClick={onOpenAttachment}
          onMove={onMoveVehicleEquipment}
          delay={index * 50}
        />
      ))}
    </div>
  );
};

export default VehicleEquipmentList;
