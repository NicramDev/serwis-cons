
import { useEffect, useState } from 'react';
import { vehicles as initialVehicles, devices as initialDevices } from '../utils/data';
import { PlusCircle, Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import AddVehicleForm from '../components/AddVehicleForm';
import VehicleDetails from '../components/VehicleDetails';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import EditVehicleForm from '../components/EditVehicleForm';
import ServiceForm from '../components/ServiceForm';
import VehicleList from '../components/VehicleList';
import VehicleDetailPanel from '../components/VehicleDetailPanel';
import NoVehiclesFound from '../components/NoVehiclesFound';
import VehicleSearchBar from '../components/VehicleSearchBar';
import {
  AlertDialog,
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
  
  const handleAddService = () => {
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
          
          <VehicleSearchBar 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
            onAddVehicle={() => setIsAddDialogOpen(true)} 
          />
        </div>
        
        {filteredVehicles.length > 0 ? (
          <div className="flex">
            {/* Lewa strona - lista pojazdów (1/3 szerokości) */}
            <div className="w-1/3 pr-4">
              <VehicleList 
                vehicles={filteredVehicles}
                selectedVehicleId={selectedVehicleId}
                onVehicleClick={handleVehicleClick}
                onViewDetails={handleViewDetails}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
              />
            </div>
            
            {/* Prawa strona - szczegóły pojazdu i urządzenia (2/3 szerokości) */}
            <div className="w-2/3 pl-4">
              <VehicleDetailPanel 
                selectedVehicleId={selectedVehicleId}
                vehicles={allVehicles}
                devices={allDevices}
                services={selectedVehicleServices}
                showingServiceRecords={showingServiceRecords}
                onServiceClick={handleServiceClick}
                onViewDetails={handleViewDetails}
                onEdit={handleEditVehicle}
                onAddService={handleAddService}
              />
            </div>
          </div>
        ) : (
          <NoVehiclesFound />
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
              devices={allDevices.filter(device => device.vehicleId === selectedVehicleId)}
              onSubmit={handleSubmitService}
              onCancel={() => setIsServiceDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
      </AlertDialog>
    </div>
  );
};

export default Vehicles;
