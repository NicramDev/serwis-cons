
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface ReminderFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  tooltipText: string;
  useInput?: boolean;
}

const ReminderField = ({ form, name, label, tooltipText, useInput = false }: ReminderFieldProps) => {
  const formatReminderDays = (days: number) => {
    if (days === 1) return "1 dzień";
    return `${days} dni`;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between mb-1">
            <FormLabel className="text-sm">{label}</FormLabel>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div><Info className="h-4 w-4 text-muted-foreground cursor-help" /></div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  {tooltipText}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {useInput ? (
            <FormControl>
              <Input 
                type="number" 
                min={1} 
                max={90} 
                step={1} 
                {...field} 
              />
            </FormControl>
          ) : (
            <div className="flex items-center gap-4">
              <FormControl className="flex-1">
                <Slider
                  value={[field.value]}
                  min={1}
                  max={90}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <span className="w-16 text-right text-sm">{formatReminderDays(field.value)}</span>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ReminderField;
