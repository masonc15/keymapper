import { useState, useCallback } from 'react';
import { KeyboardLayout as KeyboardLayoutType } from '@/types/keyboard';
import { KeyRow } from './KeyRow';
import { KeyboardHighlightMode } from './KeyboardControls';
import { motion } from 'framer-motion';

interface KeyboardLayoutProps {
  layout: KeyboardLayoutType;
  onKeyClick?: (keyId: string) => void;
  onShortcutsChanged?: () => void;
  selectedApplication?: string;
  highlightMode?: KeyboardHighlightMode;
  isMobile?: boolean;
}

export const KeyboardLayout = ({ 
  layout, 
  onKeyClick,
  onShortcutsChanged,
  selectedApplication = '',
  highlightMode = 'none',
  isMobile = false,
}: KeyboardLayoutProps) => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  // Custom key click handler that manages active keys state
  const handleKeyClick = useCallback((keyId: string) => {
    // You can implement different behavior here, such as toggling keys
    // For now, we'll just highlight the clicked key
    setActiveKeys([keyId]);
    
    // Call the parent's onKeyClick if provided
    if (onKeyClick) {
      onKeyClick(keyId);
    }
  }, [onKeyClick]);
  
  // Handler for when shortcuts change
  const handleShortcutsChanged = useCallback(() => {
    if (onShortcutsChanged) {
      onShortcutsChanged();
    }
  }, [onShortcutsChanged]);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Adjust padding and spacing based on device size
  const containerPadding = isMobile ? 'p-3' : 'p-6';
  const rowGap = isMobile ? 'gap-1' : 'gap-2';
  
  return (
    <motion.div 
      className={`bg-gray-50 ${containerPadding} rounded-lg shadow-md border border-gray-200`}
      aria-label={`${layout.name} keyboard layout`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      role="application"
    >
      <div className={`flex flex-col items-center ${rowGap}`}>
        {layout.rows.map((row) => (
          <KeyRow
            key={row.id}
            row={row}
            activeKeys={activeKeys}
            onKeyClick={handleKeyClick}
            onShortcutsChanged={handleShortcutsChanged}
            selectedApplication={selectedApplication}
            highlightMode={highlightMode}
            isMobile={isMobile}
          />
        ))}
      </div>
    </motion.div>
  );
};