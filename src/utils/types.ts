
export interface Vehicle {
  id: string;
  name: string;
  brand?: string;
  model: string;
  year: number;
  vin?: string;
  registrationNumber: string;
  purchaseDate?: Date;
  inspectionExpiryDate?: Date; // Renamed from lastInspectionDate
  serviceExpiryDate?: Date; // Renamed from lastServiceDate
  lastService: Date;
  nextService: Date;
  fuelCardNumber?: string;
  gpsSystemNumber?: string;
  driverName?: string;
  insuranceExpiryDate?: Date;
  insuranceReminderDays?: number; // Added for insurance reminder
  inspectionReminderDays?: number; // Added for inspection reminder
  serviceReminderDays?: number; // Added for service reminder
  tags?: string;
  notes?: string;
  status: 'ok' | 'needs-service' | 'in-service';
  images?: string[];
  vehicleType?: 'car' | 'truck' | 'motorcycle' | 'other';
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
}

export interface Device {
  id: string;
  name: string;
  brand?: string;
  type: string;
  model: string;
  serialNumber: string;
  vehicleId?: string; // If attached to a vehicle
  year?: number;
  purchasePrice?: number;
  purchaseDate?: Date;
  lastService: Date;
  nextService: Date;
  notes?: string;
  status: 'ok' | 'needs-service' | 'in-service' | 'error';
  images?: string[];
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
}

export interface ServiceRecord {
  id: string;
  date: Date;
  vehicleId?: string;
  deviceId?: string;
  type: 'repair' | 'maintenance' | 'inspection';
  description: string;
  cost: number;
  technician: string;
}
