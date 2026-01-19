import { useState } from 'react';
import { Layout } from './components/Layout';
import type { NavItem } from './components/Navigation';
import {
  HomeView,
  SuppliesView,
  DrinksView,
  SalesView,
  ReportsView,
  SettingsView,
} from './components/views';

function App() {
  const [activeTab, setActiveTab] = useState<NavItem>('home');

  const getTitle = () => {
    const titles: Record<NavItem, string> = {
      home: 'Drinks Manager',
      supplies: 'Insumos',
      drinks: 'Tragos',
      sales: 'Ventas',
      reports: 'Reportes',
      settings: 'Configuración',
    };
    return titles[activeTab];
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onNavigate={setActiveTab} />;
      case 'supplies':
        return <SuppliesView />;
      case 'drinks':
        return <DrinksView />;
      case 'sales':
        return <SalesView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} title={getTitle()}>
      {renderView()}
    </Layout>
  );
}

export default App;
