import type { CellStyle } from 'xlsx';

export const excelStyles = {
  headers: {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '2563EB' } },
    alignment: { horizontal: 'center' }
  } as CellStyle,

  subHeaders: {
    font: { bold: true },
    fill: { fgColor: { rgb: 'F3F4F6' } },
    alignment: { horizontal: 'left' }
  } as CellStyle,

  percentageCell: {
    numFmt: '0.00%',
    alignment: { horizontal: 'right' }
  } as CellStyle,

  currencyCell: {
    numFmt: '#,##0.00',
    alignment: { horizontal: 'right' }
  } as CellStyle,

  dateCell: {
    numFmt: 'dd/mm/yyyy',
    alignment: { horizontal: 'left' }
  } as CellStyle,

  centerCell: {
    alignment: { horizontal: 'center' }
  } as CellStyle,

  profitCell: (value: number) => ({
    numFmt: '#,##0.00',
    alignment: { horizontal: 'right' },
    font: { color: { rgb: value >= 0 ? '16A34A' : 'DC2626' } }
  }) as CellStyle
};