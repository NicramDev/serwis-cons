
import { useState, useRef, useEffect } from "react";
import { Check, Palette, Plus, Tag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

const TAG_COLORS = [
  { name: "blue", value: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  { name: "red", value: "bg-red-100 text-red-800 hover:bg-red-200" },
  { name: "green", value: "bg-green-100 text-green-800 hover:bg-green-200" },
  { name: "purple", value: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  { name: "yellow", value: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
  { name: "indigo", value: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200" },
  { name: "pink", value: "bg-pink-100 text-pink-800 hover:bg-pink-200" },
  { name: "orange", value: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
  { name: "cyan", value: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200" },
  { name: "gray", value: "bg-gray-100 text-gray-800 hover:bg-gray-200" },
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
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [colorIndex, setColorIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (value) {
      setSelectedTags(value.split(",").map(tag => tag.trim()).filter(tag => tag !== ""));
    } else {
      setSelectedTags([]);
    }
    
    // Set initial color index based on how many tags already exist
    if (value) {
      const tagsCount = value.split(",").filter(tag => tag.trim() !== "").length;
      setColorIndex(tagsCount % TAG_COLORS.length);
    }
  }, [value]);
  
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
  
  // Get the next color in the rotation
  const getNextColor = () => {
    const nextColor = TAG_COLORS[colorIndex].name;
    setColorIndex((colorIndex + 1) % TAG_COLORS.length);
    return nextColor;
  };
  
  const handleAddTag = () => {
    if (!inputValue.trim()) {
      return;
    }
    
    // Use the currently selected color or get the next one in rotation
    const tagColor = isColorPickerOpen ? selectedColor : getNextColor();
    const newTag = `${inputValue.trim()}:${tagColor}`;
    
    if (selectedTags.some(tag => tag.split(':')[0].trim() === inputValue.trim())) {
      toast("Tag już istnieje", {
        description: "Ten tag jest już dodany do pojazdu.",
      });
      return;
    }
    
    const newTags = [...selectedTags, newTag];
    setSelectedTags(newTags);
    onChange(newTags.join(", "));
    
    setInputValue("");
    setSelectedColor("blue");
    setIsColorPickerOpen(false);
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    onChange(newTags.join(", "));
  };
  
  const handleSelectSuggestion = (suggestion: { name: string; color: string }) => {
    const newTag = `${suggestion.name}:${suggestion.color}`;
    
    if (selectedTags.some(tag => tag.split(':')[0].trim() === suggestion.name)) {
      return;
    }
    
    const newTags = [...selectedTags, newTag];
    setSelectedTags(newTags);
    onChange(newTags.join(", "));
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
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 border rounded-md p-2 min-h-10">
        {selectedTags.length > 0 ? (
          renderTagBadges()
        ) : (
          <div className="text-muted-foreground text-sm p-1">Brak tagów</div>
        )}
        
        {tagSuggestions.length > 0 && (
          <div className="w-full mt-2">
            <div className="text-xs text-muted-foreground mb-1">Wybierz tag:</div>
            <div className="flex flex-wrap gap-1">
              {tagSuggestions.map((suggestion, idx) => (
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
        
        <div className="w-full flex items-center mt-2 gap-2">
          <Input
            ref={inputRef}
            placeholder="Wpisz nazwę tagu"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-8 flex-grow"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                e.preventDefault();
                handleAddTag();
              }
            }}
            autoFocus={autoFocus}
          />
          
          <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 gap-1 px-2"
                aria-label="Wybierz kolor tagu"
              >
                <div className={`w-4 h-4 rounded-full ${getTagColorClass(selectedColor)}`} />
                <Palette className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <div className="grid grid-cols-5 gap-1" role="listbox" aria-label="Wybierz kolor">
                {TAG_COLORS.map((color) => (
                  <Button
                    key={color.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 p-0 flex items-center justify-center ${color.value} ${selectedColor === color.name ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setIsColorPickerOpen(false);
                    }}
                    tabIndex={0}
                    role="option"
                    aria-selected={selectedColor === color.name}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            type="button"
            size="sm"
            className="h-8"
            onClick={handleAddTag}
            disabled={!inputValue.trim()}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Dodaj
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TagSelector;
