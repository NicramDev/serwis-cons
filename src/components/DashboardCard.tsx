
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  value: string | number;
  trend?: { value: number; label: string };
  className?: string;
  delay?: number;
}

const DashboardCard = ({ title, icon, value, trend, className, delay = 0 }: DashboardCardProps) => {
  const delayClass = `staggered-delay-${delay}`;
  
  return (
    <div 
      className={`glass-card p-6 rounded-xl opacity-0 animate-fade-in ${delayClass} ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="icon-container">{icon}</div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.value >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-sm font-medium text-foreground/60">{title}</h3>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
};

export default DashboardCard;
