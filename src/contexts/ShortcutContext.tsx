import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Shortcut } from '@/types/shortcut';
import { 
  getShortcuts, 
  saveShortcuts, 
  initializeSampleShortcuts,
  addShortcut as addShortcutToStorage,
  updateShortcut as updateShortcutInStorage,
  deleteShortcut as deleteShortcutFromStorage
} from '@/utils/storageUtils';
import { processShortcut } from '@/utils/shortcutUtils';
import { detectConflicts, ConflictType, ShortcutConflict } from '@/utils/conflictUtils';

// Override options for conflict resolution
export interface OverrideOptions {
  force: boolean;
  replaceConflicting?: boolean;
}

// Operation result with conflict information
export interface ShortcutOperationResult<T> {
  success: boolean;
  data?: T;
  conflict?: ShortcutConflict;
  error?: string;
}

// Define the context value type
interface ShortcutContextValue {
  shortcuts: Shortcut[];
  addShortcut: (
    shortcut: Omit<Shortcut, 'id'>, 
    options?: OverrideOptions
  ) => Promise<ShortcutOperationResult<Shortcut>>;
  updateShortcut: (
    shortcut: Shortcut, 
    options?: OverrideOptions
  ) => Promise<ShortcutOperationResult<Shortcut>>;
  deleteShortcut: (id: string) => Promise<boolean>;
  findShortcutsByBaseKey: (baseKey: string) => Shortcut[];
  findShortcutById: (id: string) => Shortcut | undefined;
  findShortcutsByApplication: (application: string) => Shortcut[];
  checkForConflicts: (
    shortcut: Pick<Shortcut, 'key_combination' | 'application' | 'description'>, 
    currentId?: string
  ) => ShortcutConflict;
  clearAllShortcuts: () => void;
  loading: boolean;
}

// Create context with a default value
export const ShortcutContext = createContext<ShortcutContextValue>({
  shortcuts: [],
  addShortcut: async () => ({ 
    success: false, 
    error: 'Not implemented' 
  }),
  updateShortcut: async (shortcut) => ({ 
    success: false, 
    error: 'Not implemented'
  }),
  deleteShortcut: async () => false,
  findShortcutsByBaseKey: () => [],
  findShortcutById: () => undefined,
  findShortcutsByApplication: () => [],
  checkForConflicts: () => ({
    type: ConflictType.NONE,
    message: '',
    conflictingShortcuts: [],
    severity: 'info'
  }),
  clearAllShortcuts: () => {},
  loading: true
});

// Define props for the provider component
interface ShortcutProviderProps {
  children: ReactNode;
}

