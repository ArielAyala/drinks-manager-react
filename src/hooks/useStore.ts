import { useLocalStorage } from './useLocalStorage';
import type { Supply, DrinkType, Sale } from '../types';
import { DEFAULT_DRINKS } from '../types';

// LocalStorage keys
export const STORAGE_KEYS = {
  SUPPLIES: 'drinks-manager-supplies',
  DRINKS: 'drinks-manager-drinks',
  SALES: 'drinks-manager-sales',
} as const;

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Hook to manage supplies
export function useSupplies() {
  const [supplies, setSupplies, clearSupplies] = useLocalStorage<Supply[]>(STORAGE_KEYS.SUPPLIES, []);

  const addSupply = (supply: Omit<Supply, 'id' | 'createdAt'>) => {
    const newSupply: Supply = {
      ...supply,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setSupplies(prev => [...prev, newSupply]);
    return newSupply;
  };

  const updateSupply = (id: string, updates: Partial<Omit<Supply, 'id' | 'createdAt'>>) => {
    setSupplies(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSupply = (id: string) => {
    setSupplies(prev => prev.filter(s => s.id !== id));
  };

  const getTotalInvestment = () => {
    return supplies.reduce((sum, s) => sum + s.amount, 0);
  };

  const getInvestmentByType = () => {
    const byType: Record<string, number> = {};
    supplies.forEach(s => {
      byType[s.type] = (byType[s.type] || 0) + s.amount;
    });
    return byType;
  };

  return {
    supplies,
    addSupply,
    updateSupply,
    deleteSupply,
    clearSupplies,
    getTotalInvestment,
    getInvestmentByType,
  };
}

// Hook to manage drink types
export function useDrinks() {
  const getInitialDrinks = (): DrinkType[] => {
    return DEFAULT_DRINKS.map(d => ({
      ...d,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }));
  };

  const [drinks, setDrinks, clearDrinks] = useLocalStorage<DrinkType[]>(
    STORAGE_KEYS.DRINKS,
    getInitialDrinks()
  );

  // If no drinks, initialize with defaults
  if (drinks.length === 0) {
    const initialDrinks = getInitialDrinks();
    setDrinks(initialDrinks);
  }

  const addDrink = (drink: Omit<DrinkType, 'id' | 'createdAt'>) => {
    const newDrink: DrinkType = {
      ...drink,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setDrinks(prev => [...prev, newDrink]);
    return newDrink;
  };

  const updateDrink = (id: string, updates: Partial<Omit<DrinkType, 'id' | 'createdAt'>>) => {
    setDrinks(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDrink = (id: string) => {
    setDrinks(prev => prev.filter(d => d.id !== id));
  };

  const getActiveDrinks = () => {
    return drinks.filter(d => d.active);
  };

  return {
    drinks,
    addDrink,
    updateDrink,
    deleteDrink,
    clearDrinks,
    getActiveDrinks,
  };
}

// Hook to manage sales
export function useSales() {
  const [sales, setSales, clearSales] = useLocalStorage<Sale[]>(STORAGE_KEYS.SALES, []);

  const addSale = (sale: Omit<Sale, 'id' | 'createdAt' | 'total'>) => {
    const newSale: Sale = {
      ...sale,
      total: sale.quantity * sale.pricePerUnit,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setSales(prev => [...prev, newSale]);
    return newSale;
  };

  const updateSale = (id: string, updates: Partial<Omit<Sale, 'id' | 'createdAt'>>) => {
    setSales(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates };
        // Recalculate total if quantity or pricePerUnit changed
        if (updates.quantity !== undefined || updates.pricePerUnit !== undefined) {
          updated.total = updated.quantity * updated.pricePerUnit;
        }
        return updated;
      }
      return s;
    }));
  };

  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const getSalesByDate = (date: string) => {
    return sales.filter(s => s.date === date);
  };

  const getTotalSales = () => {
    return sales.reduce((sum, s) => sum + s.total, 0);
  };

  const getDatesWithSales = () => {
    const dates = [...new Set(sales.map(s => s.date))];
    return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  };

  return {
    sales,
    addSale,
    updateSale,
    deleteSale,
    clearSales,
    getSalesByDate,
    getTotalSales,
    getDatesWithSales,
  };
}
