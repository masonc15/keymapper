import { KeyRow as KeyRowType } from '@/types/keyboard';
import { Key } from './Key';
import { KeyboardHighlightMode } from './KeyboardControls';
import { useShortcuts } from '@/hooks/useShortcuts';
import { getBaseKeyFromKeyId } from '@/utils/keyboardUtils';
import { useMemo } from 'react';

interface KeyRowProps {
  row: KeyRowType;
  activeKeys?: string[];
  onKeyClick?: (keyId: string) => void;
  onShortcutsChanged?: () => void;
  selectedApplication?: string;
  highlightMode?: KeyboardHighlightMode;
  isMobile?: boolean;
}

export const KeyRow = ({ 
  row, 
  activeKeys = [], 
  onKeyClick,
  onShortcutsChanged,
  selectedApplication = '',
  highlightMode = 'none',
  isMobile = false,
}: KeyRowProps) => {
  // Get all shortcuts to check application filtering
  const { shortcuts: allShortcuts } = useShortcuts();
  
  // Process keys that should be filtered (once for all keys in the row)
  const keyFilters = useMemo(() => {
    if (!selectedApplication) {
      // No filtering needed
      return {};
    }
    
    // For each key in this row, determine if it has shortcuts for the selected app
    return row.keys.reduce<Record<string, boolean>>((filters, keyData) => {
      const baseKey = getBaseKeyFromKeyId(keyData.id);
      const keyShortcuts = allShortcuts.filter(s => 
        (s.baseKey || '').toLowerCase() === baseKey.toLowerCase()
      );
      
      // Check if any shortcuts match the selected application
      const hasAppShortcuts = keyShortcuts.some(shortcut => 
        shortcut.application.toLowerCase() === selectedApplication.toLowerCase()
      );
      
      // Set to true if key should be filtered out (doesn't have shortcuts for the app)
      filters[keyData.id] = !hasAppShortcuts;
      
      return filters;
    }, {});
  }, [row.keys, selectedApplication, allShortcuts]);
  
  // Adjust spacing based on device size
  const keyGap = isMobile ? 'gap-0.5' : 'gap-1';
  const marginBottom = isMobile ? 'mb-0.5' : 'mb-1';
  
  return (
    <div className={`flex flex-row items-center justify-center ${keyGap} ${marginBottom}`}
         role="row"
         aria-label={`${row.id} row`}>
      {row.keys.map((keyData) => (
        <Key
          key={keyData.id}
          keyData={keyData}
          isActive={activeKeys.includes(keyData.id)}
          onClick={onKeyClick}
          onShortcutsChanged={onShortcutsChanged}
          highlightMode={highlightMode}
          isFiltered={keyFilters[keyData.id] || false}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};