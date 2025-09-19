import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { KeyboardLayout } from './KeyboardLayout';
import { KeyboardLegend } from './KeyboardLegend';
import { KeyboardControls, KeyboardHighlightMode } from './KeyboardControls';
import {
  macbookAirKeyboardLayout,
  tabletKeyboardLayout,
  mobileKeyboardLayout,
} from '@/utils/keyboardLayout';
import { useShortcuts } from '@/hooks/useShortcuts';
import { getBaseKeyFromKeyId } from '@/utils/keyboardUtils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function KeyboardView() {
  const { findShortcutsByBaseKey, shortcuts } = useShortcuts();

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

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersReducedData =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-data: reduce)').matches;

  // Visual stats for header copy
  const keysMapped = useMemo(() => {
    const keys = new Set<string>();
    shortcuts.forEach((shortcut) => {
      keys.add(shortcut.baseKey || shortcut.key_combination);
    });
    return keys.size;
  }, [shortcuts]);

  const focusedShortcutCount = useMemo(() => {
    if (!selectedApplication) {
      return shortcuts.length;
    }
    return shortcuts.filter((shortcut) => shortcut.application === selectedApplication).length;
  }, [shortcuts, selectedApplication]);

  const experienceTagline = selectedApplication
    ? `Highlighting ${focusedShortcutCount} shortcut${focusedShortcutCount === 1 ? '' : 's'} for ${selectedApplication}`
    : `Visualizing ${shortcuts.length} shortcuts across ${keysMapped} keys`;

  // Select the appropriate keyboard layout based on screen size
  const keyboardLayout = useMemo(() => {
    if (isMobile) return mobileKeyboardLayout;
    if (isTablet) return tabletKeyboardLayout;
    return macbookAirKeyboardLayout;
  }, [isDesktop, isTablet, isMobile]);

  // Handle key click
  const handleKeyClick = useCallback((keyId: string) => {
    const baseKey = getBaseKeyFromKeyId(keyId);
    const keyShortcuts = findShortcutsByBaseKey(baseKey);

    const numShortcuts = keyShortcuts.length;
    const announcement =
      numShortcuts > 0
        ? `${baseKey} key has ${numShortcuts} shortcut${numShortcuts > 1 ? 's' : ''}.`
        : `${baseKey} key has no shortcuts assigned.`;

    const liveRegion = document.getElementById('keyboard-announcer');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }, [findShortcutsByBaseKey]);

  // Handler for when shortcuts change
  const handleShortcutsChanged = useCallback(() => {
    setRefreshKey((prev) => prev + 1);

    const liveRegion = document.getElementById('keyboard-announcer');
    if (liveRegion) {
      liveRegion.textContent = 'Keyboard shortcuts have been updated.';
    }
  }, []);

  // Save keyboard view preferences
  useEffect(() => {
    if (prefersReducedData) return;

    const preferences = {
      zoomLevel,
      selectedApplication,
      highlightMode,
    };
    localStorage.setItem('keyboardViewPreferences', JSON.stringify(preferences));
  }, [zoomLevel, selectedApplication, highlightMode, prefersReducedData]);

  // Load keyboard view preferences
  useEffect(() => {
    if (prefersReducedData) return;

    const savedPreferences = localStorage.getItem('keyboardViewPreferences');
    if (savedPreferences) {
      try {
        const { zoomLevel: savedZoom, selectedApplication: savedApp, highlightMode: savedMode } = JSON.parse(savedPreferences);
        setZoomLevel(savedZoom || 1);
        setSelectedApplication(savedApp || '');
        setHighlightMode(savedMode || 'none');
      } catch (error) {
        console.error('Failed to parse keyboard view preferences:', error);
      }
    }
  }, [prefersReducedData]);

  // Reset zoom level when screen size changes
  useEffect(() => {
    if (isMobile) {
      setZoomLevel(0.9);
    } else if (isTablet) {
      setZoomLevel(0.95);
    } else {
      setZoomLevel(1.0);
    }

    setPanPosition({ x: 0, y: 0 });
  }, [isMobile, isTablet, isDesktop]);

  // Handle keyboard navigation
  const handleKeyboardNavigation = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const step = isMobile ? 20 : 40;

      setPanPosition((prev) => {
        const next = { ...prev };
        if (e.key === 'ArrowUp') next.y += step;
        if (e.key === 'ArrowDown') next.y -= step;
        if (e.key === 'ArrowLeft') next.x += step;
        if (e.key === 'ArrowRight') next.x -= step;
        return next;
      });
    }
  }, [isMobile]);

  const getMinWidthClass = () => {
    if (isMobile) return 'min-w-[320px]';
    if (isTablet) return 'min-w-[600px]';
    return 'min-w-[800px]';
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 px-6 py-8 shadow-2xl backdrop-blur-xl sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-cyan-400/25 via-transparent to-transparent blur-3xl" />
          <div className="absolute -left-20 bottom-[-10%] h-72 w-72 rounded-full bg-sky-500/20 blur-[120px]" />
          <div className="absolute -right-24 top-12 h-60 w-60 rounded-full bg-violet-500/20 blur-[120px]" />
        </div>

        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white md:text-3xl">Immersive keyboard stage</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300/80">{experienceTagline}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300/80">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
                Live panning & zoom
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
                {keysMapped} keys mapped
              </span>
            </div>
          </div>

          <KeyboardControls
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            selectedApplication={selectedApplication}
            onApplicationChange={setSelectedApplication}
            highlightMode={highlightMode}
            onHighlightModeChange={setHighlightMode}
            isMobile={isMobile}
          />

          <div
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-8"
            ref={constraintsRef}
            tabIndex={0}
            role="application"
            aria-label="Interactive keyboard visualization"
            onKeyDown={handleKeyboardNavigation}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.14),_transparent_68%)]" />

            <div
              id="keyboard-announcer"
              className="sr-only"
              aria-live="polite"
              aria-atomic="true"
            ></div>

            <div className="sr-only">
              Use arrow keys to navigate the keyboard. Press Enter on a key to view its shortcuts.
            </div>

            <motion.div
              className={`${getMinWidthClass()} relative mx-auto flex justify-center rounded-[1.75rem] border border-white/5 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-900/40 p-4 shadow-[0_40px_70px_rgba(12,74,110,0.45)] transition-all`}
              animate={{
                scale: zoomLevel,
                x: panPosition.x,
                y: panPosition.y,
                transition: {
                  duration: prefersReducedMotion ? 0 : 0.35,
                  ease: 'easeInOut',
                },
              }}
              drag={isMobile || isTablet}
              dragConstraints={constraintsRef}
              dragElastic={0.12}
              onDragStart={() => setIsPanning(true)}
              onDragEnd={() => setIsPanning(false)}
              style={{
                transformOrigin: 'center top',
                touchAction: 'none',
              }}
            >
              <KeyboardLayout
                key={refreshKey}
                layout={keyboardLayout}
                onKeyClick={handleKeyClick}
                onShortcutsChanged={handleShortcutsChanged}
                selectedApplication={selectedApplication}
                highlightMode={highlightMode}
                isMobile={isMobile}
              />
            </motion.div>

            {(isMobile || isTablet) && !isPanning && (
              <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs text-white/80 shadow-lg backdrop-blur">
                Use two fingers to pan
              </div>
            )}
          </div>

          {!isMobile && <KeyboardLegend />}

          {isMobile && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200/90">
              <h4 className="mb-2 font-semibold uppercase tracking-wide text-slate-200">Key Legend</h4>
              <div className="grid grid-cols-2 gap-2">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
                  Has shortcuts
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  Has conflicts
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
