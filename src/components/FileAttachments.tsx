
import { FileText, FileImage, ExternalLink, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileInfo {
  name: string;
  type: string;
  size: number;
  url: string;
}

interface FileAttachmentsProps {
  attachments?: FileInfo[];
  images?: string[];
  itemName?: string;
  onOpenFullscreen: (url: string, e?: React.MouseEvent) => void;
  onOpenInNewTab: (url: string, e?: React.MouseEvent) => void;
}

const FileAttachments = ({ 
  attachments = [], 
  images = [], 
  itemName = '', 
  onOpenFullscreen, 
  onOpenInNewTab 
}: FileAttachmentsProps) => {
  if (attachments.length === 0 && images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {attachments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-foreground/80">Załączniki</h3>
          <div className="space-y-3">
            {attachments.map((file, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onOpenFullscreen(file.url)}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.type} • {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={(e) => onOpenFullscreen(file.url, e)}
                    className="text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 border-none"
                  >
                    <Maximize className="h-4 w-4 mr-1" />
                    Pełny ekran
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => onOpenInNewTab(file.url, e)}
                    className="text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 border-none"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Nowa karta
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {images.length > 0 && (
        <div className={attachments.length > 0 ? "mt-6" : ""}>
          <h3 className="text-lg font-semibold mb-3 text-foreground/80">Zdjęcia</h3>
          <div className="space-y-3">
            {images.map((imgUrl, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onOpenFullscreen(imgUrl)}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileImage className="h-5 w-5" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={imgUrl} 
                      alt={`${itemName ? itemName : ''} - zdjęcie ${idx + 1}`}
                      className="h-12 w-16 object-cover rounded-md"
                    />
                    <p className="font-medium">Zdjęcie {idx + 1}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={(e) => onOpenFullscreen(imgUrl, e)}
                    className="text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 border-none"
                  >
                    <Maximize className="h-4 w-4 mr-1" />
                    Pełny ekran
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => onOpenInNewTab(imgUrl, e)}
                    className="text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 border-none"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Nowa karta
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

export default FileAttachments;
