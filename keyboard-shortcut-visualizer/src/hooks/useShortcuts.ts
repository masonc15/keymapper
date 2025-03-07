import { useContext } from 'react';
import { ShortcutContext } from '../contexts/ShortcutContext';
import { Shortcut } from '../types/shortcut';

/**
 * Custom hook to access the ShortcutContext
 * @returns All methods and properties from the ShortcutContext
 */
export function useShortcuts() {
  const context = useContext(ShortcutContext);
  
  if (context === undefined) {
    throw new Error('useShortcuts must be used within a ShortcutProvider');
  }
  
  return context;
}

/**
 * Get all unique applications from shortcuts
 * @param shortcuts - Array of shortcuts to extract applications from
 * @returns Array of unique application names
 */
export function useUniqueApplications(shortcuts: Shortcut[]): string[] {
  const applications = shortcuts.map(shortcut => shortcut.application);
  return [...new Set(applications)].sort();
}

/**
 * Hook to get shortcuts grouped by their base key
 * @param shortcuts - Array of shortcuts to group
 * @returns Object with base keys as keys and arrays of shortcuts as values
 */
export function useShortcutsByKey(shortcuts: Shortcut[]): Record<string, Shortcut[]> {
  const shortcutsByKey: Record<string, Shortcut[]> = {};
  
  shortcuts.forEach(shortcut => {
    const baseKey = shortcut.baseKey || '';
    if (!shortcutsByKey[baseKey]) {
      shortcutsByKey[baseKey] = [];
    }
    shortcutsByKey[baseKey].push(shortcut);
  });
  
  return shortcutsByKey;
}