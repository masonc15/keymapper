import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { TabNavigation } from '@/components/navigation/TabNavigation';

interface AppLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  const handleAddShortcut = () => {
    console.log('Add shortcut clicked');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">KeyMapper</h1>
          <Button 
            onClick={handleAddShortcut}
            className="bg-white text-blue-600 hover:bg-blue-100"
          >
            Add Shortcut
          </Button>
        </div>
      </header>
      
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto flex-1 px-4 pb-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-4 px-6 border-t">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} KeyMapper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}