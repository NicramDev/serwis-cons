import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateInput } from "@/components/ui/date-input";

type ServiceFormFieldsProps = {
  control: Control<any>;
};

const toRoman = (num: number): string => {
  const romanNumerals = [
    { value: 12, numeral: 'XII' },
    { value: 11, numeral: 'XI' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 8, numeral: 'VIII' },
    { value: 7, numeral: 'VII' },
    { value: 6, numeral: 'VI' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 3, numeral: 'III' },
    { value: 2, numeral: 'II' },
    { value: 1, numeral: 'I' }
  ];
  
  for (const { value, numeral } of romanNumerals) {
    if (num === value) {
      return numeral;
    }
  }
  return '';
};

const formatDateWithRomanMonth = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const romanMonth = toRoman(month);
  
  return `${day}.${romanMonth}.${year}`;
};

const ServiceFormFields = ({ control }: ServiceFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data serwisu/naprawy</FormLabel>
              <FormControl>
                <DateInput
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
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
          control={control}
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
                  <SelectItem value="replacement">Wymiana</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
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
        control={control}
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
        control={control}
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
    </>
  );
};

export default ServiceFormFields;
