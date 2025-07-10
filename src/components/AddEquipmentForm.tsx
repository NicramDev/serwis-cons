import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Equipment, Vehicle } from "../utils/types";
import { X, Maximize, Image, Smartphone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateInput } from "@/components/ui/date-input";
import FullscreenViewer from "./FullscreenViewer";
import FileUploadField from "./vehicle-form/FileUploadField";
import { FileStorageService } from "../services/fileStorageService";
import { toast } from "sonner";

const equipmentSchema = z.object({
  vehicleId: z.string().optional(),
  name: z.string().min(1, "Nazwa jest wymagana"),
  brand: z.string().min(1, "Marka jest wymagana"),
  type: z.string().min(1, "Typ wyposażenia jest wymagany"),
  serialNumber: z.string().min(1, "Numer seryjny jest wymagany"),
  year: z.coerce.number().int().min(1900, "Rok musi być większy niż 1900").max(new Date().getFullYear() + 1, "Rok nie może być przyszły"),
  purchasePrice: z.coerce.number().min(0, "Cena nie może być ujemna").optional(),
  notes: z.string().optional(),
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

type AddEquipmentFormProps = {
  onSubmit: (equipment: Partial<Equipment>) => Promise<void>;
  onCancel: () => void;
  vehicles: Vehicle[];
  initialEquipment?: Equipment;
  isEditing?: boolean;
  selectedVehicleId?: string | null;
};

const AddEquipmentForm = ({ 
  onSubmit, 
  onCancel, 
  vehicles, 
  initialEquipment, 
  isEditing = false,
  selectedVehicleId 
}: AddEquipmentFormProps) => {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialEquipment?.thumbnail || null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialEquipment?.images || []);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<{ name: string; url: string; type: string; size: number }[]>(
    initialEquipment?.attachments || []
  );
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenImageSrc, setFullscreenImageSrc] = useState("");
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(initialEquipment?.purchaseDate);

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      vehicleId: initialEquipment?.vehicleId || selectedVehicleId || "",
      name: initialEquipment?.name || "",
      brand: initialEquipment?.brand || "",
      type: initialEquipment?.type || "",
      serialNumber: initialEquipment?.serialNumber || "",
      year: initialEquipment?.year || new Date().getFullYear(),
      purchasePrice: initialEquipment?.purchasePrice || undefined,
      notes: initialEquipment?.notes || "",
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (values: EquipmentFormValues) => {
    try {
      // Clean up values and handle undefined fields properly
      const processedValues = {
        ...values,
        vehicleId: values.vehicleId === "none" || values.vehicleId === "" ? null : values.vehicleId,
        purchaseDate,
        purchasePrice: values.purchasePrice || undefined,
        thumbnail: thumbnailPreview,
        images: imagePreviews,
        attachments: attachments,
        lastService: null,
        nextService: null,
        status: 'ok' as const,
      };
      
      console.log('Submitting equipment data:', processedValues);
      await onSubmit(processedValues);
      console.log('Equipment submitted successfully');
    } catch (error) {
      console.error('Error submitting equipment:', error);
      // Don't close the form on error - let the user try again
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFullscreen = (src: string) => {
    setFullscreenImageSrc(src);
    setIsFullscreenOpen(true);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Miniatura */}
          <div className="space-y-2">
            <FormLabel>Miniatura</FormLabel>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
                {thumbnailPreview ? (
                  <img 
                    src={thumbnailPreview} 
                    alt="Miniatura" 
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openFullscreen(thumbnailPreview)}
                  />
                ) : (
                  <Smartphone className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Wybierz zdjęcie dla miniatury wyposażenia
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa wyposażenia *</FormLabel>
                  <FormControl>
                    <Input placeholder="Wprowadź nazwę wyposażenia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marka *</FormLabel>
                  <FormControl>
                    <Input placeholder="Wprowadź markę" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ wyposażenia *</FormLabel>
                  <FormControl>
                    <Input placeholder="Wprowadź typ wyposażenia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numer seryjny *</FormLabel>
                  <FormControl>
                    <Input placeholder="Wprowadź numer seryjny" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rok produkcji</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Wprowadź rok" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cena zakupu (PLN)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Wprowadź cenę" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Data zakupu</FormLabel>
              <DateInput
                value={purchaseDate}
                onChange={setPurchaseDate}
                pastDatesOnly={true}
              />
            </div>

            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Przypisz do pojazdu</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz pojazd (opcjonalnie)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Brak przypisania</SelectItem>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({vehicle.registrationNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notatki</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Dodatkowe informacje o wyposażeniu"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Zdjęcia */}
          <div className="space-y-2">
            <FormLabel>Zdjęcia</FormLabel>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Zdjęcie ${index + 1}`}
                      className="w-full h-20 object-cover rounded cursor-pointer"
                      onClick={() => openFullscreen(src)}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Załączniki */}
          <div className="space-y-2">
            <FormLabel>Dokumenty i załączniki</FormLabel>
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setAttachmentFiles(prev => [...prev, ...files]);
                files.forEach(file => {
                  setAttachments(prev => [...prev, {
                    name: file.name,
                    url: URL.createObjectURL(file),
                    type: file.type,
                    size: file.size
                  }]);
                });
              }}
            />
            <p className="text-xs text-muted-foreground">
              Obsługiwane formaty: PDF, DOC, DOCX
            </p>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
              <FormLabel>Załączone dokumenty</FormLabel>
              <div className="space-y-1">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Anuluj
            </Button>
            <Button type="submit">
              {isEditing ? 'Zapisz zmiany' : 'Dodaj wyposażenie'}
            </Button>
          </div>
        </form>
      </Form>

      {isFullscreenOpen && (
        <FullscreenViewer
          url={fullscreenImageSrc}
          onClose={() => setIsFullscreenOpen(false)}
        />
      )}
    </>
  );
};

export default AddEquipmentForm;