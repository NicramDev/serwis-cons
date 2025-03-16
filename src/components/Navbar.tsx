
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Clock, Home, Smartphone } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
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

  const navItems = [
    { path: '/', name: 'Pulpit', icon: Home },
    { path: '/vehicles', name: 'Pojazdy', icon: Car },
    { path: '/devices', name: 'Urządzenia', icon: Smartphone },
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
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
