
import { useState, useEffect } from "react";
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
import { Image } from "lucide-react";

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

type EditVehicleFormProps = {
  vehicle: Vehicle;
  onSubmit: (vehicle: Vehicle) => void;
  onCancel: () => void;
  allVehicles?: Vehicle[];
  onRemoveTag?: (tagName: string) => void;
};

const EditVehicleForm = ({ vehicle, onSubmit, onCancel, allVehicles = [], onRemoveTag }: EditVehicleFormProps) => {
  const [attachments, setAttachments] = useState<any[]>(vehicle.attachments || []);
  const [images, setImages] = useState<string[]>(vehicle.images || []);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(vehicle.thumbnail || null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    const allTags: string[] = [];
    
    allVehicles.forEach(v => {
      if (v.tags) {
        const tags = v.tags.split(',').map(tag => tag.trim());
        allTags.push(...tags);
      }
    });
    
    const uniqueTags = Array.from(new Set(allTags));
    setAvailableTags(uniqueTags);
  }, [allVehicles]);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: vehicle.name,
      brand: vehicle.brand || "",
      year: vehicle.year,
      vin: vehicle.vin || "",
      registrationNumber: vehicle.registrationNumber,
      purchaseDate: vehicle.purchaseDate ? new Date(vehicle.purchaseDate) : undefined,
      inspectionExpiryDate: vehicle.inspectionExpiryDate ? new Date(vehicle.inspectionExpiryDate) : undefined,
      serviceExpiryDate: vehicle.serviceExpiryDate ? new Date(vehicle.serviceExpiryDate) : undefined,
      insuranceExpiryDate: vehicle.insuranceExpiryDate ? new Date(vehicle.insuranceExpiryDate) : undefined,
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
      thumbnail: thumbnailFile ? URL.createObjectURL(thumbnailFile) : thumbnail,
      attachments: [
        ...(attachments || []),
        ...newAttachments.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file)
        }))
      ],
      images: [
        ...(images || []),
        ...newImages.map(img => URL.createObjectURL(img))
      ],
    };
    
    onSubmit(updatedVehicle);
    toast.success("Pojazd został zaktualizowany pomyślnie");
  };

  const handleImagesChange = (newFiles: File[]) => {
    setNewImages(newFiles);
  };

  const handleAttachmentsChange = (newFiles: File[]) => {
    setNewAttachments(prev => [...prev, ...newFiles]);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnail(URL.createObjectURL(file));
    }
  };

  const removeAttachment = (index: number) => {
    if (index < attachments.length) {
      setAttachments(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - attachments.length;
      setNewAttachments(prev => prev.filter((_, i) => i !== newIndex));
    }
  };

  const removeImage = (index: number) => {
    if (index < images.length) {
      setImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - images.length;
      setNewImages(prev => prev.filter((_, i) => i !== newIndex));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailFile(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50 relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              {thumbnail ? (
                <div className="h-20 w-20 rounded-lg overflow-hidden border border-border/50 bg-background">
                  <img src={thumbnail} alt="Miniatura pojazdu" className="h-full w-full object-cover" />
                  <button 
                    type="button" 
                    onClick={removeThumbnail}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 h-6 w-6 flex items-center justify-center"
                  >
                    <span>×</span>
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-lg border border-dashed border-border flex items-center justify-center bg-background/50">
                  <Car className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Miniatura pojazdu</h4>
              <Button type="button" size="sm" variant="outline" className="relative" onClick={() => document.getElementById('thumbnail-input')?.click()}>
                <Image className="mr-1 h-4 w-4" />
                Załącz miniaturkę
                <input 
                  id="thumbnail-input"
                  type="file" 
                  accept="image/*" 
                  onChange={handleThumbnailChange} 
                  className="sr-only"
                />
              </Button>
            </div>
          </div>
        </div>
        
        <VehicleBasicFields form={form} availableTags={availableTags} onRemoveTag={onRemoveTag} />
        
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
          files={newImages}
          accept="image/*"
          multiple={true}
          existingFiles={images.map((url, index) => ({
            name: `image-${index}.jpg`,
            type: 'image/jpeg',
            size: 0,
            url: url
          }))}
          onRemoveExisting={removeImage}
          onRemove={(index) => removeImage(index + images.length)}
          isImage={true}
        />
        
        <FileUploadField 
          label="Załączniki"
          onChange={handleAttachmentsChange}
          files={newAttachments}
          multiple={true}
          existingFiles={attachments || []}
          onRemoveExisting={removeAttachment}
          onRemove={(index) => removeAttachment(index + (attachments?.length || 0))}
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
