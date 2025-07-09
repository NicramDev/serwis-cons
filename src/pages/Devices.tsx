import { useState, useEffect } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { Device } from '../utils/types';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';
import FullscreenViewer from '../components/FullscreenViewer';
import DeviceDialogs from '../components/DeviceDialogs';
import DeviceListSection from '../components/DeviceListSection';
import { useDeviceData } from '../hooks/useDeviceData';
import { useDeviceOperations } from '../hooks/useDeviceOperations';

const Devices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  
  // Dialogs state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);
  
  // Custom hooks
  const { allDevices, setAllDevices, allVehicles, loading } = useDeviceData();
  const { addDevice, updateDevice, deleteDevice } = useDeviceOperations();
  
  // Handle URL params for direct device access
  useEffect(() => {
    const deviceId = searchParams.get('deviceId');
    const shouldEdit = searchParams.get('edit') === 'true';
    
    if (deviceId && allDevices.length > 0) {
      const device = allDevices.find(d => d.id === deviceId);
      if (device) {
        setSelectedDevice(device);
        if (shouldEdit) {
          setIsEditDialogOpen(true);
        } else {
          setIsDetailsDialogOpen(true);
        }
      }
    }
  }, [searchParams, allDevices]);
  
  const handleAddDevice = async (deviceData: Partial<Device>) => {
    try {
      const newDevice = await addDevice(deviceData);
      setAllDevices(prevDevices => [...prevDevices, newDevice]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  const handleUpdateDevice = async (updatedDeviceData: Device) => {
    try {
      const updatedDevice = await updateDevice(updatedDeviceData);
      setAllDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === updatedDeviceData.id ? updatedDevice : device
        )
      );
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating device:', error);
    }
  };

  const confirmDeleteDevice = async () => {
    if (!deviceToDelete) return;
    
    try {
      await deleteDevice(deviceToDelete.id);
      setAllDevices(prevDevices => prevDevices.filter(d => d.id !== deviceToDelete.id));
    } catch (error) {
      console.error('Error deleting device:', error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeviceToDelete(null);
    }
  };
  
  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsEditDialogOpen(true);
  };

  const handleViewDeviceDetails = (device: Device) => {
    setSelectedDevice(device);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteDevice = (device: Device) => {
    setDeviceToDelete(device);
    setIsDeleteDialogOpen(true);
  };
  
  const openFullscreen = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFullscreenUrl(url);
  };

  const closeFullscreen = () => {
    setFullscreenUrl(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Ładowanie urządzeń...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {fullscreenUrl && (
        <FullscreenViewer
          url={fullscreenUrl}
          onClose={closeFullscreen}
        />
      )}
      
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
        
        <DeviceListSection
          devices={allDevices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onEditDevice={handleEditDevice}
          onDeleteDevice={handleDeleteDevice}
          onViewDeviceDetails={handleViewDeviceDetails}
        />
      </div>
      
      <DeviceDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        onAddDevice={handleAddDevice}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedDevice={selectedDevice}
        onUpdateDevice={handleUpdateDevice}
        isDetailsDialogOpen={isDetailsDialogOpen}
        setIsDetailsDialogOpen={setIsDetailsDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        deviceToDelete={deviceToDelete}
        onConfirmDelete={confirmDeleteDevice}
        vehicles={allVehicles}
      />
    </div>
  );
};

export default Devices;
