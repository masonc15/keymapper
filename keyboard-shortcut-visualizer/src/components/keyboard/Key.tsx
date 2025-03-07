import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Key as KeyType } from '@/types/keyboard';
import { cn } from '@/lib/utils';
import { useKeyShortcuts } from '@/hooks/useKeyShortcuts';
import { blendColors, getTextColorForBackground } from '@/utils/colorUtils';
import { Tooltip } from '@/components/ui/Tooltip';
import { ShortcutPopover } from '@/components/shortcuts/ShortcutPopover';

interface KeyProps {
  keyData: KeyType;
  isActive?: boolean;
  onClick?: (keyId: string) => void;
  onShortcutsChanged?: () => void;
}

export const Key = ({ 
  keyData, 
  isActive = false, 
  onClick,
  onShortcutsChanged,
}: KeyProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const keyRef = useRef<HTMLDivElement>(null);
  const { id, label, size, type, width = 1, height = 1 } = keyData;

  // Get shortcuts for this key
  const { shortcuts, hasShortcuts, appColors, uniqueApps } = useKeyShortcuts(id);

  // Base size for a regular key (in relative units)
  const baseWidth = 40;
  const baseHeight = 40;

  // Calculate key dimensions based on width/height multipliers
  const keyWidth = baseWidth * width;
  const keyHeight = baseHeight * height;

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

  // Generate background style for keys with shortcuts
  const getKeyBackground = () => {
    if (!hasShortcuts) return {};

    // Get all app colors for shortcuts associated with this key
    const colors = uniqueApps.map(app => appColors[app]);
    
    // Blend colors if multiple apps have shortcuts for this key
    const background = blendColors(colors);
    
    return {
      background,
      ...(colors.length > 0 ? { borderColor: 'transparent' } : {})
    };
  };

  // Get text color based on background
  const getTextColor = () => {
    if (!hasShortcuts) return '';

    // For mixed colors (multiple apps), default to white text
    if (uniqueApps.length > 1) return 'text-white';

    // For single app, calculate contrast
    const backgroundColor = appColors[uniqueApps[0]];
    return getTextColorForBackground(backgroundColor);
  };

  const getKeyStyles = () => {
    // Base styles for all keys
    const baseStyles = 'flex items-center justify-center rounded-md text-xs font-medium transition-all duration-200 select-none shadow-sm';
    
    // Size-based styles
    const sizeStyles = {
      'default': '',
      'small': 'text-[10px]',
      'medium': 'text-xs',
      'large': 'text-sm',
      'wide': 'text-xs',
      'extraWide': 'text-xs',
      'spacebar': 'text-xs',
    }[size];
    
    // Type-based styles
    const typeStyles = {
      'regular': 'bg-white text-gray-800 border border-gray-200',
      'function': 'bg-gray-100 text-gray-700 border border-gray-200',
      'modifier': 'bg-gray-100 text-gray-700 border border-gray-200',
      'navigation': 'bg-gray-100 text-gray-700 border border-gray-200',
      'special': 'bg-gray-100 text-gray-700 border border-gray-200',
    }[type];
    
    // State styles
    const stateStyles = [
      isActive ? 'ring-2 ring-blue-dark' : '',
      isFocused ? 'ring-2 ring-blue' : 'hover:bg-gray-50',
      // Apply text color for keys with shortcuts
      hasShortcuts ? getTextColor() : '',
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
    if (!hasShortcuts) return (
      <div>
        <p className="font-medium">{displayLabel()} key</p>
        <p className="text-gray-300 text-xs">No shortcuts assigned</p>
      </div>
    );

    return (
      <div className="space-y-2">
        <p className="font-medium">{displayLabel()} key shortcuts</p>
        {shortcuts.map((shortcut) => (
          <div key={shortcut.id} className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-blue-300">{shortcut.key_combination}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700">
                {shortcut.application}
              </span>
            </div>
            <p className="text-gray-300 text-xs">{shortcut.description}</p>
          </div>
        ))}
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
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {shortcuts.length}
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
        delay={400}
      >
        <div
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
        >
          {displayLabel()}
          {renderMultipleShortcutsIndicator()}
        </div>
      </Tooltip>

      <ShortcutPopover
        isOpen={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        keyId={id}
        keyLabel={displayLabel()}
        onSuccess={handleShortcutChange}
      />
    </>
  );
};