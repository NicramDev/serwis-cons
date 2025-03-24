
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
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Calendar as CalendarIcon, PlusCircle, FileText, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Costs = () => {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [filteredRecords, setFilteredRecords] = useState<ServiceRecord[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [vehicleDevices, setVehicleDevices] = useState<Device[]>([]);
  const [showMultipleDevices, setShowMultipleDevices] = useState<boolean>(false);

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
    // Update available devices when vehicle changes
    if (selectedVehicleId) {
      const devicesForVehicle = allDevices.filter(device => device.vehicleId === selectedVehicleId);
      setVehicleDevices(devicesForVehicle);
      
      // Reset selected devices when vehicle changes
      setSelectedDeviceIds([]);
      setSelectedDeviceId(null);
    } else {
      setVehicleDevices([]);
    }
  }, [selectedVehicleId, allDevices]);

  useEffect(() => {
    // Filter service records based on selections
    if (serviceRecords.length) {
      let filtered = [...serviceRecords];
      
      // Filter by vehicle if selected
      if (selectedVehicleId) {
        filtered = filtered.filter(record => record.vehicleId === selectedVehicleId);
      }
      
      // Filter by device if selected (single device mode)
      if (!showMultipleDevices && selectedDeviceId) {
        filtered = filtered.filter(record => record.deviceId === selectedDeviceId);
      }
      
      // Filter by multiple devices if selected (multiple devices mode)
      if (showMultipleDevices && selectedDeviceIds.length > 0) {
        filtered = filtered.filter(record => selectedDeviceIds.includes(record.deviceId || ''));
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
  }, [selectedVehicleId, selectedDeviceId, selectedDeviceIds, dateFrom, dateTo, serviceRecords, showMultipleDevices]);

  const handleClearFilters = () => {
    setSelectedVehicleId(null);
    setSelectedDeviceId(null);
    setSelectedDeviceIds([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    setShowMultipleDevices(false);
  };

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDeviceIds(prev => {
      if (prev.includes(deviceId)) {
        return prev.filter(id => id !== deviceId);
      } else {
        return [...prev, deviceId];
      }
    });
  };

  const toggleMultipleDevicesMode = () => {
    setShowMultipleDevices(!showMultipleDevices);
    // Clear device selections when toggling modes
    setSelectedDeviceId(null);
    setSelectedDeviceIds([]);
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
                    <SelectItem value="">Wszystkie pojazdy</SelectItem>
                    {allVehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.registrationNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedVehicleId && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="multipleDevices" 
                    checked={showMultipleDevices}
                    onCheckedChange={toggleMultipleDevicesMode}
                  />
                  <label
                    htmlFor="multipleDevices"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Wybierz wiele urządzeń
                  </label>
                </div>
              )}
              
              {selectedVehicleId && !showMultipleDevices && (
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
                      <SelectItem value="">Wszystkie urządzenia</SelectItem>
                      {vehicleDevices.map(device => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.name} ({device.serialNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {selectedVehicleId && showMultipleDevices && vehicleDevices.length > 0 && (
                <div className="border p-3 rounded-md space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Wybierz urządzenia:</label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {vehicleDevices.map(device => (
                      <div key={device.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`device-${device.id}`} 
                          checked={selectedDeviceIds.includes(device.id)} 
                          onCheckedChange={() => toggleDeviceSelection(device.id)}
                        />
                        <label 
                          htmlFor={`device-${device.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {device.name} ({device.serialNumber})
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Wybrano: {selectedDeviceIds.length} z {vehicleDevices.length}</p>
                  </div>
                </div>
              )}
              
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
                <>
                  {/* Show details of selected devices if multiple selected */}
                  {showMultipleDevices && selectedDeviceIds.length > 0 && (
                    <div className="mb-4 border rounded-lg p-4 bg-white/80">
                      <h3 className="font-medium mb-2">Koszty według urządzeń</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Urządzenie</TableHead>
                            <TableHead className="text-right">Liczba napraw</TableHead>
                            <TableHead className="text-right">Łączny koszt</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedDeviceIds.map(deviceId => {
                            const deviceRecords = filteredRecords.filter(record => record.deviceId === deviceId);
                            const deviceCost = deviceRecords.reduce((sum, record) => sum + record.cost, 0);
                            const device = allDevices.find(d => d.id === deviceId);
                            
                            return (
                              <TableRow key={deviceId}>
                                <TableCell>{device?.name || 'Nieznane urządzenie'}</TableCell>
                                <TableCell className="text-right">{deviceRecords.length}</TableCell>
                                <TableCell className="text-right font-medium">{deviceCost.toFixed(2)} PLN</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                
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
                </>
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
