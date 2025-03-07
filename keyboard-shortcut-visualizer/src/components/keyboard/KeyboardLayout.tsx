import { useState, useCallback } from 'react';
import { KeyboardLayout as KeyboardLayoutType } from '@/types/keyboard';
import { KeyRow } from './KeyRow';

interface KeyboardLayoutProps {
  layout: KeyboardLayoutType;
  onKeyClick?: (keyId: string) => void;
  onShortcutsChanged?: () => void;
}

export const KeyboardLayout = ({ 
  layout, 
  onKeyClick,
  onShortcutsChanged,
}: KeyboardLayoutProps) => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  // Custom key click handler that manages active keys state
  const handleKeyClick = useCallback((keyId: string) => {
    // You can implement different behavior here, such as toggling keys
    // For now, we'll just highlight the clicked key
    setActiveKeys([keyId]);
    
    // Call the parent's onKeyClick if provided
    if (onKeyClick) {
      onKeyClick(keyId);
    }
  }, [onKeyClick]);
  
  // Handler for when shortcuts change
  const handleShortcutsChanged = useCallback(() => {
    if (onShortcutsChanged) {
      onShortcutsChanged();
    }
  }, [onShortcutsChanged]);
  
  return (
    <div 
      className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200"
      aria-label={`${layout.name} keyboard layout`}
    >
      <div className="flex flex-col items-center gap-2">
        {layout.rows.map((row) => (
          <KeyRow
            key={row.id}
            row={row}
            activeKeys={activeKeys}
            onKeyClick={handleKeyClick}
            onShortcutsChanged={handleShortcutsChanged}
          />
        ))}
      </div>
    </div>
  );
};