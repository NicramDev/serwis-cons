
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DateInput } from "@/components/ui/date-input";
import { UseFormReturn } from "react-hook-form";

interface VehicleDateFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  pastDatesOnly?: boolean;
}

const VehicleDateField = ({ form, name, label, pastDatesOnly = false }: VehicleDateFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DateInput
              value={field.value}
              onChange={field.onChange}
              pastDatesOnly={pastDatesOnly}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VehicleDateField;
