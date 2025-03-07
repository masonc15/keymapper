import { v4 as uuidv4 } from 'uuid';
import { Shortcut } from '../types/shortcut';
import { parseKeyCombination, formatKeyCombination } from './keyboardUtils';

/**
 * Generates a unique ID for a new shortcut
 * @returns A unique string ID
 */
export function generateShortcutId(): string {
  return uuidv4();
}

/**
 * Processes a shortcut by adding baseKey and modifiers properties
 * @param shortcut - The shortcut to process
 * @returns The processed shortcut with baseKey and modifiers added
 */
export function processShortcut(shortcut: Omit<Shortcut, 'id' | 'baseKey' | 'modifiers'>): Omit<Shortcut, 'id'> {
  const { baseKey, modifiers } = parseKeyCombination(shortcut.key_combination);
  return {
    ...shortcut,
    baseKey,
    modifiers
  };
}

/**
 * Normalizes a key combination to a standard format
 * @param keyCombination - The key combination string to normalize
 * @returns A normalized key combination string
 */
export function normalizeKeyCombination(keyCombination: string): string {
  const { baseKey, modifiers } = parseKeyCombination(keyCombination);
  return formatKeyCombination(baseKey, modifiers.sort());
}

/**
 * Checks if two shortcuts have conflicting key combinations
 * @param shortcut1 - First shortcut to compare
 * @param shortcut2 - Second shortcut to compare
 * @returns Boolean indicating if the shortcuts conflict
 */
export function shortcutsConflict(shortcut1: Shortcut, shortcut2: Shortcut): boolean {
  // If they have the same ID, they're the same shortcut
  if (shortcut1.id === shortcut2.id) return false;
  
  // If they have the same key combination and application, they conflict
  return (
    normalizeKeyCombination(shortcut1.key_combination) === normalizeKeyCombination(shortcut2.key_combination) &&
    shortcut1.application === shortcut2.application
  );
}