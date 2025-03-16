
export interface Vehicle {
  id: string;
  name: string;
  type: 'car' | 'truck' | 'motorcycle' | 'other';
  model: string;
  year: number;
  registrationNumber: string;
  lastService: Date;
  nextService: Date;
  status: 'ok' | 'needs-service' | 'in-service';
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
