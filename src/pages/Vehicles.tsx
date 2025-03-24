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
import AddDeviceForm from '../components/AddDeviceForm';
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
    const savedVehicles = localStorage.getItem('vehicles');
    return savedVehicles ? JSON.parse(savedVehicles) : initialVehicles;
  });
  const [allDevices, setAllDevices] = useState<Device[]>(() => {
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
  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false);
  const [isEditDeviceDialogOpen, setIsEditDeviceDialogOpen] = useState(false);
  const [isDeleteDeviceDialogOpen, setIsDeleteDeviceDialogOpen] = useState(false);
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);
  const [isDeleteServiceDialogOpen, setIsDeleteServiceDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [showingServiceRecords, setShowingServiceRecords] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceRecord | null>(null);
  const [unsavedServiceChanges, setUnsavedServiceChanges] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('vehicles', JSON.stringify(allVehicles));
  }, [allVehicles]);
  
  useEffect(() => {
    localStorage.setItem('devices', JSON.stringify(allDevices));
  }, [allDevices]);
  
  useEffect(() => {
    localStorage.setItem('serviceRecords', JSON.stringify(serviceRecords));
  }, [serviceRecords]);

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
      lastService: now,
      nextService: nextServiceDate,
      status: 'ok',
      model: 'Generic',
      registrationNumber: vehicleData.registrationNumber || '',
      year: vehicleData.year || 0,
      vehicleType: 'car',
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
      const updatedDevices = allDevices.filter(device => device.vehicleId !== vehicleToDelete.id);
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
      setSelectedVehicleId(null);
    } else {
      setSelectedVehicleId(vehicleId);
      setShowingServiceRecords(false);
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
    setShowingServiceRecords(true);
    setUnsavedServiceChanges(true);
    toast.success("Serwis/naprawa została dodana pomyślnie");
  };

  const handleSaveServiceChanges = () => {
    setUnsavedServiceChanges(false);
    toast.success("Zmiany zostały zapisane pomyślnie");
  };

  const handleAddDevice = () => {
    setIsAddDeviceDialogOpen(true);
  };

  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsEditDeviceDialogOpen(true);
  };

  const handleDeleteDevice = (device: Device) => {
    setDeviceToDelete(device);
    setIsDeleteDeviceDialogOpen(true);
  };

  const confirmDeleteDevice = () => {
    if (deviceToDelete) {
      setAllDevices(prevDevices => prevDevices.filter(d => d.id !== deviceToDelete.id));
      toast.success("Urządzenie zostało usunięte pomyślnie");
    }
    setIsDeleteDeviceDialogOpen(false);
    setDeviceToDelete(null);
  };

  const handleSubmitDevice = (deviceData: Partial<Device>) => {
    const newDevice: Device = {
      id: uuidv4(),
      name: deviceData.name || '',
      type: deviceData.type || '',
      serialNumber: deviceData.serialNumber || '',
      status: 'ok',
      lastService: new Date(),
      nextService: deviceData.serviceExpiryDate || new Date(new Date().setMonth(new Date().getMonth() + 6)),
      vehicleId: selectedVehicleId || undefined,
      ...deviceData
    };
    
    setAllDevices(prevDevices => [...prevDevices, newDevice]);
    setIsAddDeviceDialogOpen(false);
    toast.success("Urządzenie zostało dodane pomyślnie");
  };

  const handleUpdateDevice = (updatedDevice: Partial<Device>) => {
    if (!updatedDevice.id) return;
    
    setAllDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === updatedDevice.id ? { ...device, ...updatedDevice } : device
      )
    );
    setIsEditDeviceDialogOpen(false);
    toast.success("Urządzenie zostało zaktualizowane pomyślnie");
  };

  const handleEditService = (service: ServiceRecord) => {
    setSelectedService(service);
    setIsEditServiceDialogOpen(true);
  };

  const handleDeleteService = (service: ServiceRecord) => {
    setServiceToDelete(service);
    setIsDeleteServiceDialogOpen(true);
  };
  
  const confirmDeleteService = () => {
    if (serviceToDelete) {
      setServiceRecords(prev => prev.filter(record => record.id !== serviceToDelete.id));
      toast.success("Serwis został usunięty pomyślnie");
    }
    setIsDeleteServiceDialogOpen(false);
    setServiceToDelete(null);
  };
  
  const handleUpdateService = (updatedService: ServiceRecord) => {
    setServiceRecords(prev => 
      prev.map(service => 
        service.id === updatedService.id ? updatedService : service
      )
    );
    setIsEditServiceDialogOpen(false);
    toast.success("Serwis został zaktualizowany pomyślnie");
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
            <div className="w-1/3 pr-4">
              <VehicleList 
                vehicles={filteredVehicles}
                selectedVehicleId={selectedVehicleId}
                onVehicleClick={handleVehicleClick}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
              />
            </div>
            
            <div className="w-2/3 pl-4">
              <VehicleDetailPanel 
                selectedVehicleId={selectedVehicleId}
                vehicles={allVehicles}
                devices={allDevices}
                services={selectedVehicleServices}
                showingServiceRecords={showingServiceRecords}
                onServiceClick={handleServiceClick}
                onEdit={handleEditVehicle}
                onAddService={handleAddService}
                onAddDevice={handleAddDevice}
                onEditDevice={handleEditDevice}
                onDeleteDevice={handleDeleteDevice}
                onEditService={handleEditService}
                onDeleteService={handleDeleteService}
                onSaveService={handleSaveServiceChanges}
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
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
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

      <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edytuj serwis/naprawę</DialogTitle>
            <DialogDescription>
              Zaktualizuj informacje o serwisie lub naprawie
            </DialogDescription>
          </DialogHeader>
          {selectedService && selectedVehicleId && (
            <ServiceForm
              vehicleId={selectedVehicleId}
              devices={allDevices.filter(device => device.vehicleId === selectedVehicleId)}
              initialService={selectedService}
              onSubmit={handleUpdateService}
              onCancel={() => setIsEditServiceDialogOpen(false)}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDeviceDialogOpen} onOpenChange={setIsAddDeviceDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dodaj nowe urządzenie</DialogTitle>
            <DialogDescription>
              Wypełnij formularz, aby dodać nowe urządzenie do pojazdu
            </DialogDescription>
          </DialogHeader>
          <AddDeviceForm 
            vehicles={allVehicles}
            onSubmit={handleSubmitDevice}
            onCancel={() => setIsAddDeviceDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDeviceDialogOpen} onOpenChange={setIsEditDeviceDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edytuj urządzenie</DialogTitle>
            <DialogDescription>
              Zaktualizuj informacje o urządzeniu
            </DialogDescription>
          </DialogHeader>
          {selectedDevice && (
            <AddDeviceForm
              initialDevice={selectedDevice}
              onSubmit={handleUpdateDevice}
              onCancel={() => setIsEditDeviceDialogOpen(false)}
              vehicles={allVehicles}
              isEditing={true}
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

      <AlertDialog open={isDeleteDeviceDialogOpen} onOpenChange={setIsDeleteDeviceDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć to urządzenie?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Urządzenie zostanie usunięte z systemu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDevice} className="bg-destructive text-destructive-foreground">
              Usuń urządzenie
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteServiceDialogOpen} onOpenChange={setIsDeleteServiceDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć ten serwis?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Serwis zostanie usunięty z systemu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteService} className="bg-destructive text-destructive-foreground">
              Usuń serwis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Vehicles;
