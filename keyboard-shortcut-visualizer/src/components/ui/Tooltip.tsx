import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  maxWidth = 300,
  delay = 300,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const childRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return;

    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = 0;
    let top = 0;

    switch (position) {
      case 'top':
        left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);
        top = childRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);
        top = childRect.bottom + 8;
        break;
      case 'left':
        left = childRect.left - tooltipRect.width - 8;
        top = childRect.top + (childRect.height / 2) - (tooltipRect.height / 2);
        break;
      case 'right':
        left = childRect.right + 8;
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
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setTimeout(updatePosition, 0);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible]);

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
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'fixed z-50 rounded-md bg-gray-800 text-white py-2 px-3 text-sm shadow-lg',
            'animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            className
          )}
          style={tooltipStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </div>
      )}
    </>
  );
};