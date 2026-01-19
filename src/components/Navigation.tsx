import { 
  Wine, 
  ShoppingCart, 
  BarChart3, 
  Package, 
  Settings,
  Home
} from 'lucide-react';

type NavItem = 'home' | 'supplies' | 'drinks' | 'sales' | 'reports' | 'settings';

interface NavigationProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

const navItems: { id: NavItem; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'sales', label: 'Ventas', icon: ShoppingCart },
  { id: 'drinks', label: 'Tragos', icon: Wine },
  { id: 'supplies', label: 'Insumos', icon: Package },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'settings', label: 'Config', icon: Settings },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-indigo-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export type { NavItem };
