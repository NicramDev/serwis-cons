
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Device, ServiceRecord, Vehicle } from "../utils/types";
import { X, Calendar, Save, Maximize } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';
import FullscreenViewer from "./FullscreenViewer";
import ServiceFormImages from "./ServiceFormImages";
import ServiceFormFields from "./ServiceFormFields";

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
  vehicle?: Vehicle;
};

const ServiceForm = ({ 
  onSubmit, 
  onCancel, 
  vehicleId, 
  devices, 
  initialService, 
  isEditing = false,
  vehicle
}: ServiceFormProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialService?.images || []
  );
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      deviceId: initialService?.deviceId || "vehicle",
      date: initialService?.date ? new Date(initialService.date) : new Date(),
      location: initialService?.location || "",
      description: initialService?.description || "",
      cost: initialService?.cost || 0,
      technician: initialService?.technician || "",
      type: initialService?.type || "maintenance",
    },
  });

  const handleSubmit = (values: ServiceFormValues) => {
    // Handle the "vehicle" special case
    let deviceName;
    if (values.deviceId === "vehicle") {
      deviceName = vehicle?.name ? `Pojazd - ${vehicle.name}` : "Pojazd";
    } else {
      const selectedDevice = devices.find(d => d.id === values.deviceId);
      deviceName = selectedDevice?.name;
    }
    
    const serviceRecord: ServiceRecord = {
      id: initialService?.id || uuidv4(),
      date: values.date,
      vehicleId: vehicleId,
      deviceId: values.deviceId === "vehicle" ? undefined : values.deviceId,
      deviceName,
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
                  <SelectItem value="vehicle">
                    {vehicle?.name ? `Pojazd - ${vehicle.name}` : "Pojazd"}
                  </SelectItem>
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
        
        <ServiceFormFields control={form.control} />
        
        <ServiceFormImages 
          existingImages={existingImages}
          images={images}
          handleImagesChange={handleImagesChange}
          removeExistingImage={removeExistingImage}
          removeImage={removeImage}
          openFullscreen={openFullscreen}
        />
        
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
