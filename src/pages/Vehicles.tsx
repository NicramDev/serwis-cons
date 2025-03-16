
import { useState } from 'react';
import { vehicles } from '../utils/data';
import VehicleCard from '../components/VehicleCard';
import { PlusCircle, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Vehicle } from '../utils/types';
import AddVehicleForm from '../components/AddVehicleForm';
import { v4 as uuidv4 } from 'uuid';

const Vehicles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(vehicles);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const filteredVehicles = allVehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddVehicle = (vehicleData: Partial<Vehicle>) => {
    const newVehicle = {
      ...vehicleData,
      id: uuidv4(),
    } as Vehicle;
    
    setAllVehicles([...allVehicles, newVehicle]);
    setIsAddDialogOpen(false);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pojazdy</h1>
            <p className="text-muted-foreground">Zarządzaj i śledź wszystkie swoje pojazdy</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Szukaj pojazdów..."
                className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button 
              className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Dodaj Pojazd</span>
            </button>
          </div>
        </div>
        
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} delay={index % 5 + 1} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-12 text-center">
            <div className="icon-container mx-auto mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nie znaleziono pojazdów</h3>
            <p className="text-muted-foreground">
              Żadne pojazdy nie pasują do kryteriów wyszukiwania. Spróbuj innego zapytania lub dodaj nowy pojazd.
            </p>
          </div>
        )}
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dodaj nowy pojazd</DialogTitle>
          </DialogHeader>
          <AddVehicleForm 
            onSubmit={handleAddVehicle} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vehicles;
