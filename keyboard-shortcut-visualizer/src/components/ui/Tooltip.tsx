import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
  delay?: number;
  className?: string;
  showArrow?: boolean;
  theme?: 'dark' | 'light';
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  maxWidth = 300,
  delay = 300,
  className,
  showArrow = true,
  theme = 'dark',
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const childRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [computedPosition, setComputedPosition] = useState(position);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updatePosition = useCallback(() => {
    if (!childRef.current || !tooltipRef.current) return;

    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = 0;
    let top = 0;
    let effectivePosition = position;
    
    // Check if there's enough space for the tooltip in the requested position
    const spaceTop = childRect.top;
    const spaceBottom = viewportHeight - childRect.bottom;
    const spaceLeft = childRect.left;
    const spaceRight = viewportWidth - childRect.right;
    
    // If the tooltip doesn't fit in the requested position, flip it
    if (position === 'top' && spaceTop < tooltipRect.height + 15) {
      effectivePosition = 'bottom';
    } else if (position === 'bottom' && spaceBottom < tooltipRect.height + 15) {
      effectivePosition = 'top';
    } else if (position === 'left' && spaceLeft < tooltipRect.width + 15) {
      effectivePosition = 'right';
    } else if (position === 'right' && spaceRight < tooltipRect.width + 15) {
      effectivePosition = 'left';
    }
    
    setComputedPosition(effectivePosition);
    
    // Calculate position based on the effective position
    switch (effectivePosition) {
      case 'top':
        left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);
        top = childRect.top - tooltipRect.height - 10;
        break;
      case 'bottom':
        left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);
        top = childRect.bottom + 10;
        break;
      case 'left':
        left = childRect.left - tooltipRect.width - 10;
        top = childRect.top + (childRect.height / 2) - (tooltipRect.height / 2);
        break;
      case 'right':
        left = childRect.right + 10;
        top = childRect.top + (childRect.height / 2) - (tooltipRect.height / 2);
        break;
    }

    // Adjust if tooltip would be outside viewport
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10)
      left = viewportWidth - tooltipRect.width - 10;
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewportHeight - 10)
      top = viewportHeight - tooltipRect.height - 10;

    setTooltipStyle({
      left: `${left}px`,
      top: `${top}px`,
      maxWidth: `${maxWidth}px`
    });
    
    // Position the arrow
    if (showArrow) {
      let arrowLeft = 0;
      let arrowTop = 0;
      const arrowSize = 8; // Half of the arrow size
      
      switch (effectivePosition) {
        case 'top':
          arrowLeft = childRect.left + (childRect.width / 2) - left - arrowSize;
          arrowTop = tooltipRect.height - 1;
          break;
        case 'bottom':
          arrowLeft = childRect.left + (childRect.width / 2) - left - arrowSize;
          arrowTop = -arrowSize * 2 + 1;
          break;
        case 'left':
          arrowLeft = tooltipRect.width - 1;
          arrowTop = childRect.top + (childRect.height / 2) - top - arrowSize;
          break;
        case 'right':
          arrowLeft = -arrowSize * 2 + 1;
          arrowTop = childRect.top + (childRect.height / 2) - top - arrowSize;
          break;
      }
      
      setArrowStyle({
        left: `${arrowLeft}px`,
        top: `${arrowTop}px`
      });
    }
  }, [position, maxWidth, showArrow]);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setTimeout(updatePosition, 0);
    }, delay);
  }, [updatePosition, delay, disabled]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible, updatePosition]);
  
  // Get theme-specific classes
  const getThemeClasses = () => {
    return theme === 'dark' 
      ? 'bg-gray-800 text-white' 
      : 'bg-white text-gray-800 border border-gray-200';
  };
  
  // Get arrow classes based on position
  const getArrowClasses = () => {
    const baseClasses = theme === 'dark' 
      ? 'border-gray-800 bg-gray-800' 
      : 'border-gray-200 bg-white';
      
    switch (computedPosition) {
      case 'top': return `${baseClasses} rotate-45 border-r border-b`;
      case 'bottom': return `${baseClasses} rotate-45 border-l border-t`;
      case 'left': return `${baseClasses} rotate-45 border-r border-t`;
      case 'right': return `${baseClasses} rotate-45 border-l border-b`;
      default: return '';
    }
  };

  return (
    <>
      <div
        ref={childRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={cn(
              'fixed z-50 rounded-md py-2 px-3 text-sm shadow-lg',
              getThemeClasses(),
              className
            )}
            style={tooltipStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: prefersReducedMotion ? 0 : 0.15,
              ease: 'easeOut'
            }}
          >
            {content}
            
            {showArrow && (
              <div 
                className={cn(
                  'absolute w-4 h-4',
                  getArrowClasses()
                )} 
                style={arrowStyle}
                aria-hidden="true"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};