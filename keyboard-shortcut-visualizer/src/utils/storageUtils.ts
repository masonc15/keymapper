import { Shortcut } from '@/types/shortcut';
import { generateShortcutId, processShortcut } from '@/utils/shortcutUtils';

const STORAGE_KEY = 'keyboard-shortcuts';

/**
 * Retrieves all shortcuts from localStorage
 * @returns Array of shortcuts
 */
export function getShortcuts(): Shortcut[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Shortcut[];
  } catch (error) {
    console.error('Error retrieving shortcuts from localStorage:', error);
    return [];
  }
}

/**
 * Saves shortcuts to localStorage
 * @param shortcuts - Array of shortcuts to save
 */
export function saveShortcuts(shortcuts: Shortcut[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
  } catch (error) {
    console.error('Error saving shortcuts to localStorage:', error);
  }
}

/**
 * Adds a new shortcut to localStorage
 * @param shortcut - The shortcut to add (without id)
 * @returns The added shortcut with an id
 */
export function addShortcut(shortcut: Omit<Shortcut, 'id'>): Shortcut {
  try {
    const shortcuts = getShortcuts();
    const newShortcut: Shortcut = {
      ...shortcut,
      id: generateShortcutId()
    };
    saveShortcuts([...shortcuts, newShortcut]);
    return newShortcut;
  } catch (error) {
    console.error('Error adding shortcut to localStorage:', error);
    throw new Error('Failed to add shortcut');
  }
}

/**
 * Updates an existing shortcut in localStorage
 * @param updatedShortcut - The shortcut with updated values
 * @returns The updated shortcut
 */
export function updateShortcut(updatedShortcut: Shortcut): Shortcut {
  try {
    const shortcuts = getShortcuts();
    const index = shortcuts.findIndex(s => s.id === updatedShortcut.id);
    
    if (index === -1) {
      throw new Error(`Shortcut with id ${updatedShortcut.id} not found`);
    }
    
    const updatedShortcuts = [...shortcuts];
    updatedShortcuts[index] = updatedShortcut;
    
    saveShortcuts(updatedShortcuts);
    return updatedShortcut;
  } catch (error) {
    console.error('Error updating shortcut in localStorage:', error);
    throw new Error('Failed to update shortcut');
  }
}

/**
 * Deletes a shortcut from localStorage
 * @param id - ID of the shortcut to delete
 * @returns Boolean indicating success
 */
export function deleteShortcut(id: string): boolean {
  try {
    const shortcuts = getShortcuts();
    const filteredShortcuts = shortcuts.filter(s => s.id !== id);
    
    // If lengths match, nothing was removed
    if (shortcuts.length === filteredShortcuts.length) {
      return false;
    }
    
    saveShortcuts(filteredShortcuts);
    return true;
  } catch (error) {
    console.error('Error deleting shortcut from localStorage:', error);
    return false;
  }
}

/**
 * Clears all shortcuts from localStorage
 */
export function clearShortcuts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing shortcuts from localStorage:', error);
  }
}

/**
 * Sample data to initialize when no shortcuts exist
 */
export const sampleShortcuts: Omit<Shortcut, 'id'>[] = [
  {
    key_combination: '⌘+Space',
    application: 'macOS',
    description: 'Open Spotlight search',
    baseKey: 'Space',
    modifiers: ['⌘']
  },
  {
    key_combination: '⌘+C',
    application: 'Global',
    description: 'Copy selected content',
    baseKey: 'C',
    modifiers: ['⌘']
  },
  {
    key_combination: '⌘+V',
    application: 'Global',
    description: 'Paste from clipboard',
    baseKey: 'V',
    modifiers: ['⌘']
  },
  {
    key_combination: '⌘+⇧+4',
    application: 'macOS',
    description: 'Take a screenshot of a selected area',
    baseKey: '4',
    modifiers: ['⌘', '⇧']
  },
  {
    key_combination: '⌘+⌥+Esc',
    application: 'macOS',
    description: 'Force quit applications',
    baseKey: 'Esc',
    modifiers: ['⌘', '⌥']
  },
  {
    key_combination: '⌘+T',
    application: 'Browser',
    description: 'Open new tab',
    baseKey: 'T',
    modifiers: ['⌘']
  },
  {
    key_combination: '⌘+⇧+T',
    application: 'Browser',
    description: 'Reopen closed tab',
    baseKey: 'T',
    modifiers: ['⌘', '⇧']
  },
  {
    key_combination: '⌘+P',
    application: 'VS Code',
    description: 'Quick open, go to file',
    baseKey: 'P',
    modifiers: ['⌘']
  }
];

/**
 * Initializes sample shortcuts if no shortcuts exist in localStorage
 */
export function initializeSampleShortcuts(): void {
  const shortcuts = getShortcuts();
  if (shortcuts.length === 0) {
    const initialShortcuts = sampleShortcuts.map(shortcut => ({
      ...shortcut,
      id: generateShortcutId()
    }));
    saveShortcuts(initialShortcuts);
  }
}