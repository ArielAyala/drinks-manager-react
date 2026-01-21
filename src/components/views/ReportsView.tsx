import { useState } from 'react';
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  Package,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, Button } from '../ui';
import { useSupplies, useSales } from '../../hooks/useStore';
import { formatCurrency, formatDate, getTodayDate } from '../../utils/format';
import { 
  generateDailyReport, 
  generateTotalReport,
  exportSalesToCSV,
  exportSuppliesToCSV,
  exportTotalReportToCSV
} from '../../utils/reports';
import { SUPPLY_TYPES } from '../../types';

type ReportTab = 'daily' | 'total';

export function ReportsView() {
  const { supplies } = useSupplies();
  const { sales, getDatesWithSales } = useSales();
  const [activeTab, setActiveTab] = useState<ReportTab>('daily');
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const datesWithSales = getDatesWithSales();
  const dailyReport = generateDailyReport(sales, selectedDate);
  const totalReport = generateTotalReport(sales, supplies);

  const handleExportSales = () => {
    if (sales.length === 0) {
      alert('No hay ventas para exportar');
      return;
    }
    exportSalesToCSV(sales);
  };

  const handleExportSupplies = () => {
    if (supplies.length === 0) {
      alert('No hay insumos para exportar');
      return;
    }
    exportSuppliesToCSV(supplies);
  };

  const handleExportTotalReport = () => {
    exportTotalReportToCSV(totalReport);
  };

  const getTypeLabel = (type: string) => {
    return SUPPLY_TYPES.find(t => t.value === type)?.label || type;
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex bg-slate-800 rounded-xl p-1.5">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-3 px-4 rounded-lg text-base font-medium transition-colors ${
            activeTab === 'daily'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Diario
        </button>
        <button
          onClick={() => setActiveTab('total')}
          className={`flex-1 py-3 px-4 rounded-lg text-base font-medium transition-colors ${
            activeTab === 'total'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Total
        </button>
      </div>

      {/* Daily Report */}
      {activeTab === 'daily' && (
        <div className="space-y-5">
          {/* Date selector */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            <button
              onClick={() => setSelectedDate(getTodayDate())}
              className={`px-5 py-2.5 rounded-full text-base font-medium whitespace-nowrap transition-colors ${
                selectedDate === getTodayDate()
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Hoy
            </button>
            {datesWithSales
              .filter(d => d !== getTodayDate())
              .map(date => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-5 py-2.5 rounded-full text-base font-medium whitespace-nowrap transition-colors ${
                    selectedDate === date
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {formatDate(date)}
                </button>
              ))}
          </div>

          {/* Daily summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center">
                  <Calendar size={24} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-base text-slate-400">Reporte del día</p>
                  <p className="font-medium text-white text-lg">
                    {selectedDate === getTodayDate() ? 'Hoy' : formatDate(selectedDate)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <p className="text-base text-slate-400">Total vendido</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(dailyReport.totalSales)}
                  </p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <p className="text-base text-slate-400">Tragos vendidos</p>
                  <p className="text-2xl font-bold text-indigo-400">
                    {dailyReport.totalQuantity}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breakdown by drink */}
          {dailyReport.salesByDrink.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-base font-medium text-slate-400 mb-4">Ventas por trago</h3>
                <div className="space-y-4">
                  {dailyReport.salesByDrink.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <div>
                        <p className="font-medium text-white text-lg">{item.drinkName}</p>
                        <p className="text-base text-slate-400">{item.quantity} unidades</p>
                      </div>
                      <span className="font-semibold text-green-400 text-lg">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {dailyReport.salesByDrink.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <p className="text-lg">No hay ventas registradas para este día</p>
            </div>
          )}
        </div>
      )}

      {/* Total Report */}
      {activeTab === 'total' && (
        <div className="space-y-5">
          {/* Net profit */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  totalReport.netProfit >= 0 ? 'bg-green-600/20' : 'bg-red-600/20'
                }`}>
                  {totalReport.netProfit >= 0 ? (
                    <TrendingUp size={24} className="text-green-400" />
                  ) : (
                    <TrendingDown size={24} className="text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-base text-slate-400">Ganancia Neta</p>
                  <p className={`text-2xl font-bold ${
                    totalReport.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(totalReport.netProfit)}
                  </p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-base text-slate-400">Retorno de inversión</span>
                  <span className={`font-bold text-lg ${
                    totalReport.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {totalReport.profitPercentage >= 0 ? '+' : ''}
                    {totalReport.profitPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial summary */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={20} className="text-green-400" />
                  <span className="text-base text-slate-400">Ventas totales</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(totalReport.totalSales)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package size={20} className="text-orange-400" />
                  <span className="text-base text-slate-400">Inversión</span>
                </div>
                <p className="text-2xl font-bold text-orange-400">
                  {formatCurrency(totalReport.totalInvestment)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={20} className="text-indigo-400" />
                <span className="text-base font-medium text-slate-400">Estadísticas</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-base text-slate-400">Días con ventas</span>
                  <span className="font-medium text-white text-lg">{totalReport.daysWithSales}</span>
                </div>
                
                {totalReport.daysWithSales > 0 && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-base text-slate-400">Promedio diario</span>
                    <span className="font-medium text-white text-lg">
                      {formatCurrency(Math.round(totalReport.totalSales / totalReport.daysWithSales))}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Investment by type */}
          {totalReport.investmentByType.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-base font-medium text-slate-400 mb-4">Inversión por categoría</h3>
                <div className="space-y-3">
                  {totalReport.investmentByType.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-base text-slate-300">{getTypeLabel(item.type)}</span>
                      <span className="font-medium text-orange-400 text-lg">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export buttons */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-base font-medium text-slate-400 mb-4">Exportar datos</h3>
              <div className="space-y-3">
                <Button 
                  variant="secondary" 
                  className="w-full justify-center"
                  onClick={handleExportSales}
                >
                  <Download size={20} />
                  <span className="ml-2">Exportar ventas (CSV)</span>
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-center"
                  onClick={handleExportSupplies}
                >
                  <Download size={20} />
                  <span className="ml-2">Exportar insumos (CSV)</span>
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-center"
                  onClick={handleExportTotalReport}
                >
                  <Download size={20} />
                  <span className="ml-2">Exportar reporte total (CSV)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
