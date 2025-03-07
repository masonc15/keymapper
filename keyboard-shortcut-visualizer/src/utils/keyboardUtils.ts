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