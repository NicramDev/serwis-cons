
import React from 'react';
import { Bell } from 'lucide-react';

const EmptyNotifications = () => {
  return (
    <div className="glass-card rounded-xl p-12 text-center">
      <div className="icon-container mx-auto mb-4">
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Brak powiadomień</h3>
      <p className="text-muted-foreground">
        Nie masz żadnych aktywnych powiadomień. Powiadomienia pojawią się, gdy zbliżą się terminy przeglądów, ubezpieczeń lub serwisów pojazdów i urządzeń.
      </p>
    </div>
  );
};

export default EmptyNotifications;
