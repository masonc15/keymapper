import { Shortcut } from '@/types/shortcut';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  column: keyof Shortcut | '';
  direction: SortDirection;
}

export interface TableFilters {
  search: string;
  application: string;
}

export interface TableState {
  sortConfig: SortConfig;
  filters: TableFilters;
}

/**
 * Sort shortcuts based on the provided configuration
 */
export function sortShortcuts(
  shortcuts: Shortcut[],
  sortConfig: SortConfig
): Shortcut[] {
  if (!sortConfig.column) return shortcuts;

  return [...shortcuts].sort((a, b) => {
    const aValue = a[sortConfig.column] as string;
    const bValue = b[sortConfig.column] as string;

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Filter shortcuts based on search text and application filter
 */
export function filterShortcuts(
  shortcuts: Shortcut[],
  filters: TableFilters
): Shortcut[] {
  return shortcuts.filter((shortcut) => {
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        shortcut.key_combination.toLowerCase().includes(searchTerm) ||
        shortcut.application.toLowerCase().includes(searchTerm) ||
        shortcut.description.toLowerCase().includes(searchTerm);

      if (!matchesSearch) return false;
    }

    // Apply application filter
    if (filters.application && shortcut.application !== filters.application) {
      return false;
    }

    return true;
  });
}

/**
 * Save table state to localStorage
 */
export function saveTableState(state: TableState): void {
  localStorage.setItem('tableState', JSON.stringify(state));
}

/**
 * Load table state from localStorage
 */
export function loadTableState(): TableState | null {
  const saved = localStorage.getItem('tableState');
  if (!saved) return null;

  try {
    return JSON.parse(saved) as TableState;
  } catch (error) {
    console.error('Failed to parse table state from localStorage:', error);
    return null;
  }
}

/**
 * Get default table state
 */
export function getDefaultTableState(): TableState {
  return {
    sortConfig: {
      column: 'application',
      direction: 'asc',
    },
    filters: {
      search: '',
      application: '',
    },
  };
}