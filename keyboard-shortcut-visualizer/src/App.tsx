import { useState } from 'react';
import { ShortcutProvider } from '@/contexts/ShortcutContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { KeyboardView } from '@/components/keyboard/KeyboardView';
import { TableView } from '@/components/table/TableView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('keyboard');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

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