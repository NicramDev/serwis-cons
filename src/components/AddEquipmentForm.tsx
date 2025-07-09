import React, { useState } from 'react';
import { Equipment, Vehicle } from '../utils/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VehicleDateField from './vehicle-form/VehicleDateField';
import FileUploadField from './vehicle-form/FileUploadField';

interface AddEquipmentFormProps {
  onSubmit: (equipment: Partial<Equipment>) => void;
  onCancel: () => void;
  vehicles?: Vehicle[];
  initialEquipment?: Equipment;
  isEditing?: boolean;
}

const AddEquipmentForm = ({ onSubmit, onCancel, vehicles = [], initialEquipment, isEditing = false }: AddEquipmentFormProps) => {
  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: initialEquipment?.name || '',
    brand: initialEquipment?.brand || '',
    model: initialEquipment?.model || '',
    type: initialEquipment?.type || '',
    serialNumber: initialEquipment?.serialNumber || '',
    vehicleId: initialEquipment?.vehicleId || '',
    year: initialEquipment?.year || undefined,
    purchasePrice: initialEquipment?.purchasePrice || undefined,
    purchaseDate: initialEquipment?.purchaseDate || undefined,
    notes: initialEquipment?.notes || '',
    images: initialEquipment?.images || [],
    attachments: initialEquipment?.attachments || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;
    
    onSubmit({
      ...formData,
      lastService: new Date(),
      nextService: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      status: 'ok' as const
    });
  };

  const handleFileUpload = (files: File[]) => {
    console.log('Files uploaded:', files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nazwa wyposażenia *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
            placeholder="Wprowadź nazwę wyposażenia"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Marka</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))}
            placeholder="Wprowadź markę"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData(prev => ({...prev, model: e.target.value}))}
            placeholder="Wprowadź model"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Typ</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({...prev, type: e.target.value}))}
            placeholder="Wprowadź typ wyposażenia"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber">Numer seryjny</Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) => setFormData(prev => ({...prev, serialNumber: e.target.value}))}
            placeholder="Wprowadź numer seryjny"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Rok produkcji</Label>
          <Input
            id="year"
            type="number"
            value={formData.year || ''}
            onChange={(e) => setFormData(prev => ({...prev, year: e.target.value ? parseInt(e.target.value) : undefined}))}
            placeholder="Wprowadź rok"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Cena zakupu (PLN)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.purchasePrice || ''}
            onChange={(e) => setFormData(prev => ({...prev, purchasePrice: e.target.value ? parseFloat(e.target.value) : undefined}))}
            placeholder="Wprowadź cenę"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Data zakupu</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate ? formData.purchaseDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData(prev => ({...prev, purchaseDate: e.target.value ? new Date(e.target.value) : undefined}))}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="vehicle">Przypisz do pojazdu</Label>
          <Select value={formData.vehicleId || "none"} onValueChange={(value) => setFormData(prev => ({...prev, vehicleId: value === "none" ? "" : value}))}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz pojazd (opcjonalnie)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Brak przypisania</SelectItem>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.registrationNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notatki</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
            placeholder="Dodatkowe informacje o wyposażeniu"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <Label>Zdjęcia i załączniki</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Przeciągnij pliki tutaj lub kliknij aby wybrać
            </p>
            <Input type="file" multiple className="mt-2" />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Anuluj
        </Button>
        <Button type="submit">
          {isEditing ? 'Zapisz zmiany' : 'Dodaj wyposażenie'}
        </Button>
      </div>
    </form>
  );
};

export default AddEquipmentForm;