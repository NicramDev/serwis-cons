
import { Vehicle } from '../utils/types';
import { formatDate } from '../utils/data';
import { CalendarDays, Car, FileText, Info, MapPin, User, Tag, Truck, Gauge } from 'lucide-react';
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

  const getStatusClass = () => {
    switch (vehicle.status) {
      case 'ok':
        return "bg-green-100/50 text-green-700 border-green-200";
      case 'needs-service':
        return "bg-orange-100/50 text-orange-700 border-orange-200";
      case 'in-service':
        return "bg-blue-100/50 text-blue-700 border-blue-200";
      default:
        return "bg-red-100/50 text-red-700 border-red-200";
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

  const getVehicleIcon = () => {
    switch (vehicle.vehicleType) {
      case 'car':
        return <Car className="h-5 w-5" />;
      case 'truck':
        return <Truck className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  return (
    <div className="pt-2">
      <Tabs defaultValue="general">
        <TabsList className="w-full bg-secondary/50 p-1">
          <TabsTrigger value="general" className="flex-1 rounded-md data-[state=active]:shadow-sm">Informacje ogólne</TabsTrigger>
          <TabsTrigger value="service" className="flex-1 rounded-md data-[state=active]:shadow-sm">Serwis i przeglądy</TabsTrigger>
          {vehicle.attachments && vehicle.attachments.length > 0 && (
            <TabsTrigger value="files" className="flex-1 rounded-md data-[state=active]:shadow-sm">Dokumenty</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general" className="pt-4 animate-in fade-in-50 slide-in-from-bottom-3">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{vehicle.name}</h2>
              <p className="text-muted-foreground">{vehicle.brand || 'Brak marki'}</p>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="flex items-center gap-1 px-2.5 py-1 rounded-lg shadow-sm">
                {getVehicleIcon()}
                {getVehicleTypeText()}
              </Badge>
              <Badge variant="outline" className={`px-2.5 py-1 rounded-lg ${getStatusClass()} shadow-sm`}>
                {getStatusText()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
              <p className="text-sm text-muted-foreground">Numer rejestracyjny</p>
              <p className="font-medium">{vehicle.registrationNumber}</p>
            </div>
            <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
              <p className="text-sm text-muted-foreground">Numer VIN</p>
              <p className="font-medium">{vehicle.vin || 'Nie podano'}</p>
            </div>
            <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
              <p className="text-sm text-muted-foreground">Rok produkcji</p>
              <p className="font-medium">{vehicle.year}</p>
            </div>
            <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
              <p className="text-sm text-muted-foreground">Data zakupu</p>
              <p className="font-medium">{vehicle.purchaseDate ? formatDate(new Date(vehicle.purchaseDate)) : 'Nie podano'}</p>
            </div>
          </div>

          <Separator className="my-6" />
          
          <div className="space-y-5">
            {vehicle.driverName && (
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground/80">Kierowca</p>
                  <p className="font-medium">{vehicle.driverName}</p>
                </div>
              </div>
            )}
            
            {vehicle.fuelCardNumber && (
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <Gauge className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground/80">Numer karty paliwowej</p>
                  <p className="font-medium">{vehicle.fuelCardNumber}</p>
                </div>
              </div>
            )}
            
            {vehicle.gpsSystemNumber && (
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground/80">Numer systemu GPS</p>
                  <p className="font-medium">{vehicle.gpsSystemNumber}</p>
                </div>
              </div>
            )}
            
            {vehicle.tags && (
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <Tag className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground/80">Tagi</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {vehicle.tags.split(',').map((tag, index) => (
                      <Badge key={index} variant="secondary" className="font-normal shadow-sm">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {vehicle.notes && (
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground/80">Notatki</p>
                  <p className="text-sm whitespace-pre-line">{vehicle.notes}</p>
                </div>
              </div>
            )}
          </div>

          {vehicle.images && vehicle.images.length > 0 && (
            <div className="mt-6 p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
              <h3 className="text-lg font-semibold mb-3 text-foreground/80">Zdjęcia</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vehicle.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`${vehicle.name} - zdjęcie ${idx + 1}`} 
                    className="rounded-lg object-cover h-32 w-full shadow-sm hover:shadow-md transition-all"
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="service" className="space-y-6 pt-4 animate-in fade-in-50 slide-in-from-bottom-3">
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
            <div className="border border-border/50 rounded-lg p-8 text-center bg-white/50 backdrop-blur-sm shadow-sm">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Brak historii serwisowej dla tego pojazdu</p>
            </div>
          </div>
        </TabsContent>

        {vehicle.attachments && vehicle.attachments.length > 0 && (
          <TabsContent value="files" className="pt-4 animate-in fade-in-50 slide-in-from-bottom-3">
            <h3 className="text-lg font-semibold mb-3 text-foreground/80">Załączniki</h3>
            <div className="space-y-3">
              {vehicle.attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
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
                    className="text-primary hover:text-primary/80 text-sm font-medium bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
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
