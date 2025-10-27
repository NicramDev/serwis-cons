
import React, { useState } from 'react';
import { Device, ServiceRecord, Vehicle, VehicleEquipment } from '../utils/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { formatDate } from "../utils/formatting/dateUtils";

interface VehicleReportFormProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  devices: Device[];
  vehicleEquipment: VehicleEquipment[];
  services: ServiceRecord[];
}

const VehicleReportForm = ({ 
  open, 
  onClose, 
  vehicle, 
  devices, 
  vehicleEquipment,
  services 
}: VehicleReportFormProps) => {
  const [selectedReports, setSelectedReports] = useState({ devices: true, vehicleEquipment: false, services: false });

  const getServiceTypeText = (type: string) => {
    switch (type) {
      case 'repair':
        return 'Naprawa';
      case 'maintenance':
        return 'Serwis';
      case 'inspection':
        return 'Przegląd';
      case 'replacement':
        return 'Wymiana';
      default:
        return 'Inne';
    }
  };

  const toggle = (key: 'devices' | 'vehicleEquipment' | 'services') => {
    setSelectedReports(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const deviceTable = `
      <h2>Urządzenia dla pojazdu: ${vehicle.name} (${vehicle.registrationNumber})</h2>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Nazwa</th>
            <th>Marka</th>
            <th>Typ</th>
            <th>Nr seryjny</th>
          </tr>
        </thead>
        <tbody>
          ${devices.map(device => `
            <tr>
              <td>${device.name}</td>
              <td>${device.brand ?? '-'}</td>
              <td>${device.type ?? '-'}</td>
              <td>${device.serialNumber ?? '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const vehicleEquipmentTable = `
      <h2>Equipment pojazdu: ${vehicle.name} (${vehicle.registrationNumber})</h2>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Nazwa</th>
            <th>Marka/Typ</th>
            <th>Nr seryjny</th>
            <th>Ilość sztuk</th>
          </tr>
        </thead>
        <tbody>
          ${vehicleEquipment.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${[item.brand, item.type].filter(Boolean).join(' / ') || '-'}</td>
              <td>${item.serialNumber ?? '-'}</td>
              <td>${item.quantity ?? '-'}</td>
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
            <th>Typ serwisu</th>
            <th>Zakres</th>
            <th>Miejsce serwisu</th>
            <th>Koszt</th>
          </tr>
        </thead>
        <tbody>
          ${services.map(service => {
            const subject = service.deviceId ? 'Urządzenie' : 'Pojazd';
            return `
              <tr>
                <td>${formatDate(service.date)}</td>
                <td>${subject}</td>
                <td>${getServiceTypeText(service.type)}</td>
                <td>${service.description ?? '-'}</td>
                <td>${service.location ?? '-'}</td>
                <td>${service.cost ? service.cost.toFixed(2) + ' PLN' : '-'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Zestawienie</title>
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
          ${[
            selectedReports.devices ? deviceTable : '',
            selectedReports.vehicleEquipment ? vehicleEquipmentTable : '',
            selectedReports.services ? serviceTable : ''
          ].filter(Boolean).join('<hr style="margin:30px 0;" />')}
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
          <DialogDescription>Wybierz jeden lub wiele rodzajów zestawienia do wygenerowania</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="devices" checked={selectedReports.devices} onCheckedChange={() => toggle('devices')} />
              <Label htmlFor="devices">Zestawienie urządzeń</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="vehicleEquipment" checked={selectedReports.vehicleEquipment} onCheckedChange={() => toggle('vehicleEquipment')} />
              <Label htmlFor="vehicleEquipment">Zestawienie Equipment pojazdu</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="services" checked={selectedReports.services} onCheckedChange={() => toggle('services')} />
              <Label htmlFor="services">Zestawienie historii serwisowej</Label>
            </div>
          </div>
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
