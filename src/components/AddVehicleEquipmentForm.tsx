import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VehicleEquipment, Vehicle } from "../utils/types";
import { X, Maximize, Image, Box } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateInput } from "@/components/ui/date-input";
import FullscreenViewer from "./FullscreenViewer";
import FileUploadField from "./vehicle-form/FileUploadField";
import { FileStorageService } from "../services/fileStorageService";
import { toast } from "sonner";

const vehicleEquipmentSchema = z.object({
  vehicleId: z.string().optional(),
  name: z.string().min(1, "Nazwa jest wymagana").max(100, "Nazwa musi być krótsza niż 100 znaków"),
  brand: z.string().max(100, "Marka musi być krótsza niż 100 znaków").optional(),
  type: z.string().min(1, "Typ jest wymagany").max(100, "Typ musi być krótszy niż 100 znaków"),
  serialNumber: z.string().max(100, "Numer seryjny musi być krótszy niż 100 znaków").optional(),
  year: z.coerce.number().int().min(1900, "Rok musi być większy niż 1900").max(new Date().getFullYear() + 1, "Rok nie może być przyszły").optional(),
  purchasePrice: z.coerce.number().min(0, "Cena nie może być ujemna").optional(),
  serviceExpiryDate: z.date().optional(),
  serviceReminderDays: z.coerce.number().min(0).max(365).optional(),
  notes: z.string().max(1000, "Notatki muszą być krótsze niż 1000 znaków").optional(),
});

type VehicleEquipmentFormValues = z.infer<typeof vehicleEquipmentSchema>;

type AddVehicleEquipmentFormProps = {
  onSubmit: (ve: Partial<VehicleEquipment>) => void;
  onCancel: () => void;
  vehicles: Vehicle[];
  initialVehicleEquipment?: VehicleEquipment;
  isEditing?: boolean;
  selectedVehicleId?: string | null;
};

const AddVehicleEquipmentForm = ({ 
  onSubmit, 
  onCancel, 
  vehicles, 
  initialVehicleEquipment, 
  isEditing = false, 
  selectedVehicleId 
}: AddVehicleEquipmentFormProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialVehicleEquipment?.images || []);
  const [existingAttachments, setExistingAttachments] = useState(initialVehicleEquipment?.attachments || []);
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(initialVehicleEquipment?.thumbnail || null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const form = useForm<VehicleEquipmentFormValues>({
    resolver: zodResolver(vehicleEquipmentSchema),
    defaultValues: {
      vehicleId: initialVehicleEquipment?.vehicleId || selectedVehicleId || undefined,
      name: initialVehicleEquipment?.name || "",
      brand: initialVehicleEquipment?.brand || "",
      type: initialVehicleEquipment?.type || "",
      serialNumber: initialVehicleEquipment?.serialNumber || "",
      year: initialVehicleEquipment?.year || undefined,
      purchasePrice: initialVehicleEquipment?.purchasePrice || undefined,
      serviceExpiryDate: initialVehicleEquipment?.serviceExpiryDate ? new Date(initialVehicleEquipment.serviceExpiryDate) : undefined,
      serviceReminderDays: initialVehicleEquipment?.serviceReminderDays || 30,
      notes: initialVehicleEquipment?.notes || "",
    },
  });

  const handleSubmit = async (values: VehicleEquipmentFormValues) => {
    try {
      toast.loading("Zapisywanie equipment...");
      
      await FileStorageService.ensureBucketExists();
      
      const veId = initialVehicleEquipment?.id || crypto.randomUUID();
      const veName = values.name;
      
      const [uploadedImages, uploadedAttachments, uploadedThumbnail] = await Promise.all([
        images.length > 0 ? FileStorageService.uploadDeviceFiles(veId, veName, images, 'images') : [],
        attachments.length > 0 ? FileStorageService.uploadDeviceFiles(veId, veName, attachments, 'attachments') : [],
        thumbnailFile ? FileStorageService.uploadDeviceFiles(veId, veName, [thumbnailFile], 'thumbnail').then(urls => urls[0] || null) : null
      ]);
      
      const updatedVE: Partial<VehicleEquipment> = {
        ...initialVehicleEquipment,
        ...values,
        id: veId,
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
        status: initialVehicleEquipment?.status || 'ok',
        lastService: initialVehicleEquipment?.lastService || new Date(),
        nextService: values.serviceExpiryDate || new Date(new Date().setMonth(new Date().getMonth() + 6))
      };
      
      onSubmit(updatedVE);
      toast.dismiss();
      toast.success(`Equipment ${isEditing ? 'zaktualizowany' : 'dodany'} pomyślnie!`);
    } catch (error) {
      toast.dismiss();
      toast.error("Błąd podczas zapisywania equipment");
      console.error('Error submitting vehicle equipment:', error);
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
                  <img src={thumbnail} alt="Miniatura equipment" className="h-full w-full object-cover" />
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
                  <Box className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Miniatura equipment</h4>
              <Button type="button" size="sm" variant="outline" className="relative" onClick={() => document.getElementById('ve-thumbnail-input')?.click()}>
                <Image className="mr-1 h-4 w-4" />
                Załącz miniaturkę
                <input 
                  id="ve-thumbnail-input"
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
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input placeholder="Wpisz nazwę" {...field} />
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
                  <FormLabel>Marka</FormLabel>
                  <FormControl>
                    <Input placeholder="Wpisz markę" {...field} />
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
                  <FormLabel>Typ</FormLabel>
                  <FormControl>
                    <Input placeholder="Np. Narzędzie, Wyposażenie" {...field} />
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
                    <Input type="number" placeholder="RRRR" {...field} onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
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
                    <Input type="number" step="0.01" placeholder="0.00" {...field} onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                    placeholder="Dodatkowe informacje" 
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
          label="Zdjęcia"
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
          helpText="Dołącz zdjęcia"
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
          helpText="Załącz dokumenty (instrukcje, faktury, itp.)"
        />
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" className="bg-primary">
            {isEditing ? "Zapisz zmiany" : "Dodaj equipment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddVehicleEquipmentForm;
