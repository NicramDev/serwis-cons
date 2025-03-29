
// First we need to fix the technicianName reference and the currency issue
// This is a guess at what the VehicleReportForm component looks like based on the error messages
import React, { useState, useRef } from 'react';
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatDate } from '../utils/data';
import { Printer } from 'lucide-react';

interface VehicleReportFormProps {
  vehicle: Vehicle;
  devices: Device[];
  services: ServiceRecord[];
  onClose: () => void;
}

const VehicleReportForm = ({ vehicle, devices, services, onClose }: VehicleReportFormProps) => {
  const [reportType, setReportType] = useState<'devices' | 'services'>('devices');
  const printContentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printContentRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Zestawienie dla pojazdu ${vehicle.name}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1, h2, h3 { margin-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .header { margin-bottom: 20px; }
                .footer { margin-top: 40px; font-size: 12px; text-align: center; color: #666; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Zestawienie dla pojazdu: ${vehicle.name}</h1>
                <p>Nr rejestracyjny: ${vehicle.registrationNumber}</p>
                <p>Wygenerowano: ${formatDate(new Date())}</p>
              </div>
              ${printContentRef.current.innerHTML}
              <div class="footer">
                <p>© ${new Date().getFullYear()} System Zarządzania Flotą</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  return (
    <div className="space-y-6">
      <RadioGroup
        defaultValue={reportType}
        onValueChange={(value) => setReportType(value as 'devices' | 'services')}
        className="grid grid-cols-2 gap-2"
      >
        <div>
          <RadioGroupItem value="devices" id="devices" className="peer sr-only" />
          <Label
            htmlFor="devices"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            Urządzenia
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="services" id="services" className="peer sr-only" />
          <Label
            htmlFor="services"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            Serwisy
          </Label>
        </div>
      </RadioGroup>
      
      <div ref={printContentRef} className="hidden">
        {reportType === 'devices' ? (
          <div>
            <h2>Zestawienie urządzeń dla pojazdu {vehicle.name}</h2>
            <table>
              <thead>
                <tr>
                  <th>LP</th>
                  <th>Nazwa urządzenia</th>
                  <th>Typ</th>
                  <th>Numer seryjny</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device, index) => (
                  <tr key={device.id}>
                    <td>{index + 1}</td>
                    <td>{device.name}</td>
                    <td>{device.type}</td>
                    <td>{device.serialNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h2>Zestawienie serwisów dla pojazdu {vehicle.name}</h2>
            <table>
              <thead>
                <tr>
                  <th>LP</th>
                  <th>Data</th>
                  <th>Typ</th>
                  <th>Opis</th>
                  <th>Technik</th>
                  <th>Koszt</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={service.id}>
                    <td>{index + 1}</td>
                    <td>{formatDate(service.date)}</td>
                    <td>
                      {service.type === 'repair' ? 'Naprawa' :
                       service.type === 'maintenance' ? 'Przegląd' : 'Inspekcja'}
                    </td>
                    <td>{service.description}</td>
                    <td>{service.technician}</td>
                    <td>{service.cost} PLN</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Anuluj
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Drukuj
        </Button>
      </div>
    </div>
  );
};

export default VehicleReportForm;
