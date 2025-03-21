
import { Device, ServiceRecord, Vehicle } from './types';

// Sample data for our application
export const vehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Company Car 1',
    vehicleType: 'car',
    model: 'Tesla Model 3',
    year: 2022,
    registrationNumber: 'ABC123',
    lastService: new Date('2023-11-15'),
    nextService: new Date('2024-05-15'),
    status: 'ok'
  },
  {
    id: '2',
    name: 'Delivery Truck',
    vehicleType: 'truck',
    model: 'Mercedes Actros',
    year: 2021,
    registrationNumber: 'XYZ789',
    lastService: new Date('2023-12-01'),
    nextService: new Date('2024-03-10'),
    status: 'needs-service'
  },
  {
    id: '3',
    name: 'Service Van',
    vehicleType: 'car',
    model: 'Ford Transit',
    year: 2020,
    registrationNumber: 'DEF456',
    lastService: new Date('2023-10-22'),
    nextService: new Date('2024-04-22'),
    status: 'ok'
  },
  {
    id: '4',
    name: 'Executive Car',
    vehicleType: 'car',
    model: 'BMW 7 Series',
    year: 2023,
    registrationNumber: 'GHI789',
    lastService: new Date('2024-01-05'),
    nextService: new Date('2024-07-05'),
    status: 'ok'
  },
];

export const devices: Device[] = [
  {
    id: '1',
    name: 'Diagnostic Scanner',
    type: 'diagnostic',
    model: 'AutoScanner Pro X5',
    serialNumber: 'AS-12345',
    lastService: new Date('2023-11-10'),
    nextService: new Date('2024-05-10'),
    status: 'ok'
  },
  {
    id: '2',
    name: 'GPS Tracker',
    type: 'tracking',
    model: 'TrackMaster G3',
    serialNumber: 'TM-67890',
    vehicleId: '1',
    lastService: new Date('2023-09-15'),
    nextService: new Date('2024-03-15'),
    status: 'needs-service'
  },
  {
    id: '3',
    name: 'Engine Analyzer',
    type: 'diagnostic',
    model: 'EngineCheck 2000',
    serialNumber: 'EC-24680',
    lastService: new Date('2023-12-20'),
    nextService: new Date('2024-06-20'),
    status: 'ok'
  },
  {
    id: '4',
    name: 'Battery Tester',
    type: 'diagnostic',
    model: 'PowerCheck Pro',
    serialNumber: 'PC-13579',
    lastService: new Date('2023-10-05'),
    nextService: new Date('2024-04-05'),
    status: 'error'
  },
  {
    id: '5',
    name: 'GPS Tracker',
    type: 'tracking',
    model: 'TrackMaster G3',
    serialNumber: 'TM-67891',
    vehicleId: '2',
    lastService: new Date('2023-08-30'),
    nextService: new Date('2024-02-28'),
    status: 'in-service'
  },
];

export const serviceRecords: ServiceRecord[] = [
  {
    id: '1',
    date: new Date('2023-11-15'),
    vehicleId: '1',
    type: 'maintenance',
    description: 'Regular maintenance check, oil change, filter replacement',
    cost: 350,
    technician: 'John Smith'
  },
  {
    id: '2',
    date: new Date('2023-12-01'),
    vehicleId: '2',
    type: 'inspection',
    description: 'Safety inspection, brake system check',
    cost: 200,
    technician: 'Mike Johnson'
  },
  {
    id: '3',
    date: new Date('2023-11-10'),
    deviceId: '1',
    type: 'maintenance',
    description: 'Software update, calibration',
    cost: 150,
    technician: 'Sarah Williams'
  },
  {
    id: '4',
    date: new Date('2023-10-22'),
    vehicleId: '3',
    type: 'repair',
    description: 'Replace alternator, battery check',
    cost: 520,
    technician: 'John Smith'
  },
  {
    id: '5',
    date: new Date('2023-09-15'),
    deviceId: '2',
    type: 'maintenance',
    description: 'Firmware update, antenna replacement',
    cost: 180,
    technician: 'Emily Chen'
  },
  {
    id: '6',
    date: new Date('2024-01-05'),
    vehicleId: '4',
    type: 'maintenance',
    description: 'Initial service check, software updates',
    cost: 300,
    technician: 'Mike Johnson'
  }
];

// Helper functions to get upcoming services
export const getUpcomingServices = () => {
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  
  const vehicleServices = vehicles
    .filter(v => v.nextService >= now && v.nextService <= thirtyDaysFromNow)
    .map(v => ({
      id: v.id,
      name: v.name,
      type: 'vehicle',
      date: v.nextService,
      model: v.model
    }));
    
  const deviceServices = devices
    .filter(d => d.nextService >= now && d.nextService <= thirtyDaysFromNow)
    .map(d => ({
      id: d.id,
      name: d.name,
      type: 'device',
      date: d.nextService,
      model: d.model
    }));
    
  return [...vehicleServices, ...deviceServices].sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Helper function to format dates
export const formatDate = (date: Date | string | undefined | null): string => {
  // Check if date is undefined or null
  if (!date) {
    return 'Nie określono';
  }
  
  // Convert string date to Date object if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Nieprawidłowa data';
  }
  
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(dateObj);
};
