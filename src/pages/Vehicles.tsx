import { useEffect, useState } from 'react';
import { Vehicle, Device, ServiceRecord, VehicleEquipment } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, 
  DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { mapSupabaseVehicleToVehicle, mapVehicleToSupabaseVehicle, mapSupabaseDeviceToDevice, mapDeviceToSupabaseDevice, mapSupabaseServiceRecordToServiceRecord, mapServiceRecordToSupabaseServiceRecord, mapSupabaseVehicleEquipmentToVehicleEquipment, mapVehicleEquipmentToSupabaseVehicleEquipment } from '@/utils/supabaseMappers';
import { extractAllTags } from '@/utils/tagUtils';
import AddDeviceDialog from '../components/AddDeviceDialog';
import AddServiceDialog from '../components/AddServiceDialog';
import VehicleDetails from '../components/VehicleDetails';
import DeviceDetails from '../components/DeviceDetails';
import ServiceDetails from '../components/ServiceDetails';
import ServiceForm from '../components/ServiceForm';
import AddVehicleEquipmentForm from '../components/AddVehicleEquipmentForm';
import VehicleEquipmentDialogs from '../components/VehicleEquipmentDialogs';
import { FileText, Eye, Edit, Trash2, MoreHorizontal, Shuffle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDate } from '../utils/formatting/dateUtils';
import { useSearchParams } from 'react-router-dom';

const Vehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [vehicleEquipmentList, setVehicleEquipmentList] = useState<VehicleEquipment[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [showingServiceRecords, setShowingServiceRecords] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedVehicleForView, setSelectedVehicleForView] = useState<Vehicle | null>(null);

  // Stany dialogów dodawania
  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false);
  const [isAddVehicleEquipmentDialogOpen, setIsAddVehicleEquipmentDialogOpen] = useState(false);
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


  // Pobierz vehicle_equipment + realtime
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchAllVehicleEquipment = async () => {
      const { data, error } = await supabase
        .from('vehicle_equipment')
        .select('*');
      if (error) {
        toast.error("Nie udało się pobrać danych vehicle_equipment.");
        setVehicleEquipmentList([]);
      } else if (data) {
        const mapped = data.map(mapSupabaseVehicleEquipmentToVehicleEquipment);
        setVehicleEquipmentList(mapped);
        console.info('VehicleEquipment fetched:', mapped.length);
      }
    };

    fetchAllVehicleEquipment();

    channel = supabase
      .channel('realtime-vehicle-equipment')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicle_equipment' }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const mapped = mapSupabaseVehicleEquipmentToVehicleEquipment(payload.new);
          setVehicleEquipmentList((prev) => {
            const exists = prev.some(e => e.id === mapped.id);
            return exists ? prev.map(e => e.id === mapped.id ? mapped : e) : [...prev, mapped];
          });
        } else if (payload.eventType === 'DELETE') {
          const deletedId = payload.old?.id as string;
          setVehicleEquipmentList((prev) => prev.filter((e) => e.id !== deletedId));
        }
      })
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
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

// Obsługa parametrów zapytania z /vehicles?vehicleId=...&edit=true
useEffect(() => {
  const vId = searchParams.get('vehicleId');
  if (vId) {
    setSelectedVehicleId(vId);
  }
}, [searchParams]);

