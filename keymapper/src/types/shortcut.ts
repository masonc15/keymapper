export interface Shortcut {
  id: string;
  key_combination: string;
  application: string;
  description: string;
  baseKey?: string; // The main key without modifiers (e.g., 'K')
  modifiers?: string[]; // Array of modifiers (e.g., ['⌘', 'Shift'])
}