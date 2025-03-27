import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import VehicleDateField from "./VehicleDateField";
import TagSelector from "./TagSelector";

interface VehicleBasicFieldsProps {
  form: UseFormReturn<any>;
  availableTags?: string[];
}

const VehicleBasicFields = ({ form, availableTags = [] }: VehicleBasicFieldsProps) => {
  return (
    <>
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
      </div>
      
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
      
      <VehicleDateField 
        form={form}
        name="purchaseDate"
        label="Data zakupu"
        pastDatesOnly={true}
      />
      
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
            <FormLabel>Tagi</FormLabel>
            <FormControl>
              <TagSelector 
                value={field.value || ""} 
                onChange={field.onChange}
                availableTags={availableTags} 
              />
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
    </>
  );
};

export default VehicleBasicFields;
