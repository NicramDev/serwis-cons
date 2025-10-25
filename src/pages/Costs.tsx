import React, { useState, useEffect, useRef } from 'react';
import { ServiceRecord, Vehicle, Device } from '../utils/types';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseVehicleToVehicle, mapSupabaseDeviceToDevice, mapSupabaseServiceRecordToServiceRecord } from '@/utils/supabaseMappers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DateInput } from '@/components/ui/date-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { PlusCircle, FileText, ArrowDown, Printer } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [treatVehicleAsDevice, setTreatVehicleAsDevice] = useState<boolean>(false);

  // 1. Pobierz pojazdy z Supabase
  const fetchVehicles = async () => {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error) {
      console.error('Błąd pobierania pojazdów:', error);
      setAllVehicles([]);
    } else {
      setAllVehicles(data.map(mapSupabaseVehicleToVehicle));
    }
  };

  // 2. Pobierz urządzenia z Supabase
  const fetchDevices = async () => {
    const { data, error } = await supabase.from('devices').select('*');
    if (error) {
      console.error('Błąd pobierania urządzeń:', error);
      setAllDevices([]);
    } else {
      setAllDevices(data.map(mapSupabaseDeviceToDevice));
    }
  };

  // 3. Pobierz rekordy serwisowe z Supabase
  const fetchServiceRecords = async () => {
    const { data, error } = await supabase.from('service_records').select('*');
    if (error) {
      console.error('Błąd pobierania serwisów:', error);
      setServiceRecords([]);
    } else {
      setServiceRecords(data.map(mapSupabaseServiceRecordToServiceRecord));
    }
  };

  useEffect(() => {
    // Na starcie pobierz dane z supabase
    fetchVehicles();
    fetchDevices();
    fetchServiceRecords();
  }, []);

  useEffect(() => {
    if (selectedVehicleId) {
      const devicesForVehicle = allDevices.filter(device => device.vehicleId === selectedVehicleId);
      setVehicleDevices(devicesForVehicle);
      
      // Reset selections when vehicle changes
      setSelectedDeviceIds([]);
      setSelectedDeviceId(null);
      setTreatVehicleAsDevice(false);
    } else {
      setVehicleDevices([]);
    }
  }, [selectedVehicleId, allDevices]);

  useEffect(() => {
    if (serviceRecords.length) {
      let filtered = [...serviceRecords];
      
      if (selectedVehicleId) {
        filtered = filtered.filter(record => record.vehicleId === selectedVehicleId);
        
        // When vehicle is treated as a device, we need to include records that don't have a deviceId
        // These are the records directly for the vehicle
        if (treatVehicleAsDevice) {
          filtered = filtered.filter(record => !record.deviceId || record.deviceId === '');
        }
      }
      
      if (!treatVehicleAsDevice) {
        if (!showMultipleDevices && selectedDeviceId) {
          filtered = filtered.filter(record => record.deviceId === selectedDeviceId);
        }
        
        if (showMultipleDevices && selectedDeviceIds.length > 0) {
          filtered = filtered.filter(record => selectedDeviceIds.includes(record.deviceId || ''));
        }
      }
      
      if (dateFrom) {
        filtered = filtered.filter(record => new Date(record.date) >= dateFrom);
      }
      
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        filtered = filtered.filter(record => new Date(record.date) < endDate);
      }
      
      setFilteredRecords(filtered);
      
      const total = filtered.reduce((sum, record) => sum + record.cost, 0);
      setTotalCost(total);
    }
  }, [selectedVehicleId, selectedDeviceId, selectedDeviceIds, dateFrom, dateTo, serviceRecords, showMultipleDevices, treatVehicleAsDevice]);

  const handleClearFilters = () => {
    setSelectedVehicleId(null);
    setSelectedDeviceId(null);
    setSelectedDeviceIds([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    setShowMultipleDevices(false);
    setTreatVehicleAsDevice(false);
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
    setSelectedDeviceId(null);
    setSelectedDeviceIds([]);
    setTreatVehicleAsDevice(false);
  };

  const toggleTreatVehicleAsDevice = () => {
    setTreatVehicleAsDevice(!treatVehicleAsDevice);
    setShowMultipleDevices(false);
    setSelectedDeviceId(null);
    setSelectedDeviceIds([]);
  };

  const reportRef = useRef<HTMLDivElement>(null);
  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    setTimeout(() => {
      if (reportRef.current) {
        try {
          const printWindow = window.open('', '_blank');
          
          if (!printWindow) {
            toast({
              title: "Błąd",
              description: "Nie można otworzyć okna wydruku. Sprawdź czy wyskakujące okienka nie są blokowane.",
              variant: "destructive",
            });
            setIsGeneratingReport(false);
            return;
          }
          
          const selectedVehicle = selectedVehicleId ? allVehicles.find(v => v.id === selectedVehicleId)?.name || 'Wszystkie pojazdy' : 'Wszystkie pojazdy';
          const dateRange = dateFrom && dateTo 
            ? `${format(dateFrom, "dd.MM.yyyy")} - ${format(dateTo, "dd.MM.yyyy")}`
            : dateFrom 
              ? `Od ${format(dateFrom, "dd.MM.yyyy")}`
              : dateTo
                ? `Do ${format(dateTo, "dd.MM.yyyy")}`
                : 'Cały okres';
          
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Podsumowanie kosztów</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  .report-header { text-align: center; margin-bottom: 30px; }
                  .report-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                  .report-subtitle { font-size: 16px; color: #666; margin-bottom: 5px; }
                  .report-info { margin-bottom: 20px; }
                  .report-info p { margin: 5px 0; }
                  .report-total { font-size: 18px; font-weight: bold; margin: 20px 0; text-align: right; }
                  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                  th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                  th { background-color: #f5f5f5; font-weight: bold; }
                  .cost-item { margin-bottom: 15px; padding: 10px; border: 1px solid #eee; }
                  .cost-item-header { display: flex; justify-content: space-between; }
                  .cost-item-title { font-weight: bold; }
                  .cost-item-subtitle { font-size: 14px; color: #666; }
                  .cost-value { font-weight: bold; }
                  .cost-note { font-size: 12px; color: #666; }
                  .cost-description { font-size: 14px; padding-top: 10px; margin-top: 10px; border-top: 1px solid #eee; }
                  .device-summary { margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
                </style>
              </head>
              <body>
                <div class="report-header">
                  <div class="report-title">PODSUMOWANIE KOSZTÓW</div>
                  <div class="report-subtitle">Wygenerowano ${format(new Date(), "dd.MM.yyyy 'o' HH:mm")}</div>
                </div>
                
                <div class="report-info">
                  <p><strong>Pojazd:</strong> ${selectedVehicle}</p>
                  <p><strong>Zakres dat:</strong> ${dateRange}</p>
                  ${selectedDeviceId && !treatVehicleAsDevice
                    ? `<p><strong>Urządzenie:</strong> ${allDevices.find(d => d.id === selectedDeviceId)?.name || 'Nieznane'}</p>` 
                    : ''}
                  ${treatVehicleAsDevice 
                    ? `<p><strong>Pokazuję koszty samego pojazdu (bez urządzeń)</strong></p>` 
                    : ''}
                  ${showMultipleDevices && selectedDeviceIds.length > 0
                    ? `<p><strong>Wybrane urządzenia:</strong> ${selectedDeviceIds.length} z ${vehicleDevices.length}</p>`
                    : ''}
                </div>
                
                <div class="report-total">
                  Łączny koszt: ${totalCost.toFixed(2)} PLN
                </div>
                
                ${showMultipleDevices && selectedDeviceIds.length > 0 ? `
                <div class="device-summary">
                  <h3>Koszty według urządzeń</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Urządzenie</th>
                        <th style="text-align: right">Liczba napraw</th>
                        <th style="text-align: right">Łączny koszt</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${selectedDeviceIds.map(deviceId => {
                        const deviceRecords = filteredRecords.filter(record => record.deviceId === deviceId);
                        const deviceCost = deviceRecords.reduce((sum, record) => sum + record.cost, 0);
                        const device = allDevices.find(d => d.id === deviceId);
                        
                        return `
                          <tr>
                            <td>${device?.name || 'Nieznane urządzenie'}</td>
                            <td style="text-align: right">${deviceRecords.length}</td>
                            <td style="text-align: right">${deviceCost.toFixed(2)} PLN</td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
                ` : ''}
                
                <h3>Szczegóły kosztów</h3>
                ${filteredRecords.length > 0 ? `
                  ${filteredRecords.map(record => `
                    <div class="cost-item">
                      <div class="cost-item-header">
                        <div>
                          <div class="cost-item-title">
                            ${treatVehicleAsDevice 
                              ? allVehicles.find(v => v.id === record.vehicleId)?.name || 'Pojazd'
                              : record.deviceName}
                            ${!treatVehicleAsDevice && record.vehicleId && allVehicles.find(v => v.id === record.vehicleId) 
                              ? ` - ${allVehicles.find(v => v.id === record.vehicleId)?.name}` 
                              : ''}
                          </div>
                          <div class="cost-item-subtitle">
                            ${format(new Date(record.date), "dd.MM.yyyy")} - ${record.type === 'repair' ? 'Naprawa' : 
                            record.type === 'maintenance' ? 'Serwis' : 
                            record.type === 'inspection' ? 'Przegląd' : 'Inne'}
                          </div>
                        </div>
                        <div>
                          <div class="cost-value">${record.cost.toFixed(2)} PLN</div>
                          <div class="cost-note">${record.technician}</div>
                        </div>
                      </div>
                      <div class="cost-description">
                        <strong>Zakres usługi/naprawy:</strong> ${record.description}
                      </div>
                    </div>
                  `).join('')}
                ` : `
                  <p style="text-align: center; color: #666; padding: 30px;">Brak wyników dla wybranych filtrów</p>
                `}
              </body>
            </html>
          `);
          
          printWindow.document.close();
          printWindow.focus();
          
          setTimeout(() => {
            printWindow.print();
            setIsGeneratingReport(false);
          }, 500);
          
        } catch (error) {
          console.error('Error generating report:', error);
          toast({
            title: "Błąd",
            description: "Wystąpił problem podczas generowania raportu.",
            variant: "destructive",
          });
          setIsGeneratingReport(false);
        }
      }
    }, 100);
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
                    {[...allVehicles].sort((a, b) => a.name.localeCompare(b.name, 'pl')).map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.registrationNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedVehicleId && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="treatVehicleAsDevice" 
                      checked={treatVehicleAsDevice}
                      onCheckedChange={toggleTreatVehicleAsDevice}
                    />
                    <label
                      htmlFor="treatVehicleAsDevice"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Pokaż koszty samego pojazdu (bez urządzeń)
                    </label>
                  </div>
                  
                  {!treatVehicleAsDevice && (
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
                </div>
              )}
              
              {selectedVehicleId && !treatVehicleAsDevice && !showMultipleDevices && (
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
                      {vehicleDevices.map(device => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.name} ({device.serialNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {selectedVehicleId && !treatVehicleAsDevice && showMultipleDevices && vehicleDevices.length > 0 && (
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
                <DateInput
                  value={dateFrom}
                  onChange={setDateFrom}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Data do</label>
                <DateInput
                  value={dateTo}
                  onChange={setDateTo}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleClearFilters}
              >
                Wyczyść filtry
              </Button>
              
              <Button 
                className="w-full"
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>Generowanie...</>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generuj raport
                  </>
                )}
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
              <div ref={reportRef}>
                {filteredRecords.length > 0 ? (
                  <>
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
                          className="flex flex-col p-3 border rounded-lg"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">
                                {treatVehicleAsDevice 
                                  ? allVehicles.find(v => v.id === record.vehicleId)?.name || 'Pojazd'
                                  : record.deviceName}
                                {!treatVehicleAsDevice && record.vehicleId && allVehicles.find(v => v.id === record.vehicleId) && 
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
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <div className="text-sm">
                              <span className="font-medium">Zakres usługi/naprawy:</span> {record.description}
                            </div>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Costs;
