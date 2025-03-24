
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
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
  insuranceReminderDays: z.number().min(0).max(90).default(30),
  inspectionReminderDays: z.number().min(0).max(90).default(30),
  serviceReminderDays: z.number().min(0).max(90).default(30),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

type AddVehicleFormProps = {
  onSubmit: (vehicle: Partial<Vehicle>) => void;
  onCancel: () => void;
};

const AddVehicleForm = ({ onSubmit, onCancel }: AddVehicleFormProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: "",
      brand: "",
      year: new Date().getFullYear(),
      vin: "",
      registrationNumber: "",
      fuelCardNumber: "",
      gpsSystemNumber: "",
      driverName: "",
      tags: "",
      notes: "",
      insuranceReminderDays: 30,
      inspectionReminderDays: 30,
      serviceReminderDays: 30,
    },
  });

  const handleSubmit = (values: VehicleFormValues) => {
    const newVehicle: Partial<Vehicle> = {
      ...values,
      images: images.map(img => URL.createObjectURL(img)),
      attachments: attachments.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      })),
    };
    
    onSubmit(newVehicle);
    toast.success("Pojazd został dodany pomyślnie");
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

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <VehicleBasicFields form={form} />
        
        <ReminderSection 
          form={form} 
          type="insurance" 
          title="Ubezpieczenie OC/AC ważne do" 
        />
        
        <ReminderSection 
          form={form} 
          type="inspection" 
          title="Przegląd ważny do" 
        />
        
        <ReminderSection 
          form={form} 
          type="service" 
          title="Serwis ważny do" 
        />
        
        <FileUploadField 
          label="Zdjęcia pojazdu"
          onChange={handleImagesChange}
          files={images}
          accept="image/*"
          multiple={true}
          onRemove={removeImage}
          isImage={true}
        />
        
        <FileUploadField 
          label="Załączniki"
          onChange={handleAttachmentsChange}
          files={attachments}
          multiple={true}
          onRemove={removeAttachment}
        />
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" className="bg-primary">
            Dodaj pojazd
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddVehicleForm;
