import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { KeyboardLayout } from './KeyboardLayout';
import { KeyboardLegend } from './KeyboardLegend';
import { KeyboardControls, KeyboardHighlightMode } from './KeyboardControls';
import { macbookAirKeyboardLayout, tabletKeyboardLayout, mobileKeyboardLayout } from '@/utils/keyboardLayout';
import { useShortcuts } from '@/hooks/useShortcuts';
import { getBaseKeyFromKeyId } from '@/utils/keyboardUtils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function KeyboardView() {
  const { findShortcutsByBaseKey } = useShortcuts();
  
  // Responsive layout detection using media queries
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isMobile = useMediaQuery('(max-width: 639px)');
  
  // State for keyboard view
  const [refreshKey, setRefreshKey] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState('');
  const [highlightMode, setHighlightMode] = useState<KeyboardHighlightMode>('none');
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
  
  // Select the appropriate keyboard layout based on screen size
  const keyboardLayout = useMemo(() => {
    if (isMobile) return mobileKeyboardLayout;
    if (isTablet) return tabletKeyboardLayout;
    return macbookAirKeyboardLayout;
  }, [isDesktop, isTablet, isMobile]);
  
  // Handle key click
  const handleKeyClick = useCallback((keyId: string) => {
    const baseKey = getBaseKeyFromKeyId(keyId);
    const shortcuts = findShortcutsByBaseKey(baseKey);
    
    // Announce to screen readers
    const numShortcuts = shortcuts.length;
    const announcement = numShortcuts > 0 
      ? `${baseKey} key has ${numShortcuts} shortcut${numShortcuts > 1 ? 's' : ''}.` 
      : `${baseKey} key has no shortcuts assigned.`;
      
    // Use aria-live to announce this
    const liveRegion = document.getElementById('keyboard-announcer');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
    
    console.log(`Shortcuts for ${keyId} (baseKey: ${baseKey}):`, shortcuts);
  }, [findShortcutsByBaseKey]);

  // Handler for when shortcuts change
  const handleShortcutsChanged = useCallback(() => {
    // Force re-render the keyboard layout to reflect changes
    setRefreshKey(prev => prev + 1);
    
    // Announce change to screen readers
    const liveRegion = document.getElementById('keyboard-announcer');
    if (liveRegion) {
      liveRegion.textContent = 'Keyboard shortcuts have been updated.';
    }
  }, []);
  
  // Save keyboard view preferences
  useEffect(() => {
    // Don't save preferences if user prefers reduced data
    if (prefersReducedData) return;
    
    // Save preferences to localStorage
    const preferences = {
      zoomLevel,
      selectedApplication,
      highlightMode,
    };
    localStorage.setItem('keyboardViewPreferences', JSON.stringify(preferences));
  }, [zoomLevel, selectedApplication, highlightMode, prefersReducedData]);
  
  // Load keyboard view preferences
  useEffect(() => {
    // Don't load preferences if user prefers reduced data
    if (prefersReducedData) return;
    
    const savedPreferences = localStorage.getItem('keyboardViewPreferences');
    if (savedPreferences) {
      try {
        const { zoomLevel, selectedApplication, highlightMode } = JSON.parse(savedPreferences);
        setZoomLevel(zoomLevel || 1);
        setSelectedApplication(selectedApplication || '');
        setHighlightMode(highlightMode || 'none');
      } catch (error) {
        console.error('Failed to parse keyboard view preferences:', error);
      }
    }
  }, [prefersReducedData]);

  // Reset zoom level when screen size changes
  useEffect(() => {
    // Use a sensible default zoom for each screen size
    if (isMobile) {
      setZoomLevel(0.8);
    } else if (isTablet) {
      setZoomLevel(0.9);
    } else {
      setZoomLevel(1.0);
    }
    
    // Reset pan position when screen size changes
    setPanPosition({ x: 0, y: 0 });
  }, [isMobile, isTablet, isDesktop]);

  // Handle keyboard navigation
  const handleKeyboardNavigation = useCallback((e: React.KeyboardEvent) => {
    // Only handle keyboard navigation if no modifier keys are pressed
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
        e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault(); // Prevent scrolling
      
      // The step size for panning (larger for desktop, smaller for mobile)
      const step = isMobile ? 20 : 40;
      
      // Update pan position
      setPanPosition(prev => {
        const newPosition = { ...prev };
        
        if (e.key === 'ArrowUp') newPosition.y += step;
        if (e.key === 'ArrowDown') newPosition.y -= step;
        if (e.key === 'ArrowLeft') newPosition.x += step;
        if (e.key === 'ArrowRight') newPosition.x -= step;
        
        return newPosition;
      });
    }
  }, [isMobile]);

  // Helper to generate min-width class based on device
  const getMinWidthClass = () => {
    if (isMobile) return 'min-w-[320px]';
    if (isTablet) return 'min-w-[600px]';
    return 'min-w-[800px]';
  };

  // Determine title based on layout
  const layoutTitle = useMemo(() => {
    if (isMobile) return 'Mobile Keyboard View';
    if (isTablet) return 'Tablet Keyboard View';
    return 'Keyboard View';
  }, [isMobile, isTablet]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{layoutTitle}</CardTitle>
        {isMobile && (
          <p className="text-sm text-gray-500">
            Showing a compact keyboard layout optimized for mobile devices.
            You can pan and zoom to explore.
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col p-4">
        {/* Hidden screen reader announcements element */}
        <div 
          id="keyboard-announcer" 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        ></div>
        
        {/* Keyboard controls - simplified on mobile */}
        <KeyboardControls 
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          selectedApplication={selectedApplication}
          onApplicationChange={setSelectedApplication}
          highlightMode={highlightMode}
          onHighlightModeChange={setHighlightMode}
          isMobile={isMobile}
        />
        
        {/* Legend explaining key indicators - hide on very small screens */}
        {!isMobile && <KeyboardLegend />}
        
        {/* Keyboard visualization with drag support */}
        <div 
          className="max-w-full w-full overflow-hidden py-4 relative"
          ref={constraintsRef}
          tabIndex={0}
          role="application"
          aria-label="Interactive keyboard visualization"
          onKeyDown={handleKeyboardNavigation}
        >
          {/* Instructions for screen readers */}
          <div className="sr-only">
            Use arrow keys to navigate the keyboard. Press Enter on a key to view its shortcuts.
          </div>
          
          <motion.div 
            className={`${getMinWidthClass()} flex justify-center cursor-grab active:cursor-grabbing transition-all`}
            animate={{ 
              scale: zoomLevel,
              x: panPosition.x,
              y: panPosition.y,
              transition: { 
                duration: prefersReducedMotion ? 0 : 0.3,
                ease: 'easeInOut'
              }
            }}
            drag={isMobile || isTablet}
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            onDragStart={() => setIsPanning(true)}
            onDragEnd={() => setIsPanning(false)}
            style={{ 
              transformOrigin: 'center top',
              touchAction: 'none' // Prevent default touch actions on mobile
            }}
          >
            <KeyboardLayout 
              key={refreshKey} // Using a key for forced re-render when shortcuts change
              layout={keyboardLayout} 
              onKeyClick={handleKeyClick}
              onShortcutsChanged={handleShortcutsChanged}
              selectedApplication={selectedApplication}
              highlightMode={highlightMode}
              isMobile={isMobile}
            />
          </motion.div>
          
          {/* Mobile panning instructions - shown only on mobile and when not panning */}
          {(isMobile || isTablet) && !isPanning && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs p-2 rounded-md pointer-events-none">
              Use two fingers to pan
            </div>
          )}
        </div>
        
        {/* Mobile-specific legend that appears at the bottom */}
        {isMobile && (
          <div className="mt-4 p-2 bg-gray-50 rounded border text-xs">
            <h4 className="font-medium mb-1">Key Legend:</h4>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
              <li className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                <span>Has shortcuts</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                <span>Has conflicts</span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}