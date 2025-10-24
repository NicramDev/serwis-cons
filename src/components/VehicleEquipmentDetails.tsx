import React from 'react';
import { VehicleEquipment } from '../utils/types';
import { Box, Calendar, DollarSign } from 'lucide-react';
import { formatDate } from '../utils/formatting/dateUtils';

interface VehicleEquipmentDetailsProps {
  vehicleEquipment: VehicleEquipment;
}

const VehicleEquipmentDetails = ({ vehicleEquipment }: VehicleEquipmentDetailsProps) => {
  const statusConfig = {
    ok: { label: 'OK', className: 'bg-green-100 text-green-800 border-green-200' },
    'needs-service': { label: 'Wymaga serwisu', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    'in-service': { label: 'W serwisie', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    error: { label: 'Błąd', className: 'bg-red-100 text-red-800 border-red-200' }
  };

  const status = statusConfig[vehicleEquipment.status] || statusConfig.ok;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        {vehicleEquipment.thumbnail ? (
          <img 
            src={vehicleEquipment.thumbnail} 
            alt={vehicleEquipment.name}
            className="h-24 w-24 rounded-lg object-cover border border-border/50"
          />
        ) : (
          <div className="h-24 w-24 rounded-lg bg-muted/30 flex items-center justify-center border border-border/50">
            <Box className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{vehicleEquipment.name}</h3>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${status.className}`}>
            {status.label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Informacje podstawowe</h4>
          
          {vehicleEquipment.brand && (
            <div>
              <p className="text-xs text-muted-foreground">Marka</p>
              <p className="font-medium">{vehicleEquipment.brand}</p>
            </div>
          )}
          
          {vehicleEquipment.type && (
            <div>
              <p className="text-xs text-muted-foreground">Typ</p>
              <p className="font-medium">{vehicleEquipment.type}</p>
            </div>
          )}
          
          {vehicleEquipment.model && (
            <div>
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="font-medium">{vehicleEquipment.model}</p>
            </div>
          )}
          
          {vehicleEquipment.serialNumber && (
            <div>
              <p className="text-xs text-muted-foreground">Numer seryjny</p>
              <p className="font-medium">{vehicleEquipment.serialNumber}</p>
            </div>
          )}
          
          {vehicleEquipment.year && (
            <div>
              <p className="text-xs text-muted-foreground">Rok produkcji</p>
              <p className="font-medium">{vehicleEquipment.year}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Dane finansowe i serwis</h4>
          
          {vehicleEquipment.purchasePrice && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Cena zakupu</p>
                <p className="font-medium">{vehicleEquipment.purchasePrice.toFixed(2)} PLN</p>
              </div>
            </div>
          )}
          
          {vehicleEquipment.purchaseDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Data zakupu</p>
                <p className="font-medium">{formatDate(vehicleEquipment.purchaseDate)}</p>
              </div>
            </div>
          )}
          
          {vehicleEquipment.serviceExpiryDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Wymagany serwis</p>
                <p className="font-medium">{formatDate(vehicleEquipment.serviceExpiryDate)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {vehicleEquipment.notes && (
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Notatki</h4>
          <p className="text-sm whitespace-pre-wrap">{vehicleEquipment.notes}</p>
        </div>
      )}

      {vehicleEquipment.images && vehicleEquipment.images.length > 0 && (
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Zdjęcia</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {vehicleEquipment.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${vehicleEquipment.name} - zdjęcie ${index + 1}`}
                className="rounded-lg object-cover aspect-square border border-border/50"
              />
            ))}
          </div>
        </div>
      )}

      {vehicleEquipment.attachments && vehicleEquipment.attachments.length > 0 && (
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Załączniki</h4>
          <div className="space-y-2">
            {vehicleEquipment.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium truncate">{attachment.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(attachment.size / 1024).toFixed(1)} KB)
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleEquipmentDetails;
