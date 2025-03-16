
export interface Vehicle {
  id: string;
  name: string;
  brand?: string;
  type: 'car' | 'truck' | 'motorcycle' | 'other';
  model: string;
  year: number;
  vin?: string;
  registrationNumber: string;
  purchaseDate?: Date;
  lastInspectionDate?: Date;
  lastServiceDate?: Date;
  lastService: Date;
  nextService: Date;
  fuelCardNumber?: string;
  gpsSystemNumber?: string;
  driverName?: string;
  tags?: string;
  notes?: string;
  status: 'ok' | 'needs-service' | 'in-service';
  images?: string[];
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
  type: string;
  model: string;
  serialNumber: string;
  vehicleId?: string; // If attached to a vehicle
  lastService: Date;
  nextService: Date;
  status: 'ok' | 'needs-service' | 'in-service' | 'error';
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
