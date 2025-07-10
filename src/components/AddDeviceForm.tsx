import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Device, Vehicle } from "../utils/types";
import { X, Maximize, Image, Smartphone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateInput } from "@/components/ui/date-input";
import FullscreenViewer from "./FullscreenViewer";
import ReminderSection from "./vehicle-form/ReminderSection";
import FileUploadField from "./vehicle-form/FileUploadField";
import { FileStorageService } from "../services/fileStorageService";
import { toast } from "sonner";

const deviceSchema = z.object({
  vehicleId: z.string().optional(),
  name: z.string().min(1, "Nazwa jest wymagana"),
  brand: z.string().min(1, "Marka jest wymagana"),
  type: z.string().min(1, "Typ urządzenia jest wymagany"),
  serialNumber: z.string().min(1, "Numer seryjny jest wymagany"),
  year: z.coerce.number().int().min(1900, "Rok musi być większy niż 1900").max(new Date().getFullYear() + 1, "Rok nie może być przyszły"),
  purchasePrice: z.coerce.number().min(0, "Cena nie może być ujemna").optional(),
  serviceExpiryDate: z.date().optional(),
  serviceReminderDays: z.coerce.number().min(0).max(365).optional(),
  notes: z.string().optional(),
});

type DeviceFormValues = z.infer<typeof deviceSchema>;

type AddDeviceFormProps = {
  onSubmit: (device: Partial<Device>) => void;
  onCancel: () => void;
  vehicles: Vehicle[];
  initialDevice?: Device;
  isEditing?: boolean;
  selectedVehicleId?: string | null;
};

const AddDeviceForm = ({ 
  onSubmit, 
  onCancel, 
  vehicles, 
  initialDevice, 
  isEditing = false, 
  selectedVehicleId 
}: AddDeviceFormProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialDevice?.images || []);
  const [existingAttachments, setExistingAttachments] = useState(initialDevice?.attachments || []);
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(initialDevice?.thumbnail || null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      vehicleId: initialDevice?.vehicleId || selectedVehicleId || undefined,
      name: initialDevice?.name || "",
      brand: initialDevice?.brand || "",
      type: initialDevice?.type || "",
      serialNumber: initialDevice?.serialNumber || "",
      year: initialDevice?.year || new Date().getFullYear(),
      purchasePrice: initialDevice?.purchasePrice || undefined,
      serviceExpiryDate: initialDevice?.serviceExpiryDate ? new Date(initialDevice.serviceExpiryDate) : undefined,
      serviceReminderDays: initialDevice?.serviceReminderDays || 30,
      notes: initialDevice?.notes || "",
    },
  });

  const handleSubmit = async (values: DeviceFormValues) => {
    try {
      toast.loading("Zapisywanie urządzenia...");
      
      // Ensure bucket exists
      await FileStorageService.ensureBucketExists();
      
      const deviceId = initialDevice?.id || crypto.randomUUID();
      const deviceName = values.name;
      
      // Upload files to organized folders
      const [uploadedImages, uploadedAttachments, uploadedThumbnail] = await Promise.all([
        images.length > 0 ? FileStorageService.uploadDeviceFiles(deviceId, deviceName, images, 'images') : [],
        attachments.length > 0 ? FileStorageService.uploadDeviceFiles(deviceId, deviceName, attachments, 'attachments') : [],
        thumbnailFile ? FileStorageService.uploadDeviceFiles(deviceId, deviceName, [thumbnailFile], 'thumbnail').then(urls => urls[0] || null) : null
      ]);
      
      const updatedDevice: Partial<Device> = {
        ...initialDevice,
        ...values,
        id: deviceId,
        thumbnail: uploadedThumbnail || thumbnail,
        images: [
          ...existingImages,
          ...uploadedImages
        ],
        attachments: [
          ...existingAttachments,
          ...uploadedAttachments.map((url, index) => ({
            name: attachments[index]?.name || `attachment-${index}`,
            type: attachments[index]?.type || 'application/octet-stream',
            size: attachments[index]?.size || 0,
            url: url
          }))
        ],
        status: initialDevice?.status || 'ok',
        lastService: initialDevice?.lastService || new Date(),
        nextService: values.serviceExpiryDate || new Date(new Date().setMonth(new Date().getMonth() + 6))
      };
      
      onSubmit(updatedDevice);
      toast.dismiss();
      toast.success(`Urządzenie ${isEditing ? 'zaktualizowane' : 'dodane'} pomyślnie!`);
    } catch (error) {
      toast.dismiss();
      toast.error("Błąd podczas zapisywania urządzenia");
      console.error('Error submitting device:', error);
    }
  };

  const handleImagesChange = (files: File[]) => {
    setImages(files);
  };

  const handleAttachmentsChange = (files: File[]) => {
    setAttachments(files);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnail(URL.createObjectURL(file));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index: number) => {
    setExistingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailFile(null);
  };

  const openFullscreen = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFullscreenUrl(url);
  };

  const closeFullscreen = () => {
    setFullscreenUrl(null);
  };

  return (
    <Form {...form}>
      {fullscreenUrl && (
        <FullscreenViewer
          url={fullscreenUrl}
          onClose={closeFullscreen}
          type="auto"
        />
      )}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50 relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              {thumbnail ? (
                <div className="h-20 w-20 rounded-lg overflow-hidden border border-border/50 bg-background">
                  <img src={thumbnail} alt="Miniatura urządzenia" className="h-full w-full object-cover" />
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
                  <Smartphone className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Miniatura urządzenia</h4>
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
        
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="vehicleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Przypisz do pojazdu</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || ''}
                  defaultValue={selectedVehicleId || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz pojazd (opcjonalnie)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.registrationNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa własna urządzenia</FormLabel>
                  <FormControl>
                    <Input placeholder="Wpisz nazwę urządzenia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marka urządzenia</FormLabel>
                  <FormControl>
                    <Input placeholder="Wpisz markę urządzenia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ urządzenia</FormLabel>
                  <FormControl>
                    <Input placeholder="Np. GPS, OBD, Lokalizator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numer seryjny</FormLabel>
                  <FormControl>
                    <Input placeholder="Wpisz numer seryjny" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rok produkcji</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Koszt zakupu (PLN)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="serviceExpiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Wymagany serwis data</FormLabel>
                  <FormControl>
                    <DateInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceReminderDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Przypomnienie (dni przed terminem)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="30"
                      min={0}
                      max={365}
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notatki</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Dodatkowe informacje o urządzeniu" 
                    {...field} 
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FileUploadField
          label="Zdjęcia urządzenia"
          onChange={handleImagesChange}
          files={images}
          accept="image/*"
          multiple={true}
          existingFiles={existingImages.map(url => ({
            name: 'image.jpg',
            type: 'image/jpeg',
            size: 0,
            url
          }))}
          onRemoveExisting={removeExistingImage}
          onRemove={removeImage}
          isImage={true}
          helpText="Dołącz zdjęcia urządzenia"
        />
        
        <FileUploadField
          label="Załączniki"
          onChange={handleAttachmentsChange}
          files={attachments}
          multiple={true}
          existingFiles={existingAttachments}
          onRemoveExisting={removeExistingAttachment}
          onRemove={removeAttachment}
          isImage={false}
          helpText="Załącz dokumenty związane z urządzeniem (instrukcje, faktury, itp.)"
        />
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" className="bg-primary">
            {isEditing ? "Zapisz zmiany" : "Dodaj urządzenie"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddDeviceForm;
