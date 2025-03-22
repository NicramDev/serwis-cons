
import { useEffect, useState } from 'react';
import { vehicles as initialVehicles, devices as initialDevices } from '../utils/data';
import VehicleCard from '../components/VehicleCard';
import { PlusCircle, Search, Cpu, Info, Wrench, X } from 'lucide-react'; // Removed AlertDialog
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import AddVehicleForm from '../components/AddVehicleForm';
import VehicleDetails from '../components/VehicleDetails';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import EditVehicleForm from '../components/EditVehicleForm';
import { Card, CardContent } from "@/components/ui/card";
import ServiceForm from '../components/ServiceForm';
import ServiceRecordList from '../components/ServiceRecordList';
import {
  AlertDialog as AlertDialogComponent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Vehicles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(() => {
    // Try to get vehicles from localStorage first
    const savedVehicles = localStorage.getItem('vehicles');
    return savedVehicles ? JSON.parse(savedVehicles) : initialVehicles;
  });
  const [allDevices, setAllDevices] = useState<Device[]>(() => {
    // Try to get devices from localStorage
    const savedDevices = localStorage.getItem('devices');
    return savedDevices ? JSON.parse(savedDevices) : initialDevices;
  });
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>(() => {
    const savedRecords = localStorage.getItem('serviceRecords');
    return savedRecords ? JSON.parse(savedRecords) : [];
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showingServiceRecords, setShowingServiceRecords] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  
  // Save vehicles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('vehicles', JSON.stringify(allVehicles));
  }, [allVehicles]);
  
  // Save devices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('devices', JSON.stringify(allDevices));
  }, [allDevices]);
  
  // Save service records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('serviceRecords', JSON.stringify(serviceRecords));
  }, [serviceRecords]);
  
  // Filter and sort vehicles alphabetically by name
  const filteredVehicles = allVehicles
    .filter(vehicle => 
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle.brand?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (vehicle.vin?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (vehicle.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (vehicle.tags?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Get devices for the selected vehicle
  const selectedVehicleDevices = allDevices.filter(
    device => device.vehicleId === selectedVehicleId
  );
  
  // Get service records for the selected vehicle
  const selectedVehicleServices = serviceRecords.filter(
    record => record.vehicleId === selectedVehicleId
  );
  
  const handleAddVehicle = (vehicleData: Partial<Vehicle>) => {
    const now = new Date();
    const nextServiceDate = vehicleData.serviceExpiryDate || new Date(now);
    if (!vehicleData.serviceExpiryDate) {
      nextServiceDate.setMonth(now.getMonth() + 6);
    }
    
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: uuidv4(),
      lastService: now, // Keep for compatibility
      nextService: nextServiceDate, // Keep for compatibility
      status: 'ok',
      model: 'Generic', // We need to keep model for compatibility with existing code
      registrationNumber: vehicleData.registrationNumber || '',
      year: vehicleData.year || 0,
      vehicleType: 'car', // Default type
    } as Vehicle;
    
    setAllVehicles(prevVehicles => [...prevVehicles, newVehicle]);
    setIsAddDialogOpen(false);
    toast.success("Pojazd został dodany pomyślnie");
  };
  
  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsDialogOpen(true);
  };
  
  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteVehicle = () => {
    if (vehicleToDelete) {
      // Remove all devices associated with this vehicle
      const updatedDevices = allDevices.filter(device => device.vehicleId !== vehicleToDelete.id);
      
      // Remove all service records associated with this vehicle
      const updatedServiceRecords = serviceRecords.filter(record => record.vehicleId !== vehicleToDelete.id);
      
      setAllVehicles(prevVehicles => prevVehicles.filter(v => v.id !== vehicleToDelete.id));
      setAllDevices(updatedDevices);
      setServiceRecords(updatedServiceRecords);
      
      if (selectedVehicleId === vehicleToDelete.id) {
        setSelectedVehicleId(null);
      }
      
      toast.success("Pojazd został usunięty pomyślnie");
    }
    setIsDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };
  
  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    setAllVehicles(prevVehicles => 
      prevVehicles.map(vehicle => 
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      )
    );
    setIsEditDialogOpen(false);
    toast.success("Pojazd został zaktualizowany pomyślnie");
  };
  
  const handleVehicleClick = (vehicleId: string) => {
    if (selectedVehicleId === vehicleId) {
      setSelectedVehicleId(null); // Zamknij, jeśli ten sam pojazd jest już wybrany
    } else {
      setSelectedVehicleId(vehicleId); // Wybierz nowy pojazd
      setShowingServiceRecords(false); // Reset view to devices
    }
  };
  
  const handleServiceClick = () => {
    setShowingServiceRecords(!showingServiceRecords);
  };
  
  const handleAddService = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setIsServiceDialogOpen(true);
  };
  
  const handleSubmitService = (serviceRecord: ServiceRecord) => {
    setServiceRecords(prev => [...prev, serviceRecord]);
    setIsServiceDialogOpen(false);
    setShowingServiceRecords(true); // Switch to service records view
    toast.success("Serwis/naprawa została dodana pomyślnie");
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Pojazdy</h1>
            <p className="text-muted-foreground">Zarządzaj i śledź wszystkie swoje pojazdy</p>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Szukaj pojazdów..."
                className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 w-full shadow-sm backdrop-blur-sm bg-white/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              className="flex items-center justify-center space-x-2 shadow-sm"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Dodaj Pojazd</span>
            </Button>
          </div>
        </div>
        
        {filteredVehicles.length > 0 ? (
          <div className="flex">
            {/* Lewa strona - lista pojazdów (1/3 szerokości) */}
            <div className="w-1/3 pr-4 space-y-2 overflow-y-auto max-h-[70vh]">
              {filteredVehicles.map((vehicle, index) => (
                <VehicleCard 
                  key={vehicle.id}
                  vehicle={vehicle} 
                  delay={index % 5 + 1}
                  onViewDetails={() => handleViewDetails(vehicle)}
                  onEdit={() => handleEditVehicle(vehicle)}
                  onDelete={() => handleDeleteVehicle(vehicle)}
                  isSelected={selectedVehicleId === vehicle.id}
                  onClick={() => handleVehicleClick(vehicle.id)}
                  compact={true}
                />
              ))}
            </div>
            
            {/* Prawa strona - szczegóły pojazdu i urządzenia (2/3 szerokości) */}
            <div className="w-2/3 pl-4">
              {selectedVehicleId ? (
                <Card className="w-full border border-border/50 shadow-sm bg-white/80 backdrop-blur-sm animate-in fade-in-50 slide-in-from-right-5">
                  <CardContent className="p-6">
                    {(() => {
                      const vehicle = allVehicles.find(v => v.id === selectedVehicleId);
                      if (!vehicle) return null;
                      
                      return (
                        <div className="space-y-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{vehicle.name}</h2>
                              <p className="text-muted-foreground">{vehicle.brand || 'Brak marki'}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleViewDetails(vehicle)}
                              >
                                <Info className="h-4 w-4 mr-1" />
                                Szczegóły
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                onClick={() => handleEditVehicle(vehicle)}
                              >
                                Edytuj
                              </Button>
                              <Button 
                                size="sm" 
                                variant={showingServiceRecords ? "default" : "outline"}
                                onClick={handleServiceClick}
                              >
                                <Wrench className="h-4 w-4 mr-1" />
                                Serwis
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                              <p className="text-sm text-muted-foreground">Numer rejestracyjny</p>
                              <p className="font-medium">{vehicle.registrationNumber}</p>
                            </div>
                            <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                              <p className="text-sm text-muted-foreground">Następny serwis</p>
                              <p className="font-medium">
                                {vehicle.serviceExpiryDate ? 
                                  new Date(vehicle.serviceExpiryDate).toLocaleDateString() : 
                                  new Date(vehicle.nextService).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          {/* Toggle between devices and service records */}
                          <div className="pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between mb-3">
                              {!showingServiceRecords ? (
                                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                  <Cpu className="h-4 w-4" />
                                  <span>Przypisane urządzenia ({selectedVehicleDevices.length})</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                  <Wrench className="h-4 w-4" />
                                  <span>Historia serwisowa ({selectedVehicleServices.length})</span>
                                </div>
                              )}
                              
                              <Button 
                                size="sm" 
                                onClick={() => showingServiceRecords 
                                  ? setIsServiceDialogOpen(true) 
                                  : setShowingServiceRecords(true)
                                }
                              >
                                {showingServiceRecords ? "Dodaj serwis/naprawę" : "Pokaż historię serwisową"}
                              </Button>
                            </div>
                            
                            {!showingServiceRecords ? (
                              selectedVehicleDevices.length > 0 ? (
                                <div className="space-y-3">
                                  {selectedVehicleDevices.map((device) => (
                                    <div 
                                      key={device.id} 
                                      className="p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-border/50 hover:shadow-md transition-all"
                                    >
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <h4 className="font-medium">{device.name}</h4>
                                          <p className="text-xs text-muted-foreground">{device.type}</p>
                                        </div>
                                        <Badge variant={
                                          device.status === 'ok' ? 'outline' : 
                                          device.status === 'needs-service' ? 'secondary' : 
                                          device.status === 'in-service' ? 'default' : 
                                          'destructive'
                                        }>
                                          {device.status === 'ok' ? 'Sprawne' : 
                                          device.status === 'needs-service' ? 'Wymaga serwisu' : 
                                          device.status === 'in-service' ? 'W serwisie' : 
                                          'Problem'}
                                        </Badge>
                                      </div>
                                      <div className="mt-2 pt-2 border-t border-border/50 flex justify-between">
                                        <span className="text-xs text-muted-foreground">Nr seryjny: {device.serialNumber}</span>
                                        <span className="text-xs text-muted-foreground">Typ: {device.type}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50 text-center">
                                  <p className="text-sm text-muted-foreground">Brak przypisanych urządzeń do tego pojazdu.</p>
                                </div>
                              )
                            ) : (
                              <ServiceRecordList services={selectedVehicleServices} />
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center p-6 bg-white/50 backdrop-blur-sm border border-border/50 rounded-lg shadow-sm">
                  <div className="text-center">
                    <div className="icon-container mx-auto mb-4">
                      <Search className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Wybierz pojazd</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Wybierz pojazd z listy po lewej stronie, aby zobaczyć szczegóły i przypisane urządzenia
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="backdrop-blur-card rounded-xl p-12 text-center shadow-md border border-border/50">
            <div className="icon-container mx-auto mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nie znaleziono pojazdów</h3>
            <p className="text-muted-foreground">
              Żadne pojazdy nie pasują do kryteriów wyszukiwania. Spróbuj innego zapytania lub dodaj nowy pojazd.
            </p>
          </div>
        )}
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Dodaj nowy pojazd</DialogTitle>
            <DialogDescription>
              Wypełnij formularz, aby dodać nowy pojazd do floty
            </DialogDescription>
          </DialogHeader>
          <AddVehicleForm 
            onSubmit={handleAddVehicle} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Szczegóły pojazdu</DialogTitle>
            <DialogDescription>
              Pełne informacje o pojeździe
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && <VehicleDetails vehicle={selectedVehicle} />}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edytuj pojazd</DialogTitle>
            <DialogDescription>
              Zaktualizuj informacje o pojeździe
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <EditVehicleForm
              vehicle={selectedVehicle}
              onSubmit={handleUpdateVehicle}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Dodaj serwis/naprawę</DialogTitle>
            <DialogDescription>
              Dodaj informacje o serwisie lub naprawie urządzenia
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleId && (
            <ServiceForm
              vehicleId={selectedVehicleId}
              devices={selectedVehicleDevices}
              onSubmit={handleSubmitService}
              onCancel={() => setIsServiceDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialogComponent open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć ten pojazd?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Spowoduje to usunięcie pojazdu oraz wszystkich przypisanych urządzeń i historii serwisowej.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteVehicle} className="bg-destructive text-destructive-foreground">
              Usuń pojazd
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogComponent>
    </div>
  );
};

export default Vehicles;
