
import React, { useState, useEffect } from 'react';
import { ServiceRecord, Vehicle, Device } from '../utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Calendar as CalendarIcon, PlusCircle, FileText } from 'lucide-react';

const Costs = () => {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [filteredRecords, setFilteredRecords] = useState<ServiceRecord[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    // Load data from localStorage
    const savedVehicles = localStorage.getItem('vehicles');
    const savedDevices = localStorage.getItem('devices');
    const savedRecords = localStorage.getItem('serviceRecords');
    
    if (savedVehicles) setAllVehicles(JSON.parse(savedVehicles));
    if (savedDevices) setAllDevices(JSON.parse(savedDevices));
    if (savedRecords) setServiceRecords(JSON.parse(savedRecords));
  }, []);

  useEffect(() => {
    // Filter service records based on selections
    if (serviceRecords.length) {
      let filtered = [...serviceRecords];
      
      // Filter by vehicle if selected
      if (selectedVehicleId) {
        filtered = filtered.filter(record => record.vehicleId === selectedVehicleId);
      }
      
      // Filter by device if selected
      if (selectedDeviceId) {
        filtered = filtered.filter(record => record.deviceId === selectedDeviceId);
      }
      
      // Filter by date range
      if (dateFrom) {
        filtered = filtered.filter(record => new Date(record.date) >= dateFrom);
      }
      
      if (dateTo) {
        // Add one day to include the end date fully
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        filtered = filtered.filter(record => new Date(record.date) < endDate);
      }
      
      setFilteredRecords(filtered);
      
      // Calculate total cost
      const total = filtered.reduce((sum, record) => sum + record.cost, 0);
      setTotalCost(total);
    }
  }, [selectedVehicleId, selectedDeviceId, dateFrom, dateTo, serviceRecords]);

  const handleClearFilters = () => {
    setSelectedVehicleId(null);
    setSelectedDeviceId(null);
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Koszty</h1>
          <p className="text-muted-foreground">Zarządzaj i analizuj koszty serwisu i napraw</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl">Filtry kosztorysu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Pojazd</label>
                <Select 
                  value={selectedVehicleId || ""} 
                  onValueChange={(value) => setSelectedVehicleId(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wszystkie pojazdy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie pojazdy</SelectItem>
                    {allVehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.registrationNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Urządzenie</label>
                <Select 
                  value={selectedDeviceId || ""} 
                  onValueChange={(value) => setSelectedDeviceId(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wszystkie urządzenia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie urządzenia</SelectItem>
                    {allDevices.map(device => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name} ({device.serialNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Data od</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd.MM.yyyy") : "Wybierz datę"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      locale={pl}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Data do</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "dd.MM.yyyy") : "Wybierz datę"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      locale={pl}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleClearFilters}
              >
                Wyczyść filtry
              </Button>
              
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Generuj raport
              </Button>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Podsumowanie kosztów</CardTitle>
              <div className="text-2xl font-bold text-primary">
                {totalCost.toFixed(2)} PLN
              </div>
            </CardHeader>
            <CardContent>
              {filteredRecords.length > 0 ? (
                <div className="space-y-4">
                  {filteredRecords.map(record => (
                    <div 
                      key={record.id}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {record.deviceName}
                          {record.vehicleId && allVehicles.find(v => v.id === record.vehicleId) && 
                            ` - ${allVehicles.find(v => v.id === record.vehicleId)?.name}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(record.date), "dd.MM.yyyy")} - {record.type === 'repair' ? 'Naprawa' : 
                           record.type === 'maintenance' ? 'Serwis' : 
                           record.type === 'inspection' ? 'Przegląd' : 'Inne'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{record.cost.toFixed(2)} PLN</div>
                        <div className="text-xs text-muted-foreground">{record.technician}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Brak wyników dla wybranych filtrów</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Costs;
