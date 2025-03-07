import { useState, useEffect } from 'react';
import { ShortcutProvider } from '@/contexts/ShortcutContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { KeyboardView } from '@/components/keyboard/KeyboardView';
import { TableView } from '@/components/table/TableView';
import { DebugComponent } from '@/components/DebugComponent';
import { initializeSampleShortcuts } from '@/utils/storageUtils';

function AppContent() {
  const [activeTab, setActiveTab] = useState('keyboard');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Initialize sample shortcuts
  useEffect(() => {
    try {
      // Ensure we have sample data
      initializeSampleShortcuts();
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize sample shortcuts:', error);
      setIsLoading(false);
      setHasError(true);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Show debug component if there's an error
  if (hasError) {
    return <DebugComponent />;
  }

  return (
    <AppLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === 'keyboard' ? <KeyboardView /> : <TableView />}
    </AppLayout>
  );
}

function App() {
  return (
    <ShortcutProvider>
      <AppContent />
    </ShortcutProvider>
  );
}

export default App;