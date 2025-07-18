
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
import { FileStorageService } from "../services/fileStorageService";
import { toast } from "sonner";
import { Image, Car } from "lucide-react";

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
  onSubmit: (vehicle: Partial<Vehicle> | Vehicle) => void;
  onCancel: () => void;
  allVehicles?: Vehicle[];
  onRemoveTag?: (tagName: string) => void;
  vehicle?: Vehicle;
  isEditing?: boolean;
};

const AddVehicleForm = ({ onSubmit, onCancel, allVehicles = [], onRemoveTag, vehicle, isEditing = false }: AddVehicleFormProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);

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

  useEffect(() => {
    if (isEditing && vehicle) {
      form.reset({
        ...vehicle,
        brand: vehicle.brand || "",
        vin: vehicle.vin || "",
        purchaseDate: vehicle.purchaseDate ? new Date(vehicle.purchaseDate) : undefined,
        inspectionExpiryDate: vehicle.inspectionExpiryDate ? new Date(vehicle.inspectionExpiryDate) : undefined,
        serviceExpiryDate: vehicle.serviceExpiryDate ? new Date(vehicle.serviceExpiryDate) : undefined,
        insuranceExpiryDate: vehicle.insuranceExpiryDate ? new Date(vehicle.insuranceExpiryDate) : undefined,
        fuelCardNumber: vehicle.fuelCardNumber || "",
        gpsSystemNumber: vehicle.gpsSystemNumber || "",
        driverName: vehicle.driverName || "",
        tags: vehicle.tags || "",
        notes: vehicle.notes || "",
        insuranceReminderDays: vehicle.insuranceReminderDays ?? 30,
        inspectionReminderDays: vehicle.inspectionReminderDays ?? 30,
        serviceReminderDays: vehicle.serviceReminderDays ?? 30,
      });
      if (vehicle.thumbnail) {
        setThumbnailPreview(vehicle.thumbnail);
      }
      // Initialize existing files
      setExistingImages(vehicle.images || []);
      setExistingAttachments(vehicle.attachments || []);
    }
  }, [form, isEditing, vehicle]);

  const handleSubmit = async (values: VehicleFormValues) => {
    try {
      toast.loading("Zapisywanie pojazdu...");
      
      // Ensure bucket exists
      await FileStorageService.ensureBucketExists();
      
      const vehicleId = vehicle?.id || crypto.randomUUID();
      const vehicleName = values.name;
      
      // Upload files to organized folders
      const [uploadedImages, uploadedAttachments, uploadedThumbnail] = await Promise.all([
        images.length > 0 ? FileStorageService.uploadVehicleFiles(vehicleId, vehicleName, images, 'images') : [],
        attachments.length > 0 ? FileStorageService.uploadVehicleFiles(vehicleId, vehicleName, attachments, 'attachments') : [],
        thumbnail ? FileStorageService.uploadVehicleThumbnail(vehicleId, vehicleName, thumbnail) : null
      ]);
      
      const vehicleData: Partial<Vehicle> = {
        ...values,
        id: vehicleId,
        thumbnail: uploadedThumbnail || vehicle?.thumbnail,
        images: [...existingImages, ...uploadedImages],
        attachments: [
          ...existingAttachments,
          ...uploadedAttachments.map((url, index) => ({
            name: attachments[index]?.name || `attachment-${index}`,
            type: attachments[index]?.type || 'application/octet-stream',
            size: attachments[index]?.size || 0,
            url: url
          }))
        ],
      };
      
      if (isEditing && vehicle) {
        onSubmit({ ...vehicle, ...vehicleData });
      } else {
        onSubmit(vehicleData);
      }
      
      toast.dismiss();
      toast.success(`Pojazd ${isEditing ? 'zaktualizowany' : 'dodany'} pomyślnie!`);
    } catch (error) {
      toast.dismiss();
      toast.error("Błąd podczas zapisywania pojazdu");
      console.error('Error submitting vehicle:', error);
    }
  };

  const handleImagesChange = (newFiles: File[]) => {
    setImages(newFiles);
  };

  const handleAttachmentsChange = (newFiles: File[]) => {
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50 relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              {thumbnailPreview ? (
                <div className="h-20 w-20 rounded-lg overflow-hidden border border-border/50 bg-background">
                  <img src={thumbnailPreview} alt="Miniatura pojazdu" className="h-full w-full object-cover" />
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
          files={images}
          accept="image/*"
          multiple={true}
          existingFiles={existingImages.map((url, index) => ({
            name: `image-${index}.jpg`,
            type: 'image/jpeg',
            size: 0,
            url: url
          }))}
          onRemoveExisting={(index) => {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
          }}
          onRemove={removeImage}
          isImage={true}
          helpText="Przeciągnij i upuść zdjęcia lub kliknij, aby wybrać"
        />
        
        <FileUploadField 
          label="Załączniki"
          onChange={handleAttachmentsChange}
          files={attachments}
          multiple={true}
          existingFiles={existingAttachments}
          onRemoveExisting={(index) => {
            setExistingAttachments(prev => prev.filter((_, i) => i !== index));
          }}
          onRemove={removeAttachment}
          helpText="Przeciągnij i upuść pliki lub kliknij, aby wybrać"
        />
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" className="bg-primary">
            {isEditing ? 'Zapisz zmiany' : 'Dodaj pojazd'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddVehicleForm;
