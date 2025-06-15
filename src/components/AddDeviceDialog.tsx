
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddDeviceForm from "./AddDeviceForm";
import { Device, Vehicle } from "@/utils/types";

type AddDeviceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  allVehicles: Vehicle[];
  onSubmit: (device: Partial<Device>) => void;
};

const AddDeviceDialog = ({ open, onOpenChange, vehicle, allVehicles, onSubmit }: AddDeviceDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-2xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Dodaj urządzenie</DialogTitle>
        <DialogDescription>Wypełnij szczegóły urządzenia przypisanego do pojazdu.</DialogDescription>
      </DialogHeader>
      {vehicle && (
        <AddDeviceForm
          vehicles={allVehicles}
          selectedVehicleId={vehicle.id}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      )}
    </DialogContent>
  </Dialog>
);

export default AddDeviceDialog;

