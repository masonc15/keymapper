import React from 'react';
import { Shortcut } from '@/types/shortcut';
import { getAppBadgeClass } from '@/utils/colorUtils';
import { Button } from '@/components/ui/button';

interface ShortcutItemProps {
  shortcut: Shortcut;
  onEdit: (shortcut: Shortcut) => void;
  onDelete: (shortcut: Shortcut) => void;
  isMobile?: boolean;
}

export const ShortcutItem: React.FC<ShortcutItemProps> = ({
  shortcut,
  onEdit,
  onDelete,
  isMobile = false,
}) => {
  // Mobile optimizations: larger touch targets, always visible buttons
  const mobilePadding = isMobile ? 'py-3 px-2' : 'py-2 px-1';
  const mobileTextSize = isMobile ? 'text-xs' : 'text-sm';
  const buttonSize = isMobile ? 'h-9 w-9' : 'h-7 px-2';
  const buttonVisibility = isMobile 
    ? 'opacity-100' // Always visible on mobile
    : 'opacity-0 group-hover:opacity-100 transition-opacity';
  
  return (
    <div className={`${mobilePadding} border-b border-gray-200 last:border-0 group`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`font-mono ${isMobile ? 'text-xs' : 'text-sm'} font-medium text-blue-600`}>
              {shortcut.key_combination}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${getAppBadgeClass(shortcut.application)}`}>
              {shortcut.application}
            </span>
          </div>
          <p className={`${mobileTextSize} text-gray-600 mb-2 line-clamp-2`}>
            {shortcut.description}
          </p>
        </div>
        
        <div className={`flex items-center space-x-1 ${buttonVisibility}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(shortcut)}
            className={`${buttonSize} text-gray-500 hover:text-blue-600`}
            aria-label={`Edit shortcut ${shortcut.key_combination}`}
          >
            {isMobile ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                <path d="m15 5 4 4"></path>
              </svg>
            ) : (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-1"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  <path d="m15 5 4 4"></path>
                </svg>
                <span className="text-xs">Edit</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(shortcut)}
            className={`${buttonSize} text-gray-500 hover:text-red-600`}
            aria-label={`Delete shortcut ${shortcut.key_combination}`}
          >
            {isMobile ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            ) : (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-1"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                <span className="text-xs">Delete</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};