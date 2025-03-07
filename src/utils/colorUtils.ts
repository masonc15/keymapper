// Color utility functions for shortcut visualization

/**
 * Generates a consistent color based on application name
 */
export function generateAppColor(appName: string): string {
  // Simple hash function to generate a number from a string
  const hash = Array.from(appName).reduce(
    (hash, char) => (hash * 31 + char.charCodeAt(0)) & 0xffffffff,
    0
  );
  
  // Use the hash to generate HSL values with good saturation and lightness
  const hue = hash % 360;
  const saturation = 65 + (hash % 20); // 65-85%
  const lightness = 55 + (hash % 20); // 55-75%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Determines if text should be dark or light based on background color
 * Returns 'text-gray-900' for dark text or 'text-white' for light text
 */
export function getTextColorForBackground(backgroundColor: string): string {
  // For HSL colors, we can roughly determine if a color is light or dark
  // by checking the lightness value
  const lightnessMatch = backgroundColor.match(/hsl\(\s*\d+\s*,\s*\d+%\s*,\s*(\d+)%\s*\)/);
  
  if (lightnessMatch && lightnessMatch[1]) {
    const lightness = parseInt(lightnessMatch[1], 10);
    return lightness > 65 ? 'text-gray-900' : 'text-white';
  }
  
  // Fallback to dark text
  return 'text-gray-900';
}

/**
 * Returns a Tailwind CSS class for application badge background
 */
export function getAppBadgeClass(appName: string): string {
  // Predefined applications with specific colors
  const appColors: Record<string, string> = {
    'Firefox': 'bg-orange-500 text-white',
    'Chrome': 'bg-blue-500 text-white',
    'Safari': 'bg-blue-400 text-white',
    'VSCode': 'bg-blue-600 text-white',
    'Terminal': 'bg-gray-800 text-white',
    'Finder': 'bg-blue-500 text-white',
    'Slack': 'bg-purple-500 text-white',
    'Spotify': 'bg-green-500 text-white',
    'Mail': 'bg-blue-400 text-white',
    'Calendar': 'bg-red-500 text-white',
    'System': 'bg-gray-700 text-white',
    'Global': 'bg-gray-700 text-white',
  };
  
  return appColors[appName] || 'bg-gray-500 text-white';
}

/**
 * Blend two colors together
 * Used when a key has multiple shortcuts from different applications
 */
export function blendColors(colors: string[]): string {
  if (colors.length === 0) return 'transparent';
  if (colors.length === 1) return colors[0];
  
  // For simplicity, we'll use a gradient for multiple colors
  const gradient = colors.length > 2 
    ? `linear-gradient(135deg, ${colors.join(', ')})`
    : `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 49%, ${colors[1]} 51%, ${colors[1]} 100%)`;
  
  return gradient;
}