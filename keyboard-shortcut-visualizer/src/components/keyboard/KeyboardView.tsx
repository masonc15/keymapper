import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { KeyboardLayout } from './KeyboardLayout';
import { KeyboardLegend } from './KeyboardLegend';
import { macbookAirKeyboardLayout } from '@/utils/keyboardLayout';
import { useShortcuts } from '@/hooks/useShortcuts';
import { getBaseKeyFromKeyId } from '@/utils/keyboardUtils';

export function KeyboardView() {
  const { findShortcutsByBaseKey } = useShortcuts();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleKeyClick = useCallback((keyId: string) => {
    const baseKey = getBaseKeyFromKeyId(keyId);
    const shortcuts = findShortcutsByBaseKey(baseKey);
    console.log(`Shortcuts for ${keyId} (baseKey: ${baseKey}):`, shortcuts);
  }, [findShortcutsByBaseKey]);

  // Handler for when shortcuts change
  const handleShortcutsChanged = useCallback(() => {
    // Force re-render the keyboard layout to reflect changes
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyboard View</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col p-4">
        <KeyboardLegend />
        
        <div className="max-w-4xl w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <KeyboardLayout 
              key={refreshKey} // Using a key for forced re-render when shortcuts change
              layout={macbookAirKeyboardLayout} 
              onKeyClick={handleKeyClick}
              onShortcutsChanged={handleShortcutsChanged}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}