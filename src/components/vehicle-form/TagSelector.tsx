
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Tag } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

type TagSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  availableTags?: string[];
};

type Tag = {
  name: string;
  color: string;
};

const TagSelector = ({ value, onChange, availableTags = [] }: TagSelectorProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("blue");
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [step, setStep] = useState<"name" | "color" | "complete">("name");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Parse current tags when value changes
  useEffect(() => {
    if (value) {
      const tagArray = value.split(',').map(tagStr => {
        const parts = tagStr.trim().split(':');
        return {
          name: parts[0].trim(),
          color: parts.length > 1 ? parts[1].trim() : 'blue'
        };
      });
      setTags(tagArray);
    } else {
      setTags([]);
    }
  }, [value]);
  
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
  
  // Update suggestions when input or available tags change
  useEffect(() => {
    const input = inputValue.toLowerCase();
    if (!input) {
      setSuggestions([]);
      return;
    }
    
    const availableTagObjects = parseAvailableTags();
    
    // Filter tags that match input and aren't already selected
    const filtered = availableTagObjects.filter(tag => 
      tag.name.toLowerCase().includes(input) && 
      !tags.some(t => t.name.toLowerCase() === tag.name.toLowerCase())
    );
    
    setSuggestions(filtered);
  }, [inputValue, availableTags, tags]);
  
  const updateTagString = (newTags: Tag[]) => {
    const tagString = newTags.map(tag => `${tag.name}:${tag.color}`).join(',');
    onChange(tagString);
  };
  
  const addTag = () => {
    if (!inputValue.trim()) return;
    
    // Check if tag already exists
    if (tags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase())) {
      setInputValue("");
      setStep("name");
      return;
    }
    
    const newTag = { name: inputValue, color: selectedColor };
    const newTags = [...tags, newTag];
    
    setTags(newTags);
    updateTagString(newTags);
    setInputValue("");
    setStep("name");
    setIsPopoverOpen(false);
    
    // Focus input again after adding
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  
  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    updateTagString(newTags);
  };
  
  const selectSuggestion = (suggestion: Tag) => {
    const newTags = [...tags, suggestion];
    setTags(newTags);
    updateTagString(newTags);
    setInputValue("");
    setSuggestions([]);
    setStep("name");
  };

  const handleNameSubmit = () => {
    if (inputValue.trim()) {
      setStep("color");
    }
  };
  
  const colorOptions = [
    { name: "blue", value: "blue" },
    { name: "green", value: "green" },
    { name: "purple", value: "purple" },
    { name: "yellow", value: "yellow" },
    { name: "pink", value: "pink" },
    { name: "red", value: "red" },
    { name: "orange", value: "orange" },
    { name: "teal", value: "teal" },
    { name: "cyan", value: "cyan" },
    { name: "indigo", value: "indigo" },
  ];
  
  const getTagColorClass = (colorName: string) => {
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
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <Badge 
            key={index} 
            className={`font-normal shadow-sm ${getTagColorClass(tag.color)}`}
            variant="outline"
          >
            {tag.name}
            <button 
              type="button"
              onClick={() => removeTag(index)} 
              className="ml-1 rounded-full hover:bg-gray-200/50 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        <Popover open={isPopoverOpen} onOpenChange={(open) => {
          setIsPopoverOpen(open);
          if (!open) {
            setStep("name");
            setInputValue("");
          }
        }}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 text-xs px-2 rounded-full border-dashed border-muted-foreground/50 gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Dodaj tag</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="start">
            <div className="space-y-3">
              <h4 className="font-medium">Dodaj nowy tag</h4>
              
              {step === "name" && (
                <>
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      placeholder="Nazwa tagu..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (suggestions.length > 0) {
                            selectSuggestion(suggestions[0]);
                          } else if (inputValue.trim()) {
                            handleNameSubmit();
                          }
                        }
                      }}
                      className="flex-1"
                      autoFocus
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={handleNameSubmit}
                      disabled={!inputValue.trim()}
                    >
                      Dalej
                    </Button>
                  </div>
                  
                  {suggestions.length > 0 && (
                    <div className="border rounded-md overflow-hidden mt-1">
                      <Command>
                        <CommandList>
                          <CommandGroup heading="Sugestie">
                            <ScrollArea className="h-[120px]">
                              {suggestions.map((suggestion, index) => (
                                <CommandItem
                                  key={index}
                                  onSelect={() => selectSuggestion(suggestion)}
                                  className="cursor-pointer"
                                >
                                  <Badge 
                                    className={`font-normal shadow-sm ${getTagColorClass(suggestion.color)}`}
                                    variant="outline"
                                  >
                                    {suggestion.name}
                                  </Badge>
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )}
                </>
              )}
              
              {step === "color" && (
                <>
                  <div className="flex items-center mb-2">
                    <Badge 
                      className={`font-normal shadow-sm mr-2 ${getTagColorClass(selectedColor)}`}
                      variant="outline"
                    >
                      {inputValue}
                    </Badge>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setStep("name")}
                      className="ml-auto text-xs h-7"
                    >
                      Wróć
                    </Button>
                  </div>
                
                  <div>
                    <h5 className="text-xs mb-1.5 text-muted-foreground">Wybierz kolor tagu</h5>
                    <ToggleGroup 
                      type="single" 
                      value={selectedColor}
                      onValueChange={(value) => value && setSelectedColor(value)}
                      className="flex flex-wrap gap-1 justify-start mb-3"
                    >
                      {colorOptions.map((color) => (
                        <ToggleGroupItem
                          key={color.value}
                          value={color.value}
                          size="sm"
                          className={`w-6 h-6 p-0 rounded-full ${getTagColorClass(color.value)}`}
                          aria-label={`Kolor ${color.name}`}
                        />
                      ))}
                    </ToggleGroup>
                    
                    <Button 
                      type="button" 
                      onClick={addTag} 
                      className="w-full mt-1"
                    >
                      Dodaj
                    </Button>
                  </div>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TagSelector;
