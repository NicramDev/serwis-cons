import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/utils/formatting/dateUtils";
import { CheckCircle2, XCircle, ArrowLeft, Download, Calendar, User, MapPin, FileText } from "lucide-react";

interface InventoryCheckDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  check: {
    id: string;
    check_date: string;
    checked_by: string;
    location: string | null;
    items_data: any[];
    notes: string | null;
  };
  onBack: () => void;
}

const InventoryCheckDetails = ({ open, onOpenChange, check, onBack }: InventoryCheckDetailsProps) => {
  const generatePDFReport = () => {
    const items = check.items_data;
    const presentItems = items.filter(item => item.status === 'present');
    const missingItems = items.filter(item => item.status === 'missing');
    const uncheckedItems = items.filter(item => item.status === 'unchecked');

    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Raport Kontroli</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #666; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; }
            .info-row { margin: 10px 0; }
            .info-label { font-weight: bold; display: inline-block; width: 150px; }
            .status-present { color: green; }
            .status-missing { color: red; font-weight: bold; }
            .status-unchecked { color: gray; }
            .notes { background-color: #f9f9f9; padding: 10px; margin: 10px 0; border-left: 3px solid #666; }
          </style>
        </head>
        <body>
          <h1>Raport Kontroli Inwentaryzacyjnej</h1>
          
          <div class="info-row">
            <span class="info-label">Data kontroli:</span>
            <span>${formatDate(new Date(check.check_date))}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Osoba kontrolująca:</span>
            <span>${check.checked_by}</span>
          </div>
          ${check.location ? `
            <div class="info-row">
              <span class="info-label">Lokalizacja:</span>
              <span>${check.location}</span>
            </div>
          ` : ''}

          <h2>Podsumowanie</h2>
          <table>
            <tr>
              <th>Status</th>
              <th>Liczba pozycji</th>
            </tr>
            <tr>
              <td class="status-present">Obecne</td>
              <td>${presentItems.length}</td>
            </tr>
            <tr>
              <td class="status-missing">Brakujące</td>
              <td>${missingItems.length}</td>
            </tr>
            <tr>
              <td class="status-unchecked">Niesprawdzone</td>
              <td>${uncheckedItems.length}</td>
            </tr>
            <tr>
              <th>RAZEM</th>
              <th>${items.length}</th>
            </tr>
          </table>

          ${presentItems.length > 0 ? `
            <h2>Pozycje obecne (${presentItems.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Marka/Typ</th>
                  <th>Ilość</th>
                  <th>Uwagi</th>
                </tr>
              </thead>
              <tbody>
                ${presentItems.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.brandType}</td>
                    <td>${item.quantity}</td>
                    <td>${item.notes || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${missingItems.length > 0 ? `
            <h2 style="color: red;">Pozycje brakujące (${missingItems.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Marka/Typ</th>
                  <th>Ilość</th>
                  <th>Uwagi</th>
                </tr>
              </thead>
              <tbody>
                ${missingItems.map(item => `
                  <tr style="background-color: #ffe6e6;">
                    <td>${item.name}</td>
                    <td>${item.brandType}</td>
                    <td>${item.quantity}</td>
                    <td>${item.notes || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${uncheckedItems.length > 0 ? `
            <h2>Pozycje niesprawdzone (${uncheckedItems.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Marka/Typ</th>
                  <th>Ilość</th>
                </tr>
              </thead>
              <tbody>
                ${uncheckedItems.map(item => `
                  <tr style="background-color: #f5f5f5;">
                    <td>${item.name}</td>
                    <td>${item.brandType}</td>
                    <td>${item.quantity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${check.notes ? `
            <h2>Uwagi ogólne</h2>
            <div class="notes">${check.notes}</div>
          ` : ''}
        </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kontrola_${formatDate(new Date(check.check_date)).replace(/\./g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const items = check.items_data;
  const presentItems = items.filter(item => item.status === 'present');
  const missingItems = items.filter(item => item.status === 'missing');
  const uncheckedItems = items.filter(item => item.status === 'unchecked');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle>Szczegóły kontroli</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 pb-4 border-b">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Data kontroli</div>
                <div className="font-medium">{formatDate(new Date(check.check_date))}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Osoba kontrolująca</div>
                <div className="font-medium">{check.checked_by}</div>
              </div>
            </div>
            {check.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Lokalizacja</div>
                  <div className="font-medium">{check.location}</div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="text-center">
              <div className="text-2xl font-bold">{items.length}</div>
              <div className="text-sm text-muted-foreground">Razem</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{presentItems.length}</div>
              <div className="text-sm text-muted-foreground">Obecne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{missingItems.length}</div>
              <div className="text-sm text-muted-foreground">Brakujące</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{uncheckedItems.length}</div>
              <div className="text-sm text-muted-foreground">Niesprawdzone</div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {presentItems.length > 0 && (
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Pozycje obecne ({presentItems.length})
                </h3>
                <div className="space-y-2">
                  {presentItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-muted-foreground">{item.brandType}</div>
                        <div className="text-muted-foreground">Ilość: {item.quantity}</div>
                      </div>
                      {item.notes && (
                        <div className="mt-2 pt-2 border-t text-sm">
                          <FileText className="h-3 w-3 inline mr-1" />
                          {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {missingItems.length > 0 && (
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3 text-destructive">
                  <XCircle className="h-5 w-5" />
                  Pozycje brakujące ({missingItems.length})
                </h3>
                <div className="space-y-2">
                  {missingItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-muted-foreground">{item.brandType}</div>
                        <div className="text-muted-foreground">Ilość: {item.quantity}</div>
                      </div>
                      {item.notes && (
                        <div className="mt-2 pt-2 border-t text-sm">
                          <FileText className="h-3 w-3 inline mr-1" />
                          {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uncheckedItems.length > 0 && (
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3 text-muted-foreground">
                  Pozycje niesprawdzone ({uncheckedItems.length})
                </h3>
                <div className="space-y-2">
                  {uncheckedItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border bg-muted/50">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-muted-foreground">{item.brandType}</div>
                        <div className="text-muted-foreground">Ilość: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {check.notes && (
              <div>
                <h3 className="font-semibold mb-3">Uwagi ogólne</h3>
                <div className="p-4 rounded-lg bg-muted/50 border">
                  {check.notes}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onBack}>
            Wróć
          </Button>
          <Button onClick={generatePDFReport}>
            <Download className="h-4 w-4 mr-2" />
            Generuj raport
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryCheckDetails;
