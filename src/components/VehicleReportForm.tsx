
import React, { useState } from 'react';
import { Device, ServiceRecord, Vehicle } from '../utils/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { formatDate } from "../utils/formatting/dateUtils";

interface VehicleReportFormProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  devices: Device[];
  services: ServiceRecord[];
}

const VehicleReportForm = ({ 
  open, 
  onClose, 
  vehicle, 
  devices, 
  services 
}: VehicleReportFormProps) => {
  const [reportType, setReportType] = useState<'devices' | 'services'>('devices');

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const deviceTable = `
      <h2>Urządzenia dla pojazdu: ${vehicle.name} (${vehicle.registrationNumber})</h2>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Nazwa</th>
            <th>Typ</th>
            <th>Nr seryjny</th>
          </tr>
        </thead>
        <tbody>
          ${devices.map(device => `
            <tr>
              <td>${device.name}</td>
              <td>${device.type}</td>
              <td>${device.serialNumber}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const serviceTable = `
      <h2>Historia serwisowa dla pojazdu: ${vehicle.name} (${vehicle.registrationNumber})</h2>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Data</th>
            <th>Dotyczy</th>
            <th>Opis</th>
            <th>Technik</th>
            <th>Cena</th>
          </tr>
        </thead>
        <tbody>
          ${services.map(service => `
            <tr>
              <td>${formatDate(service.date)}</td>
              <td>${service.deviceName ? service.deviceName : 'Pojazd'}</td>
              <td>${service.description}</td>
              <td>${service.technician}</td>
              <td>${service.cost.toFixed(2)} PLN</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Zestawienie - ${reportType === 'devices' ? 'Urządzenia' : 'Serwisy'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f2f2f2; text-align: left; }
            th, td { padding: 10px; border: 1px solid #ddd; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${reportType === 'devices' ? deviceTable : serviceTable}
          <div style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">Drukuj</button>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generowanie zestawienia</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup
            value={reportType}
            onValueChange={(value) => setReportType(value as 'devices' | 'services')}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="devices" id="devices" />
              <Label htmlFor="devices">Zestawienie urządzeń</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="services" id="services" />
              <Label htmlFor="services">Zestawienie historii serwisowej</Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Generuj do druku
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleReportForm;
