import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Check, Trash2 } from 'lucide-react';
import { Card, CardContent, QuantitySelector, Toast } from '../ui';
import { useDrinks, useSales } from '../../hooks/useStore';
import { formatCurrency, formatDate, getTodayDate } from '../../utils/format';

export function SalesView() {
  const { drinks } = useDrinks();
  const { addSale, deleteSale, getSalesByDate, getDatesWithSales } = useSales();
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [expandedDrinkId, setExpandedDrinkId] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeSubTab, setActiveSubTab] = useState<'register' | 'history'>('register');
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ 
    message: '', 
    isVisible: false 
  });
  const activeDrinks = drinks.filter(d => d.active);
  const todaySales = getSalesByDate(selectedDate);
  const datesWithSales = getDatesWithSales();

  // Get daily totals
  const dailyTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
  const dailyQuantity = todaySales.reduce((sum, s) => sum + s.quantity, 0);

  const showToast = useCallback((message: string) => {
    setToast({ message, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  const handleDrinkClick = (drinkId: string) => {
    if (expandedDrinkId === drinkId) {
      setExpandedDrinkId(null);
    } else {
      setExpandedDrinkId(drinkId);
      if (!quantities[drinkId]) {
        setQuantities(prev => ({ ...prev, [drinkId]: 1 }));
      }
    }
  };

  const handleQuantityChange = (drinkId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [drinkId]: quantity }));
  };

  const handleConfirmSale = (drink: typeof activeDrinks[0]) => {
    const quantity = quantities[drink.id] || 1;
    
    addSale({
      drinkId: drink.id,
      drinkName: drink.name,
      quantity,
      pricePerUnit: drink.price,
      date: selectedDate,
    });

    // Show confirmation toast
    showToast(`¡Venta registrada! ${quantity}x ${drink.name}`);

    // Reset state
    setQuantities(prev => ({ ...prev, [drink.id]: 1 }));
    setExpandedDrinkId(null);
  };

  const handleDeleteSale = (saleId: string) => {
    if (confirm('¿Eliminar esta venta?')) {
      deleteSale(saleId);
    }
  };

  // Group daily sales by drink
  const salesByDrink = todaySales.reduce((acc, sale) => {
    const key = sale.drinkName;
    if (!acc[key]) {
      acc[key] = { quantity: 0, total: 0, sales: [] };
    }
    acc[key].quantity += sale.quantity;
    acc[key].total += sale.total;
    acc[key].sales.push(sale);
    return acc;
  }, {} as Record<string, { quantity: number; total: number; sales: typeof todaySales }>);

  return (
    <div className="space-y-5">
      {/* Confirmation toast */}
      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={hideToast}
      />

      {/* Day title */}
      <div className="text-center py-2">
        <h2 className="text-xl font-semibold text-white">
          {selectedDate === getTodayDate() ? 'Hoy' : formatDate(selectedDate)}
        </h2>
      </div>

      {/* Date selector - only if there are previous dates with sales */}
      {datesWithSales.filter(d => d !== getTodayDate()).length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {datesWithSales
            .filter(d => d !== getTodayDate())
            .slice(0, 7)
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
      )}

      {/* Daily summary */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Ventas del día</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(dailyTotal)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Tragos vendidos</p>
              <p className="text-2xl font-bold text-indigo-400">{dailyQuantity}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sub-tabs */}
      <div className="flex gap-2 bg-slate-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveSubTab('register')}
          className={`flex-1 py-3 px-4 rounded-lg text-base font-medium transition-colors ${
            activeSubTab === 'register'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Registrar venta
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex-1 py-3 px-4 rounded-lg text-base font-medium transition-colors ${
            activeSubTab === 'history'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Ventas de hoy
          {dailyQuantity > 0 && (
            <span className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
              {dailyQuantity}
            </span>
          )}
        </button>
      </div>

      {/* Tab content */}
      {activeSubTab === 'register' ? (
        /* Drink selector for sales */
        <div className="space-y-3">
          {activeDrinks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No hay tragos disponibles</p>
              <p className="text-sm mt-1">Activa algunos tragos en la sección "Tragos"</p>
            </div>
          ) : (
            activeDrinks.map(drink => {
              const isExpanded = expandedDrinkId === drink.id;
              const quantity = quantities[drink.id] || 1;
              const subtotal = drink.price * quantity;

              return (
                <Card key={drink.id}>
                  <CardContent className="p-0">
                    <button
                      onClick={() => handleDrinkClick(drink.id)}
                      className="w-full p-4 flex items-center justify-between"
                    >
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white text-lg">{drink.name}</p>
                        <p className="text-base text-indigo-400 mt-1">{formatCurrency(drink.price)}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={24} className="text-slate-400 ml-4" />
                      ) : (
                        <ChevronDown size={24} className="text-slate-400 ml-4" />
                      )}
                    </button>

                    {/* Expanded panel */}
                    {isExpanded && (
                      <div className="p-4 pt-4 border-t border-slate-700 space-y-5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-base">Cantidad:</span>
                          <QuantitySelector
                            value={quantity}
                            onChange={(val) => handleQuantityChange(drink.id, val)}
                            size="lg"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-base">Total:</span>
                          <span className="text-3xl font-bold text-green-400">
                            {formatCurrency(subtotal)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleConfirmSale(drink)}
                          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-medium text-lg rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                        >
                          <Check size={22} />
                          Confirmar venta
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        /* Daily sales with independent scroll */
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {Object.keys(salesByDrink).length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No hay ventas registradas</p>
              <p className="text-sm mt-1">Las ventas aparecerán aquí cuando las registres</p>
            </div>
          ) : (
            Object.entries(salesByDrink).map(([drinkName, data]) => (
              <Card key={drinkName}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-white text-lg">{drinkName}</p>
                      <p className="text-base text-slate-400">
                        {data.quantity} unidades
                      </p>
                    </div>
                    <span className="font-semibold text-green-400 text-lg">
                      {formatCurrency(data.total)}
                    </span>
                  </div>

                  {/* Individual sales list */}
                  <div className="space-y-2 pt-3 border-t border-slate-700">
                    {data.sales.map(sale => (
                      <div key={sale.id} className="flex items-center justify-between text-base py-1">
                        <span className="text-slate-400">
                          {sale.quantity}x {formatCurrency(sale.pricePerUnit)}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-300">
                            {formatCurrency(sale.total)}
                          </span>
                          <button
                            onClick={() => handleDeleteSale(sale.id)}
                            className="p-2 text-slate-500 hover:text-red-400 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
