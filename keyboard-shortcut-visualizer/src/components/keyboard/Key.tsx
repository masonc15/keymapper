import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key as KeyType } from '@/types/keyboard';
import { cn } from '@/lib/utils';
import { useKeyShortcuts } from '@/hooks/useKeyShortcuts';
import { blendColors, getTextColorForBackground } from '@/utils/colorUtils';
import { Tooltip } from '@/components/ui/Tooltip';
import { ShortcutPopover } from '@/components/shortcuts/ShortcutPopover';
import { Layers, AlertCircle } from 'lucide-react';

interface KeyProps {
  keyData: KeyType;
  isActive?: boolean;
  onClick?: (keyId: string) => void;
  onShortcutsChanged?: () => void;
  highlightMode?: 'none' | 'heatmap' | 'focus';
  isFiltered?: boolean;
  isMobile?: boolean;
}

export const Key = ({ 
  keyData, 
  isActive = false, 
  onClick,
  onShortcutsChanged,
  highlightMode = 'none',
  isFiltered = false,
  isMobile = false,
}: KeyProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isNewlyAdded, setIsNewlyAdded] = useState(false);
  const keyRef = useRef<HTMLDivElement>(null);
  const prevShortcutsCount = useRef(0);
  const { id, label, size, type, width = 1, height = 1 } = keyData;

  // Get shortcuts for this key
  const { shortcuts, hasShortcuts, appColors, uniqueApps, hasConflicts } = useKeyShortcuts(id);

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Base size for a regular key (in relative units) - smaller on mobile
  const baseWidth = isMobile ? 30 : 40;
  const baseHeight = isMobile ? 30 : 40;

  // Calculate key dimensions based on width/height multipliers
  const keyWidth = baseWidth * width;
  const keyHeight = baseHeight * height;

  // Detect when shortcuts are added to trigger animation
  useEffect(() => {
    // If shortcut count increased, trigger animation
    if (shortcuts.length > prevShortcutsCount.current) {
      setIsNewlyAdded(true);
      
      // Reset animation state after 2 seconds
      const timer = setTimeout(() => {
        setIsNewlyAdded(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    // Save current count for next comparison
    prevShortcutsCount.current = shortcuts.length;
  }, [shortcuts.length]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    onClick?.(id);
    setIsPopoverOpen(true);
  };

  // Generate background style for keys with shortcuts based on mode
  const getKeyBackground = () => {
    if (!hasShortcuts) {
      if (highlightMode === 'focus') {
        return { opacity: 0.5 }; // Dim keys without shortcuts in focus mode
      }
      return {};
    }

    // Heat map colors based on number of shortcuts
    if (highlightMode === 'heatmap') {
      const intensity = Math.min(shortcuts.length / 5, 1); // Scale: 5+ shortcuts = 100% intensity
      return {
        background: `hsl(215, 95%, ${100 - (intensity * 30)}%)`,
        borderColor: 'transparent',
        color: intensity > 0.6 ? 'white' : 'inherit'
      };
    }

    // Get all app colors for shortcuts associated with this key
    const colors = uniqueApps.map(app => appColors[app]);
    
    // Blend colors if multiple apps have shortcuts for this key
    const background = blendColors(colors);
    
    // Add opacity for filtered state
    const opacity = isFiltered ? 0.4 : 1;
    
    return {
      background,
      opacity,
      ...(colors.length > 0 ? { borderColor: 'transparent' } : {})
    };
  };

  // Get text color based on background
  const getTextColor = () => {
    if (!hasShortcuts) return '';
    
    if (highlightMode === 'heatmap') {
      const intensity = Math.min(shortcuts.length / 5, 1);
      return intensity > 0.6 ? 'text-white' : 'text-gray-800';
    }

    // For mixed colors (multiple apps), default to white text
    if (uniqueApps.length > 1) return 'text-white';

    // For single app, calculate contrast
    const backgroundColor = appColors[uniqueApps[0]];
    return getTextColorForBackground(backgroundColor);
  };

  const getKeyStyles = () => {
    // Adjust font size and rounding for mobile
    const mobileClass = isMobile ? 'rounded text-[10px]' : 'rounded-md text-xs';
    
    // Base styles for all keys
    const baseStyles = `flex items-center justify-center ${mobileClass} font-medium transition-colors duration-200 select-none shadow-sm`;
    
    // Size-based styles - adjust for mobile
    const sizeStyles = {
      'default': '',
      'small': isMobile ? 'text-[8px]' : 'text-[10px]',
      'medium': isMobile ? 'text-[10px]' : 'text-xs',
      'large': isMobile ? 'text-xs' : 'text-sm',
      'wide': isMobile ? 'text-[10px]' : 'text-xs',
      'extraWide': isMobile ? 'text-[10px]' : 'text-xs',
      'spacebar': isMobile ? 'text-[10px]' : 'text-xs',
    }[size];
    
    // Type-based styles
    const typeStyles = {
      'regular': 'bg-white text-gray-800 border border-gray-200',
      'function': 'bg-gray-100 text-gray-700 border border-gray-200',
      'modifier': 'bg-gray-100 text-gray-700 border border-gray-200',
      'navigation': 'bg-gray-100 text-gray-700 border border-gray-200',
      'special': 'bg-gray-100 text-gray-700 border border-gray-200',
    }[type];
    
    // State styles - increase touch target for mobile
    const focusRingSize = isMobile ? 'ring-2' : 'ring-2';
    const stateStyles = [
      isActive ? `${focusRingSize} ring-primary` : '',
      isFocused ? `${focusRingSize} ring-primary ring-opacity-70` : '',
      isHovered && !isFiltered ? 'shadow-md' : '',
      // Apply text color for keys with shortcuts
      hasShortcuts ? getTextColor() : '',
      // Slight glow effect for keys with shortcuts
      hasShortcuts && !isFiltered && highlightMode !== 'heatmap' ? 'shadow-lg' : '',
    ].filter(Boolean).join(' ');

    return cn(baseStyles, sizeStyles, typeStyles, stateStyles);
  };

  const specialKeys = ['command-left', 'command-right', 'option-left', 'option-right', 'control-left', 'shift-left', 'shift-right'];
  
  // Convert special key labels to symbols
  const displayLabel = () => {
    if (id === 'command-left' || id === 'command-right') return '⌘';
    if (id === 'option-left' || id === 'option-right') return '⌥';
    if (id === 'control-left') return '⌃';
    if (id === 'shift-left' || id === 'shift-right') return '⇧';
    return label;
  };

  // Render shortcut tooltip content
  const renderTooltipContent = () => {
    // Simplified content for mobile to save space
    if (isMobile) {
      if (!hasShortcuts) {
        return (
          <div>
            <p className="font-medium">{displayLabel()} key</p>
            <p className="text-gray-400 text-xs">No shortcuts</p>
          </div>
        );
      }
      
      return (
        <div className="space-y-2 max-w-[200px]">
          <p className="font-medium text-sm flex items-center justify-between">
            <span>{displayLabel()} key</span>
            <span className="bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded-full">
              {shortcuts.length}
            </span>
          </p>
          
          <div className="text-xs">
            {shortcuts.slice(0, 3).map((shortcut) => (
              <div key={shortcut.id} className="mb-1 border-b border-gray-700 pb-1">
                <div className="flex justify-between gap-1">
                  <span className="font-mono font-medium">{shortcut.key_combination}</span>
                  <span 
                    className="text-[10px] px-1 rounded-full text-white truncate max-w-[80px]"
                    style={{ backgroundColor: appColors[shortcut.application] }}
                  >
                    {shortcut.application}
                  </span>
                </div>
              </div>
            ))}
            
            {shortcuts.length > 3 && (
              <p className="text-gray-400 text-[10px]">
                + {shortcuts.length - 3} more
              </p>
            )}
          </div>
          
          {hasConflicts && (
            <div className="text-amber-200 text-[10px] flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>Has conflicts</span>
            </div>
          )}
        </div>
      );
    }
    
    // Desktop version with more details
    if (!hasShortcuts) return (
      <div>
        <p className="font-medium text-base">{displayLabel()} key</p>
        <p className="text-gray-400 text-xs mt-1">No shortcuts assigned</p>
      </div>
    );

    return (
      <div className="space-y-3 min-w-[200px]">
        <div className="flex items-center justify-between">
          <p className="font-medium text-base">{displayLabel()} key shortcuts</p>
          <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
            {shortcuts.length} shortcut{shortcuts.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.id} className="space-y-1 p-2 rounded bg-gray-700/30">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-primary-foreground font-medium">
                  {shortcut.key_combination}
                </span>
                <span 
                  className="text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: appColors[shortcut.application] }}
                >
                  {shortcut.application}
                </span>
              </div>
              <p className="text-gray-300 text-xs">{shortcut.description}</p>
            </div>
          ))}
        </div>
        
        {hasConflicts && (
          <div className="flex items-center gap-2 p-2 bg-amber-500/20 text-amber-200 rounded text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>This key has conflicting shortcuts</span>
          </div>
        )}
        
        <div className="text-xs text-gray-400 pt-1 border-t border-gray-700">
          Click the key to manage shortcuts
        </div>
      </div>
    );
  };

  // Handle shortcut changes
  const handleShortcutChange = () => {
    // Close the popover
    setIsPopoverOpen(false);
    
    // Notify parent of changes
    if (onShortcutsChanged) {
      onShortcutsChanged();
    }
  };

  // Add indicator for keys with multiple shortcuts
  const renderMultipleShortcutsIndicator = () => {
    if (shortcuts.length > 1) {
      return (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
          {shortcuts.length}
        </span>
      );
    }
    return null;
  };
  
  // Render conflict indicator if needed
  const renderConflictIndicator = () => {
    if (hasConflicts) {
      return (
        <span className="absolute -top-1 -left-1 bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
          <AlertCircle className="h-3 w-3" />
        </span>
      );
    }
    return null;
  };
  
  // Render app icon for keys with shortcuts
  const renderAppIcon = () => {
    if (hasShortcuts && uniqueApps.length > 1) {
      return (
        <span className="absolute bottom-1 right-1 text-white/80">
          <Layers className="h-3 w-3" />
        </span>
      );
    }
    return null;
  };

  // For composite keys (like up-down arrow keys)
  if (id === 'up-down' && 'keys' in keyData) {
    return (
      <div 
        className="flex flex-col" 
        style={{ width: `${keyWidth}px`, height: `${keyHeight}px` }}
      >
        {keyData.keys.map((subKey) => (
          <Key 
            key={subKey.id} 
            keyData={subKey} 
            onClick={onClick} 
            onShortcutsChanged={onShortcutsChanged}
            highlightMode={highlightMode}
            isFiltered={isFiltered}
            isMobile={isMobile}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <Tooltip 
        content={renderTooltipContent()} 
        position="top" 
        delay={isMobile ? 200 : 400}
        showArrow
        theme="dark"
        disabled={isPopoverOpen}
        maxWidth={isMobile ? 220 : 300}
      >
        <motion.div
          ref={keyRef}
          role="button"
          tabIndex={0}
          aria-label={specialKeys.includes(id) ? `${label} key` : `${label}`}
          className={getKeyStyles()}
          style={{ 
            width: `${keyWidth}px`, 
            height: `${keyHeight}px`,
            position: 'relative',
            ...getKeyBackground()
          }}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={!prefersReducedMotion && !isFiltered && !isMobile ? 
            { y: -2, transition: { duration: 0.2 } } : 
            {}
          }
          whileTap={isMobile ? { scale: 0.95 } : {}}
          animate={isNewlyAdded && !prefersReducedMotion ? 
            { 
              boxShadow: [
                '0 0 0 rgba(59, 130, 246, 0)', 
                '0 0 10px rgba(59, 130, 246, 0.7)', 
                '0 0 0 rgba(59, 130, 246, 0)'
              ],
              transition: { 
                repeat: 2, 
                duration: 0.7 
              } 
            } : {}
          }
        >
          {displayLabel()}
          
          {/* Indicators - simplified for mobile */}
          <AnimatePresence>
            {!isMobile && renderMultipleShortcutsIndicator()}
            {renderConflictIndicator()}
            {!isMobile && renderAppIcon()}
            
            {/* Mobile-only simple indicator */}
            {isMobile && hasShortcuts && (
              <motion.span 
                className="absolute -top-1 -right-1 bg-blue-500 w-2 h-2 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </Tooltip>

      <ShortcutPopover
        isOpen={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        keyId={id}
        keyLabel={displayLabel()}
        onSuccess={handleShortcutChange}
        isMobile={isMobile}
      />
    </>
  );
};