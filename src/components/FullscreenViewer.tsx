
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullscreenViewerProps {
  url: string;
  onClose: () => void;
  type?: 'image' | 'pdf' | 'auto';
}

const FullscreenViewer = ({ url, onClose, type = 'auto' }: FullscreenViewerProps) => {
  // Określ typ pliku na podstawie rozszerzenia, jeśli typ jest ustawiony na auto
  const determineType = () => {
    if (type !== 'auto') return type;
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    return 'image'; // domyślnie traktuj jako obraz
  };

  const fileType = determineType();

  // Dodaj obsługę klawisza Escape do zamykania podglądu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-in fade-in">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white border-none"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center">
        {fileType === 'pdf' ? (
          <iframe 
            src={url} 
            className="w-full h-full" 
            title="PDF Viewer"
          />
        ) : (
          <img 
            src={url} 
            alt="Podgląd" 
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
          />
        )}
      </div>
    </div>
  );
};

export default FullscreenViewer;
