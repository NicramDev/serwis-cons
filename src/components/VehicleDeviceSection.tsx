
import React, { useState } from 'react';
import { Device, Vehicle } from '../utils/types';
import { Cpu, PlusCircle, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeviceList from './DeviceList';
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
  allVehicles?: Vehicle[];
  onAddDevice?: () => void;
  onEditDevice?: (device: Device) => void;
  onDeleteDevice?: (device: Device) => void;
  onViewDevice?: (device: Device) => void;
  onOpenAttachment: (url: string) => void;
  selectedVehicleId?: string | null;
  onMoveDevice?: (device: Device, targetVehicleId: string) => void;
}

const VehicleDeviceSection = ({
  devices,
  allVehicles = [],
  onAddDevice,
  onEditDevice,
  onDeleteDevice,
  onViewDevice,
  onOpenAttachment,
  selectedVehicleId,
  onMoveDevice
}: VehicleDeviceSectionProps) => {
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [targetVehicleId, setTargetVehicleId] = useState<string>("");

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

  // Filter out the current vehicle from the list of available vehicles
  const availableVehicles = allVehicles.filter(vehicle => vehicle.id !== selectedVehicleId);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Cpu className="h-4 w-4" />
          <span>Przypisane urządzenia ({devices.length})</span>
        </div>
        
        {onAddDevice && (
          <Button 
            size="sm" 
            onClick={onAddDevice}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Dodaj urządzenie
          </Button>
        )}
      </div>
      
      <DeviceList 
        devices={devices} 
        onEditDevice={onEditDevice}
        onDeleteDevice={onDeleteDevice}
        onViewDevice={onViewDevice}
        onOpenAttachment={onOpenAttachment}
        onMoveDevice={handleMoveClick}
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
    </>
  );
};

export default VehicleDeviceSection;
