import * as XLSX from 'xlsx';
import { calculateBetStats, calculateBookmakerStats, calculateMonthlyPerformance } from './betAnalytics';
import { excelStyles } from './excelStyles';
import type { PlacedBet } from '@/types/bet';

interface ExcelExportOptions {
  includeOverview?: boolean;
  includeBookmakers?: boolean;
  includeMonthly?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

function applyStyles(sheet: XLSX.WorkSheet, ranges: { [key: string]: XLSX.CellStyle }) {
  if (!sheet['!styles']) sheet['!styles'] = {};
  Object.entries(ranges).forEach(([range, style]) => {
    const cells = XLSX.utils.decode_range(range);
    for (let row = cells.s.r; row <= cells.e.r; row++) {
      for (let col = cells.s.c; col <= cells.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        sheet['!styles'][cellRef] = style;
      }
    }
  });
}

function setColumnWidths(sheet: XLSX.WorkSheet, widths: number[]) {
  sheet['!cols'] = widths.map(w => ({ wch: w }));
}

export function generateExcelWorkbook(bets: PlacedBet[], options: ExcelExportOptions = {}) {
  const workbook = XLSX.utils.book_new();

  // Overview Sheet
  if (options.includeOverview) {
    const stats = calculateBetStats(bets);
    const overviewData = [
      ['Overall Performance'],
      ['Total Bets', 'Win Rate', 'Total Profit', 'ROI'],
      [stats.totalBets, stats.winRate / 100, stats.totalProfit, stats.roi / 100]
    ];
    
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    applyStyles(overviewSheet, {
      'A1:D1': excelStyles.subHeaders,
      'A2:D2': excelStyles.headers,
      'B3:B3': excelStyles.percentageCell,
      'C3:C3': excelStyles.profitCell(stats.totalProfit),
      'D3:D3': excelStyles.percentageCell
    });
    
    setColumnWidths(overviewSheet, [15, 15, 15, 15]);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview');
  }

  // Bookmaker Performance Sheet
  if (options.includeBookmakers) {
    const bookmakerStats = calculateBookmakerStats(bets);
    const bookmakerData = [
      ['Bookmaker Performance'],
      ['Bookmaker', 'Total Bets', 'Won Bets', 'Profit/Loss', 'ROI'],
      ...bookmakerStats.map(stat => [
        stat.name,
        stat.bets,
        stat.wonBets,
        stat.profit,
        stat.roi / 100
      ])
    ];
    
    const bookmakerSheet = XLSX.utils.aoa_to_sheet(bookmakerData);
    applyStyles(bookmakerSheet, {
      'A1:E1': excelStyles.subHeaders,
      'A2:E2': excelStyles.headers,
      'D3:D' + (bookmakerData.length): excelStyles.currencyCell,
      'E3:E' + (bookmakerData.length): excelStyles.percentageCell
    });
    
    setColumnWidths(bookmakerSheet, [20, 12, 12, 15, 12]);
    XLSX.utils.book_append_sheet(workbook, bookmakerSheet, 'Bookmakers');
  }

  // Monthly Performance Sheet
  if (options.includeMonthly) {
    const monthlyStats = calculateMonthlyPerformance(bets);
    const monthlyData = [
      ['Monthly Performance'],
      ['Month', 'Total Bets', 'Won Bets', 'Profit/Loss', 'Win Rate'],
      ...monthlyStats.map(stat => [
        stat.month,
        stat.bets,
        stat.wonBets,
        stat.profit,
        stat.winRate / 100
      ])
    ];
    
    const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
    applyStyles(monthlySheet, {
      'A1:E1': excelStyles.subHeaders,
      'A2:E2': excelStyles.headers,
      'D3:D' + (monthlyData.length): excelStyles.currencyCell,
      'E3:E' + (monthlyData.length): excelStyles.percentageCell
    });
    
    setColumnWidths(monthlySheet, [15, 12, 12, 15, 12]);
    XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly');
  }

  // Bet History Sheet
  const betData = [
    ['Bet History'],
    ['Date', 'Selection', 'Bookmaker', 'Odds', 'Stake', 'Result', 'Profit/Loss', 'Notes'],
    ...bets.map(bet => [
      new Date(bet.createdAt),
      bet.selection,
      bet.bettingSite,
      bet.odds,
      bet.stake,
      bet.status.toUpperCase(),
      bet.status === 'won' ? bet.potentialWin - bet.stake : 
        bet.status === 'lost' ? -bet.stake : 0,
      bet.reasoning || ''
    ])
  ];

  const betSheet = XLSX.utils.aoa_to_sheet(betData);
  applyStyles(betSheet, {
    'A1:H1': excelStyles.subHeaders,
    'A2:H2': excelStyles.headers,
    'A3:A' + (betData.length): excelStyles.dateCell,
    'D3:D' + (betData.length): excelStyles.centerCell,
    'E3:E' + (betData.length): excelStyles.currencyCell,
    'F3:F' + (betData.length): excelStyles.centerCell,
    'G3:G' + (betData.length): { 
      ...excelStyles.currencyCell,
      font: bet => ({
        color: { rgb: bet[6] >= 0 ? '16A34A' : 'DC2626' }
      })
    }
  });
  
  setColumnWidths(betSheet, [12, 30, 15, 8, 10, 10, 12, 40]);
  XLSX.utils.book_append_sheet(workbook, betSheet, 'Bet History');

  return workbook;
}

export function downloadExcel(workbook: XLSX.WorkBook, filename: string) {
  try {
    XLSX.writeFile(workbook, filename);
    return true;
  } catch (error) {
    console.error('Error downloading Excel file:', error);
    return false;
  }
}