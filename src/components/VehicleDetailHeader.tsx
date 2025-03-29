
import React from 'react';
import { Wrench, Cpu, FileText } from 'lucide-react';
import { Vehicle } from '../utils/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VehicleDetailHeaderProps {
  vehicle: Vehicle;
  showingServiceRecords: boolean;
  showingReports?: boolean;
  onServiceClick: () => void;
  onReportClick?: () => void;
}

const VehicleDetailHeader = ({ 
  vehicle, 
  showingServiceRecords, 
  showingReports = false,
  onServiceClick,
  onReportClick
}: VehicleDetailHeaderProps) => {
  const getActiveTab = () => {
    if (showingReports) return "reports";
    if (showingServiceRecords) return "service";
    return "devices";
  };

  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {vehicle.name}
        </h2>
        <p className="text-muted-foreground">{vehicle.brand || 'Brak marki'}</p>
      </div>
      <div className="flex space-x-2">
        <Tabs 
          value={getActiveTab()}
          className="w-auto"
          onValueChange={(value) => {
            if (value === "service" && !showingServiceRecords) {
              onServiceClick();
            } else if (value === "devices" && showingServiceRecords) {
              onServiceClick();
            } else if (value === "reports" && onReportClick) {
              onReportClick();
            }
          }}
        >
          <TabsList className="grid grid-cols-3 bg-[#ebe9e6]">
            <TabsTrigger 
              value="service" 
              className={`flex items-center gap-1 ${showingServiceRecords && !showingReports ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Wrench className="h-4 w-4" />
              Serwis
            </TabsTrigger>
            <TabsTrigger 
              value="devices" 
              className={`flex items-center gap-1 ${!showingServiceRecords && !showingReports ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Cpu className="h-4 w-4" />
              Urządzenia
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className={`flex items-center gap-1 ${showingReports ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <FileText className="h-4 w-4" />
              Zestawienia
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default VehicleDetailHeader;
