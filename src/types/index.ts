// Tipos de insumos predefinidos
export type SupplyType = 'bebidas' | 'estante' | 'hielo' | 'vasos' | 'otros';

export interface Supply {
  id: string;
  type: SupplyType;
  description: string;
  amount: number; // en guaraníes
  date: string; // ISO date string
  createdAt: string;
}

export interface DrinkType {
  id: string;
  name: string;
  price: number; // en guaraníes
  active: boolean;
  createdAt: string;
}

export interface Sale {
  id: string;
  drinkId: string;
  drinkName: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
  date: string; // ISO date string (solo fecha YYYY-MM-DD)
  createdAt: string;
}

export interface DailyReport {
  date: string;
  totalSales: number;
  totalQuantity: number;
  salesByDrink: {
    drinkName: string;
    quantity: number;
    total: number;
  }[];
}

export interface TotalReport {
  totalInvestment: number;
  totalSales: number;
  netProfit: number;
  profitPercentage: number;
  daysWithSales: number;
  investmentByType: {
    type: SupplyType;
    total: number;
  }[];
}

// Configuración inicial de tragos
export const DEFAULT_DRINKS: Omit<DrinkType, 'id' | 'createdAt'>[] = [
  { name: 'Caipirinha', price: 15000, active: true },
  { name: 'Mojito', price: 15000, active: true },
  { name: 'Margarita', price: 15000, active: true },
  { name: 'Piña colada', price: 15000, active: true },
  { name: 'Cuba libre', price: 15000, active: true },
  { name: 'Daiquiri de durazno', price: 15000, active: true },
  { name: 'Daiquiri de frutilla', price: 15000, active: true },
];

// Tipos de insumos con sus etiquetas
export const SUPPLY_TYPES: { value: SupplyType; label: string }[] = [
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'estante', label: 'Estante para bebidas' },
  { value: 'hielo', label: 'Hielo' },
  { value: 'vasos', label: 'Vasos' },
  { value: 'otros', label: 'Otros insumos' },
];
