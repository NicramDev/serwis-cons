
import { Device } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { vehicles } from './vehicleData';

// Generate some sample device data
export const devices: Device[] = [
  {
    id: uuidv4(),
    name: "GPS Tracker Standard",
    type: "GPS",
    brand: "TrakTech",
    model: "GT-103",
    serialNumber: "TT-10398765",
    vehicleId: vehicles[0]?.id,
    year: 2020,
    purchaseDate: new Date(2020, 2, 10),
    lastService: new Date(2023, 10, 15),
    nextService: new Date(2024, 4, 15),
    serviceExpiryDate: new Date(2024, 4, 15),
    serviceReminderDays: 14,
    status: "ok",
    thumbnail: "/gps1.jpg"
  },
  {
    id: uuidv4(),
    name: "Fuel Monitor Pro",
    type: "Fuel sensor",
    brand: "FuelTech",
    model: "FM-200",
    serialNumber: "FT-20056789",
    vehicleId: vehicles[0]?.id,
    year: 2020,
    purchaseDate: new Date(2020, 2, 10),
    lastService: new Date(2023, 10, 15),
    nextService: new Date(2024, 4, 15),
    serviceExpiryDate: new Date(2024, 4, 15),
    serviceReminderDays: 14,
    status: "ok",
    thumbnail: "/fuel1.jpg"
  },
  {
    id: uuidv4(),
    name: "Advanced GPS Tracker",
    type: "GPS",
    brand: "NaviSat",
    model: "NS-500",
    serialNumber: "NS-50012345",
    vehicleId: vehicles[1]?.id,
    year: 2019,
    purchaseDate: new Date(2019, 5, 20),
    lastService: new Date(2023, 8, 5),
    nextService: new Date(2024, 2, 5),
    serviceExpiryDate: new Date(2024, 2, 5),
    serviceReminderDays: 14,
    status: "ok",
    thumbnail: "/gps2.jpg"
  },
  {
    id: uuidv4(),
    name: "Temperature Monitor",
    type: "Temperature sensor",
    brand: "TempGuard",
    model: "TG-100",
    serialNumber: "TG-10045678",
    vehicleId: vehicles[4]?.id,
    year: 2020,
    purchaseDate: new Date(2020, 3, 20),
    lastService: new Date(2023, 7, 25),
    nextService: new Date(2024, 1, 25),
    serviceExpiryDate: new Date(2024, 1, 25),
    serviceReminderDays: 14,
    status: "needs-service",
    thumbnail: "/temp1.jpg"
  }
];
