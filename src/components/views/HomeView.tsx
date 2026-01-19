import { 
  TrendingUp, 
  ShoppingCart, 
  Package,
  Wine,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '../ui';
import { useSupplies, useSales, useDrinks } from '../../hooks/useStore';
import { formatCurrency, getTodayDate } from '../../utils/format';
import { generateTotalReport } from '../../utils/reports';
import type { NavItem } from '../Navigation';

interface HomeViewProps {
  onNavigate: (tab: NavItem) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { supplies } = useSupplies();
  const { sales, getSalesByDate } = useSales();
  const { drinks } = useDrinks();

  const totalReport = generateTotalReport(sales, supplies);
  const todaySales = getSalesByDate(getTodayDate());
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
  const todayQuantity = todaySales.reduce((sum, s) => sum + s.quantity, 0);
  const activeDrinks = drinks.filter(d => d.active);

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Título de bienvenida */}
      <div className="text-center py-4">
        <h2 className="text-3xl font-bold text-white">🍹 Drinks Manager</h2>
        <p className="text-slate-400 text-base mt-2">Tu asistente de ventas de tragos</p>
      </div>

      {/* Ganancia neta destacada */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-0 mt-2">
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-indigo-200 text-base">Ganancia Neta Total</p>
            <p className={`text-4xl font-bold mt-2 ${
              totalReport.netProfit >= 0 ? 'text-white' : 'text-red-200'
            }`}>
              {formatCurrency(totalReport.netProfit)}
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <TrendingUp size={18} className="text-indigo-200" />
              <span className={`text-base font-medium ${
                totalReport.profitPercentage >= 0 ? 'text-green-300' : 'text-red-300'
              }`}>
                {totalReport.profitPercentage >= 0 ? '+' : ''}
                {totalReport.profitPercentage.toFixed(1)}% ROI
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de hoy */}
      <Card className="mt-2">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg text-white">Ventas de hoy</h3>
            <button 
              onClick={() => onNavigate('sales')}
              className="text-indigo-400 text-base flex items-center gap-2 hover:text-indigo-300 py-2 px-3"
            >
              Ver más <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-base text-slate-400">Total</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(todayTotal)}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-base text-slate-400">Tragos</p>
              <p className="text-2xl font-bold text-indigo-400">
                {todayQuantity}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-3 gap-4 mt-2">
        <button
          onClick={() => onNavigate('sales')}
          className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col items-center gap-3 hover:bg-slate-750 active:scale-[0.98] transition-all"
        >
          <div className="w-14 h-14 bg-green-600/20 rounded-full flex items-center justify-center">
            <ShoppingCart size={28} className="text-green-400" />
          </div>
          <span className="text-base text-slate-300 font-medium">Vender</span>
        </button>

        <button
          onClick={() => onNavigate('drinks')}
          className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col items-center gap-3 hover:bg-slate-750 active:scale-[0.98] transition-all"
        >
          <div className="w-14 h-14 bg-indigo-600/20 rounded-full flex items-center justify-center">
            <Wine size={28} className="text-indigo-400" />
          </div>
          <span className="text-base text-slate-300 font-medium">Tragos</span>
          <span className="text-sm text-slate-500">{activeDrinks.length} activos</span>
        </button>

        <button
          onClick={() => onNavigate('supplies')}
          className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col items-center gap-3 hover:bg-slate-750 active:scale-[0.98] transition-all"
        >
          <div className="w-14 h-14 bg-orange-600/20 rounded-full flex items-center justify-center">
            <Package size={28} className="text-orange-400" />
          </div>
          <span className="text-base text-slate-300 font-medium">Insumos</span>
          <span className="text-sm text-slate-500">{formatCurrency(totalReport.totalInvestment)}</span>
        </button>
      </div>

      {/* Stats rápidos */}
      <Card className="mt-2">
        <CardContent>
          <h3 className="font-medium text-lg text-white mb-4">Resumen general</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-1">
              <span className="text-base text-slate-400">Ventas totales</span>
              <span className="text-lg font-semibold text-green-400">
                {formatCurrency(totalReport.totalSales)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-base text-slate-400">Inversión total</span>
              <span className="text-lg font-semibold text-orange-400">
                {formatCurrency(totalReport.totalInvestment)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-base text-slate-400">Días con ventas</span>
              <span className="text-lg font-semibold text-white">
                {totalReport.daysWithSales}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
