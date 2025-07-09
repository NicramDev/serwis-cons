import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from '../utils/formatting/dateUtils';
import DeviceCard from '../components/DeviceCard';
import DeviceDetails from '../components/DeviceDetails';
import { PlusCircle, Search, Maximize } from 'lucide-react';
import { Device, Vehicle } from '../utils/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import AddDeviceForm from '../components/AddDeviceForm';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
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
import FullscreenViewer from '../components/FullscreenViewer';
import { mapSupabaseDeviceToDevice, mapDeviceToSupabaseDevice, mapSupabaseVehicleToVehicle } from '@/utils/supabaseMappers';

const Devices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [searchParams] = useSearchParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const [devicesRes, vehiclesRes] = await Promise.all([
        supabase.from('devices').select('*'),
        supabase.from('vehicles').select('*'),
      ]);

      if (devicesRes.error) {
        toast.error("Błąd pobierania urządzeń");
        console.error(devicesRes.error);
      } else {
        setAllDevices(devicesRes.data.map(mapSupabaseDeviceToDevice));
      }

      if (vehiclesRes.error) {
        toast.error("Błąd pobierania pojazdów");
        console.error(vehiclesRes.error);
      } else {
        setAllVehicles(vehiclesRes.data.map(mapSupabaseVehicleToVehicle));
      }
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    const deviceId = searchParams.get('deviceId');
    const shouldEdit = searchParams.get('edit') === 'true';
    
    if (deviceId && allDevices.length > 0) {
      const device = allDevices.find(d => d.id === deviceId);
      if (device) {
        setSelectedDevice(device);
        if (shouldEdit) {
          setIsEditDialogOpen(true);
        } else {
          setIsDetailsDialogOpen(true);
        }
      }
    }
  }, [searchParams, allDevices]);
  
  const filteredDevices = allDevices
    .filter(device => 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (device.model?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleAddDevice = async (deviceData: Partial<Device>) => {
    const newDeviceData: Partial<Device> = {
      ...deviceData,
      id: uuidv4(),
      lastService: deviceData.lastService || new Date(),
      nextService: deviceData.nextService || new Date(new Date().setMonth(new Date().getMonth() + 6)),
      status: 'ok',
    };

    const supabaseDevice = mapDeviceToSupabaseDevice(newDeviceData);
    
    const { data, error } = await supabase
      .from('devices')
      .insert(supabaseDevice)
      .select()
      .single();

    if (error) {
      toast.error("Nie udało się dodać urządzenia.");
      console.error(error);
      return;
    }
    
    setAllDevices(prevDevices => [...prevDevices, mapSupabaseDeviceToDevice(data)]);
    setIsAddDialogOpen(false);
    toast.success("Urządzenie zostało dodane pomyślnie");
  };

  const handleUpdateDevice = async (updatedDeviceData: Device) => {
    const supabaseDevice = mapDeviceToSupabaseDevice(updatedDeviceData);
    delete supabaseDevice.id;

    const { data, error } = await supabase
      .from('devices')
      .update(supabaseDevice)
      .eq('id', updatedDeviceData.id)
      .select()
      .single();

    if (error) {
      toast.error("Nie udało się zaktualizować urządzenia.");
      console.error(error);
      return;
    }

    setAllDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === updatedDeviceData.id ? mapSupabaseDeviceToDevice(data) : device
      )
    );
    setIsEditDialogOpen(false);
    toast.success("Urządzenie zostało zaktualizowane pomyślnie");
  };

  const confirmDeleteDevice = async () => {
    if (deviceToDelete) {
      const { error } = await supabase.from('devices').delete().eq('id', deviceToDelete.id);

      if (error) {
        toast.error("Nie udało się usunąć urządzenia.");
        console.error(error);
      } else {
        setAllDevices(prevDevices => prevDevices.filter(d => d.id !== deviceToDelete.id));
        toast.success("Urządzenie zostało usunięte pomyślnie");
      }
    }
    setIsDeleteDialogOpen(false);
    setDeviceToDelete(null);
  };
  
  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsEditDialogOpen(true);
  };

  const handleViewDeviceDetails = (device: Device) => {
    setSelectedDevice(device);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteDevice = (device: Device) => {
    setDeviceToDelete(device);
    setIsDeleteDialogOpen(true);
  };
  
  const openFullscreen = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFullscreenUrl(url);
  };

  const closeFullscreen = () => {
    setFullscreenUrl(null);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {fullscreenUrl && (
        <FullscreenViewer
          url={fullscreenUrl}
          onClose={closeFullscreen}
        />
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Urządzenia</h1>
            <p className="text-muted-foreground">Zarządzaj i śledź wszystkie urządzenia serwisowe</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Szukaj urządzeń..."
                className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              className="flex items-center justify-center space-x-2 shadow-sm"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Dodaj Urządzenie</span>
            </Button>
          </div>
        </div>
        
        {filteredDevices.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {filteredDevices.map((device, index) => (
              <DeviceCard 
                key={device.id} 
                device={device} 
                delay={index % 5 + 1} 
                onEdit={handleEditDevice}
                onDelete={handleDeleteDevice}
                onViewDetails={handleViewDeviceDetails}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-12 text-center">
            <div className="icon-container mx-auto mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nie znaleziono urządzeń</h3>
            <p className="text-muted-foreground">
              Żadne urządzenia nie pasują do kryteriów wyszukiwania. Spróbuj innego zapytania lub dodaj nowe urządzenie.
            </p>
          </div>
        )}
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Dodaj nowe urządzenie</DialogTitle>
            <DialogDescription>
              Wypełnij formularz, aby dodać nowe urządzenie
            </DialogDescription>
          </DialogHeader>
          <AddDeviceForm 
            onSubmit={handleAddDevice} 
            onCancel={() => setIsAddDialogOpen(false)}
            vehicles={allVehicles}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
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
              onCancel={() => setIsEditDialogOpen(false)}
              vehicles={allVehicles}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Szczegóły urządzenia</DialogTitle>
            <DialogDescription>
              Pełne informacje o urządzeniu
            </DialogDescription>
          </DialogHeader>
          {selectedDevice && <DeviceDetails device={selectedDevice} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć to urządzenie?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Spowoduje to usunięcie urządzenia i jego danych.
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
    </div>
  );
};

export default Devices;

// UWAGA: Ten plik ma już 321 linii i staje się za długi. 
// Warto go refaktoryzować na mniejsze komponenty.
