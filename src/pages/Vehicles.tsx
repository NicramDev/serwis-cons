
import { useState } from 'react';
import { vehicles } from '../utils/data';
import VehicleCard from '../components/VehicleCard';
import { PlusCircle, Search } from 'lucide-react';

const Vehicles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vehicles</h1>
            <p className="text-muted-foreground">Manage and track all your vehicles</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search vehicles..."
                className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors">
              <PlusCircle className="h-5 w-5" />
              <span>Add Vehicle</span>
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
            <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
            <p className="text-muted-foreground">
              No vehicles match your search criteria. Please try a different search or add a new vehicle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
