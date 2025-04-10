import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Device, Vehicle } from "../utils/types";
import { X, Calendar, Maximize, Image, Smartphone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import FullscreenViewer from "./FullscreenViewer";
import ReminderSection from "./vehicle-form/ReminderSection";
import FileUploadField from "./vehicle-form/FileUploadField";

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

  const handleSubmit = (values: DeviceFormValues) => {
    const updatedDevice: Partial<Device> = {
      ...initialDevice,
      ...values,
      thumbnail: thumbnailFile ? URL.createObjectURL(thumbnailFile) : thumbnail,
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
      status: initialDevice?.status || 'ok',
      lastService: initialDevice?.lastService || new Date(),
      nextService: values.serviceExpiryDate || new Date(new Date().setMonth(new Date().getMonth() + 6))
    };
    
    onSubmit(updatedDevice);
  };

  const handleImagesChange = (files: File[]) => {
    setImages(files);
  };

  const handleAttachmentsChange = (files: File[]) => {
    setAttachments(prev => [...prev, ...files]);
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd.MM.yyyy")
                          ) : (
                            <span>Wybierz datę</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
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
        
        <div className="space-y-2">
          <FormLabel>Załączniki</FormLabel>
          <Input 
            type="file" 
            multiple 
            onChange={(e) => handleAttachmentsChange(Array.from(e.target.files || []))}
            className="cursor-pointer"
          />
          
          {(existingAttachments.length > 0 || attachments.length > 0) && (
            <div className="space-y-2 mt-2">
              {existingAttachments.map((file, idx) => (
                <div 
                  key={`existing-attach-${idx}`} 
                  className="flex items-center justify-between bg-secondary p-2 rounded-md cursor-pointer"
                  onClick={() => openFullscreen(file.url)}
                >
                  <div className="truncate text-sm">
                    {file.name} ({(file.size / 1024).toFixed(0)} KB)
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-primary"
                      onClick={(e) => openFullscreen(file.url, e)}
                    >
                      <Maximize className="h-3 w-3 mr-1" />
                      <span className="text-xs">Pełny ekran</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExistingAttachment(idx);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {attachments.map((file, idx) => (
                <div 
                  key={`new-attach-${idx}`} 
                  className="flex items-center justify-between bg-secondary p-2 rounded-md"
                >
                  <div className="truncate text-sm">
                    {file.name} ({(file.size / 1024).toFixed(0)} KB)
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAttachment(idx);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
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
