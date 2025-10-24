
import { Vehicle, Device, Equipment, ServiceRecord, VehicleEquipment } from './types';

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
  mdvrNumber: supabaseVehicle.mdvrnumber,
  driverName: supabaseVehicle.drivername,
  insuranceExpiryDate: supabaseVehicle.insuranceexpirydate ? new Date(supabaseVehicle.insuranceexpirydate) : undefined,
  insurancePolicyNumber: supabaseVehicle.insurancepolicynumber,
  insuranceReminderDays: supabaseVehicle.insurancereminderdays,
  inspectionReminderDays: supabaseVehicle.inspectionreminderdays,
  serviceReminderDays: supabaseVehicle.servicereminderdays,
  tags: supabaseVehicle.tags,
  notes: supabaseVehicle.notes,
  status: supabaseVehicle.status || 'ok',
  images: supabaseVehicle.images || [],
  vehicleType: supabaseVehicle.vehicletype,
  thumbnail: supabaseVehicle.thumbnail,
  attachments: supabaseVehicle.attachments || [],
});

// Helper to map local Vehicle to Supabase vehicle for insert/update
export const mapVehicleToSupabaseVehicle = (vehicle: Partial<Vehicle>): any => {
    const { id, registrationNumber, purchaseDate, inspectionExpiryDate, serviceExpiryDate, insuranceExpiryDate, insurancePolicyNumber, lastService, nextService, fuelCardNumber, gpsSystemNumber, mdvrNumber, driverName, insuranceReminderDays, inspectionReminderDays, serviceReminderDays, vehicleType, ...rest } = vehicle;
    return {
        ...rest,
        id,
        registrationnumber: registrationNumber,
        purchasedate: purchaseDate ? purchaseDate.toISOString().slice(0, 10) : null,
        inspectionexpirydate: inspectionExpiryDate ? inspectionExpiryDate.toISOString().slice(0, 10) : null,
        serviceexpirydate: serviceExpiryDate ? serviceExpiryDate.toISOString().slice(0, 10) : null,
        insuranceexpirydate: insuranceExpiryDate ? insuranceExpiryDate.toISOString().slice(0, 10) : null,
        insurancepolicynumber: insurancePolicyNumber,
        lastservice: lastService ? lastService.toISOString() : null,
        nextservice: nextService ? nextService.toISOString() : null,
        fuelcardnumber: fuelCardNumber,
        gpssystemnumber: gpsSystemNumber,
        mdvrnumber: mdvrNumber,
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
  serviceIntervalHours: supabaseDevice.serviceintervalhours,
  notes: supabaseDevice.notes,
  status: supabaseDevice.status || 'ok',
  images: supabaseDevice.images || [],
  thumbnail: supabaseDevice.thumbnail,
  attachments: supabaseDevice.attachments || [],
});

export const mapDeviceToSupabaseDevice = (device: Partial<Device>): any => {
    const { id, serialNumber, vehicleId, purchasePrice, purchaseDate, lastService, nextService, serviceExpiryDate, serviceReminderDays, serviceIntervalHours, ...rest } = device;
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
        serviceintervalhours: serviceIntervalHours,
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
  images: record.images || [],
  attachments: record.attachments || [],
});

export const mapSupabaseEquipmentToEquipment = (supabaseEquipment: any): Equipment => ({
  id: supabaseEquipment.id,
  name: supabaseEquipment.name,
  brand: supabaseEquipment.brand,
  type: supabaseEquipment.type,
  model: supabaseEquipment.model,
  serialNumber: supabaseEquipment.serialnumber || '',
  vehicleId: supabaseEquipment.vehicleid,
  year: supabaseEquipment.year,
  purchasePrice: supabaseEquipment.purchaseprice,
  purchaseDate: supabaseEquipment.purchasedate ? new Date(supabaseEquipment.purchasedate) : undefined,
  lastService: supabaseEquipment.lastservice ? new Date(supabaseEquipment.lastservice) : new Date(),
  nextService: supabaseEquipment.nextservice ? new Date(supabaseEquipment.nextservice) : new Date(),
  serviceExpiryDate: supabaseEquipment.serviceexpirydate ? new Date(supabaseEquipment.serviceexpirydate) : undefined,
  serviceReminderDays: supabaseEquipment.servicereminderdays,
  notes: supabaseEquipment.notes,
  status: supabaseEquipment.status || 'ok',
  images: supabaseEquipment.images || [],
  thumbnail: supabaseEquipment.thumbnail,
  attachments: supabaseEquipment.attachments || [],
});

export const mapEquipmentToSupabaseEquipment = (equipment: Partial<Equipment>): any => {
    const { id, serialNumber, vehicleId, purchasePrice, purchaseDate, lastService, nextService, serviceExpiryDate, serviceReminderDays, ...rest } = equipment;
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

export const mapSupabaseVehicleEquipmentToVehicleEquipment = (supabaseVE: any): VehicleEquipment => ({
  id: supabaseVE.id,
  name: supabaseVE.name,
  brand: supabaseVE.brand,
  type: supabaseVE.type,
  model: supabaseVE.model,
  serialNumber: supabaseVE.serialnumber || '',
  vehicleId: supabaseVE.vehicleid,
  year: supabaseVE.year,
  purchasePrice: supabaseVE.purchaseprice,
  purchaseDate: supabaseVE.purchasedate ? new Date(supabaseVE.purchasedate) : undefined,
  lastService: supabaseVE.lastservice ? new Date(supabaseVE.lastservice) : new Date(),
  nextService: supabaseVE.nextservice ? new Date(supabaseVE.nextservice) : new Date(),
  serviceExpiryDate: supabaseVE.serviceexpirydate ? new Date(supabaseVE.serviceexpirydate) : undefined,
  serviceReminderDays: supabaseVE.servicereminderdays,
  quantity: supabaseVE.quantity,
  serviceIntervalHours: supabaseVE.serviceintervalhours,
  notes: supabaseVE.notes,
  status: supabaseVE.status || 'ok',
  images: supabaseVE.images || [],
  thumbnail: supabaseVE.thumbnail,
  attachments: supabaseVE.attachments || [],
});

export const mapVehicleEquipmentToSupabaseVehicleEquipment = (ve: Partial<VehicleEquipment>): any => {
    const { id, serialNumber, vehicleId, purchasePrice, purchaseDate, lastService, nextService, serviceExpiryDate, serviceReminderDays, quantity, serviceIntervalHours, ...rest } = ve;
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
        quantity,
        serviceintervalhours: serviceIntervalHours,
    };
};

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
