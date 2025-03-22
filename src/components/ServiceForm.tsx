
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Device, ServiceRecord } from "../utils/types";
import { X, Calendar, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';

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
};

const ServiceForm = ({ onSubmit, onCancel, vehicleId, devices }: ServiceFormProps) => {
  const [images, setImages] = useState<File[]>([]);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      deviceId: "",
      date: new Date(),
      location: "",
      description: "",
      cost: 0,
      technician: "",
      type: "maintenance",
    },
  });

  const handleSubmit = (values: ServiceFormValues) => {
    const selectedDevice = devices.find(d => d.id === values.deviceId);
    
    const serviceRecord: ServiceRecord = {
      id: uuidv4(),
      date: values.date,
      vehicleId: vehicleId,
      deviceId: values.deviceId,
      deviceName: selectedDevice?.name,
      location: values.location,
      type: values.type,
      description: values.description,
      cost: values.cost,
      technician: values.technician,
      images: images.map(img => URL.createObjectURL(img)),
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pr-2">
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
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img 
                    src={URL.createObjectURL(img)} 
                    alt={`Service image ${idx}`} 
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 h-6 w-6 flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
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
            <Save className="h-4 w-4 mr-1" />
            Zapisz serwis/naprawę
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
