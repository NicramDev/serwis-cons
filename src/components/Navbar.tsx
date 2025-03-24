
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Car, 
  Bell, 
  History, 
  Home,
  Menu,
  DollarSign,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();
  
  const navItems = [
    { path: '/', label: 'Pulpit', icon: <Home className="h-5 w-5" /> },
    { path: '/vehicles', label: 'Pojazdy', icon: <Car className="h-5 w-5" /> },
    { path: '/costs', label: 'Koszty', icon: <DollarSign className="h-5 w-5" /> },
    { path: '/notifications', label: 'Powiadomienia', icon: <Bell className="h-5 w-5" /> },
    { path: '/history', label: 'Historia', icon: <History className="h-5 w-5" /> },
  ];
  
  const NavItems = () => (
    <>
      {navItems.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path}
          className={({ isActive }) => `
            flex items-center gap-2 px-3 py-2 rounded-md transition-all
            ${isActive 
              ? 'bg-primary text-primary-foreground font-medium' 
              : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
            }
          `}
          onClick={() => setIsOpen(false)}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 backdrop-blur-md bg-background/90 border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-primary font-bold text-lg">Cons Road</div>
          </div>
          
          {isMobile ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="py-4 space-y-1">
                  <NavItems />
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 w-full justify-start px-3 py-2 rounded-md text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Wyloguj</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex items-center space-x-1">
              <nav className="flex items-center space-x-1 mr-4">
                <NavItems />
              </nav>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2 text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Wyloguj</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