useEffect(() => {
  const vId = searchParams.get('vehicleId');
  const edit = searchParams.get('edit');
  if (edit === 'true' && vId && allVehicles.length) {
    const v = allVehicles.find(vh => vh.id === vId);
    if (v) {
      setSelectedVehicleForEdit(v);
      setIsEditDialogOpen(true);
    }
  }
}, [searchParams, allVehicles]);

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
    setSearchParams({ vehicleId: vehicleId });
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicleForEdit(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicleForView(vehicle);
    setIsViewDialogOpen(true);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleServiceClick = () => {
    setShowingServiceRecords((prev) => !prev);
  };

  // --- Poprawiony handler dodawania urządzenia ---
  const handleAddDevice = async (deviceData: Partial<Device>) => {
    if (!selectedVehicleId) return;
    // Tworzymy pełny device
    const newDeviceData: Device = {
      id: uuidv4(),
      name: deviceData.name ?? "",
      brand: deviceData.brand ?? "",
      type: deviceData.type ?? "",
      model: deviceData.model ?? "",
      serialNumber: deviceData.serialNumber ?? "",
      vehicleId: selectedVehicleId,
      year: deviceData.year,
      purchasePrice: deviceData.purchasePrice,
      purchaseDate: deviceData.purchaseDate,
      lastService: deviceData.lastService ?? new Date(),
      nextService: deviceData.nextService ?? new Date(new Date().setMonth(new Date().getMonth() + 6)),
      serviceExpiryDate: deviceData.serviceExpiryDate,
      serviceReminderDays: deviceData.serviceReminderDays,
      notes: deviceData.notes ?? "",
      status: deviceData.status ?? "ok",
      images: deviceData.images ?? [],
      thumbnail: deviceData.thumbnail ?? null,
      attachments: deviceData.attachments ?? [],
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

  // Handler aktualizacji urządzenia
  const handleUpdateDevice = async (updatedDeviceData: Partial<Device>) => {
    if (!selectedDeviceForEdit) return;
    
    const updatedDevice: Device = {
      ...selectedDeviceForEdit,
      ...updatedDeviceData,
    };
    
    const supabaseDevice = mapDeviceToSupabaseDevice(updatedDevice);
    delete supabaseDevice.id;

    const { data, error } = await supabase
      .from('devices')
      .update(supabaseDevice)
      .eq('id', selectedDeviceForEdit.id)
      .select()
      .single();

    if (error) {
      toast.error("Błąd podczas edycji urządzenia");
      return;
    }
    if (data) {
      setDevices(prev =>
        prev.map(device =>
          device.id === selectedDeviceForEdit.id
            ? mapSupabaseDeviceToDevice(data)
            : device
        )
      );
      setIsEditDeviceDialogOpen(false);
      toast.success("Urządzenie zostało zaktualizowane");
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

  const handleAddVehicleEquipment = async (veData: Partial<VehicleEquipment>) => {
    try {
      const newVEData = {
        ...veData,
        id: uuidv4(),
      };
      const supabaseVE = mapVehicleEquipmentToSupabaseVehicleEquipment(newVEData);

      const { data, error } = await supabase
        .from('vehicle_equipment')
        .insert(supabaseVE)
        .select()
        .single();

      if (error) {
        toast.error("Błąd podczas dodawania vehicle equipment.");
        return;
      }
      
      if (data) {
        setVehicleEquipmentList(prev => [...prev, mapSupabaseVehicleEquipmentToVehicleEquipment(data)]);
        setIsAddVehicleEquipmentDialogOpen(false);
        toast.success("Vehicle Equipment zostało dodane pomyślnie");
      }
    } catch (error) {
      console.error('Error adding vehicle equipment:', error);
      toast.error("Błąd podczas dodawania vehicle equipment.");
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

  // --- DIALOGI AKCJE URZĄDZEŃ ---
  const [selectedDeviceForEdit, setSelectedDeviceForEdit] = useState<Device | null>(null);
  const [isEditDeviceDialogOpen, setIsEditDeviceDialogOpen] = useState(false);
  const [selectedDeviceForView, setSelectedDeviceForView] = useState<Device | null>(null);
  const [isViewDeviceDialogOpen, setIsViewDeviceDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [isDeleteDeviceDialogOpen, setIsDeleteDeviceDialogOpen] = useState(false);

  // --- DIALOGI AKCJE SERWISÓW ---
  const [selectedServiceForEdit, setSelectedServiceForEdit] = useState<ServiceRecord | null>(null);
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);
  const [selectedServiceForView, setSelectedServiceForView] = useState<ServiceRecord | null>(null);
  const [isViewServiceDialogOpen, setIsViewServiceDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceRecord | null>(null);
  const [isDeleteServiceDialogOpen, setIsDeleteServiceDialogOpen] = useState(false);

  // VehicleEquipment states
  const [selectedVehicleEquipment, setSelectedVehicleEquipment] = useState<VehicleEquipment | null>(null);
  const [isVehicleEquipmentDetailsOpen, setIsVehicleEquipmentDetailsOpen] = useState(false);
  const [isEditVehicleEquipmentOpen, setIsEditVehicleEquipmentOpen] = useState(false);
  const [isDeleteVehicleEquipmentOpen, setIsDeleteVehicleEquipmentOpen] = useState(false);
  const [vehicleEquipmentToDelete, setVehicleEquipmentToDelete] = useState<VehicleEquipment | null>(null);
  const [vehicleEquipmentToMove, setVehicleEquipmentToMove] = useState<VehicleEquipment | null>(null);
  const [isMoveVehicleEquipmentDialogOpen, setIsMoveVehicleEquipmentDialogOpen] = useState(false);
  const [targetVehicleIdForVehicleEquipment, setTargetVehicleIdForVehicleEquipment] = useState<string>("");

  // --- Move Device Dialog ---
  const [deviceToMove, setDeviceToMove] = useState<Device | null>(null);
  const [isMoveDeviceDialogOpen, setIsMoveDeviceDialogOpen] = useState(false);
  const [targetVehicleId, setTargetVehicleId] = useState<string>("");

  // Przyciski do urządzeń
  const handleEditDevice = (device: Device) => {
    setSelectedDeviceForEdit(device);
    setIsEditDeviceDialogOpen(true);
  };
  const handleDeleteDevice = (device: Device) => {
    setDeviceToDelete(device);
    setIsDeleteDeviceDialogOpen(true);
  };
  const handleViewDevice = (device: Device) => {
    setSelectedDeviceForView(device);
    setIsViewDeviceDialogOpen(true);
  };
  const handleMoveDevice = (device: Device) => {
    setDeviceToMove(device);
    setIsMoveDeviceDialogOpen(true);
    setTargetVehicleId("");
  };
  const confirmMoveDevice = async () => {
    if (deviceToMove && targetVehicleId) {
      // Find source vehicle info
      const sourceVehicle = allVehicles.find(v => v.id === deviceToMove.vehicleId);
      const sourceInfo = sourceVehicle 
        ? `\n\nPrzeniesione z pojazdu: ${sourceVehicle.name} (${sourceVehicle.registrationNumber || 'brak nr rej.'}) - ${new Date().toLocaleDateString('pl-PL')}`
        : '';
      
      // Update device in supabase and local state with updated notes
      const updatedNotes = (deviceToMove.notes || '') + sourceInfo;
      const updates = { 
        vehicleid: targetVehicleId,
        notes: updatedNotes
      };
      
      const { data, error } = await supabase
        .from('devices')
        .update(updates)
        .eq('id', deviceToMove.id)
        .select()
        .single();

      if (error) {
        toast.error("Błąd przenoszenia urządzenia");
      } else if (data) {
        setDevices(prev =>
          prev.map(d =>
            d.id === deviceToMove.id ? { ...d, vehicleId: targetVehicleId, notes: updatedNotes } : d
          )
        );
        toast.success("Urządzenie przeniesione");
      }
      setIsMoveDeviceDialogOpen(false);
      setDeviceToMove(null);
      setTargetVehicleId("");
    }
  };
  const confirmDeleteDevice = async () => {
    if (deviceToDelete) {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', deviceToDelete.id);
      if (error) {
        toast.error("Błąd usuwania urządzenia");
      } else {
        setDevices(prev => prev.filter(d => d.id !== deviceToDelete.id));
        toast.success("Urządzenie usunięte");
      }
      setIsDeleteDeviceDialogOpen(false);
      setDeviceToDelete(null);
    }
  };
  // Edycja urządzenia - UI logika istniejąca w AddDeviceDialog

  // VehicleEquipment handlers
  const handleViewVehicleEquipment = (ve: VehicleEquipment) => {
    setSelectedVehicleEquipment(ve);
    setIsVehicleEquipmentDetailsOpen(true);
  };

  const handleEditVehicleEquipment = (ve: VehicleEquipment) => {
    setSelectedVehicleEquipment(ve);
    setIsEditVehicleEquipmentOpen(true);
  };

  const handleDeleteVehicleEquipment = (ve: VehicleEquipment) => {
    setVehicleEquipmentToDelete(ve);
    setIsDeleteVehicleEquipmentOpen(true);
  };

  const handleMoveVehicleEquipment = (ve: VehicleEquipment) => {
    setVehicleEquipmentToMove(ve);
    setTargetVehicleIdForVehicleEquipment("");
    setIsMoveVehicleEquipmentDialogOpen(true);
  };

  const handleUpdateVehicleEquipment = async (updatedVEData: VehicleEquipment) => {
    try {
      const supabaseVE = mapVehicleEquipmentToSupabaseVehicleEquipment(updatedVEData);
      delete supabaseVE.id;

      const { data, error } = await supabase
        .from('vehicle_equipment')
        .update(supabaseVE)
        .eq('id', updatedVEData.id)
        .select()
        .single();

      if (error) {
        toast.error("Błąd podczas edycji equipment.");
        return;
      }
      
      if (data) {
        setVehicleEquipmentList(prev =>
          prev.map(ve =>
            ve.id === updatedVEData.id
              ? mapSupabaseVehicleEquipmentToVehicleEquipment(data)
              : ve
          )
        );
        setIsEditVehicleEquipmentOpen(false);
        toast.success("Equipment zostało zaktualizowane pomyślnie");
      }
    } catch (error) {
      console.error('Error updating vehicle equipment:', error);
      toast.error("Błąd podczas edycji equipment.");
    }
  };

  const confirmDeleteVehicleEquipment = async () => {
    if (vehicleEquipmentToDelete) {
      const { error } = await supabase
        .from('vehicle_equipment')
        .delete()
        .eq('id', vehicleEquipmentToDelete.id);
      if (error) {
        toast.error("Błąd usuwania equipment");
      } else {
        setVehicleEquipmentList(prev => prev.filter(ve => ve.id !== vehicleEquipmentToDelete.id));
        toast.success("Equipment usunięte");
      }
      setIsDeleteVehicleEquipmentOpen(false);
      setVehicleEquipmentToDelete(null);
    }
  };

  const confirmMoveVehicleEquipment = async () => {
    if (vehicleEquipmentToMove && targetVehicleIdForVehicleEquipment) {
      // Find source vehicle info
      const sourceVehicle = allVehicles.find(v => v.id === vehicleEquipmentToMove.vehicleId);
      const sourceInfo = sourceVehicle 
        ? `\n\nPrzeniesione z pojazdu: ${sourceVehicle.name} (${sourceVehicle.registrationNumber || 'brak nr rej.'}) - ${new Date().toLocaleDateString('pl-PL')}`
        : '';
      
      const updatedNotes = (vehicleEquipmentToMove.notes || '') + sourceInfo;
      const updates = { 
        vehicleid: targetVehicleIdForVehicleEquipment,
        notes: updatedNotes
      };
      
      const { data, error } = await supabase
        .from('vehicle_equipment')
        .update(updates)
        .eq('id', vehicleEquipmentToMove.id)
        .select()
        .single();

      if (error) {
        toast.error("Błąd przenoszenia equipment");
      } else if (data) {
        setVehicleEquipmentList(prev =>
          prev.map(ve =>
            ve.id === vehicleEquipmentToMove.id ? { ...ve, vehicleId: targetVehicleIdForVehicleEquipment, notes: updatedNotes } : ve
          )
        );
        toast.success("Equipment przeniesione");
      }
      setIsMoveVehicleEquipmentDialogOpen(false);
      setVehicleEquipmentToMove(null);
      setTargetVehicleIdForVehicleEquipment("");
    }
  };

  // Przyciski do serwisów
  const handleViewService = (service: ServiceRecord) => {
    setSelectedServiceForView(service);
    setIsViewServiceDialogOpen(true);
  };
  const handleEditService = (service: ServiceRecord) => {
    setSelectedServiceForEdit(service);
    setIsEditServiceDialogOpen(true);
  };
  const handleDeleteService = (service: ServiceRecord) => {
    setServiceToDelete(service);
    setIsDeleteServiceDialogOpen(true);
  };
  const handleUpdateService = async (updatedServiceData: ServiceRecord) => {
    const supabaseService = mapServiceRecordToSupabaseServiceRecord(updatedServiceData);
    delete supabaseService.id;

    const { data, error } = await supabase
      .from('service_records')
      .update(supabaseService)
      .eq('id', updatedServiceData.id)
      .select()
      .single();

    if (error) {
      toast.error("Błąd podczas edycji serwisu");
      return;
    }
    if (data) {
      setServices(prev =>
        prev.map(s =>
          s.id === updatedServiceData.id ? mapSupabaseServiceRecordToServiceRecord(data) : s
        )
      );
      setIsEditServiceDialogOpen(false);
      toast.success("Serwis został zaktualizowany");
    }
  };
  const confirmDeleteService = async () => {
    if (serviceToDelete) {
      const { error } = await supabase
        .from('service_records')
        .delete()
        .eq('id', serviceToDelete.id);
      if (error) {
        toast.error("Błąd usuwania serwisu");
      } else {
        setServices(prev => prev.filter(s => s.id !== serviceToDelete.id));
        toast.success("Serwis usunięty");
      }
      setIsDeleteServiceDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  // --- Reset powiadomień i kosztów na wejściu (do nowych danych) ---
  useEffect(() => {
    localStorage.removeItem('notifications');
    localStorage.removeItem('vehicles');
    localStorage.removeItem('devices');
    localStorage.removeItem('serviceRecords');
    // Chwilowe zapisanie bieżących danych (vehicles/devices/services)
    localStorage.setItem('vehicles', JSON.stringify(allVehicles));
    localStorage.setItem('devices', JSON.stringify(devices));
    localStorage.setItem('serviceRecords', JSON.stringify(services));
  }, [allVehicles, devices, services]);

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

        <div className="flex gap-3 lg:gap-5 min-w-0 overflow-hidden">
          <div className="w-full md:w-1/3 xl:w-1/4 min-w-0 flex-shrink-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              {filteredVehicles.length > 0 ? (
                <VehicleList
                  vehicles={filteredVehicles}
                  selectedVehicleId={selectedVehicleId}
                  onVehicleClick={handleVehicleClick}
                  onEdit={handleEditVehicle}
                  onDelete={handleDeleteVehicle}
                  onView={handleViewVehicle}
                />
              ) : (
                <NoVehiclesFound />
              )}
            </ScrollArea>
          </div>
          <div className="w-full md:w-2/3 xl:w-3/4 min-w-0 flex-shrink">
            <VehicleDetailPanel
              selectedVehicleId={selectedVehicleId}
              vehicles={allVehicles}
              devices={devices}
              vehicleEquipment={vehicleEquipmentList}
              services={services}
              showingServiceRecords={showingServiceRecords}
              onServiceClick={handleServiceClick}
              onEdit={handleEditVehicle}
              onAddService={() => setIsAddServiceDialogOpen(true)}
              onAddDevice={() => setIsAddDeviceDialogOpen(true)}
              onAddVehicleEquipment={() => setIsAddVehicleEquipmentDialogOpen(true)}
              onEditDevice={handleEditDevice}
              onDeleteDevice={handleDeleteDevice}
              onViewDevice={handleViewDevice}
              onEditVehicleEquipment={handleEditVehicleEquipment}
              onDeleteVehicleEquipment={handleDeleteVehicleEquipment}
              onViewVehicleEquipment={handleViewVehicleEquipment}
              onMoveVehicleEquipment={handleMoveVehicleEquipment}
              onMoveDevice={handleMoveDevice}
              onConvertToEquipment={handleConvertToEquipment}
              onEditService={handleEditService}
              onDeleteService={handleDeleteService}
              onViewService={handleViewService}
              onSaveService={() => { }}
              onView={() => { }}
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

      {/* Dialog podglądu pojazdu */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Szczegóły pojazdu</DialogTitle>
          </DialogHeader>
          {selectedVehicleForView && (
            <div>
              {/* Możesz użyć istniejącego VehicleDetails lub VehicleDetailPanel do prezentacji */}
              {/* Zakładam, że VehicleDetails wyświetla szczegóły */}
              <VehicleDetails vehicle={selectedVehicleForView} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edytowanie urządzenia */}
      <Dialog open={isEditDeviceDialogOpen} onOpenChange={setIsEditDeviceDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edytuj urządzenie</DialogTitle>
            <DialogDescription>Zaktualizuj informacje o urządzeniu</DialogDescription>
          </DialogHeader>
          {selectedDeviceForEdit && (
            <AddDeviceDialog
              open={isEditDeviceDialogOpen}
              onOpenChange={setIsEditDeviceDialogOpen}
              allVehicles={allVehicles}
              vehicle={allVehicles.find(v => v.id === selectedDeviceForEdit.vehicleId) ?? null}
              onSubmit={handleUpdateDevice}
              initialDevice={selectedDeviceForEdit}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Podgląd urządzenia */}
      <Dialog open={isViewDeviceDialogOpen} onOpenChange={setIsViewDeviceDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Szczegóły urządzenia</DialogTitle>
          </DialogHeader>
          {selectedDeviceForView && (
            <div>
              <DeviceDetails device={selectedDeviceForView} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Usuwanie urządzenia */}
      <AlertDialog open={isDeleteDeviceDialogOpen} onOpenChange={setIsDeleteDeviceDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć to urządzenie?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna.
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

      {/* Przenoszenie urządzenia */}
      <Dialog open={isMoveDeviceDialogOpen} onOpenChange={setIsMoveDeviceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Przenieś urządzenie</DialogTitle>
            <DialogDescription>
              Wybierz pojazd docelowy.
            </DialogDescription>
          </DialogHeader>
          <select
            className="border rounded w-full p-2 my-4"
            value={targetVehicleId}
            onChange={e => setTargetVehicleId(e.target.value)}
          >
            <option value="">Wybierz pojazd</option>
            {allVehicles.filter(v => v.id !== deviceToMove?.vehicleId).map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name} ({vehicle.registrationNumber})
              </option>
            ))}
          </select>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button
              onClick={confirmMoveDevice}
              disabled={!targetVehicleId}
              className="gap-2"
            >
              Przenieś
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edytowanie serwisu */}
      <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edytuj serwis</DialogTitle>
            <DialogDescription>Zaktualizuj informacje o serwisie</DialogDescription>
          </DialogHeader>
          {selectedServiceForEdit && selectedVehicle && (
            <ServiceForm
              onSubmit={handleUpdateService}
              onCancel={() => setIsEditServiceDialogOpen(false)}
              vehicleId={selectedVehicle.id}
              devices={selectedVehicleDevices}
              vehicle={selectedVehicle}
              initialService={selectedServiceForEdit}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Podgląd serwisu */}
      <Dialog open={isViewServiceDialogOpen} onOpenChange={setIsViewServiceDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Podgląd serwisu</DialogTitle>
          </DialogHeader>
          {selectedServiceForView && (
            <ServiceDetails 
              service={selectedServiceForView}
              device={devices.find(d => d.id === selectedServiceForView.deviceId) || null}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Usuwanie serwisu */}
      <AlertDialog open={isDeleteServiceDialogOpen} onOpenChange={setIsDeleteServiceDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć ten serwis?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna.
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

      {/* Transfer Device/Equipment Dialog */}
      <Dialog open={isMoveDeviceDialogOpen || isMoveEquipmentDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsMoveDeviceDialogOpen(false);
          setIsMoveEquipmentDialogOpen(false);
          setDeviceToMove(null);
          setEquipmentToMove(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {deviceToMove ? 'Przenieś urządzenie' : 'Przenieś wyposażenie'}
            </DialogTitle>
            <DialogDescription>
              {equipmentToMove ? 
                `Czy na pewno chcesz przenieść wyposażenie "${equipmentToMove.name}" do innego pojazdu? Wybierz pojazd docelowy.` :
                `Wybierz pojazd docelowy lub przenieś do wyposażenia/urządzeń.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Przenieś do pojazdu:</label>
              <select
                className="border rounded w-full p-2"
                value={deviceToMove ? targetVehicleId : targetVehicleIdForEquipment}
                onChange={e => deviceToMove ? setTargetVehicleId(e.target.value) : setTargetVehicleIdForEquipment(e.target.value)}
              >
                <option value="">Wybierz pojazd</option>
                {allVehicles.filter(v => v.id !== (deviceToMove?.vehicleId || equipmentToMove?.vehicleId)).map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.registrationNumber})
                  </option>
                ))}
              </select>
            </div>
            
            {deviceToMove && (
              <div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={async () => {
                    // Convert device to equipment
                    const equipmentData: Equipment = {
                      id: uuidv4(),
                      name: deviceToMove.name,
                      brand: deviceToMove.brand,
                      type: deviceToMove.type,
                      model: deviceToMove.model,
                      serialNumber: deviceToMove.serialNumber,
                      vehicleId: deviceToMove.vehicleId,
                      year: deviceToMove.year,
                      purchasePrice: deviceToMove.purchasePrice,
                      purchaseDate: deviceToMove.purchaseDate,
                      lastService: new Date(),
                      nextService: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                      notes: deviceToMove.notes,
                      status: deviceToMove.status,
                      images: deviceToMove.images,
                      thumbnail: deviceToMove.thumbnail,
                      attachments: deviceToMove.attachments,
                    };
                    
                    const supabaseEquipment = mapEquipmentToSupabaseEquipment(equipmentData);
                    const { data, error } = await supabase.from('equipment').insert(supabaseEquipment).select().single();
                    
                    if (!error && data) {
                      await supabase.from('devices').delete().eq('id', deviceToMove.id);
                      setEquipment(prev => [...prev, mapSupabaseEquipmentToEquipment(data)]);
                      setDevices(prev => prev.filter(d => d.id !== deviceToMove.id));
                      toast.success("Urządzenie przeniesione do wyposażenia");
                      setIsMoveDeviceDialogOpen(false);
                      setDeviceToMove(null);
                    } else {
                      toast.error("Błąd przenoszenia");
                    }
                  }}
                >
                  Przenieś do wyposażenia
                </Button>
              </div>
            )}
            
            {equipmentToMove && (
              <div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={async () => {
                    // Convert equipment to device
                    const deviceData: Device = {
                      id: uuidv4(),
                      name: equipmentToMove.name,
                      brand: equipmentToMove.brand,
                      type: equipmentToMove.type,
                      model: equipmentToMove.model,
                      serialNumber: equipmentToMove.serialNumber,
                      vehicleId: equipmentToMove.vehicleId,
                      year: equipmentToMove.year,
                      purchasePrice: equipmentToMove.purchasePrice,
                      purchaseDate: equipmentToMove.purchaseDate,
                      lastService: new Date(),
                      nextService: new Date(new Date().setMonth(new Date().getMonth() + 6)),
                      serviceExpiryDate: undefined,
                      serviceReminderDays: 30,
                      notes: equipmentToMove.notes,
                      status: equipmentToMove.status,
                      images: equipmentToMove.images,
                      thumbnail: equipmentToMove.thumbnail,
                      attachments: equipmentToMove.attachments,
                    };
                    
                    const supabaseDevice = mapDeviceToSupabaseDevice(deviceData);
                    const { data, error } = await supabase.from('devices').insert(supabaseDevice).select().single();
                    
                    if (!error && data) {
                      await supabase.from('equipment').delete().eq('id', equipmentToMove.id);
                      setDevices(prev => [...prev, mapSupabaseDeviceToDevice(data)]);
                      setEquipment(prev => prev.filter(e => e.id !== equipmentToMove.id));
                      toast.success("Wyposażenie przeniesione do urządzeń");
                      setIsMoveEquipmentDialogOpen(false);
                      setEquipmentToMove(null);
                    } else {
                      toast.error("Błąd przenoszenia");
                    }
                  }}
                >
                  Przenieś do urządzeń
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button
              onClick={async () => {
                const targetId = deviceToMove ? targetVehicleId : targetVehicleIdForEquipment;
                if (targetId) {
                  if (deviceToMove) {
                    await confirmMoveDevice();
                  } else if (equipmentToMove) {
                    const updates = { vehicleid: targetId };
                    const { error } = await supabase
                      .from('equipment')
                      .update(updates)
                      .eq('id', equipmentToMove.id);
                    
                    if (!error) {
                      setEquipment(prev => prev.map(e => e.id === equipmentToMove.id ? { ...e, vehicleId: targetId } : e));
                      toast.success("Wyposażenie przeniesione");
                    } else {
                      toast.error("Błąd przenoszenia wyposażenia");
                    }
                    setIsMoveEquipmentDialogOpen(false);
                    setEquipmentToMove(null);
                    setTargetVehicleIdForEquipment("");
                  }
                }
              }}
              disabled={!(deviceToMove ? targetVehicleId : targetVehicleIdForEquipment)}
            >
              Przenieś do pojazdu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Device to Equipment Confirmation Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konwertuj urządzenie na wyposażenie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz przenieść urządzenie "{deviceToConvert?.name}" do wyposażenia? 
              Ta operacja usunie urządzenie z listy urządzeń i doda je do wyposażenia.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConvertDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={confirmConvertToEquipment}>
              Potwierdź przeniesienie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Equipment Dialogs */}
      <EquipmentDialogs
        isAddDialogOpen={isAddEquipmentOpen}
        setIsAddDialogOpen={setIsAddEquipmentOpen}
        onAddEquipment={handleAddEquipment}
        isEditDialogOpen={isEditEquipmentOpen}
        setIsEditDialogOpen={setIsEditEquipmentOpen}
        selectedEquipment={selectedEquipment}
        onUpdateEquipment={handleUpdateEquipment}
        isDetailsDialogOpen={isEquipmentDetailsOpen}
        setIsDetailsDialogOpen={setIsEquipmentDetailsOpen}
        isDeleteDialogOpen={isDeleteEquipmentOpen}
        setIsDeleteDialogOpen={setIsDeleteEquipmentOpen}
        equipmentToDelete={equipmentToDelete}
        onConfirmDelete={handleConfirmDeleteEquipment}
        vehicles={allVehicles}
        selectedVehicleId={selectedVehicleId}
      />

      {/* Vehicle Equipment Dialog */}
      <Dialog open={isAddVehicleEquipmentDialogOpen} onOpenChange={setIsAddVehicleEquipmentDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Equipment pojazdu</DialogTitle>
            <DialogDescription>
              Wypełnij formularz, aby dodać equipment do pojazdu
            </DialogDescription>
          </DialogHeader>
          <AddVehicleEquipmentForm 
            onSubmit={handleAddVehicleEquipment} 
            onCancel={() => setIsAddVehicleEquipmentDialogOpen(false)}
            vehicles={allVehicles}
            selectedVehicleId={selectedVehicleId}
          />
        </DialogContent>
      </Dialog>

      {/* Vehicle Equipment Dialogs */}
      <VehicleEquipmentDialogs
        isEditDialogOpen={isEditVehicleEquipmentOpen}
        setIsEditDialogOpen={setIsEditVehicleEquipmentOpen}
        selectedVehicleEquipment={selectedVehicleEquipment}
        onUpdateVehicleEquipment={handleUpdateVehicleEquipment}
        isDetailsDialogOpen={isVehicleEquipmentDetailsOpen}
        setIsDetailsDialogOpen={setIsVehicleEquipmentDetailsOpen}
        isDeleteDialogOpen={isDeleteVehicleEquipmentOpen}
        setIsDeleteDialogOpen={setIsDeleteVehicleEquipmentOpen}
        vehicleEquipmentToDelete={vehicleEquipmentToDelete}
        onConfirmDelete={confirmDeleteVehicleEquipment}
        vehicles={allVehicles}
      />

      {/* Move VehicleEquipment Dialog */}
      <Dialog open={isMoveVehicleEquipmentDialogOpen} onOpenChange={setIsMoveVehicleEquipmentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Przenieś equipment do innego pojazdu</DialogTitle>
            <DialogDescription>
              Wybierz pojazd, do którego chcesz przenieść equipment "{vehicleEquipmentToMove?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label htmlFor="target-vehicle-ve" className="text-sm font-medium mb-2 block">Wybierz pojazd docelowy:</label>
            <select
              id="target-vehicle-ve"
              value={targetVehicleIdForVehicleEquipment}
              onChange={(e) => setTargetVehicleIdForVehicleEquipment(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background"
            >
              <option value="">Wybierz pojazd</option>
              {allVehicles
                .filter(v => v.id !== selectedVehicleId)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.registrationNumber})
                  </option>
                ))}
            </select>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button 
              onClick={confirmMoveVehicleEquipment} 
              disabled={!targetVehicleIdForVehicleEquipment}
            >
              Przenieś equipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Vehicles;
