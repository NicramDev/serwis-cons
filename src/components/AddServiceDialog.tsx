
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ServiceForm from "./ServiceForm";
import { Vehicle, Device, ServiceRecord } from "@/utils/types";

type AddServiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  devices: Device[];
  onSubmit: (service: ServiceRecord) => void;
};

const AddServiceDialog = ({ open, onOpenChange, vehicle, devices, onSubmit }: AddServiceDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-2xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Dodaj serwis/naprawę</DialogTitle>
        <DialogDescription>Dodaj nowy wpis serwisowy dla pojazdu lub urządzenia.</DialogDescription>
      </DialogHeader>
      {vehicle && (
        <ServiceForm
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          vehicleId={vehicle.id}
          devices={devices}
          vehicle={vehicle}
        />
      )}
    </DialogContent>
  </Dialog>
);

export default AddServiceDialog;
