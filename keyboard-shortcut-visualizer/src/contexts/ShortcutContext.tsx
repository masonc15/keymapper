import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Shortcut } from '../types/shortcut';
import { 
  getShortcuts, 
  saveShortcuts, 
  initializeSampleShortcuts,
  addShortcut as addShortcutToStorage,
  updateShortcut as updateShortcutInStorage,
  deleteShortcut as deleteShortcutFromStorage
} from '../utils/storageUtils';
import { processShortcut } from '../utils/shortcutUtils';

// Define the context value type
interface ShortcutContextValue {
  shortcuts: Shortcut[];
  addShortcut: (shortcut: Omit<Shortcut, 'id'>) => Shortcut;
  updateShortcut: (shortcut: Shortcut) => Shortcut;
  deleteShortcut: (id: string) => boolean;
  findShortcutsByBaseKey: (baseKey: string) => Shortcut[];
  findShortcutById: (id: string) => Shortcut | undefined;
  findShortcutsByApplication: (application: string) => Shortcut[];
  clearAllShortcuts: () => void;
  loading: boolean;
}

// Create context with a default value
export const ShortcutContext = createContext<ShortcutContextValue>({
  shortcuts: [],
  addShortcut: () => ({ id: '', key_combination: '', application: '', description: '' }),
  updateShortcut: shortcut => shortcut,
  deleteShortcut: () => false,
  findShortcutsByBaseKey: () => [],
  findShortcutById: () => undefined,
  findShortcutsByApplication: () => [],
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

  // Initialize shortcuts from localStorage
  useEffect(() => {
    initializeSampleShortcuts();
    const loadedShortcuts = getShortcuts();
    setShortcuts(loadedShortcuts);
    setLoading(false);
  }, []);

  // Add a new shortcut
  const addShortcut = (shortcut: Omit<Shortcut, 'id'>): Shortcut => {
    // Process the shortcut to extract baseKey and modifiers
    const processedShortcut = processShortcut(shortcut);
    // Add to storage
    const newShortcut = addShortcutToStorage(processedShortcut);
    // Update state
    setShortcuts([...shortcuts, newShortcut]);
    return newShortcut;
  };

  // Update an existing shortcut
  const updateShortcut = (shortcut: Shortcut): Shortcut => {
    // Process the shortcut to extract baseKey and modifiers if they're not already set
    const processedShortcut = shortcut.baseKey && shortcut.modifiers 
      ? shortcut 
      : processShortcut(shortcut);
    
    // Update in storage
    const updatedShortcut = updateShortcutInStorage(processedShortcut);
    
    // Update state
    setShortcuts(
      shortcuts.map(s => s.id === updatedShortcut.id ? updatedShortcut : s)
    );
    
    return updatedShortcut;
  };

  // Delete a shortcut
  const deleteShortcut = (id: string): boolean => {
    // Delete from storage
    const success = deleteShortcutFromStorage(id);
    
    if (success) {
      // Update state
      setShortcuts(shortcuts.filter(s => s.id !== id));
    }
    
    return success;
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
    return shortcuts.filter(s => s.application === application);
  };

  // Clear all shortcuts
  const clearAllShortcuts = (): void => {
    saveShortcuts([]);
    setShortcuts([]);
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
    clearAllShortcuts,
    loading
  };

  return (
    <ShortcutContext.Provider value={contextValue}>
      {children}
    </ShortcutContext.Provider>
  );
};