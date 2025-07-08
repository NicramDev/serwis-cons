
import React, { useState, useRef, useEffect } from 'react';
import { Search, Tag, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Vehicle, Device } from '@/utils/types';

interface VehicleSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddVehicle: () => void;
  availableTags?: string[];
  selectedTags?: string[];
  onTagSelect?: (tag: string) => void;
  vehicles?: Vehicle[];
  devices?: Device[];
  onCommandSelect?: (command: string) => void;
}

const VehicleSearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onAddVehicle,
  availableTags = [],
  selectedTags = [],
  onTagSelect,
  vehicles = [],
  devices = [],
  onCommandSelect
}: VehicleSearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Check if input starts with command
  const isCommand = searchQuery.startsWith(':');
  
  // Parse command suggestions
  const getCommandSuggestions = () => {
    if (!isCommand) return [];
    
    const query = searchQuery.slice(1).toLowerCase();
    const suggestions = [];
    
    if ('szukaj-urządzenia'.includes(query) && query.length > 0) {
      suggestions.push({
        type: 'command',
        text: ':szukaj-urządzenia',
        description: 'Szukaj urządzeń w całej flocie'
      });
    }
    
    if ('szukaj-w'.includes(query) && query.length > 0) {
      suggestions.push({
        type: 'command', 
        text: ':szukaj-w',
        description: 'Szukaj urządzeń w konkretnym pojeździe'
      });
    }
    
    // If it's szukaj-w command, suggest vehicles
    if (query.startsWith('szukaj-w ')) {
      const vehicleQuery = query.replace('szukaj-w ', '').toLowerCase();
      vehicles.forEach(vehicle => {
        if (vehicle.name.toLowerCase().includes(vehicleQuery) || 
            vehicle.registrationNumber?.toLowerCase().includes(vehicleQuery)) {
          suggestions.push({
            type: 'vehicle',
            text: `:szukaj-w ${vehicle.name}`,
            description: `Szukaj w ${vehicle.name} (${vehicle.registrationNumber})`
          });
        }
      });
    }
    
    return suggestions;
  };
  
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
  
  const commandSuggestions = getCommandSuggestions();
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setShowSuggestions(value.startsWith(':') && value.length > 1);
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    onSearchChange(suggestion.text);
    setShowSuggestions(false);
    if (onCommandSelect) {
      onCommandSelect(suggestion.text);
    }
  };
  
  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mt-6 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Wyszukiwarka"
          className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 w-full shadow-sm backdrop-blur-sm bg-white/60"
          value={searchQuery}
          onChange={handleInputChange}
        />
        
        {/* Command suggestions */}
        {showSuggestions && commandSuggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 bg-white border border-border rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto"
          >
            {commandSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-accent cursor-pointer border-b border-border/50 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="font-medium text-sm">{suggestion.text}</div>
                <div className="text-xs text-muted-foreground">{suggestion.description}</div>
              </div>
            ))}
          </div>
        )}
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
      
      <Button 
        className="flex items-center justify-center space-x-2 shadow-sm"
        onClick={onAddVehicle}
      >
        <PlusCircle className="h-5 w-5" />
        <span>Dodaj Pojazd</span>
      </Button>
    </div>
  );
};

export default VehicleSearchBar;
