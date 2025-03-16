
import { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import ServiceItem from '../components/ServiceItem';
import { devices, getUpcomingServices, serviceRecords, vehicles } from '../utils/data';
import { Car, Smartphone, Wrench, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [upcomingServices, setUpcomingServices] = useState<any[]>([]);
  
  useEffect(() => {
    setUpcomingServices(getUpcomingServices());
  }, []);
  
  const needsAttention = [
    ...vehicles.filter(v => v.status === 'needs-service'),
    ...devices.filter(d => d.status === 'needs-service' || d.status === 'error')
  ].length;
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Vehicle Service Management System</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard 
            title="Total Vehicles" 
            icon={<Car className="h-5 w-5" />} 
            value={vehicles.length}
            trend={{ value: 25, label: 'vs last month' }}
            delay={1}
          />
          <DashboardCard 
            title="Total Devices" 
            icon={<Smartphone className="h-5 w-5" />} 
            value={devices.length}
            delay={2}
          />
          <DashboardCard 
            title="Service Records" 
            icon={<Wrench className="h-5 w-5" />} 
            value={serviceRecords.length}
            trend={{ value: 12, label: 'vs last month' }}
            delay={3}
          />
          <DashboardCard 
            title="Needs Attention" 
            icon={<AlertTriangle className="h-5 w-5" />} 
            value={needsAttention}
            trend={{ value: -5, label: 'vs last month' }}
            delay={4}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-xl overflow-hidden opacity-0 animate-fade-in staggered-delay-5">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold">Upcoming Services</h2>
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
                  No upcoming services in the next 30 days
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-card rounded-xl overflow-hidden opacity-0 animate-fade-in staggered-delay-5">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              {serviceRecords.slice(0, 5).map((record, index) => (
                <div key={record.id} className={`flex items-start opacity-0 animate-fade-in staggered-delay-${index + 1}`}>
                  <div className="icon-container shrink-0 mr-4">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {record.vehicleId ? 'Vehicle' : 'Device'} service - {record.type}
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
