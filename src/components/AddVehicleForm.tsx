
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Vehicle } from "../utils/types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

const vehicleSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  brand: z.string().min(1, "Marka jest wymagana"),
  model: z.string().min(1, "Model jest wymagany"),
  year: z.coerce.number().int().min(1900, "Rok musi być większy niż 1900").max(new Date().getFullYear() + 1, "Rok nie może być przyszły"),
  vin: z.string().min(1, "Numer VIN jest wymagany"),
  registrationNumber: z.string().min(1, "Numer rejestracyjny jest wymagany"),
  purchaseDate: z.date().optional(),
  lastInspectionDate: z.date().optional(),
  lastServiceDate: z.date().optional(),
  insuranceExpiryDate: z.date().optional(),
  fuelCardNumber: z.string().optional(),
  gpsSystemNumber: z.string().optional(),
  driverName: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
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
      model: "",
      year: new Date().getFullYear(),
      vin: "",
      registrationNumber: "",
      fuelCardNumber: "",
      gpsSystemNumber: "",
      driverName: "",
      tags: "",
      notes: "",
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

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa własna pojazdu</FormLabel>
                <FormControl>
                  <Input placeholder="Wpisz nazwę pojazdu" {...field} />
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
                <FormLabel>Marka pojazdu</FormLabel>
                <FormControl>
                  <Input placeholder="Wpisz markę pojazdu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Wpisz model pojazdu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numer VIN</FormLabel>
                <FormControl>
                  <Input placeholder="Wpisz numer VIN pojazdu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numer rejestracyjny</FormLabel>
                <FormControl>
                  <Input placeholder="Wpisz numer rejestracyjny" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data zakupu</FormLabel>
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
                          format(field.value, "dd.MM.yyyy", { locale: pl })
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="insuranceExpiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ubezpieczenie OC/AC ważne do</FormLabel>
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
                          format(field.value, "dd.MM.yyyy", { locale: pl })
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lastInspectionDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data ostatniego przeglądu</FormLabel>
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
                          format(field.value, "dd.MM.yyyy", { locale: pl })
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastServiceDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data ostatniego serwisu</FormLabel>
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
                          format(field.value, "dd.MM.yyyy", { locale: pl })
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fuelCardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nr karty paliwowej</FormLabel>
                <FormControl>
                  <Input placeholder="Wpisz numer karty paliwowej" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gpsSystemNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nr systemu GPS</FormLabel>
                <FormControl>
                  <Input placeholder="Wpisz numer systemu GPS" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="driverName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię i nazwisko kierowcy</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz imię i nazwisko kierowcy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagi (oddzielone przecinkami)</FormLabel>
              <FormControl>
                <Input placeholder="np. VIP, serwis, leasing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notatki</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Dodatkowe informacje o pojeździe" 
                  {...field} 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Zdjęcia pojazdu</FormLabel>
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
                    alt={`Vehicle preview ${idx}`} 
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
        
        <div className="space-y-2">
          <FormLabel>Załączniki</FormLabel>
          <Input 
            type="file" 
            multiple 
            onChange={handleAttachmentsChange}
            className="cursor-pointer"
          />
          {attachments.length > 0 && (
            <div className="space-y-2 mt-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                  <div className="truncate text-sm">
                    {file.name} ({(file.size / 1024).toFixed(0)} KB)
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="text-destructive hover:text-destructive/80"
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
            Dodaj pojazd
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddVehicleForm;
