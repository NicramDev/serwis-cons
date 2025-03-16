
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Vehicle } from "../utils/types";

const vehicleSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  type: z.enum(["car", "truck", "motorcycle", "other"]),
  model: z.string().min(1, "Model jest wymagany"),
  year: z.coerce.number().int().min(1900, "Rok musi być większy niż 1900").max(new Date().getFullYear() + 1, "Rok nie może być przyszły"),
  registrationNumber: z.string().min(1, "Numer rejestracyjny jest wymagany"),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

type AddVehicleFormProps = {
  onSubmit: (vehicle: Partial<Vehicle>) => void;
  onCancel: () => void;
};

const AddVehicleForm = ({ onSubmit, onCancel }: AddVehicleFormProps) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: "",
      type: "car",
      model: "",
      year: new Date().getFullYear(),
      registrationNumber: "",
    },
  });

  const handleSubmit = (values: VehicleFormValues) => {
    const now = new Date();
    const nextServiceDate = new Date();
    nextServiceDate.setMonth(now.getMonth() + 6);
    
    const newVehicle: Partial<Vehicle> = {
      ...values,
      lastService: now,
      nextService: nextServiceDate,
      status: "ok",
    };
    
    onSubmit(newVehicle);
    toast.success("Pojazd został dodany pomyślnie");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa pojazdu</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz nazwę pojazdu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typ pojazdu</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ pojazdu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="car">Samochód</SelectItem>
                  <SelectItem value="truck">Ciężarówka</SelectItem>
                  <SelectItem value="motorcycle">Motocykl</SelectItem>
                  <SelectItem value="other">Inny</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit">
            Dodaj pojazd
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddVehicleForm;
