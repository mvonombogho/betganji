import * as XLSX from 'xlsx';
import { calculateBetStats, calculateBookmakerStats, calculateMonthlyPerformance } from './betAnalytics';
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

export function generateExcelWorkbook(bets: PlacedBet[], options: ExcelExportOptions = {}) {
  const workbook = XLSX.utils.book_new();

  // Overview Sheet
  if (options.includeOverview) {
    const stats = calculateBetStats(bets);
    const overviewData = [
      ['Overall Performance'],
      ['Total Bets', 'Win Rate', 'Total Profit', 'ROI'],
      [stats.totalBets, `${stats.winRate.toFixed(2)}%`, stats.totalProfit, `${stats.roi.toFixed(2)}%`]
    ];
    
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
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
        `${stat.roi.toFixed(2)}%`
      ])
    ];
    
    const bookmakerSheet = XLSX.utils.aoa_to_sheet(bookmakerData);
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
        `${stat.winRate.toFixed(2)}%`
      ])
    ];
    
    const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
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
  
  // Add column widths
  const colWidths = [{ wch: 12 }, { wch: 30 }, { wch: 15 }, { wch: 8 }, 
                     { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 40 }];
  betSheet['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(workbook, betSheet, 'Bet History');

  return workbook;
}

export function downloadExcel(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename);
}