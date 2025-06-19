
import { Vehicle, Device, ServiceRecord } from './types';

// Helper to map Supabase vehicle to local Vehicle type
export const mapSupabaseVehicleToVehicle = (supabaseVehicle: any): Vehicle => ({
  id: supabaseVehicle.id,
  name: supabaseVehicle.name,
  brand: supabaseVehicle.brand,
  model: supabaseVehicle.model,
  year: supabaseVehicle.year,
  vin: supabaseVehicle.vin,
  registrationNumber: supabaseVehicle.registrationnumber || '',
  purchaseDate: supabaseVehicle.purchasedate ? new Date(supabaseVehicle.purchasedate) : undefined,
  inspectionExpiryDate: supabaseVehicle.inspectionexpirydate ? new Date(supabaseVehicle.inspectionexpirydate) : undefined,
  serviceExpiryDate: supabaseVehicle.serviceexpirydate ? new Date(supabaseVehicle.serviceexpirydate) : undefined,
  lastService: supabaseVehicle.lastservice ? new Date(supabaseVehicle.lastservice) : new Date(),
  nextService: supabaseVehicle.nextservice ? new Date(supabaseVehicle.nextservice) : new Date(),
  fuelCardNumber: supabaseVehicle.fuelcardnumber,
  gpsSystemNumber: supabaseVehicle.gpssystemnumber,
  driverName: supabaseVehicle.drivername,
  insuranceExpiryDate: supabaseVehicle.insuranceexpirydate ? new Date(supabaseVehicle.insuranceexpirydate) : undefined,
  insuranceReminderDays: supabaseVehicle.insurancereminderdays,
  inspectionReminderDays: supabaseVehicle.inspectionreminderdays,
  serviceReminderDays: supabaseVehicle.servicereminderdays,
  tags: supabaseVehicle.tags,
  notes: supabaseVehicle.notes,
  status: supabaseVehicle.status || 'ok',
  images: Array.isArray(supabaseVehicle.images) ? supabaseVehicle.images as string[] : [],
  vehicleType: supabaseVehicle.vehicletype,
  thumbnail: supabaseVehicle.thumbnail,
  attachments: Array.isArray(supabaseVehicle.attachments) 
    ? supabaseVehicle.attachments as Array<{name: string; type: string; size: number; url: string}>
    : [],
});

// Helper to map local Vehicle to Supabase vehicle for insert/update
export const mapVehicleToSupabaseVehicle = (vehicle: Partial<Vehicle>): any => {
    const { id, registrationNumber, purchaseDate, inspectionExpiryDate, serviceExpiryDate, insuranceExpiryDate, lastService, nextService, fuelCardNumber, gpsSystemNumber, driverName, insuranceReminderDays, inspectionReminderDays, serviceReminderDays, vehicleType, ...rest } = vehicle;
    return {
        ...rest,
        id,
        registrationnumber: registrationNumber,
        purchasedate: purchaseDate ? purchaseDate.toISOString().slice(0, 10) : null,
        inspectionexpirydate: inspectionExpiryDate ? inspectionExpiryDate.toISOString().slice(0, 10) : null,
        serviceexpirydate: serviceExpiryDate ? serviceExpiryDate.toISOString().slice(0, 10) : null,
        insuranceexpirydate: insuranceExpiryDate ? insuranceExpiryDate.toISOString().slice(0, 10)
        : null,
        lastservice: lastService ? lastService.toISOString() : null,
        nextservice: nextService ? nextService.toISOString() : null,
        fuelcardnumber: fuelCardNumber,
        gpssystemnumber: gpsSystemNumber,
        drivername: driverName,
        insurancereminderdays: insuranceReminderDays,
        inspectionreminderdays: inspectionReminderDays,
        servicereminderdays: serviceReminderDays,
        vehicletype: vehicleType,
    };
};

export const mapSupabaseDeviceToDevice = (supabaseDevice: any): Device => ({
  id: supabaseDevice.id,
  name: supabaseDevice.name,
  brand: supabaseDevice.brand,
  type: supabaseDevice.type,
  model: supabaseDevice.model,
  serialNumber: supabaseDevice.serialnumber || '',
  vehicleId: supabaseDevice.vehicleid,
  year: supabaseDevice.year,
  purchasePrice: supabaseDevice.purchaseprice,
  purchaseDate: supabaseDevice.purchasedate ? new Date(supabaseDevice.purchasedate) : undefined,
  lastService: supabaseDevice.lastservice ? new Date(supabaseDevice.lastservice) : new Date(),
  nextService: supabaseDevice.nextservice ? new Date(supabaseDevice.nextservice) : new Date(),
  serviceExpiryDate: supabaseDevice.serviceexpirydate ? new Date(supabaseDevice.serviceexpirydate) : undefined,
  serviceReminderDays: supabaseDevice.servicereminderdays,
  notes: supabaseDevice.notes,
  status: supabaseDevice.status || 'ok',
  images: Array.isArray(supabaseDevice.images) ? supabaseDevice.images as string[] : [],
  thumbnail: supabaseDevice.thumbnail,
  attachments: Array.isArray(supabaseDevice.attachments) 
    ? supabaseDevice.attachments as Array<{name: string; type: string; size: number; url: string}>
    : [],
});

export const mapDeviceToSupabaseDevice = (device: Partial<Device>): any => {
    const { id, serialNumber, vehicleId, purchasePrice, purchaseDate, lastService, nextService, serviceExpiryDate, serviceReminderDays, ...rest } = device;
    return {
        ...rest,
        id,
        serialnumber: serialNumber,
        vehicleid: vehicleId,
        purchaseprice: purchasePrice,
        purchasedate: purchaseDate ? purchaseDate.toISOString().slice(0, 10) : null,
        lastservice: lastService ? lastService.toISOString() : null,
        nextservice: nextService ? nextService.toISOString() : null,
        serviceexpirydate: serviceExpiryDate ? serviceExpiryDate.toISOString().slice(0, 10) : null,
        servicereminderdays: serviceReminderDays,
    };
};

export const mapSupabaseServiceRecordToServiceRecord = (record: any): ServiceRecord => ({
  id: record.id,
  date: new Date(record.date),
  vehicleId: record.vehicleid,
  deviceId: record.deviceid,
  deviceName: record.devicename,
  location: record.location,
  type: record.type,
  description: record.description,
  cost: record.cost,
  technician: record.technician,
  notes: record.notes,
  images: Array.isArray(record.images) ? record.images as string[] : [],
  attachments: Array.isArray(record.attachments) 
    ? record.attachments as Array<{name: string; type: string; size: number; url: string}>
    : [],
});

export const mapServiceRecordToSupabaseServiceRecord = (record: Partial<ServiceRecord>): any => {
    const { id, vehicleId, deviceId, deviceName, ...rest } = record;
    return {
        ...rest,
        id,
        vehicleid: vehicleId,
        deviceid: deviceId,
        devicename: deviceName,
        date: record.date ? record.date.toISOString().slice(0, 10) : new Date().toISOString().slice(0,10),
    };
};
