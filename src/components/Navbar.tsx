
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Car, Clock, Home, Smartphone } from 'lucide-react';
import { Vehicle } from '../utils/types';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Calculate notifications count
    const checkNotifications = () => {
      const savedVehicles = localStorage.getItem('vehicles');
      if (!savedVehicles) return 0;
      
      const vehicles: Vehicle[] = JSON.parse(savedVehicles);
      const now = new Date();
      let count = 0;
      
      vehicles.forEach((vehicle: Vehicle) => {
        // Check insurance
        if (vehicle.insuranceExpiryDate) {
          const insuranceDate = new Date(vehicle.insuranceExpiryDate);
          const daysToInsuranceExpiry = Math.floor((insuranceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysToInsuranceExpiry <= (vehicle.insuranceReminderDays || 30) && daysToInsuranceExpiry >= -7) {
            count++;
          }
        }
        
        // Check inspection
        if (vehicle.inspectionExpiryDate) {
          const inspectionDate = new Date(vehicle.inspectionExpiryDate);
          const daysToInspectionExpiry = Math.floor((inspectionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysToInspectionExpiry <= (vehicle.inspectionReminderDays || 30) && daysToInspectionExpiry >= -7) {
            count++;
          }
        }
        
        // Check service
        if (vehicle.serviceExpiryDate) {
          const serviceDate = new Date(vehicle.serviceExpiryDate);
          const daysToServiceExpiry = Math.floor((serviceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysToServiceExpiry <= (vehicle.serviceReminderDays || 30) && daysToServiceExpiry >= -7) {
            count++;
          }
        }
      });
      
      return count;
    };
    
    setNotificationCount(checkNotifications());
    
    // Check notifications every minute
    const interval = setInterval(() => {
      setNotificationCount(checkNotifications());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/', name: 'Pulpit', icon: Home },
    { path: '/vehicles', name: 'Pojazdy', icon: Car },
    { path: '/devices', name: 'Urządzenia', icon: Smartphone },
    { path: '/notifications', name: 'Powiadomienia', icon: Bell, badge: notificationCount },
    { path: '/history', name: 'Historia Serwisu', icon: Clock },
  ];
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-subtle' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="icon-container">
            <Car className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">SerwisPojazdów</span>
        </Link>
        
        <div className="hidden md:flex space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'hover:bg-secondary text-foreground/80 hover:text-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
                {item.badge && item.badge > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-red-500 text-white">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        
        <div className="md:hidden flex">
          {/* Mobile menu button would go here */}
          <button className="p-2 rounded-md hover:bg-secondary">
            <span className="sr-only">Otwórz menu</span>
            <div className="w-5 h-0.5 bg-foreground mb-1"></div>
            <div className="w-5 h-0.5 bg-foreground mb-1"></div>
            <div className="w-5 h-0.5 bg-foreground"></div>
          </button>
        </div>
      </div>
      
      {/* Mobile menu - would be toggled */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-3 py-2 rounded-md text-base font-medium"
            >
              {item.name}
              {item.badge && item.badge > 0 && (
                <span className="inline-flex items-center justify-center ml-2 w-5 h-5 text-xs font-semibold rounded-full bg-red-500 text-white">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
