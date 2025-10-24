
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
  mdvrNumber?: string;
  driverName?: string;
  insuranceExpiryDate?: Date;
  insurancePolicyNumber?: string; // Added for insurance policy number
  insuranceReminderDays?: number; // Added for insurance reminder
  inspectionReminderDays?: number; // Added for inspection reminder
  serviceReminderDays?: number; // Added for service reminder
  tags?: string;
  notes?: string;
  status: 'ok' | 'needs-service' | 'in-service';
  images?: string[];
  vehicleType?: 'car' | 'truck' | 'motorcycle' | 'other';
  thumbnail?: string | null; // Added thumbnail property
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
  model?: string; // Made optional since it's redundant
  serialNumber: string;
  vehicleId?: string; // If attached to a vehicle
  year?: number;
  purchasePrice?: number;
  purchaseDate?: Date;
  lastService: Date;
  nextService: Date;
  serviceExpiryDate?: Date;
  serviceReminderDays?: number;
  serviceIntervalHours?: number; // Service interval in engine hours
  notes?: string; // Added for device description/notes
  status: 'ok' | 'needs-service' | 'in-service' | 'error';
  images?: string[];
  thumbnail?: string | null; // Added thumbnail property
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
}

export interface Equipment {
  id: string;
  name: string;
  brand?: string;
  type: string;
  model?: string;
  serialNumber: string;
  vehicleId?: string; // If attached to a vehicle
  year?: number;
  purchasePrice?: number;
  purchaseDate?: Date;
  lastService: Date;
  nextService: Date;
  serviceExpiryDate?: Date;
  serviceReminderDays?: number;
  notes?: string;
  status: 'ok' | 'needs-service' | 'in-service' | 'error';
  images?: string[];
  thumbnail?: string | null;
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
  deviceName?: string;
  location?: string;
  type: 'repair' | 'maintenance' | 'inspection' | 'replacement';
  description: string;
  cost: number;
  technician: string;
  notes?: string; // Added for additional service notes
  images?: string[];
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
}
