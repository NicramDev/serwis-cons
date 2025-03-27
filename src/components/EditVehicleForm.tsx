
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Vehicle } from "../utils/types";
import VehicleBasicFields from "./vehicle-form/VehicleBasicFields";
import ReminderSection from "./vehicle-form/ReminderSection";
import FileUploadField from "./vehicle-form/FileUploadField";

const vehicleSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  brand: z.string().min(1, "Marka jest wymagana"),
  year: z.coerce.number().int().min(1900, "Rok musi być większy niż 1900").max(new Date().getFullYear() + 1, "Rok nie może być przyszły"),
  vin: z.string().min(1, "Numer VIN jest wymagany"),
  registrationNumber: z.string().min(1, "Numer rejestracyjny jest wymagany"),
  purchaseDate: z.date().optional(),
  inspectionExpiryDate: z.date().optional(),
  serviceExpiryDate: z.date().optional(),
  insuranceExpiryDate: z.date().optional(),
  fuelCardNumber: z.string().optional(),
  gpsSystemNumber: z.string().optional(),
  driverName: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
  insuranceReminderDays: z.coerce.number().min(0).max(90).default(30),
  inspectionReminderDays: z.coerce.number().min(0).max(90).default(30),
  serviceReminderDays: z.coerce.number().min(0).max(90).default(30),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

type EditVehicleFormProps = {
  vehicle: Vehicle;
  onSubmit: (vehicle: Vehicle) => void;
  onCancel: () => void;
  allVehicles?: Vehicle[];
};

const EditVehicleForm = ({ vehicle, onSubmit, onCancel, allVehicles = [] }: EditVehicleFormProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState(vehicle.attachments || []);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(vehicle.images || []);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    // Extract all unique tags from all vehicles
    const allTags: string[] = [];
    
    allVehicles.forEach(v => {
      if (v.tags) {
        const tags = v.tags.split(',').map(tag => tag.trim());
        allTags.push(...tags);
      }
    });
    
    // Remove duplicates
    const uniqueTags = Array.from(new Set(allTags));
    setAvailableTags(uniqueTags);
  }, [allVehicles]);

  const convertToDate = (dateInput: any) => {
    if (!dateInput) return undefined;
    try {
      if (dateInput instanceof Date) return dateInput;
      return new Date(dateInput);
    } catch {
      return undefined;
    }
  };

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: vehicle.name,
      brand: vehicle.brand || "",
      year: vehicle.year,
      vin: vehicle.vin || "",
      registrationNumber: vehicle.registrationNumber,
      purchaseDate: convertToDate(vehicle.purchaseDate),
      inspectionExpiryDate: convertToDate(vehicle.inspectionExpiryDate),
      serviceExpiryDate: convertToDate(vehicle.serviceExpiryDate),
      insuranceExpiryDate: convertToDate(vehicle.insuranceExpiryDate),
      fuelCardNumber: vehicle.fuelCardNumber || "",
      gpsSystemNumber: vehicle.gpsSystemNumber || "",
      driverName: vehicle.driverName || "",
      tags: vehicle.tags || "",
      notes: vehicle.notes || "",
      insuranceReminderDays: vehicle.insuranceReminderDays || 30,
      inspectionReminderDays: vehicle.inspectionReminderDays || 30,
      serviceReminderDays: vehicle.serviceReminderDays || 30,
    },
  });

  const handleSubmit = (values: VehicleFormValues) => {
    const updatedVehicle: Vehicle = {
      ...vehicle,
      ...values,
      images: [
        ...existingImages,
        ...images.map(img => URL.createObjectURL(img))
      ],
      attachments: [
        ...existingAttachments,
        ...attachments.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file)
        }))
      ],
      lastService: vehicle.lastService,
      nextService: values.serviceExpiryDate || vehicle.nextService
    };
    
    onSubmit(updatedVehicle);
  };

  const handleImagesChange = (newFiles: File[]) => {
    setImages(newFiles);
  };

  const handleAttachmentsChange = (newFiles: File[]) => {
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index: number) => {
    setExistingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <VehicleBasicFields form={form} availableTags={availableTags} />
        
        <ReminderSection 
          form={form} 
          type="insurance" 
          title="Ubezpieczenie OC/AC ważne do" 
          useInputs={true}
        />
        
        <ReminderSection 
          form={form} 
          type="inspection" 
          title="Przegląd ważny do" 
          useInputs={true}
        />
        
        <ReminderSection 
          form={form} 
          type="service" 
          title="Serwis ważny do" 
          useInputs={true}
        />
        
        <FileUploadField 
          label="Zdjęcia pojazdu"
          onChange={handleImagesChange}
          files={images}
          accept="image/*"
          multiple={true}
          existingFiles={existingImages.map((url, i) => ({
            name: `Zdjęcie ${i+1}`,
            type: "image/jpeg",
            size: 0,
            url
          }))}
          onRemoveExisting={removeExistingImage}
          onRemove={removeImage}
          isImage={true}
        />
        
        <FileUploadField 
          label="Załączniki"
          onChange={handleAttachmentsChange}
          files={attachments}
          multiple={true}
          existingFiles={existingAttachments}
          onRemoveExisting={removeExistingAttachment}
          onRemove={removeAttachment}
        />
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" className="bg-primary">
            Zapisz zmiany
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditVehicleForm;
