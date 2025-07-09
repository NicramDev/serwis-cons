
import React, { useState } from 'react';
import { Device, Equipment, Vehicle } from '../utils/types';
import { Cpu, PlusCircle, MoveRight, Search, Wrench, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeviceList from './DeviceList';
import EquipmentList from './EquipmentList';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface VehicleDeviceSectionProps {
  devices: Device[];
  equipment: Equipment[];
  allVehicles?: Vehicle[];
  onAddDevice?: () => void;
  onAddEquipment?: () => void;
  onEditDevice?: (device: Device) => void;
  onDeleteDevice?: (device: Device) => void;
  onViewDevice?: (device: Device) => void;
  onEditEquipment?: (equipment: Equipment) => void;
  onDeleteEquipment?: (equipment: Equipment) => void;
  onViewEquipment?: (equipment: Equipment) => void;
  onOpenAttachment: (url: string) => void;
  selectedVehicleId?: string | null;
  onMoveDevice?: (device: Device, targetVehicleId: string) => void;
  onMoveEquipment?: (equipment: Equipment, targetVehicleId: string) => void;
  onConvertToEquipment?: (device: Device) => void;
}

const VehicleDeviceSection = ({
  devices,
  equipment,
  allVehicles = [],
  onAddDevice,
  onAddEquipment,
  onEditDevice,
  onDeleteDevice,
  onViewDevice,
  onEditEquipment,
  onDeleteEquipment,
  onViewEquipment,
  onOpenAttachment,
  selectedVehicleId,
  onMoveDevice,
  onMoveEquipment,
  onConvertToEquipment
}: VehicleDeviceSectionProps) => {
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [targetVehicleId, setTargetVehicleId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [equipmentSearchQuery, setEquipmentSearchQuery] = useState<string>("");
  
  // Equipment move state
  const [isMoveEquipmentDialogOpen, setIsMoveEquipmentDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [targetVehicleIdForEquipment, setTargetVehicleIdForEquipment] = useState<string>("");

  const handleMoveClick = (device: Device) => {
    setSelectedDevice(device);
    setTargetVehicleId("");
    setIsMoveDialogOpen(true);
  };

  const handleMoveDevice = () => {
    if (!selectedDevice || !targetVehicleId || !onMoveDevice) return;
    
    onMoveDevice(selectedDevice, targetVehicleId);
    setIsMoveDialogOpen(false);
    toast.success(`Urządzenie zostało przeniesione do innego pojazdu`);
  };

  const handleMoveEquipmentClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setTargetVehicleIdForEquipment("");
    setIsMoveEquipmentDialogOpen(true);
  };

  const handleMoveEquipment = () => {
    if (!selectedEquipment || !targetVehicleIdForEquipment || !onMoveEquipment) return;
    
    onMoveEquipment(selectedEquipment, targetVehicleIdForEquipment);
    setIsMoveEquipmentDialogOpen(false);
    toast.success(`Wyposażenie zostało przeniesione do innego pojazdu`);
  };

  // Filter out the current vehicle from the list of available vehicles
  const availableVehicles = allVehicles.filter(vehicle => vehicle.id !== selectedVehicleId);

  // Filter devices based on search query
  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter equipment based on search query
  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(equipmentSearchQuery.toLowerCase()) ||
    item.brand?.toLowerCase().includes(equipmentSearchQuery.toLowerCase()) ||
    item.model?.toLowerCase().includes(equipmentSearchQuery.toLowerCase()) ||
    item.type?.toLowerCase().includes(equipmentSearchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Cpu className="h-4 w-4" />
          <span>Przypisane urządzenia ({devices.length})</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Szukaj urządzeń..."
              className="pl-9 pr-3 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Button 
              size="sm" 
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Dodaj
              <ChevronDown className="h-3 w-3" />
            </Button>
            
            {showAddMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-md shadow-lg z-10">
                <div className="py-1">
                  {onAddDevice && (
                    <button
                      onClick={() => {
                        onAddDevice();
                        setShowAddMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                    >
                      <Cpu className="h-4 w-4" />
                      Dodaj urządzenie
                    </button>
                  )}
                  {onAddEquipment && (
                    <button
                      onClick={() => {
                        onAddEquipment();
                        setShowAddMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                    >
                      <Wrench className="h-4 w-4" />
                      Dodaj wyposażenie
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <DeviceList 
        devices={filteredDevices} 
        onEditDevice={onEditDevice}
        onDeleteDevice={onDeleteDevice}
        onViewDevice={onViewDevice}
        onOpenAttachment={onOpenAttachment}
        onMoveDevice={handleMoveClick}
        onConvertToEquipment={onConvertToEquipment}
      />

      <div className="flex items-center justify-between mb-3 mt-6">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Wrench className="h-4 w-4" />
          <span>Wyposażenie ({equipment.length})</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Szukaj wyposażenia..."
              className="pl-9 pr-3 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
              value={equipmentSearchQuery}
              onChange={(e) => setEquipmentSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <EquipmentList 
        equipment={filteredEquipment} 
        onEditEquipment={onEditEquipment}
        onDeleteEquipment={onDeleteEquipment}
        onViewEquipment={onViewEquipment}
        onOpenAttachment={onOpenAttachment}
        onMoveEquipment={handleMoveEquipmentClick}
      />

      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Przenieś urządzenie do innego pojazdu</DialogTitle>
            <DialogDescription>
              Wybierz pojazd, do którego chcesz przenieść urządzenie {selectedDevice?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="target-vehicle" className="text-sm mb-2 block">Wybierz pojazd docelowy:</Label>
            <Select
              value={targetVehicleId}
              onValueChange={setTargetVehicleId}
            >
              <SelectTrigger className="w-full bg-white" id="target-vehicle">
                <SelectValue placeholder="Wybierz pojazd" />
              </SelectTrigger>
              <SelectContent>
                {availableVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.registrationNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button 
              onClick={handleMoveDevice} 
              disabled={!targetVehicleId}
              className="gap-2"
            >
              <MoveRight className="h-4 w-4" />
              Przenieś urządzenie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMoveEquipmentDialogOpen} onOpenChange={setIsMoveEquipmentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Przenieś wyposażenie do innego pojazdu</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz przenieść wyposażenie "{selectedEquipment?.name}" do innego pojazdu?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="target-vehicle-equipment" className="text-sm mb-2 block">Wybierz pojazd docelowy:</Label>
            <Select
              value={targetVehicleIdForEquipment}
              onValueChange={setTargetVehicleIdForEquipment}
            >
              <SelectTrigger className="w-full bg-white" id="target-vehicle-equipment">
                <SelectValue placeholder="Wybierz pojazd" />
              </SelectTrigger>
              <SelectContent>
                {availableVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.registrationNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button 
              onClick={handleMoveEquipment} 
              disabled={!targetVehicleIdForEquipment}
              className="gap-2"
            >
              <MoveRight className="h-4 w-4" />
              Przenieś wyposażenie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleDeviceSection;
