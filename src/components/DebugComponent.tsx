import React from 'react';
import { useShortcuts } from '@/hooks/useShortcuts';

export const DebugComponent: React.FC = () => {
  const { shortcuts, loading } = useShortcuts();
  
  if (loading) {
    return <div className="p-4">Loading shortcuts...</div>;
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Component</h1>
      <h2 className="text-xl font-semibold mb-2">Shortcuts ({shortcuts.length})</h2>
      {shortcuts.length === 0 ? (
        <p className="text-red-500">No shortcuts found! Check localStorage initialization.</p>
      ) : (
        <ul className="space-y-2">
          {shortcuts.map(shortcut => (
            <li key={shortcut.id} className="border p-2 rounded">
              <div><strong>App:</strong> {shortcut.application}</div>
              <div><strong>Key:</strong> {shortcut.key_combination}</div>
              <div><strong>Description:</strong> {shortcut.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};