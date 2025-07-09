import React from 'react';
import { Equipment } from '../utils/types';
import { Edit, Trash2, Eye, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EquipmentCard from './EquipmentCard';

interface EquipmentListProps {
  equipment: Equipment[];
  onEditEquipment?: (equipment: Equipment) => void;
  onDeleteEquipment?: (equipment: Equipment) => void;
  onViewEquipment?: (equipment: Equipment) => void;
  onOpenAttachment?: (url: string) => void;
  onMoveEquipment?: (equipment: Equipment) => void;
}

const EquipmentList = ({ 
  equipment, 
  onEditEquipment, 
  onDeleteEquipment, 
  onViewEquipment,
  onOpenAttachment,
  onMoveEquipment
}: EquipmentListProps) => {
  if (equipment.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50 text-center">
        <p className="text-sm text-muted-foreground">Brak przypisanego wyposażenia do tego pojazdu.</p>
      </div>
    );
  }

  const sortedEquipment = [...equipment].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-3">
      {sortedEquipment.map(item => (
        <EquipmentCard 
          key={item.id}
          equipment={item}
          actions={
            <>
              {onViewEquipment && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onViewEquipment(item)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Podgląd
                </Button>
              )}
              {onMoveEquipment && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveEquipment(item);
                  }}
                >
                  <MoveRight className="h-3.5 w-3.5 mr-1" />
                  Przenieś
                </Button>
              )}
              {onEditEquipment && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onEditEquipment(item)}
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edytuj
                </Button>
              )}
              {onDeleteEquipment && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onDeleteEquipment(item)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Usuń
                </Button>
              )}
            </>
          }
          onAttachmentClick={onOpenAttachment}
        />
      ))}
    </div>
  );
};

export default EquipmentList;