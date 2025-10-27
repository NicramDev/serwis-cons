import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseDeviceToDevice } from '@/utils/supabaseMappers';
import { mapSupabaseVehicleEquipmentToVehicleEquipment } from '@/utils/supabaseMappers';
import { Device, VehicleEquipment } from '@/utils/types';
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, History, MessageSquare } from "lucide-react";
import InventoryHistoryDialog from './InventoryHistoryDialog';

interface ControlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId?: string;
}

type ItemStatus = 'present' | 'missing' | 'unchecked';

interface ControlItem {
  id: string;
  name: string;
  brandType: string;
  quantity: number;
  checked: boolean;
  status: ItemStatus;
  notes: string;
  type: 'device' | 'equipment';
}

const ControlDialog = ({ open, onOpenChange, vehicleId }: ControlDialogProps) => {
  const [items, setItems] = useState<ControlItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkedBy, setCheckedBy] = useState('');
  const [location, setLocation] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [itemNoteId, setItemNoteId] = useState<string | null>(null);
  const { toast } = useToast();

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
          status: 'unchecked' as ItemStatus,
          notes: '',
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
          status: 'unchecked' as ItemStatus,
          notes: '',
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
        item.id === id ? { 
          ...item, 
          checked,
          status: checked ? 'present' : 'unchecked'
        } : item
      )
    );
  };

  const handleStatusChange = (id: string, status: ItemStatus) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { 
          ...item, 
          status,
          checked: status !== 'unchecked'
        } : item
      )
    );
  };

  const handleItemNoteChange = (id: string, notes: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  const handleSelectAll = () => {
    setItems(prev => prev.map(item => ({ ...item, checked: true, status: 'present' as ItemStatus })));
  };

  const saveInventoryCheck = async () => {
    if (!vehicleId || !checkedBy.trim()) {
      toast({
        title: "Błąd",
        description: "Proszę uzupełnić osobę kontrolującą",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('inventory_checks')
        .insert({
          vehicle_id: vehicleId,
          checked_by: checkedBy,
          location: location || null,
          items_data: items as any,
          notes: generalNotes || null,
        });

      if (error) throw error;

      toast({
        title: "Sukces",
        description: "Kontrola została zapisana",
      });

      // Reset form
      setCheckedBy('');
      setLocation('');
      setGeneralNotes('');
      loadControlItems();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving inventory check:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać kontroli",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const checkedCount = items.filter(item => item.checked).length;
  const totalCount = items.length;
  const missingCount = items.filter(item => item.status === 'missing').length;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Kontrola - Zestawienie urządzeń i wyposażenia</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowHistory(true)}
              >
                <History className="h-4 w-4 mr-2" />
                Historia
              </Button>
            </DialogTitle>
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
            <>
              <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                <div>
                  <Label htmlFor="checked-by">Osoba kontrolująca *</Label>
                  <Input
                    id="checked-by"
                    value={checkedBy}
                    onChange={(e) => setCheckedBy(e.target.value)}
                    placeholder="Imię i nazwisko"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Lokalizacja</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Np. warsztat, parking"
                  />
                </div>
                <div className="flex items-end">
                  <div className="text-sm space-y-1">
                    <div className="font-medium">Postęp kontroli</div>
                    <div className="text-muted-foreground">
                      {checkedCount}/{totalCount} sprawdzonych
                      {missingCount > 0 && (
                        <span className="text-destructive ml-2">
                          ({missingCount} brakujących)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2">
                <h3 className="font-semibold">Lista pozycji</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                >
                  Zaznacz wszystkie jako obecne
                </Button>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        item.status === 'present' 
                          ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900' 
                          : item.status === 'missing'
                          ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900'
                          : 'bg-card border-border hover:bg-accent/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground">{item.brandType}</div>
                          <div className="text-muted-foreground">Ilość: {item.quantity}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={item.status === 'present' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusChange(item.id, 'present')}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={item.status === 'missing' ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusChange(item.id, 'missing')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={item.notes ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setItemNoteId(itemNoteId === item.id ? null : item.id)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {itemNoteId === item.id && (
                        <div className="mt-3 pt-3 border-t">
                          <Label htmlFor={`note-${item.id}`} className="text-xs">Uwagi do pozycji</Label>
                          <Textarea
                            id={`note-${item.id}`}
                            value={item.notes}
                            onChange={(e) => handleItemNoteChange(item.id, e.target.value)}
                            placeholder="Dodaj uwagi..."
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="pt-4 border-t space-y-4">
                <div>
                  <Label htmlFor="general-notes">Uwagi ogólne</Label>
                  <Textarea
                    id="general-notes"
                    value={generalNotes}
                    onChange={(e) => setGeneralNotes(e.target.value)}
                    placeholder="Dodatkowe uwagi do kontroli..."
                    rows={3}
                  />
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Anuluj
                  </Button>
                  <Button onClick={saveInventoryCheck} disabled={saving}>
                    {saving ? 'Zapisywanie...' : 'Zapisz kontrolę'}
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <InventoryHistoryDialog
        open={showHistory}
        onOpenChange={setShowHistory}
        vehicleId={vehicleId}
      />
    </>
  );
};

export default ControlDialog;
