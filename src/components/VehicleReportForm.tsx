
import React, { useState } from 'react';
import { Device, ServiceRecord, Vehicle } from '../utils/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Printer, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface VehicleReportFormProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  devices: Device[];
  services: ServiceRecord[];
}

const reportFormSchema = z.object({
  reportType: z.enum(['devices', 'services']),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

const VehicleReportForm = ({
  open,
  onClose,
  vehicle,
  devices,
  services
}: VehicleReportFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reportType: 'devices',
    },
  });

  const handleGenerateReport = (values: ReportFormValues) => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Here we'd normally send the data to a server endpoint
      // Instead, we'll generate a simple printable view
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      
      const reportTitle = values.reportType === 'devices' 
        ? 'Zestawienie urządzeń' 
        : 'Zestawienie serwisów';
        
      let reportContent = '';
      
      if (values.reportType === 'devices') {
        reportContent = `
          <h2>Lista urządzeń dla pojazdu: ${vehicle.name}</h2>
          <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th>Nazwa</th>
                <th>Typ</th>
                <th>Numer seryjny</th>
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
      } else {
        reportContent = `
          <h2>Historia serwisowa dla pojazdu: ${vehicle.name}</h2>
          <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th>Data</th>
                <th>Typ</th>
                <th>Opis</th>
                <th>Technik</th>
                <th>Koszt</th>
              </tr>
            </thead>
            <tbody>
              ${services.map(service => `
                <tr>
                  <td>${new Date(service.date).toLocaleDateString()}</td>
                  <td>${service.type === 'repair' ? 'Naprawa' : 
                        service.type === 'maintenance' ? 'Konserwacja' : 'Przegląd'}</td>
                  <td>${service.description}</td>
                  <td>${service.technician}</td>
                  <td>${service.cost.toFixed(2)} PLN</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${reportTitle} - ${vehicle.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background-color: #f2f2f2; text-align: left; padding: 8px; }
              td { padding: 8px; border: 1px solid #ddd; }
              .header { display: flex; justify-content: space-between; align-items: center; }
              .header-left { flex: 1; }
              .header-right { text-align: right; }
              @media print {
                button.no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="header-left">
                <h1>${reportTitle}</h1>
                <p>Pojazd: ${vehicle.name} (${vehicle.registrationNumber})</p>
                <p>Data wygenerowania: ${new Date().toLocaleDateString()}</p>
              </div>
            </div>
            ${reportContent}
            <button class="no-print" style="margin-top: 20px; padding: 10px; background: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="window.print(); return false;">
              Drukuj raport
            </button>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      setIsGenerating(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generuj zestawienie</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerateReport)} className="space-y-4">
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Typ zestawienia</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="devices" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Zestawienie urządzeń
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="services" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Zestawienie serwisów
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Anuluj
              </Button>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>Generowanie...</>
                ) : (
                  <>
                    <Printer className="mr-2 h-4 w-4" />
                    Generuj
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleReportForm;
