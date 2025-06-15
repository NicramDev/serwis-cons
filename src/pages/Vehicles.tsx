import { useEffect, useState } from 'react';
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import AddVehicleForm from '../components/AddVehicleForm';
import VehicleDetails from '../components/VehicleDetails';
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
import { mapSupabaseVehicleToVehicle, mapVehicleToSupabaseVehicle } from '@/utils/supabaseMappers';
import { extractAllTags } from '@/utils/tagUtils';

const Vehicles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*');

      if (error) {
        console.error("Błąd pobierania pojazdów z Supabase:", error);
        toast.error("Nie udało się pobrać danych pojazdów.");
        setAllVehicles([]);
      } else if (data) {
        setAllVehicles(data.map(mapSupabaseVehicleToVehicle));
      }
    };
    fetchVehicles();
  }, []);

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
      console.error("Błąd dodawania pojazdu do Supabase:", error);
      toast.error("Błąd podczas dodawania pojazdu.");
      return;
    }
    if (data) {
      setAllVehicles(prev => [...prev, mapSupabaseVehicleToVehicle(data)]);
      setIsAddDialogOpen(false);
      toast.success("Pojazd został dodany pomyślnie");
    }
  };

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
      console.error("Błąd aktualizacji pojazdu:", error);
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
  
  const handleVehicleClick = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
      setSelectedVehicleForEdit(vehicle);
      setIsEditDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
      setVehicleToDelete(vehicle);
      setIsDeleteDialogOpen(true);
  };
  
  const handleViewDetails = (vehicle: Vehicle) => {
      setSelectedVehicleForEdit(vehicle);
      setIsDetailsDialogOpen(true);
  };
  
  const handleTagSelect = (tag: string) => {
      setSelectedTags(prev => 
          prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      );
  };

  const filteredVehicles = allVehicles.filter(vehicle => {
    const textMatch = 
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        
        {filteredVehicles.length > 0 ? (
          <VehicleList 
            vehicles={filteredVehicles}
            selectedVehicleId={selectedVehicleId}
            onVehicleClick={handleVehicleClick}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
            onView={handleViewDetails}
          />
        ) : (
          <NoVehiclesFound />
        )}
      </div>
      
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

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Szczegóły pojazdu</DialogTitle>
            <DialogDescription>
              Pełne informacje o pojeździe
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleForEdit && <VehicleDetails vehicle={selectedVehicleForEdit} />}
        </DialogContent>
      </Dialog>
      
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
    </div>
  );
};

export default Vehicles;
