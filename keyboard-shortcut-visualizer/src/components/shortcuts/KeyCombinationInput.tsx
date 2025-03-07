import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { keyEventToKeyCombo, isValidKeyCombination } from '@/utils/keyboardUtils';
import { cn } from '@/lib/utils';

interface KeyCombinationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  warning?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const KeyCombinationInput: React.FC<KeyCombinationInputProps> = ({
  value,
  onChange,
  error = false,
  warning = false,
  disabled = false,
  className = '',
  placeholder = 'Press a key combination',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle key events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isRecording) return;
    
    // Prevent default behavior for all key presses during recording
    event.preventDefault();

    // Convert the key event to a key combination string
    const keyCombo = keyEventToKeyCombo(event);
    
    // If we got a valid key combo, update the value
    if (keyCombo) {
      onChange(keyCombo);
      setIsRecording(false);
    }
  }, [isRecording, onChange]);

  // Set up key event listeners
  useEffect(() => {
    if (isRecording) {
      // Add global event listener for keydown
      window.addEventListener('keydown', handleKeyDown);
      
      // Focus the input
      inputRef.current?.focus();
    }
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRecording, handleKeyDown]);

  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    inputRef.current?.focus();
  };

  // Clear the input
  const clearInput = () => {
    onChange('');
    setIsRecording(false);
  };

  // Format the key combination for display
  const displayValue = value || (isRecording ? 'Recording...' : placeholder);

  // Determine border color based on state
  const getBorderClass = () => {
    if (error) return 'border-red-300';
    if (warning) return 'border-amber-300';
    return 'border-gray-300';
  };

  // Determine ring color when focused
  const getRingClass = () => {
    if (error) return 'ring-red-500';
    if (warning) return 'ring-amber-500';
    return 'ring-blue-500';
  };

  // Determine text color for the display value
  const getTextClass = () => {
    if (isRecording) return 'text-blue-600 animate-pulse';
    if (error) return 'text-red-500';
    if (warning) return 'text-amber-500';
    if (!value && !isRecording) return 'text-gray-400';
    return '';
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'flex items-center justify-between px-3 py-2 w-full rounded-md border bg-white text-sm ring-offset-white',
          isFocused && `ring-2 ring-offset-2 ${getRingClass()}`,
          isRecording && 'bg-blue-50 border-blue-300',
          getBorderClass(),
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={() => !disabled && startRecording()}
      >
        <div className="flex items-center flex-1">
          {/* Hidden input for focus management */}
          <input
            ref={inputRef}
            type="text"
            className="sr-only"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            readOnly
            aria-label="Key combination input"
            tabIndex={disabled ? -1 : 0}
          />
          
          {/* Visual representation of the key combination */}
          <div
            className={cn(
              'font-mono',
              getTextClass()
            )}
          >
            {displayValue}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Warning indicator */}
          {warning && !isRecording && (
            <div className="mr-1 text-amber-500">
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
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          )}
        
          {/* Clear button */}
          {value && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearInput();
              }}
              className="h-6 px-2 text-gray-400 hover:text-gray-600"
              aria-label="Clear key combination"
            >
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
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </Button>
          )}
          
          {/* Record button */}
          {!disabled && (
            <Button
              type="button"
              variant={isRecording ? "default" : "outline"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                startRecording();
              }}
              className={cn(
                "h-6 text-xs",
                isRecording && "bg-blue-600 text-white"
              )}
            >
              {isRecording ? "Recording..." : "Record"}
            </Button>
          )}
        </div>
      </div>
      
      {/* Helper text */}
      {isRecording && (
        <p className="mt-1 text-xs text-blue-600">
          Press a key combination (e.g., ⌘+A, ⌃+⌥+Delete)
        </p>
      )}
    </div>
  );
};