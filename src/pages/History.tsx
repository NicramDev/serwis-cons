
import { useState } from 'react';
import { serviceRecords } from '../utils/data';
import ServiceHistoryItem from '../components/ServiceHistoryItem';
import { Filter, Search } from 'lucide-react';

const History = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredRecords = serviceRecords.filter(record => 
    record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.technician.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort records by date (newest first)
  filteredRecords.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Historia Serwisu</h1>
            <p className="text-muted-foreground">Przeglądaj wszystkie poprzednie zapisy serwisowe</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Szukaj zapisów..."
                className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button className="flex items-center justify-center space-x-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md transition-colors">
              <Filter className="h-5 w-5" />
              <span>Filtruj</span>
            </button>
          </div>
        </div>
        
        {filteredRecords.length > 0 ? (
          <div className="space-y-4">
            {filteredRecords.map((record, index) => (
              <ServiceHistoryItem 
                key={record.id} 
                record={record}
                delay={index % 5 + 1}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-12 text-center">
            <div className="icon-container mx-auto mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nie znaleziono zapisów</h3>
            <p className="text-muted-foreground">
              Żadne zapisy serwisowe nie pasują do kryteriów wyszukiwania. Spróbuj innego zapytania.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
