import React from 'react';
import { ZoomIn, ZoomOut, RefreshCw, Filter, X, Layers, Badge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/Tooltip';
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
  
  // Calculate min and max zoom levels
  const minZoom = 0.6;
  const maxZoom = 1.4;
  const zoomStep = 0.1;
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Handle zoom in
  const handleZoomIn = () => {
    if (zoomLevel < maxZoom) {
      onZoomChange(Math.min(zoomLevel + zoomStep, maxZoom));
    }
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    if (zoomLevel > minZoom) {
      onZoomChange(Math.max(zoomLevel - zoomStep, minZoom));
    }
  };
  
  // Handle zoom reset
  const handleZoomReset = () => {
    onZoomChange(1);
  };
  
  // Handle application filter change
  const handleApplicationChange = (appName: string) => {
    onApplicationChange(appName === selectedApplication ? '' : appName);
  };
  
  // Handle highlight mode change
  const handleHighlightModeChange = (mode: KeyboardHighlightMode) => {
    onHighlightModeChange(mode === highlightMode ? 'none' : mode);
  };
  
  // Render zoom percentage
  const zoomPercentage = Math.round(zoomLevel * 100);
  
  // Render mobile-optimized controls
  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 mb-4">
        {/* Combined zoom and filter controls - more compact for mobile */}
        <div className="grid grid-cols-2 items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center justify-between gap-1 p-2 bg-gray-50 rounded-md border border-gray-200">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleZoomOut} 
              disabled={zoomLevel <= minZoom}
              className="h-9 w-9"
              aria-label="Zoom out"
            >
              <ZoomOut size={18} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomReset} 
              disabled={zoomLevel === 1}
              className="h-9 px-2 text-sm"
              aria-label="Reset zoom"
            >
              {zoomPercentage}%
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleZoomIn} 
              disabled={zoomLevel >= maxZoom}
              className="h-9 w-9"
              aria-label="Zoom in"
            >
              <ZoomIn size={18} />
            </Button>
          </div>
          
          {/* Mode/filter controls */}
          <div className="flex items-center justify-between gap-1 p-2 bg-gray-50 rounded-md border border-gray-200">
            <Button 
              variant={highlightMode === 'focus' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => handleHighlightModeChange('focus')}
              className={cn(
                "h-9 px-2",
                highlightMode === 'focus' && "bg-blue-600"
              )}
              aria-label={highlightMode === 'focus' ? 'Disable focus mode' : 'Enable focus mode'}
            >
              <Layers size={18} />
            </Button>
            
            {/* Filter button shows/hides the app filters */}
            <Button 
              variant={selectedApplication ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                // Simple toggle for mobile - if there's already a filter, clear it
                if (selectedApplication) {
                  onApplicationChange('');
                }
              }}
              className={cn(
                "h-9 px-2",
                selectedApplication && "bg-blue-600"
              )}
              aria-label={selectedApplication ? 'Clear application filter' : 'Filter by application'}
            >
              <Filter size={18} />
            </Button>
            
            {/* Clear all button */}
            {(selectedApplication || highlightMode !== 'none') && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  onApplicationChange('');
                  onHighlightModeChange('none');
                }}
                className="h-9 w-9"
                aria-label="Clear all filters"
              >
                <X size={18} />
              </Button>
            )}
          </div>
        </div>
        
        {/* Simplified app filter for mobile - only show top apps with bigger touch targets */}
        {!selectedApplication && (
          <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md border border-gray-200">
            {applications.slice(0, 6).map((app) => (
              <Button
                key={app.name}
                variant="outline"
                size="sm"
                onClick={() => handleApplicationChange(app.name)}
                className={cn(
                  "h-8 px-3 text-sm rounded-full transition-all",
                  selectedApplication === app.name ? 
                    "bg-gray-800 text-white border-transparent" : 
                    "bg-white hover:bg-gray-100"
                )}
                style={
                  selectedApplication === app.name ? 
                    { backgroundColor: app.color } : 
                    {}
                }
              >
                {app.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Standard desktop controls
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-gray-50 rounded-md border border-gray-200">
        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Tooltip 
            content="Zoom out" 
            position="top" 
            showArrow 
            theme="light"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleZoomOut} 
              disabled={zoomLevel <= minZoom}
              className="h-7 w-7"
              aria-label="Zoom out"
            >
              <ZoomOut size={16} />
            </Button>
          </Tooltip>
          
          <Tooltip 
            content="Reset zoom" 
            position="top" 
            showArrow 
            theme="light"
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomReset} 
              disabled={zoomLevel === 1}
              className="h-7 px-2 text-xs"
              aria-label="Reset zoom"
            >
              {zoomPercentage}%
            </Button>
          </Tooltip>
          
          <Tooltip 
            content="Zoom in" 
            position="top" 
            showArrow 
            theme="light"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleZoomIn} 
              disabled={zoomLevel >= maxZoom}
              className="h-7 w-7"
              aria-label="Zoom in"
            >
              <ZoomIn size={16} />
            </Button>
          </Tooltip>
        </div>
        
        {/* Mode toggles */}
        <div className="flex items-center gap-1">
          <Tooltip 
            content={highlightMode === 'heatmap' ? 'Disable heatmap view' : 'Enable heatmap view'} 
            position="top" 
            showArrow 
            theme="light"
          >
            <Button 
              variant={highlightMode === 'heatmap' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => handleHighlightModeChange('heatmap')}
              className={cn(
                "h-7 gap-1",
                highlightMode === 'heatmap' && "bg-blue-600"
              )}
              aria-label={highlightMode === 'heatmap' ? 'Disable heatmap view' : 'Enable heatmap view'}
            >
              <Badge size={14} />
              <span className="text-xs">Heatmap</span>
            </Button>
          </Tooltip>
          
          <Tooltip 
            content={highlightMode === 'focus' ? 'Disable focus mode' : 'Enable focus mode'} 
            position="top" 
            showArrow 
            theme="light"
          >
            <Button 
              variant={highlightMode === 'focus' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => handleHighlightModeChange('focus')}
              className={cn(
                "h-7 gap-1",
                highlightMode === 'focus' && "bg-blue-600"
              )}
              aria-label={highlightMode === 'focus' ? 'Disable focus mode' : 'Enable focus mode'}
            >
              <Layers size={14} />
              <span className="text-xs">Focus</span>
            </Button>
          </Tooltip>
        </div>
        
        {/* Clear filters button - only shown when filters are active */}
        {(selectedApplication || highlightMode !== 'none') && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              onApplicationChange('');
              onHighlightModeChange('none');
            }}
            className="h-7 gap-1 text-xs"
            aria-label="Clear all filters"
          >
            <X size={14} />
            <span>Clear All</span>
          </Button>
        )}
      </div>
      
      {/* Application filters */}
      <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto p-2 bg-gray-50 rounded-md border border-gray-200">
        <span className="text-xs text-gray-500 font-medium w-full mb-1" id="app-filter-label">Filter by application:</span>
        <div className="flex flex-wrap gap-1" role="group" aria-labelledby="app-filter-label">
          {applications.map((app) => (
            <Button
              key={app.name}
              variant="outline"
              size="sm"
              onClick={() => handleApplicationChange(app.name)}
              className={cn(
                "h-6 px-2 text-xs rounded-full transition-all",
                selectedApplication === app.name ? 
                  "bg-gray-800 text-white border-transparent" : 
                  "bg-white hover:bg-gray-100"
              )}
              style={
                selectedApplication === app.name ? 
                  { backgroundColor: app.color } : 
                  {}
              }
              aria-pressed={selectedApplication === app.name}
            >
              {app.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Heatmap legend - only shown in heatmap mode */}
      {highlightMode === 'heatmap' && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-200" 
             aria-labelledby="heatmap-legend-label">
          <span className="text-xs text-gray-500 font-medium" id="heatmap-legend-label">Usage intensity:</span>
          <div className="flex-1 h-4 rounded overflow-hidden" 
            style={{ 
              background: 'linear-gradient(to right, hsl(215, 95%, 93%), hsl(215, 95%, 70%)' 
            }}
            role="img"
            aria-label="Low usage gradient"
          />
          <span className="text-xs text-gray-500">Low</span>
          <div className="flex-1 h-4 rounded overflow-hidden" 
            style={{ 
              background: 'linear-gradient(to right, hsl(215, 95%, 70%), hsl(215, 95%, 50%)' 
            }}
            role="img"
            aria-label="High usage gradient"
          />
          <span className="text-xs text-gray-500">High</span>
        </div>
      )}
    </div>
  );
}