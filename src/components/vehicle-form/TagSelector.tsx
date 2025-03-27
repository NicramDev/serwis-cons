
import { useState, useRef, useEffect } from "react";
import { Check, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);
  
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
  
  // Extract unique tag names and colors from available tags
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
    
    // Reset
    setInputValue("");
    setSelectedColor("blue");
    setIsPopoverOpen(false);
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
  
  // Auto-open the popover when the component is focused
  const openTagCreator = () => {
    setIsPopoverOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddTag();
      }
    } else if (e.key === 'Escape') {
      setIsPopoverOpen(false);
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
        
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              ref={popoverTriggerRef}
              variant="outline" 
              size="sm" 
              className="h-6 text-xs px-2 rounded-full border-dashed border-muted-foreground/50 gap-1"
              onClick={openTagCreator}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Dodaj tag</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="start">
            <div className="space-y-4">
              {/* Name input */}
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
                        >
                          {suggestion.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Color selection */}
              <div className="space-y-2">
                <div className="font-medium text-sm">Wybierz kolor</div>
                <div className="grid grid-cols-5 gap-1">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      className={`w-8 h-8 rounded-md ${color.value} flex items-center justify-center cursor-pointer ${selectedColor === color.name ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedColor(color.name)}
                    >
                      {selectedColor === color.name && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-between pt-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsPopoverOpen(false)}
                >
                  Anuluj
                </Button>
                <Button 
                  type="button"
                  size="sm"
                  onClick={handleAddTag}
                  disabled={!inputValue.trim()}
                >
                  Stwórz tag
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TagSelector;
