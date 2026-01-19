import type { ReactNode } from 'react';
import { Navigation, type NavItem } from './Navigation';
import packageJson from '../../package.json';

interface LayoutProps {
  children: ReactNode;
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
  title: string;
}

export function Layout({ children, activeTab, onTabChange, }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 safe-area-pt">
        <div className="flex items-center justify-center">
          <span className="text-xs text-slate-500">v{packageJson.version}</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 px-5 py-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
