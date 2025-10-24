import React from 'react';
import { VehicleEquipment } from '../utils/types';
import { Box } from 'lucide-react';

interface VehicleEquipmentListProps {
  vehicleEquipment: VehicleEquipment[];
}

const VehicleEquipmentList = ({ vehicleEquipment }: VehicleEquipmentListProps) => {
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
      {sortedVehicleEquipment.map((ve) => (
        <div 
          key={ve.id} 
          className="p-4 border border-border/50 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
        >
          <div className="flex items-start gap-4">
            {ve.thumbnail ? (
              <img 
                src={ve.thumbnail} 
                alt={ve.name}
                className="h-16 w-16 rounded object-cover border border-border/50"
              />
            ) : (
              <div className="h-16 w-16 rounded bg-muted/30 flex items-center justify-center border border-border/50">
                <Box className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm mb-1">{ve.name}</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {ve.brand && (
                  <div>
                    <span className="font-medium">Marka:</span> {ve.brand}
                  </div>
                )}
                {ve.type && (
                  <div>
                    <span className="font-medium">Typ:</span> {ve.type}
                  </div>
                )}
                {ve.serialNumber && (
                  <div>
                    <span className="font-medium">Nr seryjny:</span> {ve.serialNumber}
                  </div>
                )}
                {ve.year && (
                  <div>
                    <span className="font-medium">Rok:</span> {ve.year}
                  </div>
                )}
              </div>
              {ve.notes && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{ve.notes}</p>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                ve.status === 'ok' ? 'bg-green-100 text-green-800' :
                ve.status === 'needs-service' ? 'bg-yellow-100 text-yellow-800' :
                ve.status === 'in-service' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {ve.status === 'ok' ? 'OK' :
                 ve.status === 'needs-service' ? 'Wymaga serwisu' :
                 ve.status === 'in-service' ? 'W serwisie' :
                 'Błąd'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleEquipmentList;
