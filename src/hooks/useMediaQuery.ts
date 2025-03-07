import { useState, useEffect } from 'react';

/**
 * Custom hook to handle responsive media queries
 * @param query The media query to match
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Safely use window.matchMedia only in browser environment
  const getMatches = (query: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    // Define callback for matchMedia
    const handleChange = () => {
      setMatches(getMatches(query));
    };

    // Create media query list
    const mediaQueryList = window.matchMedia(query);
    
    // Initial check
    handleChange();

    // Add listener for changes
    // Use addEventListener for modern browsers and addListener as fallback
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // For older browsers (Safari < 14)
      mediaQueryList.addListener(handleChange);
    }

    // Clean up
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // For older browsers (Safari < 14)
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}