import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Device, ServiceRecord } from "../utils/types";
import { X, Calendar, Save, Maximize } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';
import FullscreenViewer from "./FullscreenViewer";

const serviceSchema = z.object({
  deviceId: z.string().min(1, "Wybór urządzenia jest wymagany"),
  date: z.date(),
  location: z.string().min(1, "Miejsce serwisu jest wymagane"),
  description: z.string().min(1, "Opis serwisu/naprawy jest wymagany"),
  cost: z.coerce.number().min(0, "Koszt nie może być ujemny"),
  technician: z.string().min(1, "Technik jest wymagany"),
  type: z.enum(["repair", "maintenance", "inspection"]),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

type ServiceFormProps = {
  onSubmit: (service: ServiceRecord) => void;
  onCancel: () => void;
  vehicleId: string;
  devices: Device[];
  initialService?: ServiceRecord;
  isEditing?: boolean;
};

const ServiceForm = ({ 
  onSubmit, 
  onCancel, 
  vehicleId, 
  devices, 
  initialService, 
  isEditing = false 
}: ServiceFormProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialService?.images || []
  );
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      deviceId: initialService?.deviceId || "",
      date: initialService?.date ? new Date(initialService.date) : new Date(),
      location: initialService?.location || "",
      description: initialService?.description || "",
      cost: initialService?.cost || 0,
      technician: initialService?.technician || "",
      type: initialService?.type || "maintenance",
    },
  });

  const handleSubmit = (values: ServiceFormValues) => {
    const selectedDevice = devices.find(d => d.id === values.deviceId);
    
    const serviceRecord: ServiceRecord = {
      id: initialService?.id || uuidv4(),
      date: values.date,
      vehicleId: vehicleId,
      deviceId: values.deviceId,
      deviceName: selectedDevice?.name,
      location: values.location,
      type: values.type,
      description: values.description,
      cost: values.cost,
      technician: values.technician,
      images: [
        ...existingImages,
        ...images.map(img => URL.createObjectURL(img))
      ],
    };
    
    onSubmit(serviceRecord);
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pr-2 overflow-y-auto max-h-[65vh]">
        <FormField
          control={form.control}
          name="deviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urządzenie</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz urządzenie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {devices.map(device => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name} - {device.type} ({device.serialNumber})
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
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data serwisu/naprawy</FormLabel>
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miejsce serwisu/naprawy</FormLabel>
                <FormControl>
                  <Input placeholder="Np. Warsztat XYZ" {...field} />
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz typ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="repair">Naprawa</SelectItem>
                    <SelectItem value="maintenance">Serwis</SelectItem>
                    <SelectItem value="inspection">Przegląd</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Koszt (PLN)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="technician"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technik / Serwisant</FormLabel>
              <FormControl>
                <Input placeholder="Imię i nazwisko technika" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zakres serwisu/naprawy</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Opisz wykonane czynności" 
                  {...field} 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Zdjęcia z serwisu/naprawy</FormLabel>
          <Input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleImagesChange}
            className="cursor-pointer"
          />
          
          {existingImages.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mt-4 mb-2">Istniejące zdjęcia:</p>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={imgUrl} 
                      alt={`Service image ${idx}`} 
                      className="h-20 w-20 object-cover rounded-md cursor-pointer"
                      onClick={() => openFullscreen(imgUrl)}
                    />
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-6 w-6 bg-black/40 hover:bg-black/60 text-white"
                        onClick={(e) => openFullscreen(imgUrl, e)}
                      >
                        <Maximize className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingImage(idx);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {images.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mt-4 mb-2">Nowe zdjęcia:</p>
              <div className="flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={URL.createObjectURL(img)} 
                      alt={`Service image ${idx}`} 
                      className="h-20 w-20 object-cover rounded-md cursor-pointer"
                      onClick={() => openFullscreen(URL.createObjectURL(img))}
                    />
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-6 w-6 bg-black/40 hover:bg-black/60 text-white"
                        onClick={(e) => openFullscreen(URL.createObjectURL(img), e)}
                      >
                        <Maximize className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" className="bg-primary">
            <Save className="h-4 w-4 mr-1" />
            {isEditing ? 'Zapisz zmiany' : 'Zapisz serwis/naprawę'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
