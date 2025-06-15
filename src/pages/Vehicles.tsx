
import { useEffect, useState } from 'react';
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import AddVehicleForm from '../components/AddVehicleForm';
import VehicleDetailPanel from '../components/VehicleDetailPanel';
import { toast } from 'sonner';
import VehicleList from '../components/VehicleList';
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
import { mapSupabaseVehicleToVehicle, mapVehicleToSupabaseVehicle, mapSupabaseDeviceToDevice, mapDeviceToSupabaseDevice, mapSupabaseServiceRecordToServiceRecord, mapServiceRecordToSupabaseServiceRecord } from '@/utils/supabaseMappers';
import { extractAllTags } from '@/utils/tagUtils';
import AddDeviceDialog from '../components/AddDeviceDialog';
import AddServiceDialog from '../components/AddServiceDialog';

const Vehicles = () => {
  // Główne stany
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [showingServiceRecords, setShowingServiceRecords] = useState(false);

  // Stany dialogów dodawania
  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);

  // Pobierz pojazdy
  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*');
      if (error) {
        toast.error("Nie udało się pobrać danych pojazdów.");
        setAllVehicles([]);
      } else if (data) {
        setAllVehicles(data.map(mapSupabaseVehicleToVehicle));
      }
    };
    fetchVehicles();
  }, []);

  // Pobierz urządzenia
  useEffect(() => {
    const fetchDevices = async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('*');
      if (error) {
        toast.error("Nie udało się pobrać danych urządzeń.");
        setDevices([]);
      } else if (data) {
        setDevices(data.map(mapSupabaseDeviceToDevice));
      }
    };
    fetchDevices();
  }, []);

  // Pobierz serwisy
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('service_records')
        .select('*');
      if (error) {
        toast.error("Nie udało się pobrać historii serwisowej.");
        setServices([]);
      } else if (data) {
        setServices(data.map(mapSupabaseServiceRecordToServiceRecord));
      }
    };
    fetchServices();
  }, []);

  // Dodawanie pojazdu
  const handleAddVehicle = async (vehicleData: Partial<Vehicle>) => {
    const newVehicleData = {
      ...vehicleData,
      id: uuidv4(),
      lastService: vehicleData.lastService || new Date(),
      nextService: vehicleData.nextService || new Date(new Date().setMonth(new Date().getMonth() + 6)),
    };
    const supabaseVehicle = mapVehicleToSupabaseVehicle(newVehicleData);

    const { data, error } = await supabase
      .from('vehicles')
      .insert(supabaseVehicle)
      .select()
      .single();

    if (error) {
      toast.error("Błąd podczas dodawania pojazdu.");
      return;
    }
    if (data) {
      setAllVehicles(prev => [...prev, mapSupabaseVehicleToVehicle(data)]);
      setIsAddDialogOpen(false);
      toast.success("Pojazd został dodany pomyślnie");
    }
  };

  // Edycja pojazdu
  const handleUpdateVehicle = async (updatedVehicleData: Vehicle) => {
    const supabaseVehicle = mapVehicleToSupabaseVehicle(updatedVehicleData);
    delete supabaseVehicle.id;

    const { data, error } = await supabase
      .from('vehicles')
      .update(supabaseVehicle)
      .eq('id', updatedVehicleData.id)
      .select()
      .single();

    if (error) {
      toast.error("Błąd edycji pojazdu");
      return;
    }
    if (data) {
      setAllVehicles(prev =>
        prev.map(vehicle =>
          vehicle.id === updatedVehicleData.id
            ? mapSupabaseVehicleToVehicle(data)
            : vehicle
        )
      );
      setIsEditDialogOpen(false);
      toast.success("Pojazd został zaktualizowany pomyślnie");
    }
  };

  // Usuwanie pojazdu
  const confirmDeleteVehicle = async () => {
    if (vehicleToDelete) {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicleToDelete.id);

      if (error) {
        toast.error("Błąd podczas usuwania pojazdu z Supabase");
        return;
      }

      setAllVehicles(prevVehicles => prevVehicles.filter(v => v.id !== vehicleToDelete.id));
      if (selectedVehicleId === vehicleToDelete.id) {
        setSelectedVehicleId(null);
      }
      toast.success("Pojazd został usunięty pomyślnie");
    }
    setIsDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  // Callbacki UI
  const handleVehicleClick = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setShowingServiceRecords(false);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicleForEdit(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleServiceClick = () => {
    setShowingServiceRecords((prev) => !prev);
  };

  // Dodawanie urządzenia do pojazdu
  const handleAddDevice = async (deviceData: Partial<Device>) => {
    if (!selectedVehicleId) return;
    const newDeviceData = {
      ...deviceData,
      id: uuidv4(),
      vehicleId: selectedVehicleId,
    };
    const supabaseDevice = mapDeviceToSupabaseDevice(newDeviceData);

    const { data, error } = await supabase
      .from('devices')
      .insert(supabaseDevice)
      .select()
      .single();

    if (error) {
      toast.error("Błąd podczas dodawania urządzenia");
      return;
    }
    if (data) {
      setDevices(prev => [...prev, mapSupabaseDeviceToDevice(data)]);
      setIsAddDeviceDialogOpen(false);
      toast.success("Urządzenie zostało dodane");
    }
  };

  // Dodawanie serwisu
  const handleAddService = async (service: ServiceRecord) => {
    const supabaseService = mapServiceRecordToSupabaseServiceRecord(service);
    const { data, error } = await supabase
      .from('service_records')
      .insert(supabaseService)
      .select()
      .single();

    if (error) {
      toast.error("Błąd podczas dodawania serwisu");
      return;
    }
    if (data) {
      setServices(prev => [...prev, mapSupabaseServiceRecordToServiceRecord(data)]);
      setIsAddServiceDialogOpen(false);
      toast.success("Serwis został dodany");
    }
  };

  // Filtracja pojazdów
  const filteredVehicles = allVehicles.filter(vehicle => {
    const textMatch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
  }).sort((a, b) => a.name.localeCompare(b.name));

  // Pobierz dane wybranego pojazdu i jego urządzeń
  const selectedVehicle = allVehicles.find(v => v.id === selectedVehicleId) || null;
  const selectedVehicleDevices = devices.filter(d => d.vehicleId === selectedVehicleId);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pojazdy</h1>
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

        <div className="flex gap-5">
          <div className="w-full md:w-1/3 xl:w-1/4">
            {filteredVehicles.length > 0 ? (
              <VehicleList
                vehicles={filteredVehicles}
                selectedVehicleId={selectedVehicleId}
                onVehicleClick={handleVehicleClick}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
              />
            ) : (
              <NoVehiclesFound />
            )}
          </div>
          <div className="w-full md:w-2/3 xl:w-3/4">
            <VehicleDetailPanel
              selectedVehicleId={selectedVehicleId}
              vehicles={allVehicles}
              devices={devices}
              services={services}
              showingServiceRecords={showingServiceRecords}
              onServiceClick={handleServiceClick}
              onEdit={handleEditVehicle}
              onAddService={() => setIsAddServiceDialogOpen(true)}
              onAddDevice={() => setIsAddDeviceDialogOpen(true)}
              onEditDevice={() => { }}
              onDeleteDevice={() => { }}
              onViewDevice={() => { }}
              onEditService={() => { }}
              onDeleteService={() => { }}
              onViewService={() => { }}
              onSaveService={() => { }}
              onView={() => { }}
              onMoveDevice={() => { }}
            />
          </div>
        </div>
      </div>

      {/* Dodawanie pojazdu */}
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
          />
        </DialogContent>
      </Dialog>

      {/* Edytowanie pojazdu */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edytuj pojazd</DialogTitle>
            <DialogDescription>
              Zaktualizuj informacje o pojeździe
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleForEdit && (
            <AddVehicleForm
              vehicle={selectedVehicleForEdit}
              onSubmit={handleUpdateVehicle}
              onCancel={() => setIsEditDialogOpen(false)}
              allVehicles={allVehicles}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Usuwanie pojazdu */}
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

      {/* Dodawanie URZĄDZENIA */}
      <AddDeviceDialog
        open={isAddDeviceDialogOpen}
        onOpenChange={setIsAddDeviceDialogOpen}
        vehicle={selectedVehicle}
        allVehicles={allVehicles}
        onSubmit={handleAddDevice}
      />

      {/* Dodawanie SERWISU */}
      <AddServiceDialog
        open={isAddServiceDialogOpen}
        onOpenChange={setIsAddServiceDialogOpen}
        vehicle={selectedVehicle}
        devices={selectedVehicleDevices}
        onSubmit={handleAddService}
      />
    </div>
  );
};

export default Vehicles;
