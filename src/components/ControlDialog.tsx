import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseDeviceToDevice } from '@/utils/supabaseMappers';
import { mapSupabaseVehicleEquipmentToVehicleEquipment } from '@/utils/supabaseMappers';
import { Device, VehicleEquipment } from '@/utils/types';

interface ControlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId?: string;
}

interface ControlItem {
  id: string;
  name: string;
  brandType: string;
  quantity: number;
  checked: boolean;
  type: 'device' | 'equipment';
}

const ControlDialog = ({ open, onOpenChange, vehicleId }: ControlDialogProps) => {
  const [items, setItems] = useState<ControlItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && vehicleId) {
      loadControlItems();
    }
  }, [open, vehicleId]);

  const loadControlItems = async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    try {
      // Load devices
      const { data: devicesData, error: devicesError } = await supabase
        .from('devices')
        .select('*')
        .eq('vehicleid', vehicleId);

      if (devicesError) throw devicesError;

      // Load vehicle equipment
      const { data: equipmentData, error: equipmentError } = await supabase
        .from('vehicle_equipment')
        .select('*')
        .eq('vehicleid', vehicleId);

      if (equipmentError) throw equipmentError;

      const deviceItems: ControlItem[] = (devicesData || []).map((d: any) => {
        const device = mapSupabaseDeviceToDevice(d);
        return {
          id: device.id,
          name: device.name,
          brandType: `${device.brand || ''} ${device.type || ''}`.trim() || '-',
          quantity: 1,
          checked: false,
          type: 'device' as const,
        };
      });

      const equipmentItems: ControlItem[] = (equipmentData || []).map((e: any) => {
        const equipment = mapSupabaseVehicleEquipmentToVehicleEquipment(e);
        return {
          id: equipment.id,
          name: equipment.name,
          brandType: `${equipment.brand || ''} ${equipment.type || ''}`.trim() || '-',
          quantity: equipment.quantity || 1,
          checked: false,
          type: 'equipment' as const,
        };
      });

      setItems([...deviceItems, ...equipmentItems]);
    } catch (error) {
      console.error('Error loading control items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckChange = (id: string, checked: boolean) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Kontrola - Zestawienie urządzeń i wyposażenia</DialogTitle>
        </DialogHeader>

        {!vehicleId ? (
          <div className="text-center py-8 text-muted-foreground">
            Proszę najpierw wybrać pojazd
          </div>
        ) : loading ? (
          <div className="text-center py-8">Ładowanie...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Brak urządzeń i wyposażenia dla tego pojazdu
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground">{item.brandType}</div>
                    <div className="text-muted-foreground">Ilość: {item.quantity}</div>
                  </div>
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={(checked) => 
                      handleCheckChange(item.id, checked as boolean)
                    }
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ControlDialog;
