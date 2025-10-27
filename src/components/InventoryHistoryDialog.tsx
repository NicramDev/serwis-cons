import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/formatting/dateUtils";
import { CheckCircle2, XCircle, Eye, Calendar, User, MapPin } from "lucide-react";
import InventoryCheckDetails from './InventoryCheckDetails';

interface InventoryHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId?: string;
}

interface InventoryCheck {
  id: string;
  check_date: string;
  checked_by: string;
  location: string | null;
  items_data: any;
  notes: string | null;
  created_at: string;
  vehicle_id: string;
}

const InventoryHistoryDialog = ({ open, onOpenChange, vehicleId }: InventoryHistoryDialogProps) => {
  const [checks, setChecks] = useState<InventoryCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<InventoryCheck | null>(null);

  useEffect(() => {
    if (open && vehicleId) {
      loadHistory();
    }
  }, [open, vehicleId]);

  const loadHistory = async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_checks')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('check_date', { ascending: false });

      if (error) throw error;
      setChecks(data || []);
    } catch (error) {
      console.error('Error loading inventory history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCheckStats = (itemsData: any[]) => {
    const total = itemsData.length;
    const present = itemsData.filter(item => item.status === 'present').length;
    const missing = itemsData.filter(item => item.status === 'missing').length;
    return { total, present, missing };
  };

  if (selectedCheck) {
    return (
      <InventoryCheckDetails
        open={open}
        onOpenChange={onOpenChange}
        check={selectedCheck}
        onBack={() => setSelectedCheck(null)}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Historia kontroli</DialogTitle>
        </DialogHeader>

        {!vehicleId ? (
          <div className="text-center py-8 text-muted-foreground">
            Proszę najpierw wybrać pojazd
          </div>
        ) : loading ? (
          <div className="text-center py-8">Ładowanie...</div>
        ) : checks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Brak zapisanych kontroli dla tego pojazdu
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {checks.map((check) => {
                const stats = getCheckStats(check.items_data);
                const isComplete = stats.missing === 0 && stats.present === stats.total;
                
                return (
                  <div
                    key={check.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {formatDate(new Date(check.check_date))}
                          </span>
                          {isComplete ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{check.checked_by}</span>
                          </div>
                          {check.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{check.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span>
                            Sprawdzono: <strong>{stats.present}/{stats.total}</strong>
                          </span>
                          {stats.missing > 0 && (
                            <span className="text-destructive">
                              Brakujących: <strong>{stats.missing}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCheck(check)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Szczegóły
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InventoryHistoryDialog;
