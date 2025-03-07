/**
 * Parses a key combination string into baseKey and modifiers
 * @param keyCombination - A string representing a key combination (e.g., "⌘+Shift+K")
 * @returns An object with baseKey and modifiers
 */
export function parseKeyCombination(keyCombination: string): { baseKey: string; modifiers: string[] } {
  const parts = keyCombination.split('+');
  const baseKey = parts.pop() || '';
  const modifiers = parts;
  return { baseKey, modifiers };
}

/**
 * Formats modifiers and baseKey into a key combination string
 * @param baseKey - The main key (e.g., "K")
 * @param modifiers - Array of modifiers (e.g., ["⌘", "Shift"])
 * @returns A formatted key combination string (e.g., "⌘+Shift+K")
 */
export function formatKeyCombination(baseKey: string, modifiers: string[]): string {
  if (modifiers.length === 0) return baseKey;
  return `${modifiers.join('+')}+${baseKey}`;
}

/**
 * Mapping between keyboard key IDs and shortcut base keys
 */
export const keyboardToBaseKeyMap: Record<string, string> = {
  // Letter keys
  'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E',
  'f': 'F', 'g': 'G', 'h': 'H', 'i': 'I', 'j': 'J', 
  'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O',
  'p': 'P', 'q': 'Q', 'r': 'R', 's': 'S', 't': 'T',
  'u': 'U', 'v': 'V', 'w': 'W', 'x': 'X', 'y': 'Y', 'z': 'Z',
  
  // Number keys
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
  '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  
  // Function keys
  'f1': 'F1', 'f2': 'F2', 'f3': 'F3', 'f4': 'F4', 'f5': 'F5',
  'f6': 'F6', 'f7': 'F7', 'f8': 'F8', 'f9': 'F9', 'f10': 'F10',
  'f11': 'F11', 'f12': 'F12',
  
  // Special keys
  'tab': 'Tab', 'escape': 'Esc', 'space': 'Space', 'enter': 'Return',
  'backspace': 'Backspace', 'delete': 'Delete',
  'left': 'Left', 'right': 'Right', 'up': 'Up', 'down': 'Down',
  
  // Modifiers are typically not used as base keys, but we'll include them
  'command-left': 'Command', 'command-right': 'Command',
  'option-left': 'Option', 'option-right': 'Option',
  'shift-left': 'Shift', 'shift-right': 'Shift',
  'control-left': 'Control',
};

/**
 * Convert keyboard key IDs to shortcut baseKey format
 * @param keyId - The keyboard key ID
 * @returns The corresponding shortcut base key
 */
export function getBaseKeyFromKeyId(keyId: string): string {
  return keyboardToBaseKeyMap[keyId] || keyId;
}

// Mapping for modifier keys to their symbols
export const modifierSymbols: Record<string, string> = {
  'Meta': '⌘',       // Command key on Mac
  'Command': '⌘',    // Alternate name
  'Alt': '⌥',        // Option key on Mac
  'Option': '⌥',     // Alternate name
  'Control': '⌃',    // Control key
  'Ctrl': '⌃',       // Alternate name
  'Shift': '⇧',      // Shift key
};

// Order for sorting modifiers
export const modifierOrder: Record<string, number> = {
  '⌃': 1, // Control first
  '⌥': 2, // Option second
  '⇧': 3, // Shift third
  '⌘': 4, // Command last (Mac convention)
};

/**
 * Converts a KeyboardEvent to a standardized key combination string
 * @param event - The KeyboardEvent to convert
 * @returns A formatted key combination string (e.g., "⌘+⇧+K")
 */
export function keyEventToKeyCombo(event: KeyboardEvent): string | null {
  // Ignore standalone modifier key presses
  if (['Meta', 'Alt', 'Control', 'Shift'].includes(event.key)) {
    return null;
  }
  
  // Get the main key
  const key = getNormalizedKeyName(event);
  if (!key) return null;
  
  // Get active modifiers
  const modifiers: string[] = [];
  if (event.metaKey) modifiers.push('⌘');
  if (event.altKey) modifiers.push('⌥');
  if (event.ctrlKey) modifiers.push('⌃');
  if (event.shiftKey) modifiers.push('⇧');
  
  // Sort modifiers in standard order
  modifiers.sort((a, b) => modifierOrder[a] - modifierOrder[b]);
  
  // Format the key combination
  return modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;
}

/**
 * Gets a normalized name for a key from a KeyboardEvent
 * @param event - The KeyboardEvent
 * @returns A normalized key name
 */
export function getNormalizedKeyName(event: KeyboardEvent): string | null {
  const { key, code } = event;
  
  // Handle special cases
  if (key === ' ' || code === 'Space') return 'Space';
  if (key === 'Escape') return 'Esc';
  if (key === 'Enter') return 'Return';
  
  // Function keys
  if (key.match(/^F\d+$/)) return key;
  
  // Arrow keys
  if (key === 'ArrowLeft') return 'Left';
  if (key === 'ArrowRight') return 'Right';
  if (key === 'ArrowUp') return 'Up';
  if (key === 'ArrowDown') return 'Down';
  
  // Common keys
  if (key === 'Backspace') return 'Backspace';
  if (key === 'Delete') return 'Delete';
  if (key === 'Tab') return 'Tab';
  
  // For letter keys, return uppercase
  if (key.length === 1 && key.match(/[a-z]/i)) {
    return key.toUpperCase();
  }
  
  // For numbers and other characters, return as is
  if (key.length === 1) {
    return key;
  }
  
  // For any other keys, null indicates we should ignore them
  return null;
}

/**
 * Checks if a key combination is valid
 * @param keyCombination - The key combination to check
 * @returns True if the combination is valid, false otherwise
 */
export function isValidKeyCombination(keyCombination: string): boolean {
  if (!keyCombination) return false;
  
  const { baseKey, modifiers } = parseKeyCombination(keyCombination);
  
  // Must have a base key
  if (!baseKey) return false;
  
  // Valid modifier symbols
  const validModifiers = Object.values(modifierSymbols);
  
  // Check if all modifiers are valid
  return modifiers.every(modifier => validModifiers.includes(modifier));
}