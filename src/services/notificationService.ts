
import { Device, Vehicle } from '../utils/types';

export const generateNotifications = (
  vehicles: Vehicle[], 
  devices: Device[]
): any[] => {
  const now = new Date();
  const allNotifications: any[] = [];
  
  // Process vehicle notifications
  vehicles.forEach((vehicle: Vehicle) => {
    // Insurance notifications
    if (vehicle.insuranceExpiryDate) {
      const insuranceDate = new Date(vehicle.insuranceExpiryDate);
      const daysToInsuranceExpiry = Math.floor((insuranceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToInsuranceExpiry <= (vehicle.insuranceReminderDays || 30) && daysToInsuranceExpiry >= 0) {
        allNotifications.push({
          id: `insurance-${vehicle.id}`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'insurance',
          date: insuranceDate,
          daysLeft: daysToInsuranceExpiry,
          message: `Ubezpieczenie OC/AC pojazdu ${vehicle.name} wygasa za ${daysToInsuranceExpiry} dni`,
          itemType: 'vehicle'
        });
      } else if (daysToInsuranceExpiry < 0) {
        allNotifications.push({
          id: `insurance-${vehicle.id}`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'insurance',
          date: insuranceDate,
          daysLeft: daysToInsuranceExpiry,
          message: `Ubezpieczenie OC/AC pojazdu ${vehicle.name} wygasło ${Math.abs(daysToInsuranceExpiry)} dni temu`,
          expired: true,
          itemType: 'vehicle'
        });
      }
    }
    
    // Inspection notifications
    if (vehicle.inspectionExpiryDate) {
      const inspectionDate = new Date(vehicle.inspectionExpiryDate);
      const daysToInspectionExpiry = Math.floor((inspectionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToInspectionExpiry <= (vehicle.inspectionReminderDays || 30) && daysToInspectionExpiry >= 0) {
        allNotifications.push({
          id: `inspection-${vehicle.id}`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'inspection',
          date: inspectionDate,
          daysLeft: daysToInspectionExpiry,
          message: `Przegląd pojazdu ${vehicle.name} wygasa za ${daysToInspectionExpiry} dni`,
          itemType: 'vehicle'
        });
      } else if (daysToInspectionExpiry < 0) {
        allNotifications.push({
          id: `inspection-${vehicle.id}`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'inspection',
          date: inspectionDate,
          daysLeft: daysToInspectionExpiry,
          message: `Przegląd pojazdu ${vehicle.name} wygasł ${Math.abs(daysToInspectionExpiry)} dni temu`,
          expired: true,
          itemType: 'vehicle'
        });
      }
    }
    
    // Service notifications
    if (vehicle.serviceExpiryDate) {
      const serviceDate = new Date(vehicle.serviceExpiryDate);
      const daysToServiceExpiry = Math.floor((serviceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToServiceExpiry <= (vehicle.serviceReminderDays || 30) && daysToServiceExpiry >= 0) {
        allNotifications.push({
          id: `service-${vehicle.id}`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'service',
          date: serviceDate,
          daysLeft: daysToServiceExpiry,
          message: `Serwis pojazdu ${vehicle.name} wygasa za ${daysToServiceExpiry} dni`,
          itemType: 'vehicle'
        });
      } else if (daysToServiceExpiry < 0) {
        allNotifications.push({
          id: `service-${vehicle.id}`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'service',
          date: serviceDate,
          daysLeft: daysToServiceExpiry,
          message: `Serwis pojazdu ${vehicle.name} wygasł ${Math.abs(daysToServiceExpiry)} dni temu`,
          expired: true,
          itemType: 'vehicle'
        });
      }
    }
  });
  
  // Process device notifications
  devices.forEach((device: Device) => {
    // Service notifications for devices
    if (device.serviceExpiryDate) {
      const serviceDate = new Date(device.serviceExpiryDate);
      const daysToServiceExpiry = Math.floor((serviceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Find vehicle name if device is attached to a vehicle
      let vehicleName = '';
      if (device.vehicleId) {
        const deviceVehicle = vehicles.find((v: Vehicle) => v.id === device.vehicleId);
        if (deviceVehicle) {
          vehicleName = deviceVehicle.name;
        }
      }
      
      if (daysToServiceExpiry <= (device.serviceReminderDays || 30) && daysToServiceExpiry >= 0) {
        allNotifications.push({
          id: `device-service-${device.id}`,
          deviceId: device.id,
          deviceName: device.name,
          vehicleId: device.vehicleId,
          vehicleName: vehicleName,
          type: 'device-service',
          date: serviceDate,
          daysLeft: daysToServiceExpiry,
          message: `Serwis urządzenia ${device.name} wygasa za ${daysToServiceExpiry} dni`,
          itemType: 'device'
        });
      } else if (daysToServiceExpiry < 0) {
        allNotifications.push({
          id: `device-service-${device.id}`,
          deviceId: device.id,
          deviceName: device.name,
          vehicleId: device.vehicleId,
          vehicleName: vehicleName,
          type: 'device-service',
          date: serviceDate,
          daysLeft: daysToServiceExpiry,
          message: `Serwis urządzenia ${device.name} wygasł ${Math.abs(daysToServiceExpiry)} dni temu`,
          expired: true,
          itemType: 'device'
        });
      }
    }
  });
  
  // Sort notifications by days left
  allNotifications.sort((a, b) => {
    if (a.expired && !b.expired) return -1;
    if (!a.expired && b.expired) return 1;
    return a.daysLeft - b.daysLeft;
  });
  
  return allNotifications;
};

export const saveNotifications = (notifications: any[]) => {
  localStorage.setItem('notifications', JSON.stringify(notifications));
};
