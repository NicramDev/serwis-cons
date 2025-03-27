
import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Tag {
  name: string;
  color: string;
}

interface TagSelectorProps {
  value: string;
  onChange: (value: string) => void;
  availableTags?: string[];
}

const TagSelector = ({ value, onChange, availableTags = [] }: TagSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  
  // Parse the comma-separated string into an array of tag objects
  const parseTags = (tagsString: string): Tag[] => {
    if (!tagsString) return [];
    
    return tagsString.split(',').map(tagInfo => {
      const parts = tagInfo.trim().split(':');
      return {
        name: parts[0].trim(),
        color: parts.length > 1 ? parts[1].trim() : 'blue'
      };
    });
  };
  
  // Convert tag objects back to a comma-separated string
  const stringifyTags = (tags: Tag[]): string => {
    return tags.map(tag => `${tag.name}:${tag.color}`).join(',');
  };
  
  const tags = parseTags(value);
  
  // Parse available tags from other vehicles
  const parseAvailableTags = (): Tag[] => {
    if (!availableTags || availableTags.length === 0) return [];
    
    return availableTags.map(tagInfo => {
      const parts = tagInfo.trim().split(':');
      return {
        name: parts[0].trim(),
        color: parts.length > 1 ? parts[1].trim() : 'blue'
      };
    });
  };
  
  // Filter out tags that are already selected
  const getUnusedTags = (): Tag[] => {
    const existingTagNames = tags.map(tag => tag.name.toLowerCase());
    return parseAvailableTags().filter(tag => 
      !existingTagNames.includes(tag.name.toLowerCase()) && 
      tag.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  
  // Update suggestions when input changes
  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      return;
    }
    
    setSuggestions(getUnusedTags());
  }, [inputValue, availableTags, value]);
  
  const handleAddTag = () => {
    if (!inputValue.trim()) return;
    
    const newTag: Tag = {
      name: inputValue.trim(),
      color: selectedColor
    };
    
    const newTags = [...tags, newTag];
    onChange(stringifyTags(newTags));
    
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChange(stringifyTags(newTags));
  };
  
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleSelectSuggestion = (tag: Tag) => {
    const newTags = [...tags, tag];
    onChange(stringifyTags(newTags));
    setInputValue("");
    setOpen(false);
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
      cyan: "bg-cyan-100 text-cyan-800 border-cyan-200"
    };
    
    return colorMap[colorName] || colorMap.blue;
  };
  
  console.log("Available tags:", availableTags);
  console.log("Current suggestions:", suggestions);
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 p-2 min-h-12 border rounded-md">
        {tags.length === 0 ? (
          <div className="text-muted-foreground text-sm py-1">Brak tagów</div>
        ) : (
          tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`font-normal ${getTagColorClasses(tag.color)}`}
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="ml-1 rounded-full hover:bg-gray-200/70 inline-flex items-center justify-center w-4 h-4"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
      
      <div className="flex flex-col space-y-2">
        <ToggleGroup type="single" value={selectedColor} onValueChange={(value) => value && setSelectedColor(value)}>
          <ToggleGroupItem value="blue" className={`${getTagColorClasses('blue')} h-6 w-6 p-0 rounded-full`} />
          <ToggleGroupItem value="green" className={`${getTagColorClasses('green')} h-6 w-6 p-0 rounded-full`} />
          <ToggleGroupItem value="purple" className={`${getTagColorClasses('purple')} h-6 w-6 p-0 rounded-full`} />
          <ToggleGroupItem value="yellow" className={`${getTagColorClasses('yellow')} h-6 w-6 p-0 rounded-full`} />
          <ToggleGroupItem value="pink" className={`${getTagColorClasses('pink')} h-6 w-6 p-0 rounded-full`} />
          <ToggleGroupItem value="indigo" className={`${getTagColorClasses('indigo')} h-6 w-6 p-0 rounded-full`} />
          <ToggleGroupItem value="red" className={`${getTagColorClasses('red')} h-6 w-6 p-0 rounded-full`} />
          <ToggleGroupItem value="orange" className={`${getTagColorClasses('orange')} h-6 w-6 p-0 rounded-full`} />
          <ToggleGroupItem value="teal" className={`${getTagColorClasses('teal')} h-6 w-6 p-0 rounded-full`} />
          <ToggleGroupItem value="cyan" className={`${getTagColorClasses('cyan')} h-6 w-6 p-0 rounded-full`} />
        </ToggleGroup>
        
        <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
          <div className="flex gap-2">
            <PopoverTrigger asChild>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Wpisz nazwę tagu..."
                className="flex-1"
                onClick={() => setOpen(true)}
              />
            </PopoverTrigger>
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={handleAddTag}
              disabled={!inputValue.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>Brak sugestii tagów</CommandEmpty>
                <CommandGroup heading="Istniejące tagi">
                  {suggestions.map((tag, index) => (
                    <CommandItem
                      key={index}
                      value={tag.name}
                      onSelect={() => handleSelectSuggestion(tag)}
                      className="cursor-pointer"
                    >
                      <Badge 
                        variant="outline" 
                        className={`mr-2 ${getTagColorClasses(tag.color)}`}
                      >
                        {tag.name}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TagSelector;
