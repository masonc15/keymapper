import { useMemo } from 'react';
import { useShortcuts } from './useShortcuts';
import { Shortcut } from '@/types/shortcut';
import { generateAppColor } from '@/utils/colorUtils';
import { getBaseKeyFromKeyId } from '@/utils/keyboardUtils';

interface ShortcutsByApp {
  [app: string]: Shortcut[];
}

interface KeyShortcutsResult {
  shortcuts: Shortcut[];
  shortcutsByApp: ShortcutsByApp;
  hasShortcuts: boolean;
  uniqueApps: string[];
  appColors: Record<string, string>;
}

/**
 * Custom hook to get shortcuts associated with a specific key
 * @param keyId - The ID of the key to get shortcuts for
 * @returns Object containing shortcuts and helper methods
 */
export function useKeyShortcuts(keyId: string): KeyShortcutsResult {
  const { findShortcutsByBaseKey } = useShortcuts();
  
  // Get all shortcuts associated with this key
  const baseKey = getBaseKeyFromKeyId(keyId);
  const shortcuts = useMemo(() => findShortcutsByBaseKey(baseKey), [baseKey, findShortcutsByBaseKey]);
  
  // Group shortcuts by application
  const shortcutsByApp = useMemo(() => {
    return shortcuts.reduce<ShortcutsByApp>((groupedShortcuts, shortcut) => {
      const app = shortcut.application;
      if (!groupedShortcuts[app]) {
        groupedShortcuts[app] = [];
      }
      groupedShortcuts[app].push(shortcut);
      return groupedShortcuts;
    }, {});
  }, [shortcuts]);
  
  // Get unique app names
  const uniqueApps = useMemo(() => Object.keys(shortcutsByApp), [shortcutsByApp]);
  
  // Generate colors for each application
  const appColors = useMemo(() => {
    return uniqueApps.reduce<Record<string, string>>((colors, app) => {
      colors[app] = generateAppColor(app);
      return colors;
    }, {});
  }, [uniqueApps]);
  
  return {
    shortcuts,
    shortcutsByApp,
    hasShortcuts: shortcuts.length > 0,
    uniqueApps,
    appColors,
  };
}