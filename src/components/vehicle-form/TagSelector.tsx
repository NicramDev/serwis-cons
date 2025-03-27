import { useState, useRef, useEffect } from "react";
import { Check, Palette, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const TAG_COLORS = [
  { name: "blue", value: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  { name: "red", value: "bg-red-100 text-red-800 hover:bg-red-200" },
  { name: "green", value: "bg-green-100 text-green-800 hover:bg-green-200" },
  { name: "purple", value: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  { name: "yellow", value: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
  { name: "indigo", value: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200" },
  { name: "pink", value: "bg-pink-100 text-pink-800 hover:bg-pink-200" },
  { name: "orange", value: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
  { name: "gray", value: "bg-gray-100 text-gray-800 hover:bg-gray-200" },
  { name: "cyan", value: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200" },
];

interface TagSelectorProps {
  value: string;
  onChange: (value: string) => void;
  availableTags?: string[];
  autoFocus?: boolean;
}

const TagSelector = ({ value, onChange, availableTags = [], autoFocus = false }: TagSelectorProps) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);
  const colorButtonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (value) {
      setSelectedTags(value.split(",").map(tag => tag.trim()).filter(tag => tag !== ""));
    } else {
      setSelectedTags([]);
    }
  }, [value]);
  
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        openTagCreator();
      }, 100);
    }
  }, [autoFocus]);
  
  const extractTagSuggestions = () => {
    const suggestions: { name: string; color: string }[] = [];
    availableTags.forEach(tag => {
      const [name, color] = tag.split(':');
      if (name && !suggestions.some(s => s.name === name.trim())) {
        suggestions.push({ 
          name: name.trim(), 
          color: color ? color.trim() : 'blue' 
        });
      }
    });
    return suggestions;
  };
  
  const tagSuggestions = extractTagSuggestions();
  
  const handleAddTag = () => {
    if (!inputValue.trim()) {
      return;
    }
    
    const newTag = `${inputValue.trim()}:${selectedColor}`;
    
    if (selectedTags.some(tag => tag.split(':')[0].trim() === inputValue.trim())) {
      toast({
        title: "Tag już istnieje",
        description: "Ten tag jest już dodany do pojazdu.",
        variant: "destructive",
      });
      return;
    }
    
    const newTags = [...selectedTags, newTag];
    setSelectedTags(newTags);
    onChange(newTags.join(", "));
    
    setInputValue("");
    setSelectedColor("blue");
    setIsDialogOpen(false);
    setIsColorPickerOpen(false);
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    onChange(newTags.join(", "));
  };
  
  const handleSelectSuggestion = (suggestion: { name: string; color: string }) => {
    setInputValue(suggestion.name);
    setSelectedColor(suggestion.color);
  };
  
  const renderTagBadges = () => {
    return selectedTags.map((tag, index) => {
      const [name, color] = tag.split(':');
      const colorClass = getTagColorClass(color || 'blue');
      
      return (
        <Badge 
          key={index} 
          className={`${colorClass} rounded-md px-2 py-1 text-xs font-medium mr-1 mb-1`}
        >
          {name}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
            onClick={() => handleRemoveTag(tag)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    });
  };
  
  const getTagColorClass = (colorName: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      red: "bg-red-100 text-red-800 hover:bg-red-200",
      green: "bg-green-100 text-green-800 hover:bg-green-200",
      purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      indigo: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      pink: "bg-pink-100 text-pink-800 hover:bg-pink-200",
      orange: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      gray: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      cyan: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    };
    
    return colorMap[colorName] || colorMap.blue;
  };
  
  const openTagCreator = () => {
    setIsDialogOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  
  const openColorPicker = (e?: React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsColorPickerOpen(true);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddTag();
      }
    } else if (e.key === 'Escape') {
      setIsDialogOpen(false);
      setIsColorPickerOpen(false);
    } else if ((e.key === 'c' && (e.ctrlKey || e.metaKey)) || (e.key === 'p' && (e.ctrlKey || e.metaKey))) {
      openColorPicker(e);
    }
  };
  
  const handleColorButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsColorPickerOpen(!isColorPickerOpen);
    }
  };
  
  return (
    <div className="space-y-2" onKeyDown={handleKeyDown}>
      <div className="flex flex-wrap gap-1 border rounded-md p-2 min-h-10">
        {selectedTags.length > 0 ? (
          renderTagBadges()
        ) : (
          <div className="text-muted-foreground text-sm p-1">Brak tagów</div>
        )}
        
        <Button 
          ref={popoverTriggerRef}
          variant="outline" 
          size="sm" 
          className="h-6 text-xs px-2 rounded-full border-dashed border-muted-foreground/50 gap-1"
          onClick={openTagCreator}
          aria-label="Dodaj tag"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Dodaj tag</span>
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Stwórz nowy tag</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="font-medium text-sm">Nazwa tagu</div>
                <Input
                  ref={inputRef}
                  placeholder="Wpisz nazwę tagu"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="h-8"
                  autoFocus
                />
                
                {tagSuggestions.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs text-muted-foreground mb-1">Sugestie tagów:</div>
                    <div className="flex flex-wrap gap-1">
                      {tagSuggestions.slice(0, 6).map((suggestion, idx) => (
                        <Badge 
                          key={idx}
                          className={`${getTagColorClass(suggestion.color)} cursor-pointer`}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          tabIndex={0}
                          role="button"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectSuggestion(suggestion);
                            }
                          }}
                        >
                          {suggestion.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">Kolor tagu</div>
                  <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        ref={colorButtonRef}
                        variant="outline" 
                        size="sm"
                        className="h-7 gap-1 px-2"
                        aria-label="Wybierz kolor tagu"
                        onKeyDown={handleColorButtonKeyDown}
                      >
                        <div className={`w-4 h-4 rounded-full ${getTagColorClass(selectedColor)}`} />
                        <Palette className="h-3.5 w-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="end">
                      <div className="flex flex-wrap gap-1" role="listbox" aria-label="Wybierz kolor">
                        {TAG_COLORS.map((color) => (
                          <Button
                            key={color.name}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`h-8 px-2 ${color.value} ${selectedColor === color.name ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => {
                              setSelectedColor(color.name);
                              setIsColorPickerOpen(false);
                            }}
                            tabIndex={0}
                            role="option"
                            aria-selected={selectedColor === color.name}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedColor(color.name);
                                setIsColorPickerOpen(false);
                              }
                            }}
                          >
                            {color.name}
                            {selectedColor === color.name && (
                              <Check className="h-4 w-4 ml-1" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className={`w-full h-8 rounded-md ${getTagColorClass(selectedColor)} flex items-center justify-center`}>
                  {inputValue ? inputValue : "Podgląd tagu"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Skrót: Ctrl+P lub Command+P aby otworzyć paletę kolorów
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Anuluj
                </Button>
              </DialogClose>
              <Button 
                type="button"
                onClick={handleAddTag}
                disabled={!inputValue.trim()}
              >
                Stwórz tag
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TagSelector;
