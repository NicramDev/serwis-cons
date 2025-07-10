import React from 'react';
import { Equipment } from '@/utils/types';
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
import AddEquipmentForm from './AddEquipmentForm';
import EquipmentDetails from './EquipmentDetails';

interface EquipmentDialogsProps {
  // Add dialog
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  onAddEquipment: (equipment: Partial<Equipment>) => Promise<void>;
  
  // Edit dialog
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedEquipment: Equipment | null;
  onUpdateEquipment: (equipment: Equipment) => Promise<void>;
  
  // Details dialog
  isDetailsDialogOpen: boolean;
  setIsDetailsDialogOpen: (open: boolean) => void;
  
  // Delete dialog
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  equipmentToDelete: Equipment | null;
  onConfirmDelete: () => void;
  
  vehicles: any[];
  selectedVehicleId?: string | null;
}

const EquipmentDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  onAddEquipment,
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedEquipment,
  onUpdateEquipment,
  isDetailsDialogOpen,
  setIsDetailsDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  equipmentToDelete,
  onConfirmDelete,
  vehicles,
  selectedVehicleId
}: EquipmentDialogsProps) => {
  return (
    <>
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Dodaj nowe wyposażenie</DialogTitle>
            <DialogDescription>
              Wypełnij formularz, aby dodać nowe wyposażenie
            </DialogDescription>
          </DialogHeader>
          <AddEquipmentForm 
            onSubmit={onAddEquipment} 
            onCancel={() => setIsAddDialogOpen(false)}
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edytuj wyposażenie</DialogTitle>
            <DialogDescription>
              Zaktualizuj informacje o wyposażeniu
            </DialogDescription>
          </DialogHeader>
          {selectedEquipment && (
            <AddEquipmentForm
              initialEquipment={selectedEquipment}
              onSubmit={onUpdateEquipment}
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
            <DialogTitle>Szczegóły wyposażenia</DialogTitle>
            <DialogDescription>
              Pełne informacje o wyposażeniu
            </DialogDescription>
          </DialogHeader>
          {selectedEquipment && <EquipmentDetails equipment={selectedEquipment} />}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć to wyposażenie?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Spowoduje to usunięcie wyposażenia i jego danych.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive text-destructive-foreground">
              Usuń wyposażenie
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EquipmentDialogs;