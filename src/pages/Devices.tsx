
import { useState, useEffect } from 'react';
import { devices as initialDevices, vehicles as initialVehicles } from '../utils/data';
import DeviceCard from '../components/DeviceCard';
import { PlusCircle, Search } from 'lucide-react';
import { Device, Vehicle } from '../utils/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import AddDeviceForm from '../components/AddDeviceForm';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const Devices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allDevices, setAllDevices] = useState<Device[]>(() => {
    // Try to get devices from localStorage
    const savedDevices = localStorage.getItem('devices');
    return savedDevices ? JSON.parse(savedDevices) : initialDevices;
  });
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(() => {
    // Try to get vehicles from localStorage
    const savedVehicles = localStorage.getItem('vehicles');
    return savedVehicles ? JSON.parse(savedVehicles) : initialVehicles;
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Save devices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('devices', JSON.stringify(allDevices));
  }, [allDevices]);
  
  const filteredDevices = allDevices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDevice = (deviceData: Partial<Device>) => {
    const now = new Date();
    const nextServiceDate = new Date(now);
    nextServiceDate.setMonth(now.getMonth() + 6);
    
    const newDevice: Device = {
      id: uuidv4(),
      name: deviceData.name || '',
      type: deviceData.type || '',
      model: deviceData.model || '',
      serialNumber: deviceData.serialNumber || '',
      vehicleId: deviceData.vehicleId,
      lastService: now,
      nextService: nextServiceDate,
      status: 'ok',
      ...deviceData
    };
    
    setAllDevices(prevDevices => [...prevDevices, newDevice]);
    setIsAddDialogOpen(false);
    toast.success("Urządzenie zostało dodane pomyślnie");
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Urządzenia</h1>
            <p className="text-muted-foreground">Zarządzaj i śledź wszystkie urządzenia serwisowe</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Szukaj urządzeń..."
                className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              className="flex items-center justify-center space-x-2 shadow-sm"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Dodaj Urządzenie</span>
            </Button>
          </div>
        </div>
        
        {filteredDevices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevices.map((device, index) => (
              <DeviceCard key={device.id} device={device} delay={index % 5 + 1} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-12 text-center">
            <div className="icon-container mx-auto mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nie znaleziono urządzeń</h3>
            <p className="text-muted-foreground">
              Żadne urządzenia nie pasują do kryteriów wyszukiwania. Spróbuj innego zapytania lub dodaj nowe urządzenie.
            </p>
          </div>
        )}
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Dodaj nowe urządzenie</DialogTitle>
            <DialogDescription>
              Wypełnij formularz, aby dodać nowe urządzenie
            </DialogDescription>
          </DialogHeader>
          <AddDeviceForm 
            onSubmit={handleAddDevice} 
            onCancel={() => setIsAddDialogOpen(false)}
            vehicles={allVehicles}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Devices;
