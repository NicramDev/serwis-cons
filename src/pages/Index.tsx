import { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import ServiceItem from '../components/ServiceItem';
import { Car, Smartphone, Wrench, AlertTriangle } from 'lucide-react';
import { Device, ServiceRecord, Vehicle } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseDeviceToDevice, mapSupabaseVehicleToVehicle } from '@/utils/supabaseMappers';
import { toast } from 'sonner';

const Index = () => {
  const [upcomingServices, setUpcomingServices] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from Supabase
        const [vehiclesRes, devicesRes, servicesRes] = await Promise.all([
          supabase.from('vehicles').select('*'),
          supabase.from('devices').select('*'),
          supabase.from('service_records').select('*'),
        ]);

        if (vehiclesRes.error) {
          toast.error("Błąd pobierania pojazdów");
          console.error(vehiclesRes.error);
        } else {
          const mappedVehicles = vehiclesRes.data.map(mapSupabaseVehicleToVehicle);
          setVehicles(mappedVehicles);
        }

        if (devicesRes.error) {
          toast.error("Błąd pobierania urządzeń");
          console.error(devicesRes.error);
        } else {
          const mappedDevices = devicesRes.data.map(mapSupabaseDeviceToDevice);
          setDevices(mappedDevices);
        }

        if (servicesRes.error) {
          toast.error("Błąd pobierania historii serwisu");
          console.error(servicesRes.error);
        } else {
          const mappedServices = (servicesRes.data || []).map((record: any) => ({
            ...record,
            date: new Date(record.date),
          })) as ServiceRecord[];
          setServiceRecords(mappedServices);
        }

        // Calculate upcoming services
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);
        
        const vehicleServices = (vehiclesRes.data || [])
          .map(mapSupabaseVehicleToVehicle)
          .filter(v => {
            const nextService = v.nextService;
            return nextService && nextService >= now && nextService <= thirtyDaysFromNow;
          })
          .map(v => ({
            id: v.id,
            name: v.name,
            type: 'vehicle',
            date: v.nextService,
            model: v.model
          }));
          
        const deviceServices = (devicesRes.data || [])
          .map(mapSupabaseDeviceToDevice)
          .filter(d => {
            const nextService = d.nextService;
            return nextService && nextService >= now && nextService <= thirtyDaysFromNow;
          })
          .map(d => ({
            id: d.id,
            name: d.name,
            type: 'device',
            date: d.nextService,
            model: d.model
          }));
          
        const allServices = [...vehicleServices, ...deviceServices].sort((a, b) => {
          const dateA = a.date instanceof Date ? a.date : new Date(a.date);
          const dateB = b.date instanceof Date ? b.date : new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
        
        setUpcomingServices(allServices);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error("Wystąpił błąd podczas pobierania danych");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const needsAttention = [
    ...vehicles.filter(v => v.status === 'needs-service'),
    ...devices.filter(d => d.status === 'needs-service' || d.status === 'error')
  ].length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Ładowanie danych...</div>
      </div>
    );
  }
  
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
              {serviceRecords.length > 0 ? (
                serviceRecords
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((record, index) => (
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
                  ))
              ) : (
                <div className="text-center text-muted-foreground">
                  Brak ostatnich aktywności. Rozpocznij dodając nowy serwis!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;