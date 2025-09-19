import { useMemo } from 'react';
import { ZoomIn, ZoomOut, RefreshCw, Filter, X, Layers, Badge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApplications } from '@/hooks/useApplications';

export type KeyboardHighlightMode = 'none' | 'heatmap' | 'focus';

interface KeyboardControlsProps {
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  selectedApplication: string;
  onApplicationChange: (app: string) => void;
  highlightMode: KeyboardHighlightMode;
  onHighlightModeChange: (mode: KeyboardHighlightMode) => void;
  isMobile?: boolean;
}

export function KeyboardControls({
  zoomLevel,
  onZoomChange,
  selectedApplication,
  onApplicationChange,
  highlightMode,
  onHighlightModeChange,
  isMobile = false,
}: KeyboardControlsProps) {
  const applications = useApplications();

  const minZoom = 0.6;
  const maxZoom = 1.4;
  const zoomStep = 0.1;
  const zoomPercentage = Math.round(zoomLevel * 100);
  const zoomFill = Math.min(100, Math.max(0, zoomPercentage));

  const hasActiveFilter = selectedApplication || highlightMode !== 'none';

  const paletteClass = cn(
    'relative rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[0_20px_55px_rgba(8,47,73,0.45)] backdrop-blur',
    isMobile ? 'space-y-4' : 'space-y-5'
  );

  const controlButtonClass = (active?: boolean) =>
    cn(
      'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
      active
        ? 'border-sky-400/60 bg-gradient-to-r from-sky-500/60 to-cyan-400/60 text-white shadow-[0_12px_30px_rgba(56,189,248,0.35)]'
        : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
    );

  const iconButtonClass = (disabled?: boolean) =>
    cn(
      'flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
      disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent'
    );

  const highlightOptions = useMemo(
    () => [
      { mode: 'focus' as KeyboardHighlightMode, label: 'Focus mode', icon: Layers },
      { mode: 'heatmap' as KeyboardHighlightMode, label: 'Heat map', icon: Badge },
    ],
    []
  );

  const handleZoomIn = () => {
    if (zoomLevel < maxZoom) {
      onZoomChange(Math.min(zoomLevel + zoomStep, maxZoom));
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > minZoom) {
      onZoomChange(Math.max(zoomLevel - zoomStep, minZoom));
    }
  };

  const handleZoomReset = () => {
    onZoomChange(1);
  };

  const handleApplicationChange = (appName: string) => {
    onApplicationChange(appName === selectedApplication ? '' : appName);
  };

  const renderApplicationChips = () => (
    <div className="-m-1 flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
      {applications.length === 0 ? (
        <span className="m-1 text-xs text-slate-400/80">Add shortcuts to unlock filtering</span>
      ) : (
        applications.map((app) => (
          <button
            key={app.name}
            onClick={() => handleApplicationChange(app.name)}
            className={controlButtonClass(selectedApplication === app.name)}
            style={
              selectedApplication === app.name
                ? { boxShadow: `0 0 0 1px ${app.color}` }
                : undefined
            }
            aria-pressed={selectedApplication === app.name}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: app.color }} />
            {app.name}
          </button>
        ))
      )}
    </div>
  );

  const renderHighlightChips = () => (
    <div className="flex flex-wrap items-center gap-2">
      {highlightOptions.map(({ mode, label, icon: Icon }) => (
        <button
          key={mode}
          onClick={() => onHighlightModeChange(mode === highlightMode ? 'none' : mode)}
          className={controlButtonClass(highlightMode === mode)}
          aria-pressed={highlightMode === mode}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );

  const zoomMeterStyle = {
    background: `linear-gradient(90deg, rgba(56,189,248,0.45) 0%, rgba(59,130,246,0.55) ${zoomFill}%, rgba(15,23,42,0.85) ${zoomFill}%, rgba(15,23,42,0.85) 100%)`,
  };

  if (isMobile) {
    return (
      <div className={paletteClass}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= minZoom}
              className={iconButtonClass(zoomLevel <= minZoom)}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <div className="relative flex h-10 w-28 items-center justify-center overflow-hidden rounded-full border border-white/15 text-sm font-semibold text-sky-100" style={zoomMeterStyle}>
              <span className="relative z-10 mix-blend-screen">{zoomPercentage}%</span>
            </div>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= maxZoom}
              className={iconButtonClass(zoomLevel >= maxZoom)}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleZoomReset}
            className={controlButtonClass(false)}
            aria-label="Reset zoom"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
            <Filter className="h-3.5 w-3.5" />
            Filter by app
          </span>
          {hasActiveFilter && (
            <button
              onClick={() => {
                onApplicationChange('');
                onHighlightModeChange('none');
              }}
              className={controlButtonClass(false)}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        {renderApplicationChips()}
        {renderHighlightChips()}
      </div>
    );
  }

  return (
    <div className={paletteClass}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= minZoom}
            className={iconButtonClass(zoomLevel <= minZoom)}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <div className="relative flex h-12 w-32 items-center justify-center overflow-hidden rounded-full border border-white/15 text-sm font-semibold text-sky-100" style={zoomMeterStyle}>
            <span className="relative z-10 mix-blend-screen">{zoomPercentage}%</span>
          </div>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= maxZoom}
            className={iconButtonClass(zoomLevel >= maxZoom)}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomReset}
            className={controlButtonClass(false)}
            aria-label="Reset zoom"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          {renderHighlightChips()}
          {hasActiveFilter && (
            <button
              onClick={() => {
                onApplicationChange('');
                onHighlightModeChange('none');
              }}
              className={controlButtonClass(false)}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300/80">
          <Filter className="h-4 w-4" />
          Applications
        </div>
        {renderApplicationChips()}
      </div>
    </div>
  );
}
