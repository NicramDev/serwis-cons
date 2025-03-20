
import { Vehicle } from '../utils/types';
import { formatDate } from '../utils/data';
import { CalendarDays, Car, FileText, Info, MapPin, User, Tag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  const getStatusText = () => {
    switch (vehicle.status) {
      case 'ok':
        return "Sprawny";
      case 'needs-service':
        return "Wymaga serwisu";
      case 'in-service':
        return "W serwisie";
      default:
        return "Problem";
    }
  };

  const getVehicleTypeText = () => {
    switch (vehicle.vehicleType) {
      case 'car':
        return "Samochód";
      case 'truck':
        return "Ciężarówka";
      case 'motorcycle':
        return "Motocykl";
      default:
        return "Inny";
    }
  };

  return (
    <div className="pt-2">
      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">Informacje ogólne</TabsTrigger>
          <TabsTrigger value="service" className="flex-1">Serwis i przeglądy</TabsTrigger>
          {vehicle.attachments && vehicle.attachments.length > 0 && (
            <TabsTrigger value="files" className="flex-1">Dokumenty</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general" className="pt-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{vehicle.name}</h2>
              <p className="text-muted-foreground">{vehicle.brand || 'Brak marki'}</p>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline">{getVehicleTypeText()}</Badge>
              <Badge variant={
                vehicle.status === 'ok' ? 'outline' : 
                vehicle.status === 'needs-service' ? 'secondary' : 
                vehicle.status === 'in-service' ? 'default' : 
                'destructive'
              }>
                {getStatusText()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Numer rejestracyjny</p>
              <p className="font-medium">{vehicle.registrationNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Numer VIN</p>
              <p className="font-medium">{vehicle.vin || 'Nie podano'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rok produkcji</p>
              <p className="font-medium">{vehicle.year}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Data zakupu</p>
              <p className="font-medium">{vehicle.purchaseDate ? formatDate(new Date(vehicle.purchaseDate)) : 'Nie podano'}</p>
            </div>
          </div>

          <Separator className="my-4" />
          
          <div className="space-y-4">
            {vehicle.driverName && (
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Kierowca</p>
                  <p>{vehicle.driverName}</p>
                </div>
              </div>
            )}
            
            {vehicle.fuelCardNumber && (
              <div className="flex items-start space-x-3">
                <Car className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Numer karty paliwowej</p>
                  <p>{vehicle.fuelCardNumber}</p>
                </div>
              </div>
            )}
            
            {vehicle.gpsSystemNumber && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Numer systemu GPS</p>
                  <p>{vehicle.gpsSystemNumber}</p>
                </div>
              </div>
            )}
            
            {vehicle.tags && (
              <div className="flex items-start space-x-3">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tagi</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {vehicle.tags.split(',').map((tag, index) => (
                      <Badge key={index} variant="secondary" className="font-normal">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {vehicle.notes && (
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Notatki</p>
                  <p className="text-sm whitespace-pre-line">{vehicle.notes}</p>
                </div>
              </div>
            )}
          </div>

          {vehicle.images && vehicle.images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Zdjęcia</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {vehicle.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`${vehicle.name} - zdjęcie ${idx + 1}`} 
                    className="rounded-md object-cover h-32 w-full"
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="service" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-md bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Ubezpieczenie OC/AC</p>
                  <p className="text-lg font-semibold">
                    {vehicle.insuranceExpiryDate 
                      ? formatDate(new Date(vehicle.insuranceExpiryDate)) 
                      : 'Brak danych'}
                  </p>
                </div>
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              {vehicle.insuranceReminderDays && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Przypomnienie: {vehicle.insuranceReminderDays} dni przed wygaśnięciem
                </p>
              )}
            </div>

            <div className="p-4 border border-border rounded-md bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Przegląd ważny do</p>
                  <p className="text-lg font-semibold">
                    {vehicle.inspectionExpiryDate 
                      ? formatDate(new Date(vehicle.inspectionExpiryDate)) 
                      : 'Brak danych'}
                  </p>
                </div>
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              {vehicle.inspectionReminderDays && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Przypomnienie: {vehicle.inspectionReminderDays} dni przed wygaśnięciem
                </p>
              )}
            </div>

            <div className="p-4 border border-border rounded-md bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Serwis ważny do</p>
                  <p className="text-lg font-semibold">
                    {vehicle.serviceExpiryDate 
                      ? formatDate(new Date(vehicle.serviceExpiryDate)) 
                      : 'Brak danych'}
                  </p>
                </div>
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              {vehicle.serviceReminderDays && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Przypomnienie: {vehicle.serviceReminderDays} dni przed wygaśnięciem
                </p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-3">Historia serwisów</h3>
            <div className="border border-border rounded-md p-6 text-center bg-secondary/30">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Brak historii serwisowej dla tego pojazdu</p>
            </div>
          </div>
        </TabsContent>

        {vehicle.attachments && vehicle.attachments.length > 0 && (
          <TabsContent value="files" className="pt-4">
            <h3 className="text-lg font-semibold mb-3">Załączniki</h3>
            <div className="space-y-2">
              {vehicle.attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-secondary/50 p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.type} • {(file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Otwórz
                  </a>
                </div>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default VehicleDetails;