// Create the provider component
export const ShortcutProvider: React.FC<ShortcutProviderProps> = ({ children }) => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [conflictHistory, setConflictHistory] = useState<{
    [id: string]: ShortcutConflict
  }>({});

  // Initialize shortcuts from localStorage
  useEffect(() => {
    initializeSampleShortcuts();
    const loadedShortcuts = getShortcuts();
    setShortcuts(loadedShortcuts);
    setLoading(false);
  }, []);

  // Check for conflicts
  const checkForConflicts = (
    shortcut: Pick<Shortcut, 'key_combination' | 'application' | 'description'>,
    currentId?: string
  ): ShortcutConflict => {
    return detectConflicts(shortcut, shortcuts, currentId);
  };

  // Add a new shortcut with conflict checking
  const addShortcut = async (
    shortcut: Omit<Shortcut, 'id'>,
    options: OverrideOptions = { force: false }
  ): Promise<ShortcutOperationResult<Shortcut>> => {
    try {
      // Process the shortcut to extract baseKey and modifiers
      const processedShortcut = processShortcut(shortcut);
      
      // Check for conflicts
      const conflict = checkForConflicts(processedShortcut);
      
      // If we have a conflict and we're not forcing the operation
      if (conflict.type !== ConflictType.NONE && !options.force) {
        // If it's an exact conflict, we can't proceed
        if (conflict.type === ConflictType.EXACT) {
          return { 
            success: false, 
            conflict,
            error: 'Exact duplicate shortcut exists'
          };
        }
        
        // For other conflict types, we return the conflict but don't proceed
        return {
          success: false,
          conflict,
          error: 'Conflict detected, requires confirmation'
        };
      }
      
      // If we're forcing and need to replace conflicting shortcuts
      if (options.force && options.replaceConflicting && conflict.conflictingShortcuts.length > 0) {
        // For app-specific conflicts, delete the conflicting shortcuts first
        if (conflict.type === ConflictType.APP_SPECIFIC) {
          // Remove all conflicting shortcuts with the same app
          const idsToDelete = conflict.conflictingShortcuts
            .filter(s => s.application.toLowerCase() === shortcut.application.toLowerCase())
            .map(s => s.id);
            
          // Delete each conflicting shortcut
          for (const id of idsToDelete) {
            await deleteShortcut(id);
          }
        }
      }
      
      // Add to storage
      const newShortcut = addShortcutToStorage(processedShortcut);
      
      // Update state
      setShortcuts(prev => [...prev, newShortcut]);
      
      // If there was a conflict but we proceeded, record it
      if (conflict.type !== ConflictType.NONE) {
        setConflictHistory(prev => ({
          ...prev,
          [newShortcut.id]: conflict
        }));
      }
      
      return { 
        success: true, 
        data: newShortcut,
        conflict: conflict.type !== ConflictType.NONE ? conflict : undefined
      };
    } catch (error) {
      console.error('Error adding shortcut:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error adding shortcut'
      };
    }
  };

  // Update an existing shortcut with conflict checking
  const updateShortcut = async (
    shortcut: Shortcut,
    options: OverrideOptions = { force: false }
  ): Promise<ShortcutOperationResult<Shortcut>> => {
    try {
      // Process the shortcut to extract baseKey and modifiers if they're not already set
      const processedShortcut = shortcut.baseKey && shortcut.modifiers 
        ? shortcut 
        : processShortcut(shortcut);
      
      // Check for conflicts, excluding the current shortcut
      const conflict = checkForConflicts(processedShortcut, shortcut.id);
      
      // If we have a conflict and we're not forcing the operation
      if (conflict.type !== ConflictType.NONE && !options.force) {
        // If it's an exact conflict, we can't proceed
        if (conflict.type === ConflictType.EXACT) {
          return { 
            success: false, 
            conflict,
            error: 'Exact duplicate shortcut exists'
          };
        }
        
        // For other conflict types, we return the conflict but don't proceed
        return {
          success: false,
          conflict,
          error: 'Conflict detected, requires confirmation'
        };
      }
      
      // If we're forcing and need to replace conflicting shortcuts
      if (options.force && options.replaceConflicting && conflict.conflictingShortcuts.length > 0) {
        // For app-specific conflicts, delete the conflicting shortcuts first
        if (conflict.type === ConflictType.APP_SPECIFIC) {
          // Remove all conflicting shortcuts with the same app
          const idsToDelete = conflict.conflictingShortcuts
            .filter(s => s.application.toLowerCase() === shortcut.application.toLowerCase())
            .map(s => s.id);
            
          // Delete each conflicting shortcut
          for (const id of idsToDelete) {
            await deleteShortcut(id);
          }
        }
      }
      
      // Update in storage
      const updatedShortcut = updateShortcutInStorage(processedShortcut);
      
      // Update state
      setShortcuts(prev => 
        prev.map(s => s.id === updatedShortcut.id ? updatedShortcut : s)
      );
      
      // If there was a conflict but we proceeded, record it
      if (conflict.type !== ConflictType.NONE) {
        setConflictHistory(prev => ({
          ...prev,
          [updatedShortcut.id]: conflict
        }));
      }
      
      return { 
        success: true, 
        data: updatedShortcut,
        conflict: conflict.type !== ConflictType.NONE ? conflict : undefined
      };
    } catch (error) {
      console.error('Error updating shortcut:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error updating shortcut'
      };
    }
  };

  // Delete a shortcut
  const deleteShortcut = async (id: string): Promise<boolean> => {
    try {
      // Delete from storage
      const success = deleteShortcutFromStorage(id);
      
      if (success) {
        // Update state
        setShortcuts(prev => prev.filter(s => s.id !== id));
        
        // Remove from conflict history if exists
        if (conflictHistory[id]) {
          setConflictHistory(prev => {
            const newHistory = { ...prev };
            delete newHistory[id];
            return newHistory;
          });
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting shortcut:', error);
      return false;
    }
  };

  // Find shortcuts by base key
  const findShortcutsByBaseKey = (baseKey: string): Shortcut[] => {
    return shortcuts.filter(s => s.baseKey === baseKey);
  };

  // Find a shortcut by ID
  const findShortcutById = (id: string): Shortcut | undefined => {
    return shortcuts.find(s => s.id === id);
  };

  // Find shortcuts by application
  const findShortcutsByApplication = (application: string): Shortcut[] => {
    return shortcuts.filter(s => s.application.toLowerCase() === application.toLowerCase());
  };

  // Clear all shortcuts
  const clearAllShortcuts = (): void => {
    saveShortcuts([]);
    setShortcuts([]);
    setConflictHistory({});
  };

  // Create the context value object
  const contextValue: ShortcutContextValue = {
    shortcuts,
    addShortcut,
    updateShortcut,
    deleteShortcut,
    findShortcutsByBaseKey,
    findShortcutById,
    findShortcutsByApplication,
    checkForConflicts,
    clearAllShortcuts,
    loading
  };

  return (
    <ShortcutContext.Provider value={contextValue}>
      {children}
    </ShortcutContext.Provider>
  );
};