
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import VehicleDateField from "./VehicleDateField";
import ReminderField from "./ReminderField";

interface ReminderSectionProps {
  form: UseFormReturn<any>;
  type: 'insurance' | 'inspection' | 'service';
  title: string;
  useInputs?: boolean;
}

const ReminderSection = ({ form, type, title, useInputs = false }: ReminderSectionProps) => {
  const dateName = `${type}ExpiryDate`;
  const reminderName = `${type}ReminderDays`;
  
  const reminderLabels = {
    insurance: "Ustaw ile dni przed wygaśnięciem ubezpieczenia chcesz otrzymać przypomnienie",
    inspection: "Ustaw ile dni przed wygaśnięciem przeglądu chcesz otrzymać przypomnienie",
    service: "Ustaw ile dni przed terminem serwisu chcesz otrzymać przypomnienie"
  };
  
  return (
    <div className="space-y-4 p-4 border border-border rounded-md bg-secondary/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VehicleDateField 
          form={form}
          name={dateName}
          label={title}
        />
        
        <ReminderField
          form={form}
          name={reminderName}
          label="Przypomnienie przed wygaśnięciem"
          tooltipText={reminderLabels[type]}
          useInput={useInputs}
        />
      </div>
    </div>
  );
};

export default ReminderSection;
