
import { useState } from 'react';
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FileInfo {
  name: string;
  type: string;
  size: number;
  url: string;
}

interface FileUploadFieldProps {
  label: string;
  onChange: (files: File[]) => void;
  files: File[];
  accept?: string;
  multiple?: boolean;
  existingFiles?: FileInfo[];
  onRemoveExisting?: (index: number) => void;
  onRemove?: (index: number) => void;
  isImage?: boolean;
}

const FileUploadField = ({ 
  label, 
  onChange, 
  files, 
  accept, 
  multiple = false, 
  existingFiles = [],
  onRemoveExisting,
  onRemove,
  isImage = false
}: FileUploadFieldProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <Input 
        type="file" 
        multiple={multiple} 
        accept={accept} 
        onChange={handleChange}
        className="cursor-pointer"
      />
      
      {isImage && (existingFiles.length > 0 || files.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {existingFiles && existingFiles.map((file, idx) => (
            <div key={`existing-${idx}`} className="relative">
              <img 
                src={file.url} 
                alt={`Preview ${idx}`} 
                className="h-20 w-20 object-cover rounded-md"
              />
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(idx)}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 h-6 w-6 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          
          {files.map((file, idx) => (
            <div key={`new-${idx}`} className="relative">
              <img 
                src={URL.createObjectURL(file)} 
                alt={`Preview ${idx}`} 
                className="h-20 w-20 object-cover rounded-md"
              />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 h-6 w-6 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadField;

