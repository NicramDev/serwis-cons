
import React, { useState } from 'react';
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DialogFooter } from '@/components/ui/dialog';
import { formatDate } from '../utils/data';
import { toast } from 'sonner';

interface VehicleReportFormProps {
  vehicle: Vehicle;
  devices: Device[];
  services: ServiceRecord[];
  onClose: () => void;
}

const VehicleReportForm = ({ vehicle, devices, services, onClose }: VehicleReportFormProps) => {
  const [reportType, setReportType] = useState<'devices' | 'services'>('devices');
  
  const generateReport = () => {
    // Create a printable window with the report
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Nie udało się otworzyć okna wydruku. Sprawdź czy blokada wyskakujących okien jest wyłączona.');
      return;
    }
    
    // Get current date for the report
    const today = formatDate(new Date());
    
    // Common styles for the report
    const reportStyles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; font-size: 24px; margin-bottom: 10px; }
        h2 { color: #444; font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
        .header { border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
        .vehicle-info { display: flex; flex-wrap: wrap; margin-bottom: 20px; }
        .vehicle-info div { width: 50%; margin-bottom: 8px; }
        .vehicle-info span { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { text-align: left; background-color: #f3f3f3; }
        th, td { padding: 8px; border: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 12px; color: #666; }
      </style>
    `;
    
    // Common header for both report types
    const reportHeader = `
      <div class="header">
        <h1>Zestawienie dla pojazdu: ${vehicle.name}</h1>
        <p>Data wygenerowania: ${today}</p>
      </div>
      <div class="vehicle-info">
        <div><span>Nazwa:</span> ${vehicle.name}</div>
        <div><span>Nr rejestracyjny:</span> ${vehicle.registrationNumber || '-'}</div>
        <div><span>Marka:</span> ${vehicle.brand || '-'}</div>
        <div><span>VIN:</span> ${vehicle.vin || '-'}</div>
        <div><span>Rok produkcji:</span> ${vehicle.year || '-'}</div>
        <div><span>Kierowca:</span> ${vehicle.driverName || '-'}</div>
      </div>
    `;
    
    // Generate devices report
    if (reportType === 'devices') {
      const devicesContent = `
        <h2>Lista urządzeń (${devices.length})</h2>
        ${devices.length > 0 
          ? `<table>
              <thead>
                <tr>
                  <th>Lp.</th>
                  <th>Nazwa</th>
                  <th>Typ</th>
                  <th>Numer seryjny</th>
                  <th>Model</th>
                  <th>Rok</th>
                  <th>Ostatni serwis</th>
                  <th>Następny serwis</th>
                </tr>
              </thead>
              <tbody>
                ${devices.map((device, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${device.name}</td>
                    <td>${device.type}</td>
                    <td>${device.serialNumber || '-'}</td>
                    <td>${device.model || '-'}</td>
                    <td>${device.year || '-'}</td>
                    <td>${formatDate(device.lastService)}</td>
                    <td>${formatDate(device.nextService)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>`
          : '<p>Brak urządzeń w tym pojeździe.</p>'
        }
      `;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Zestawienie urządzeń - ${vehicle.name}</title>
            ${reportStyles}
          </head>
          <body>
            ${reportHeader}
            ${devicesContent}
            <div class="footer">
              <p>Wygenerowano z systemu zarządzania flotą</p>
            </div>
          </body>
        </html>
      `);
    }
    
    // Generate services report
    else {
      const servicesContent = `
        <h2>Historia serwisów (${services.length})</h2>
        ${services.length > 0 
          ? `<table>
              <thead>
                <tr>
                  <th>Lp.</th>
                  <th>Data</th>
                  <th>Typ</th>
                  <th>Opis</th>
                  <th>Technik</th>
                  <th>Koszt</th>
                </tr>
              </thead>
              <tbody>
                ${services.map((service, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${formatDate(service.date)}</td>
                    <td>${service.type}</td>
                    <td>${service.description || '-'}</td>
                    <td>${service.technicianName || '-'}</td>
                    <td>${service.cost ? `${service.cost} ${service.currency || 'PLN'}` : '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="margin-top: 20px;">
              <p><strong>Suma kosztów:</strong> ${
                services.reduce((total, service) => total + (service.cost || 0), 0)
              } PLN</p>
            </div>`
          : '<p>Brak historii serwisowej dla tego pojazdu.</p>'
        }
      `;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Zestawienie serwisów - ${vehicle.name}</title>
            ${reportStyles}
          </head>
          <body>
            ${reportHeader}
            ${servicesContent}
            <div class="footer">
              <p>Wygenerowano z systemu zarządzania flotą</p>
            </div>
          </body>
        </html>
      `);
    }
    
    // Finalize the document
    printWindow.document.close();
    
    // Wait for CSS to load
    setTimeout(() => {
      printWindow.print();
      // Optional: close the window after printing
      // printWindow.close();
    }, 500);
    
    onClose();
    toast.success('Zestawienie zostało wygenerowane pomyślnie');
  };
  
  return (
    <div className="py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Wybierz rodzaj zestawienia:</Label>
          <RadioGroup 
            defaultValue="devices" 
            value={reportType}
            onValueChange={(value) => setReportType(value as 'devices' | 'services')}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="devices" id="devices" />
              <Label htmlFor="devices" className="font-normal cursor-pointer">
                Zestawienie urządzeń ({devices.length})
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="services" id="services" />
              <Label htmlFor="services" className="font-normal cursor-pointer">
                Zestawienie serwisów ({services.length})
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="mr-2"
          >
            Anuluj
          </Button>
          <Button 
            onClick={generateReport}
            disabled={
              (reportType === 'devices' && devices.length === 0) || 
              (reportType === 'services' && services.length === 0)
            }
          >
            Wygeneruj raport
          </Button>
        </DialogFooter>
      </div>
    </div>
  );
};

export default VehicleReportForm;
