
// Re-export all data from individual files
export * from './vehicleData';
export * from './deviceData';
export * from './serviceData';

// Add getUpcomingServices function that was missing after refactoring
export const getUpcomingServices = (vehicles: any[] = [], devices: any[] = []) => {
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  
  const vehicleServices = vehicles
    .filter(v => {
      const nextService = v.nextService instanceof Date ? 
        v.nextService : new Date(v.nextService);
      return nextService >= now && nextService <= thirtyDaysFromNow;
    })
    .map(v => ({
      id: v.id,
      name: v.name,
      type: 'vehicle',
      date: v.nextService,
      model: v.model
    }));
    
  const deviceServices = devices
    .filter(d => {
      const nextService = d.nextService instanceof Date ? 
        d.nextService : new Date(d.nextService);
      return nextService >= now && nextService <= thirtyDaysFromNow;
    })
    .map(d => ({
      id: d.id,
      name: d.name,
      type: 'device',
      date: d.nextService,
      model: d.model
    }));
    
  return [...vehicleServices, ...deviceServices].sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
};
