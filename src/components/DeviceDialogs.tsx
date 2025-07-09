import React from 'react';
import { Device } from '@/utils/types';
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
import AddDeviceForm from './AddDeviceForm';
import DeviceDetails from './DeviceDetails';

interface DeviceDialogsProps {
  // Add dialog
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  onAddDevice: (device: Partial<Device>) => void;
  
  // Edit dialog
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedDevice: Device | null;
  onUpdateDevice: (device: Device) => void;
  
  // Details dialog
  isDetailsDialogOpen: boolean;
  setIsDetailsDialogOpen: (open: boolean) => void;
  
  // Delete dialog
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  deviceToDelete: Device | null;
  onConfirmDelete: () => void;
  
  vehicles: any[];
}

const DeviceDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  onAddDevice,
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedDevice,
  onUpdateDevice,
  isDetailsDialogOpen,
  setIsDetailsDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  deviceToDelete,
  onConfirmDelete,
  vehicles
}: DeviceDialogsProps) => {
  return (
    <>
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Dodaj nowe urządzenie</DialogTitle>
            <DialogDescription>
              Wypełnij formularz, aby dodać nowe urządzenie
            </DialogDescription>
          </DialogHeader>
          <AddDeviceForm 
            onSubmit={onAddDevice} 
            onCancel={() => setIsAddDialogOpen(false)}
            vehicles={vehicles}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
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
              onSubmit={onUpdateDevice}
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
            <DialogTitle>Szczegóły urządzenia</DialogTitle>
            <DialogDescription>
              Pełne informacje o urządzeniu
            </DialogDescription>
          </DialogHeader>
          {selectedDevice && <DeviceDetails device={selectedDevice} />}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
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
            <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive text-destructive-foreground">
              Usuń urządzenie
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeviceDialogs;