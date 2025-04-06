
import { useEffect, useState } from 'react';
import { vehicles as initialVehicles } from '../utils/data/vehicleData';
import { devices as initialDevices } from '../utils/data/deviceData';
import { formatDate } from '../utils/formatting/dateUtils';
import { PlusCircle, Search, X, FileText, FileImage, ExternalLink, Maximize, Eye, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import AddVehicleForm from '../components/AddVehicleForm';
import VehicleDetails from '../components/VehicleDetails';
import DeviceDetails from '../components/DeviceDetails';
import ServiceDetails from '../components/ServiceDetails';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EditVehicleForm from '../components/EditVehicleForm';
import ServiceForm from '../components/ServiceForm';
import VehicleList from '../components/VehicleList';
import VehicleDetailPanel from '../components/VehicleDetailPanel';
import NoVehiclesFound from '../components/NoVehiclesFound';
import VehicleSearchBar from '../components/VehicleSearchBar';
import AddDeviceForm from '../components/AddDeviceForm';
import { useSearchParams } from 'react-router-dom';
import FullscreenViewer from '../components/FullscreenViewer';
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  
  useEffect(() => {
    const savedVehicles = localStorage.getItem('vehicles');
    
    if (!savedVehicles) {
      console.log("Loading initial vehicles data");
      setAllVehicles(initialVehicles);
      localStorage.setItem('vehicles', JSON.stringify(initialVehicles));
    } else {
      try {
        const vehiclesData = JSON.parse(savedVehicles);
        if (Array.isArray(vehiclesData) && vehiclesData.length > 0) {
          console.log(`Loading ${vehiclesData.length} vehicles from localStorage`);
          setAllVehicles(vehiclesData);
        } else {
          console.log("Invalid or empty vehicles data, loading initial data");
          setAllVehicles(initialVehicles);
          localStorage.setItem('vehicles', JSON.stringify(initialVehicles));
        }
      } catch (error) {
        console.error("Error parsing vehicles data:", error);
        setAllVehicles(initialVehicles);
        localStorage.setItem('vehicles', JSON.stringify(initialVehicles));
      }
    }
    
    const savedDevices = localStorage.getItem('devices');
    
    if (!savedDevices) {
      setAllDevices(initialDevices);
      localStorage.setItem('devices', JSON.stringify(initialDevices));
    } else {
      try {
        const devicesData = JSON.parse(savedDevices);
        if (Array.isArray(devicesData) && devicesData.length > 0) {
          setAllDevices(devicesData);
        } else {
          setAllDevices(initialDevices);
          localStorage.setItem('devices', JSON.stringify(initialDevices));
        }
      } catch (error) {
        console.error("Error parsing devices data:", error);
        setAllDevices(initialDevices);
        localStorage.setItem('devices', JSON.stringify(initialDevices));
      }
    }
    
    const savedRecords = localStorage.getItem('serviceRecords');
    
    if (!savedRecords) {
      setServiceRecords([]);
    } else {
      try {
        const recordsData = JSON.parse(savedRecords);
        if (Array.isArray(recordsData)) {
          setServiceRecords(recordsData);
        } else {
          setServiceRecords([]);
        }
      } catch (error) {
        console.error("Error parsing service records:", error);
        setServiceRecords([]);
      }
    }
  }, []);
  
  const [searchParams] = useSearchParams();
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
  const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState<Vehicle | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [showingServiceRecords, setShowingServiceRecords] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceRecord | null>(null);
  const [unsavedServiceChanges, setUnsavedServiceChanges] = useState(false);
  const [isDeviceDetailsDialogOpen, setIsDeviceDetailsDialogOpen] = useState(false);
  const [isServiceDetailsDialogOpen, setIsServiceDetailsDialogOpen] = useState(false);

  useEffect(() => {
    const vehicleId = searchParams.get('vehicleId');
    const shouldEdit = searchParams.get('edit') === 'true';
    
    if (vehicleId) {
      setSelectedVehicleId(vehicleId);
      
      if (shouldEdit) {
        const vehicle = allVehicles.find(v => v.id === vehicleId);
        if (vehicle) {
          setSelectedVehicleForEdit(vehicle);
          setIsEditDialogOpen(true);
        }
      }
    }
  }, [searchParams, allVehicles]);
  
  useEffect(() => {
    if (allVehicles.length > 0) {
      localStorage.setItem('vehicles', JSON.stringify(allVehicles));
    }
  }, [allVehicles]);
  
  useEffect(() => {
    if (allDevices.length > 0) {
      localStorage.setItem('devices', JSON.stringify(allDevices));
    }
  }, [allDevices]);
  
  useEffect(() => {
    localStorage.setItem('serviceRecords', JSON.stringify(serviceRecords));
  }, [serviceRecords]);

  const extractAllTags = (vehicles: Vehicle[]): string[] => {
    const allTags: string[] = [];
    
    vehicles.forEach(vehicle => {
      if (vehicle.tags) {
        const tags = vehicle.tags.split(',').map(tag => tag.trim());
        allTags.push(...tags);
      }
    });
    
    return allTags;
  };

  const handleTagSelect = (tagName: string) => {
    setSelectedTags(prevTags => {
      const tagExists = prevTags.some(tag => tag.split(':')[0].trim() === tagName);
      
      if (tagExists) {
        return prevTags.filter(tag => tag.split(':')[0].trim() !== tagName);
      } else {
        for (const vehicle of allVehicles) {
          if (vehicle.tags) {
            const vehicleTags = vehicle.tags.split(',').map(tag => tag.trim());
            const matchingTag = vehicleTags.find(tag => tag.split(':')[0].trim() === tagName);
            if (matchingTag) {
              return [...prevTags, matchingTag];
            }
          }
        }
        return [...prevTags, `${tagName}:blue`];
      }
    });
  };

  const handleRemoveTag = (tagNameToRemove: string) => {
    const updatedVehicles = allVehicles.map(vehicle => {
      if (vehicle.tags) {
        const vehicleTags = vehicle.tags.split(',').map(tag => tag.trim());
        const filteredTags = vehicleTags.filter(tag => {
          const tagName = tag.split(':')[0].trim();
          return tagName !== tagNameToRemove;
        });
        
        return {
          ...vehicle,
          tags: filteredTags.join(', ')
        };
      }
      return vehicle;
    });
    
    setAllVehicles(updatedVehicles);
    
    setSelectedTags(prevTags => 
      prevTags.filter(tag => tag.split(':')[0].trim() !== tagNameToRemove)
    );
    
    toast.success(`Tag "${tagNameToRemove}" został usunięty ze wszystkich pojazdów`);
  };

  const filteredVehicles = allVehicles
    .filter(vehicle => {
      const textMatch = 
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vehicle.brand?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (vehicle.vin?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (vehicle.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (vehicle.tags?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      let tagMatch = true;
      if (selectedTags.length > 0) {
        tagMatch = selectedTags.every(selectedTag => {
          const selectedTagName = selectedTag.split(':')[0].trim();
          if (!vehicle.tags) return false;
          
          return vehicle.tags.split(',')
            .map(tag => tag.trim().split(':')[0].trim())
            .includes(selectedTagName);
        });
      }
      
      return textMatch && tagMatch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const selectedVehicleData = selectedVehicleId ? allVehicles.find(v => v.id === selectedVehicleId) : null;

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
    setSelectedVehicleForEdit(vehicle);
    setIsDetailsDialogOpen(true);
  };
  
  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicleForEdit(vehicle);
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
      vehicleId: deviceData.vehicleId || selectedVehicleId || undefined,
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

  const handleViewDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsDeviceDetailsDialogOpen(true);
  };

  const handleViewService = (service: ServiceRecord) => {
    setSelectedService(service);
    setIsServiceDetailsDialogOpen(true);
  };

  console.log("Vehicles count:", allVehicles.length);
  console.log("Devices count:", allDevices.length);

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
            availableTags={extractAllTags(allVehicles)}
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
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
                onView={handleViewDetails}
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
                onViewDevice={handleViewDevice}
                onEditService={handleEditService}
                onDeleteService={handleDeleteService}
                onViewService={handleViewService}
                onSaveService={handleSaveServiceChanges}
                onView={handleViewDetails}
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
            allVehicles={allVehicles}
            onRemoveTag={handleRemoveTag}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Szczegóły pojazdu</DialogTitle>
            <DialogDescription>
              Pełne informacje o pojeździe
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleForEdit && <VehicleDetails vehicle={selectedVehicleForEdit} />}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeviceDetailsDialogOpen} onOpenChange={setIsDeviceDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Szczegóły urządzenia</DialogTitle>
            <DialogDescription>
              Informacje o urządzeniu {selectedDevice?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedDevice && <DeviceDetails device={selectedDevice} />}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isServiceDetailsDialogOpen} onOpenChange={setIsServiceDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Szczegóły serwisu</DialogTitle>
            <DialogDescription>
              Informacje o serwisie z dnia {selectedService && formatDate(selectedService.date)}
            </DialogDescription>
          </DialogHeader>
          {selectedService && <ServiceDetails service={selectedService} />}
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
          {selectedVehicleForEdit && (
            <EditVehicleForm
              vehicle={selectedVehicleForEdit}
              onSubmit={handleUpdateVehicle}
              onCancel={() => setIsEditDialogOpen(false)}
              allVehicles={allVehicles}
              onRemoveTag={handleRemoveTag}
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
              vehicle={selectedVehicleData}
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
              vehicle={selectedVehicleData}
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
            selectedVehicleId={selectedVehicleId}
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
