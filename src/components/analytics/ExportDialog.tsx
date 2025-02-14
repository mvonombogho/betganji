import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Download } from 'lucide-react';
import { generateCSVReport, downloadCSV } from '@/lib/services/reportGenerator';
import { generateExcelWorkbook, downloadExcel } from '@/lib/services/excelGenerator';
import type { PlacedBet } from '@/types/bet';

interface ExportDialogProps {
  bets: PlacedBet[];
}

type ExportFormat = 'csv' | 'excel';

export default function ExportDialog({ bets }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [options, setOptions] = useState({
    includeOverview: true,
    includeBookmakers: true,
    includeMonthly: true
  });
  const [dateRange, setDateRange] = useState<{
    start?: Date;
    end?: Date;
  }>({});

  const handleExport = () => {
    let filteredBets = [...bets];

    if (dateRange.start && dateRange.end) {
      filteredBets = bets.filter(bet => {
        const betDate = new Date(bet.createdAt);
        return betDate >= dateRange.start! && betDate <= dateRange.end!;
      });
    }

    const filename = `betting-report-${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      const csv = generateCSVReport(filteredBets, {
        ...options,
        dateRange: dateRange.start && dateRange.end ? dateRange : undefined
      });
      downloadCSV(csv, `${filename}.csv`);
    } else {
      const workbook = generateExcelWorkbook(filteredBets, {
        ...options,
        dateRange: dateRange.start && dateRange.end ? dateRange : undefined
      });
      downloadExcel(workbook, `${filename}.xlsx`);
    }

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Betting Report</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Include Sections</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overview"
                  checked={options.includeOverview}
                  onCheckedChange={(checked) =>
                    setOptions(prev => ({ ...prev, includeOverview: !!checked }))
                  }
                />
                <Label htmlFor="overview">Overall Performance</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bookmakers"
                  checked={options.includeBookmakers}
                  onCheckedChange={(checked) =>
                    setOptions(prev => ({ ...prev, includeBookmakers: !!checked }))
                  }
                />
                <Label htmlFor="bookmakers">Bookmaker Performance</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="monthly"
                  checked={options.includeMonthly}
                  onCheckedChange={(checked) =>
                    setOptions(prev => ({ ...prev, includeMonthly: !!checked }))
                  }
                />
                <Label htmlFor="monthly">Monthly Performance</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Date Range (Optional)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <DatePicker
                  value={dateRange.start}
                  onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <DatePicker
                  value={dateRange.end}
                  onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                  disabled={!dateRange.start}
                  minDate={dateRange.start}
                />
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleExport} className="w-full">
          Download {format === 'csv' ? 'CSV' : 'Excel'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}