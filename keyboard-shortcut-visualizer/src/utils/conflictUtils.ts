import { Shortcut } from '@/types/shortcut';
import { normalizeKeyCombination } from './shortcutUtils';

/**
 * Types of shortcut conflicts
 */
export enum ConflictType {
  EXACT = 'exact',             // Same key combo and app (critical)
  APP_SPECIFIC = 'appSpecific', // Same key combo, same app, different action (warning)
  CROSS_APP = 'crossApp',      // Same key combo, different app (info)
  NONE = 'none'                // No conflict
}

/**
 * Structure representing a shortcut conflict
 */
export interface ShortcutConflict {
  type: ConflictType;
  message: string;
  conflictingShortcuts: Shortcut[];
  severity: 'error' | 'warning' | 'info';
}

/**
 * Check if two shortcuts have the same key combination
 */
export function hasSameKeyCombination(shortcut1: Shortcut | Pick<Shortcut, 'key_combination'>, 
                                     shortcut2: Shortcut | Pick<Shortcut, 'key_combination'>): boolean {
  const normalizedKey1 = normalizeKeyCombination(shortcut1.key_combination);
  const normalizedKey2 = normalizeKeyCombination(shortcut2.key_combination);
  
  return normalizedKey1 === normalizedKey2;
}

/**
 * Check if two shortcuts are for the same application
 */
export function isSameApplication(shortcut1: Shortcut | Pick<Shortcut, 'application'>, 
                                shortcut2: Shortcut | Pick<Shortcut, 'application'>): boolean {
  return shortcut1.application.toLowerCase() === shortcut2.application.toLowerCase();
}

/**
 * Detect and describe conflicts between a shortcut and a list of existing shortcuts
 * @param shortcut - The shortcut to check
 * @param existingShortcuts - List of existing shortcuts to check against
 * @param currentShortcutId - Optional ID of the current shortcut (for edit mode)
 * @returns An object describing any conflicts found
 */
export function detectConflicts(
  shortcut: Pick<Shortcut, 'key_combination' | 'application' | 'description'>,
  existingShortcuts: Shortcut[],
  currentShortcutId?: string
): ShortcutConflict {
  if (!shortcut.key_combination) {
    // No key combination provided yet
    return {
      type: ConflictType.NONE,
      message: '',
      conflictingShortcuts: [],
      severity: 'info'
    };
  }
  
  // Filter out the current shortcut when in edit mode
  const shortcuts = currentShortcutId 
    ? existingShortcuts.filter(s => s.id !== currentShortcutId)
    : existingShortcuts;
  
  // Find exact matches (same key combination, same application)
  const exactMatches = shortcuts.filter(s => 
    hasSameKeyCombination(shortcut, s) && 
    isSameApplication(shortcut, s)
  );
  
  if (exactMatches.length > 0) {
    return {
      type: ConflictType.EXACT,
      message: `This shortcut conflicts with ${exactMatches.length} existing shortcut(s) in the same application.`,
      conflictingShortcuts: exactMatches,
      severity: 'error'
    };
  }
  
  // Find same application, different purpose conflicts
  const appSpecificMatches = shortcuts.filter(s => 
    hasSameKeyCombination(shortcut, s) && 
    isSameApplication(shortcut, s) &&
    s.description !== shortcut.description
  );
  
  if (appSpecificMatches.length > 0) {
    return {
      type: ConflictType.APP_SPECIFIC,
      message: `This shortcut will override ${appSpecificMatches.length} existing shortcut(s) in ${shortcut.application}.`,
      conflictingShortcuts: appSpecificMatches,
      severity: 'warning'
    };
  }
  
  // Find cross-application conflicts (same key combo, different app)
  const crossAppMatches = shortcuts.filter(s => 
    hasSameKeyCombination(shortcut, s) && 
    !isSameApplication(shortcut, s)
  );
  
  if (crossAppMatches.length > 0) {
    return {
      type: ConflictType.CROSS_APP,
      message: `This key combination is already used by ${crossAppMatches.length} shortcut(s) in other applications.`,
      conflictingShortcuts: crossAppMatches,
      severity: 'info'
    };
  }
  
  // No conflicts found
  return {
    type: ConflictType.NONE,
    message: '',
    conflictingShortcuts: [],
    severity: 'info'
  };
}

/**
 * Get descriptive text for the conflict type
 */
export function getConflictTypeDescription(type: ConflictType): string {
  switch (type) {
    case ConflictType.EXACT:
      return 'Exact duplicate';
    case ConflictType.APP_SPECIFIC:
      return 'Same shortcut, different function';
    case ConflictType.CROSS_APP:
      return 'Used in other applications';
    case ConflictType.NONE:
      return 'No conflict';
  }
}

/**
 * Get a CSS class for the conflict severity
 */
export function getConflictSeverityClass(severity: 'error' | 'warning' | 'info'): string {
  switch (severity) {
    case 'error':
      return 'bg-red-50 border-red-200 text-red-600';
    case 'warning':
      return 'bg-amber-50 border-amber-200 text-amber-600';
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-600';
  }
}

/**
 * Check for conflicts between shortcuts on the same key
 * 
 * @param shortcuts - List of shortcuts for a specific key
 * @returns True if any conflicts are found, false otherwise
 */
export function checkForKeyConflicts(shortcuts: Shortcut[]): boolean {
  if (shortcuts.length <= 1) return false;
  
  // Check for conflicting application shortcuts
  // (same key combination within the same application)
  const appShortcuts = new Map<string, Shortcut[]>();
  
  // Group shortcuts by application
  for (const shortcut of shortcuts) {
    const app = shortcut.application.toLowerCase();
    if (!appShortcuts.has(app)) {
      appShortcuts.set(app, []);
    }
    appShortcuts.get(app)!.push(shortcut);
  }
  
  // Check for multiple shortcuts in the same application
  for (const [app, shortcuts] of appShortcuts.entries()) {
    if (shortcuts.length > 1) {
      return true; // Conflict found within the same application
    }
  }
  
  // Check for global shortcuts that might conflict with app-specific ones
  const hasGlobalShortcuts = appShortcuts.has('global') || 
                             appShortcuts.has('system');
  
  if (hasGlobalShortcuts && appShortcuts.size > 1) {
    return true; // Global shortcuts might conflict with app-specific ones
  }
  
  return false;
}