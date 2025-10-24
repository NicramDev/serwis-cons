import React from 'react';
import { VehicleEquipment } from '@/utils/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import AddVehicleEquipmentForm from './AddVehicleEquipmentForm';
import VehicleEquipmentDetails from './VehicleEquipmentDetails';

interface VehicleEquipmentDialogsProps {
  // Edit dialog
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedVehicleEquipment: VehicleEquipment | null;
  onUpdateVehicleEquipment: (ve: VehicleEquipment) => Promise<void>;
  
  // Details dialog
  isDetailsDialogOpen: boolean;
  setIsDetailsDialogOpen: (open: boolean) => void;
  
  // Delete dialog
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  vehicleEquipmentToDelete: VehicleEquipment | null;
  onConfirmDelete: () => void;
  
  vehicles: any[];
}

const VehicleEquipmentDialogs = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedVehicleEquipment,
  onUpdateVehicleEquipment,
  isDetailsDialogOpen,
  setIsDetailsDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  vehicleEquipmentToDelete,
  onConfirmDelete,
  vehicles
}: VehicleEquipmentDialogsProps) => {
  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edytuj equipment</DialogTitle>
            <DialogDescription>
              Zaktualizuj informacje o equipment
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleEquipment && (
            <AddVehicleEquipmentForm
              initialVehicleEquipment={selectedVehicleEquipment}
              onSubmit={onUpdateVehicleEquipment}
              onCancel={() => setIsEditDialogOpen(false)}
              vehicles={vehicles}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Szczegóły equipment</DialogTitle>
            <DialogDescription>
              Pełne informacje o equipment
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleEquipment && <VehicleEquipmentDetails vehicleEquipment={selectedVehicleEquipment} />}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć ten equipment?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Spowoduje to usunięcie equipment i jego danych.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive text-destructive-foreground">
              Usuń equipment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VehicleEquipmentDialogs;
