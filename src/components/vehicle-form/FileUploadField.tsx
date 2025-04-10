
import { useState } from 'react';
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Maximize, Upload, Image, ImagePlus, Images } from "lucide-react";

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
  helpText?: string;
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
  isImage = false,
  helpText
}: FileUploadFieldProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onChange(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      
      {isImage ? (
        <div 
          className="border-2 border-dashed border-border rounded-md p-4 text-center hover:bg-muted/30 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById(`file-upload-${label.replace(/\s+/g, '-')}`)?.click()}
        >
          <input 
            id={`file-upload-${label.replace(/\s+/g, '-')}`}
            type="file" 
            multiple={multiple} 
            accept={accept} 
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center py-4">
            <Images className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">Przeciągnij i upuść lub kliknij, aby wybrać</p>
            {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
            {multiple && <p className="text-xs text-muted-foreground mt-1">Możesz wybrać wiele plików jednocześnie</p>}
          </div>
        </div>
      ) : (
        <Input 
          type="file" 
          multiple={multiple} 
          accept={accept} 
          onChange={handleChange}
          className="cursor-pointer"
        />
      )}
      
      {isImage && (existingFiles.length > 0 || files.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {existingFiles && existingFiles.map((file, idx) => (
            <div key={`existing-${idx}`} className="relative group">
              <img 
                src={file.url} 
                alt={`Preview ${idx}`} 
                className="h-20 w-20 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(idx)}
                    className="bg-destructive text-white rounded-full p-1 h-6 w-6 flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {files.map((file, idx) => (
            <div key={`new-${idx}`} className="relative group">
              <img 
                src={URL.createObjectURL(file)} 
                alt={`Preview ${idx}`} 
                className="h-20 w-20 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="bg-destructive text-white rounded-full p-1 h-6 w-6 flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadField;
