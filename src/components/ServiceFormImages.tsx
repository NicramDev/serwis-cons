
import React from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Maximize } from "lucide-react";

interface ServiceFormImagesProps {
  existingImages: string[];
  images: File[];
  handleImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeExistingImage: (index: number) => void;
  removeImage: (index: number) => void;
  openFullscreen: (url: string, e?: React.MouseEvent) => void;
}

const ServiceFormImages = ({
  existingImages,
  images,
  handleImagesChange,
  removeExistingImage,
  removeImage,
  openFullscreen
}: ServiceFormImagesProps) => {
  return (
    <div className="space-y-2">
      <FormLabel>Zdjęcia z serwisu/naprawy</FormLabel>
      <Input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={handleImagesChange}
        className="cursor-pointer"
      />
      
      {existingImages.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mt-4 mb-2">Istniejące zdjęcia:</p>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((imgUrl, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={imgUrl} 
                  alt={`Service image ${idx}`} 
                  className="h-20 w-20 object-cover rounded-md cursor-pointer"
                  onClick={() => openFullscreen(imgUrl)}
                />
                <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6 bg-black/40 hover:bg-black/60 text-white"
                    onClick={(e) => openFullscreen(imgUrl, e)}
                  >
                    <Maximize className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExistingImage(idx);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {images.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mt-4 mb-2">Nowe zdjęcia:</p>
          <div className="flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={URL.createObjectURL(img)} 
                  alt={`Service image ${idx}`} 
                  className="h-20 w-20 object-cover rounded-md cursor-pointer"
                  onClick={() => openFullscreen(URL.createObjectURL(img))}
                />
                <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6 bg-black/40 hover:bg-black/60 text-white"
                    onClick={(e) => openFullscreen(URL.createObjectURL(img), e)}
                  >
                    <Maximize className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(idx);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceFormImages;
