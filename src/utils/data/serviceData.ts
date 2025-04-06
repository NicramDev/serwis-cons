
import { ServiceRecord } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { vehicles } from './vehicleData';
import { devices } from './deviceData';

// Generate some sample service records
export const serviceRecords: ServiceRecord[] = [
  {
    id: uuidv4(),
    date: new Date(2023, 10, 15),
    vehicleId: vehicles[0]?.id,
    type: "maintenance",
    description: "Wymiana oleju\nWymiana filtra oleju\nSprawdzenie płynów",
    cost: 350,
    technician: "Serwis AutoMax",
    location: "Warszawa, ul. Serwisowa 10"
  },
  {
    id: uuidv4(),
    date: new Date(2023, 8, 5),
    vehicleId: vehicles[1]?.id,
    type: "maintenance",
    description: "Wymiana oleju\nWymiana filtrów\nKontrola hamulców",
    cost: 420,
    technician: "Serwis Ford Premium",
    location: "Warszawa, ul. Fordowska 5"
  },
  {
    id: uuidv4(),
    date: new Date(2023, 7, 25),
    vehicleId: vehicles[4]?.id,
    deviceId: devices[3]?.id,
    deviceName: devices[3]?.name,
    type: "repair",
    description: "Naprawa czujnika temperatury\nKalibracja systemu",
    cost: 280,
    technician: "TempService",
    location: "Warszawa, ul. Techniczna 15"
  },
  {
    id: uuidv4(),
    date: new Date(2023, 11, 20),
    vehicleId: vehicles[2]?.id,
    type: "inspection",
    description: "Przegląd okresowy\nWymiana płynu hamulcowego",
    cost: 500,
    technician: "Toyota Serwis Autoryzowany",
    location: "Warszawa, ul. Japońska 8"
  },
  {
    id: uuidv4(),
    date: new Date(2023, 6, 12),
    vehicleId: vehicles[0]?.id,
    deviceId: devices[0]?.id,
    deviceName: devices[0]?.name,
    type: "maintenance",
    description: "Aktualizacja oprogramowania\nSprawdzenie mocowania",
    cost: 150,
    technician: "GPS Solutions",
    location: "Warszawa, ul. Nawigacyjna 3"
  },
  {
    id: uuidv4(),
    date: new Date(2023, 5, 18),
    vehicleId: vehicles[0]?.id,
    deviceId: devices[1]?.id,
    deviceName: devices[1]?.name,
    type: "repair",
    description: "Wymiana czujnika poziomu paliwa\nKalibracja",
    cost: 320,
    technician: "FuelTech Service",
    location: "Warszawa, ul. Paliwowa 7"
  },
  {
    id: uuidv4(),
    date: new Date(2023, 9, 10),
    vehicleId: vehicles[3]?.id,
    type: "maintenance",
    description: "Wymiana oleju\nWymiana filtra powietrza\nSprawdzenie hamulców",
    cost: 380,
    technician: "Skoda Service Center",
    location: "Warszawa, ul. Czeska 12"
  }
];
