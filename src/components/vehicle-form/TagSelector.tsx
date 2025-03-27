
import { useState, useRef, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Tag {
  name: string;
  color: string;
}

interface TagSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TagSelector = ({ value, onChange }: TagSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  
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
        
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Wpisz nazwę tagu..."
            className="flex-1"
          />
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
      </div>
    </div>
  );
};

export default TagSelector;
