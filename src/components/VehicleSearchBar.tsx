
import React, { useState } from 'react';
import { Search, Tag, PlusCircle, ChevronDown, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VehicleSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddVehicle: () => void;
  onAddDevice?: () => void;
  availableTags?: string[];
  selectedTags?: string[];
  onTagSelect?: (tag: string) => void;
}

const VehicleSearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onAddVehicle,
  onAddDevice,
  availableTags = [],
  selectedTags = [],
  onTagSelect
}: VehicleSearchBarProps) => {
  const [open, setOpen] = useState(false);
  
  // Parse tags to get unique tag names and their colors
  const parseTagInfo = (tags: string[]) => {
    return tags.map(tagInfo => {
      const parts = tagInfo.split(':');
      return {
        name: parts[0].trim(),
        color: parts.length > 1 ? parts[1].trim() : 'blue'
      };
    });
  };

  const getTagColorClasses = (colorName: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      pink: "bg-pink-100 text-pink-800 border-pink-200",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
      red: "bg-red-100 text-red-800 border-red-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      teal: "bg-teal-100 text-teal-800 border-teal-200",
      cyan: "bg-cyan-100 text-cyan-800 border-cyan-200",
      gray: "bg-gray-100 text-gray-800 border-gray-200",
    };
    
    return colorMap[colorName] || colorMap.blue;
  };

  const parsedTags = parseTagInfo(availableTags);
  const uniqueTags = Array.from(new Set(parsedTags.map(tag => tag.name)));

  return (
    <div className="mt-6 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Szukaj pojazdów..."
          className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 w-full shadow-sm backdrop-blur-sm bg-white/60"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {onTagSelect && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
              <Tag className="h-4 w-4 mr-2" />
              <span>Tagi</span>
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-2 rounded-full px-1 font-normal">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Szukaj tagu..." />
              <CommandList>
                <CommandEmpty>Brak tagów</CommandEmpty>
                <CommandGroup heading="Dostępne tagi">
                  {uniqueTags.map((tag) => {
                    const isSelected = selectedTags.some(selectedTag => 
                      selectedTag.split(':')[0].trim() === tag
                    );
                    const matchingTags = parsedTags.filter(t => t.name === tag);
                    const tagColor = matchingTags.length > 0 ? matchingTags[0].color : 'blue';
                    
                    return (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => {
                          if (onTagSelect) {
                            onTagSelect(tag);
                          }
                        }}
                        className={cn(
                          "cursor-pointer",
                          isSelected && "bg-accent text-accent-foreground"
                        )}
                      >
                        <Badge 
                          variant="outline" 
                          className={`mr-2 ${getTagColorClasses(tagColor)}`}
                        >
                          {tag}
                        </Badge>
                        {isSelected && (
                          <span className="ml-auto">✓</span>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center justify-center space-x-2 shadow-sm">
            <PlusCircle className="h-5 w-5" />
            <span>Dodaj</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onAddVehicle} className="cursor-pointer">
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>Dodaj Pojazd</span>
          </DropdownMenuItem>
          {onAddDevice && (
            <DropdownMenuItem onClick={onAddDevice} className="cursor-pointer">
              <Laptop className="h-4 w-4 mr-2" />
              <span>Dodaj Urządzenie</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default VehicleSearchBar;
