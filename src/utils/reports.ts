import type { Sale, Supply, DailyReport, TotalReport, SupplyType } from '../types';
import { SUPPLY_TYPES } from '../types';

// Generar reporte diario
export function generateDailyReport(sales: Sale[], date: string): DailyReport {
  const daySales = sales.filter(s => s.date === date);
  
  const salesByDrink: Record<string, { quantity: number; total: number }> = {};
  
  daySales.forEach(sale => {
    if (!salesByDrink[sale.drinkName]) {
      salesByDrink[sale.drinkName] = { quantity: 0, total: 0 };
    }
    salesByDrink[sale.drinkName].quantity += sale.quantity;
    salesByDrink[sale.drinkName].total += sale.total;
  });

  return {
    date,
    totalSales: daySales.reduce((sum, s) => sum + s.total, 0),
    totalQuantity: daySales.reduce((sum, s) => sum + s.quantity, 0),
    salesByDrink: Object.entries(salesByDrink).map(([drinkName, data]) => ({
      drinkName,
      ...data,
    })),
  };
}

// Generar reporte total
export function generateTotalReport(sales: Sale[], supplies: Supply[]): TotalReport {
  const totalInvestment = supplies.reduce((sum, s) => sum + s.amount, 0);
  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const netProfit = totalSales - totalInvestment;
  const profitPercentage = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
  
  const uniqueDates = new Set(sales.map(s => s.date));
  
  const investmentByType: { type: SupplyType; total: number }[] = SUPPLY_TYPES.map(st => ({
    type: st.value,
    total: supplies.filter(s => s.type === st.value).reduce((sum, s) => sum + s.amount, 0),
  })).filter(item => item.total > 0);

  return {
    totalInvestment,
    totalSales,
    netProfit,
    profitPercentage,
    daysWithSales: uniqueDates.size,
    investmentByType,
  };
}

// Exportar a CSV
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escapar comillas y valores con comas
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Exportar ventas a CSV
export function exportSalesToCSV(sales: Sale[]): void {
  const data = sales.map(s => ({
    Fecha: s.date,
    Trago: s.drinkName,
    Cantidad: s.quantity,
    'Precio Unitario': s.pricePerUnit,
    Total: s.total,
  }));
  exportToCSV(data, `ventas-${new Date().toISOString().split('T')[0]}`);
}

// Exportar insumos a CSV
export function exportSuppliesToCSV(supplies: Supply[]): void {
  const typeLabels: Record<string, string> = {};
  SUPPLY_TYPES.forEach(st => {
    typeLabels[st.value] = st.label;
  });

  const data = supplies.map(s => ({
    Fecha: s.date,
    Tipo: typeLabels[s.type] || s.type,
    Descripción: s.description,
    Monto: s.amount,
  }));
  exportToCSV(data, `insumos-${new Date().toISOString().split('T')[0]}`);
}

// Exportar reporte total a CSV
export function exportTotalReportToCSV(report: TotalReport): void {
  const data = [
    { Concepto: 'Inversión Total', Valor: report.totalInvestment },
    { Concepto: 'Ventas Totales', Valor: report.totalSales },
    { Concepto: 'Ganancia Neta', Valor: report.netProfit },
    { Concepto: 'Porcentaje de Ganancia', Valor: `${report.profitPercentage.toFixed(1)}%` },
    { Concepto: 'Días con Ventas', Valor: report.daysWithSales },
    ...report.investmentByType.map(item => ({
      Concepto: `Inversión en ${item.type}`,
      Valor: item.total,
    })),
  ];
  exportToCSV(data, `reporte-total-${new Date().toISOString().split('T')[0]}`);
}
