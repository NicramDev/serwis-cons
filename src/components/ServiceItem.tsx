
import { CalendarClock } from 'lucide-react';
import { formatDate } from '../utils/data';

interface ServiceItemProps {
  id: string;
  name: string;
  type: 'vehicle' | 'device';
  date: Date | string;
  model: string;
  delay?: number;
}

const ServiceItem = ({ name, type, date, model, delay = 0 }: ServiceItemProps) => {
  const delayClass = `staggered-delay-${delay}`;
  
  // Ensure date is a proper Date object
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const daysRemaining = Math.ceil((dateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div 
      className={`flex items-center p-4 border-b border-border last:border-0 opacity-0 animate-fade-in ${delayClass}`}
    >
      <div className="icon-container shrink-0">
        <CalendarClock className="h-5 w-5" />
      </div>
      <div className="ml-4 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-primary inline-block px-2 py-0.5 bg-primary/10 rounded-full mb-1">
              {type === 'vehicle' ? 'Pojazd' : 'Urządzenie'}
            </span>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-muted-foreground">{model}</p>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${
              daysRemaining <= 7 ? 'text-red-500' : 'text-orange-500'
            }`}>
              {daysRemaining} dni pozostało
            </div>
            <p className="text-sm text-muted-foreground">{formatDate(dateObj)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;
