
import { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import ServiceItem from '../components/ServiceItem';
import { devices as initialDevices, getUpcomingServices, serviceRecords as initialServiceRecords, vehicles as initialVehicles } from '../utils/data';
import { Car, Smartphone, Wrench, AlertTriangle } from 'lucide-react';
import { Device, ServiceRecord, Vehicle } from '@/utils/types';

const Index = () => {
  const [upcomingServices, setUpcomingServices] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  
  useEffect(() => {
    // Załaduj dane z localStorage lub użyj domyślnych danych
    const loadData = () => {
      const savedVehicles = localStorage.getItem('vehicles');
      const vehiclesData = savedVehicles ? JSON.parse(savedVehicles) : null;
      
      const savedDevices = localStorage.getItem('devices');
      const devicesData = savedDevices ? JSON.parse(savedDevices) : null;
      
      const savedRecords = localStorage.getItem('serviceRecords');
      const recordsData = savedRecords ? JSON.parse(savedRecords) : null;
      
      // If no vehicles in localStorage or empty array, use initialVehicles
      const parsedVehicles = vehiclesData && Array.isArray(vehiclesData) && vehiclesData.length > 0 ? vehiclesData : initialVehicles;
      const parsedDevices = devicesData && Array.isArray(devicesData) && devicesData.length > 0 ? devicesData : initialDevices;
      
      // Make sure we convert date strings to Date objects
      const processedVehicles = parsedVehicles.map((vehicle: any) => ({
        ...vehicle,
        lastService: vehicle.lastService instanceof Date ? vehicle.lastService : new Date(vehicle.lastService),
        nextService: vehicle.nextService instanceof Date ? vehicle.nextService : new Date(vehicle.nextService),
        purchaseDate: vehicle.purchaseDate ? (vehicle.purchaseDate instanceof Date ? vehicle.purchaseDate : new Date(vehicle.purchaseDate)) : undefined,
        inspectionExpiryDate: vehicle.inspectionExpiryDate ? (vehicle.inspectionExpiryDate instanceof Date ? vehicle.inspectionExpiryDate : new Date(vehicle.inspectionExpiryDate)) : undefined,
        serviceExpiryDate: vehicle.serviceExpiryDate ? (vehicle.serviceExpiryDate instanceof Date ? vehicle.serviceExpiryDate : new Date(vehicle.serviceExpiryDate)) : undefined,
        insuranceExpiryDate: vehicle.insuranceExpiryDate ? (vehicle.insuranceExpiryDate instanceof Date ? vehicle.insuranceExpiryDate : new Date(vehicle.insuranceExpiryDate)) : undefined
      }));
      
      const processedDevices = parsedDevices.map((device: any) => ({
        ...device,
        lastService: device.lastService instanceof Date ? device.lastService : new Date(device.lastService),
        nextService: device.nextService instanceof Date ? device.nextService : new Date(device.nextService),
        purchaseDate: device.purchaseDate ? (device.purchaseDate instanceof Date ? device.purchaseDate : new Date(device.purchaseDate)) : undefined,
        serviceExpiryDate: device.serviceExpiryDate ? (device.serviceExpiryDate instanceof Date ? device.serviceExpiryDate : new Date(device.serviceExpiryDate)) : undefined
      }));
      
      setVehicles(processedVehicles);
      setDevices(processedDevices);
      setServiceRecords(recordsData && Array.isArray(recordsData) && recordsData.length > 0 ? recordsData : initialServiceRecords);
      
      // Reset localStorage with the initial data to ensure it's always properly loaded
      localStorage.setItem('vehicles', JSON.stringify(processedVehicles));
      localStorage.setItem('devices', JSON.stringify(processedDevices));
      localStorage.setItem('serviceRecords', JSON.stringify(recordsData && Array.isArray(recordsData) && recordsData.length > 0 ? recordsData : initialServiceRecords));
      
      // Zwraca dane do użycia w calculateUpcomingServices
      return {
        vehicles: processedVehicles,
        devices: processedDevices
      };
    };
    
    const data = loadData();
    
    // Ręcznie obliczamy nadchodzące serwisy
    const calculateUpcomingServices = () => {
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      
      const vehicleServices = data.vehicles
        .filter(v => {
          const nextService = v.nextService instanceof Date ? 
            v.nextService : new Date(v.nextService);
          return nextService >= now && nextService <= thirtyDaysFromNow;
        })
        .map(v => ({
          id: v.id,
          name: v.name,
          type: 'vehicle',
          date: v.nextService,
          model: v.model
        }));
        
      const deviceServices = data.devices
        .filter(d => {
          const nextService = d.nextService instanceof Date ? 
            d.nextService : new Date(d.nextService);
          return nextService >= now && nextService <= thirtyDaysFromNow;
        })
        .map(d => ({
          id: d.id,
          name: d.name,
          type: 'device',
          date: d.nextService,
          model: d.model
        }));
        
      return [...vehicleServices, ...deviceServices].sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    };
    
    try {
      const services = calculateUpcomingServices();
      console.log("Upcoming services calculated:", services.length);
      setUpcomingServices(services);
    } catch (error) {
      console.error("Error calculating upcoming services:", error);
    }
    
  }, []);
  
  // Debug
  console.log("Dashboard - Vehicles:", vehicles.length);
  console.log("Dashboard - Devices:", devices.length);
  console.log("Dashboard - Upcoming Services:", upcomingServices.length);
  
  const needsAttention = [
    ...vehicles.filter(v => v.status === 'needs-service'),
    ...devices.filter(d => d.status === 'needs-service' || d.status === 'error')
  ].length;
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Pulpit</h1>
        <p className="text-muted-foreground mb-8">System Zarządzania Serwisem Pojazdów</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard 
            title="Wszystkie Pojazdy" 
            icon={<Car className="h-5 w-5" />} 
            value={vehicles.length}
            trend={{ value: 25, label: 'vs poprzedni miesiąc' }}
            delay={1}
          />
          <DashboardCard 
            title="Wszystkie Urządzenia" 
            icon={<Smartphone className="h-5 w-5" />} 
            value={devices.length}
            delay={2}
          />
          <DashboardCard 
            title="Historia Serwisu" 
            icon={<Wrench className="h-5 w-5" />} 
            value={serviceRecords.length}
            trend={{ value: 12, label: 'vs poprzedni miesiąc' }}
            delay={3}
          />
          <DashboardCard 
            title="Wymaga Uwagi" 
            icon={<AlertTriangle className="h-5 w-5" />} 
            value={needsAttention}
            trend={{ value: -5, label: 'vs poprzedni miesiąc' }}
            delay={4}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-xl overflow-hidden opacity-0 animate-fade-in staggered-delay-5">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold">Nadchodzące Serwisy</h2>
            </div>
            <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
              {upcomingServices.length > 0 ? (
                upcomingServices.map((service, index) => (
                  <ServiceItem 
                    key={`${service.type}-${service.id}`}
                    id={service.id}
                    name={service.name}
                    type={service.type}
                    date={service.date}
                    model={service.model}
                    delay={index + 1}
                  />
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  Brak nadchodzących serwisów w ciągu najbliższych 30 dni
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-card rounded-xl overflow-hidden opacity-0 animate-fade-in staggered-delay-5">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold">Ostatnia Aktywność</h2>
            </div>
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              {serviceRecords.slice(0, 5).map((record, index) => (
                <div key={record.id} className={`flex items-start opacity-0 animate-fade-in staggered-delay-${index + 1}`}>
                  <div className="icon-container shrink-0 mr-4">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Serwis {record.vehicleId ? 'pojazdu' : 'urządzenia'} - {record.type === 'repair' ? 'naprawa' : record.type === 'maintenance' ? 'konserwacja' : 'inspekcja'}
                    </p>
                    <p className="text-sm text-muted-foreground">{new Date(record.date).toLocaleDateString()}</p>
                    <p className="text-sm mt-1">{record.description.substring(0, 60)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
