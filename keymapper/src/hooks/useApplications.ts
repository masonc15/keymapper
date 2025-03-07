import { useMemo } from 'react';
import { Shortcut } from '@/types/shortcut';
import { useShortcuts } from './useShortcuts';
import { generateAppColor } from '@/utils/colorUtils';

export interface ApplicationWithColor {
  name: string;
  color: string;
}

/**
 * Custom hook to get a list of all unique applications with their colors
 * @returns Array of application objects with name and color
 */
export function useApplications(): ApplicationWithColor[] {
  const { shortcuts } = useShortcuts();
  
  return useMemo(() => {
    // Get unique application names
    const appNames = [...new Set(shortcuts.map(shortcut => shortcut.application))];
    
    // Create application objects with colors
    return appNames
      .map(name => ({
        name,
        color: generateAppColor(name)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [shortcuts]);
}

/**
 * Custom hook to get a mapping of application names to their colors
 * @returns Record mapping application names to their colors
 */
export function useApplicationColors(): Record<string, string> {
  const applications = useApplications();
  
  return useMemo(() => {
    return applications.reduce<Record<string, string>>(
      (acc, { name, color }) => {
        acc[name] = color;
        return acc;
      }, 
      {}
    );
  }, [applications]);
}

/**
 * Helper function to find shortcuts by application
 * @param shortcuts - List of shortcuts to filter
 * @param applicationName - Name of the application to filter by
 * @returns Array of shortcuts for the specified application
 */
export function getShortcutsByApplication(
  shortcuts: Shortcut[], 
  applicationName: string
): Shortcut[] {
  return shortcuts.filter(
    shortcut => shortcut.application.toLowerCase() === applicationName.toLowerCase()
  );
}