import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { pl } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DateInputProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: (date: Date) => boolean
  className?: string
  pastDatesOnly?: boolean
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onChange, placeholder = "Wybierz datę", disabled, className, pastDatesOnly = false }, ref) => {
    const [inputValue, setInputValue] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)

    // Update input value when value prop changes
    React.useEffect(() => {
      if (value) {
        setInputValue(format(value, "dd.MM.yyyy"))
      } else {
        setInputValue("")
      }
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)

      // Try to parse the date if it matches dd.MM.yyyy format
      if (newValue.length === 10) {
        try {
          const parsedDate = parse(newValue, "dd.MM.yyyy", new Date())
          if (isValid(parsedDate)) {
            // Check if date should be disabled
            if (disabled && disabled(parsedDate)) {
              return
            }
            // Check past dates only restriction
            if (pastDatesOnly && parsedDate > new Date()) {
              return
            }
            onChange(parsedDate)
          }
        } catch (error) {
          // Invalid date format, continue typing
        }
      }
    }

    const handleInputBlur = () => {
      // If input is empty, clear the date
      if (!inputValue.trim()) {
        onChange(undefined)
        return
      }

      // Try to parse the final input value
      try {
        const parsedDate = parse(inputValue, "dd.MM.yyyy", new Date())
        if (isValid(parsedDate)) {
          // Check if date should be disabled
          if (disabled && disabled(parsedDate)) {
            // Reset to previous valid value
            if (value) {
              setInputValue(format(value, "dd.MM.yyyy"))
            } else {
              setInputValue("")
              onChange(undefined)
            }
            return
          }
          // Check past dates only restriction (only reject future dates if pastDatesOnly is true)
          if (pastDatesOnly && parsedDate > new Date()) {
            // Reset to previous valid value
            if (value) {
              setInputValue(format(value, "dd.MM.yyyy"))
            } else {
              setInputValue("")
              onChange(undefined)
            }
            return
          }
          // If all validations pass, accept the date
          onChange(parsedDate)
        } else {
          // Invalid date, reset to previous valid value
          if (value) {
            setInputValue(format(value, "dd.MM.yyyy"))
          } else {
            setInputValue("")
            onChange(undefined)
          }
        }
      } catch (error) {
        // Reset to previous valid value
        if (value) {
          setInputValue(format(value, "dd.MM.yyyy"))
        } else {
          setInputValue("")
          onChange(undefined)
        }
      }
    }

    const handleCalendarSelect = (date: Date | undefined) => {
      onChange(date)
      setIsOpen(false)
    }

    return (
      <div className={cn("flex", className)}>
        <Input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="dd.mm.rrrr"
          className="rounded-r-none border-r-0"
          maxLength={10}
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-l-none px-3"
              type="button"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleCalendarSelect}
              disabled={(date) => {
                if (pastDatesOnly && date > new Date()) return true
                if (disabled) return disabled(date)
                return date < new Date("1900-01-01")
              }}
              initialFocus
              className="p-3 pointer-events-auto"
              locale={pl}
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

DateInput.displayName = "DateInput"

export { DateInput }