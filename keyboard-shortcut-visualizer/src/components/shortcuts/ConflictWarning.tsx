import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ShortcutConflict, 
  getConflictTypeDescription, 
  getConflictSeverityClass, 
  ConflictType 
} from '@/utils/conflictUtils';
import { getAppBadgeClass } from '@/utils/colorUtils';

interface ConflictWarningProps {
  conflict: ShortcutConflict;
  onContinue?: () => void;
  onCancel?: () => void;
  showButtons?: boolean;
  className?: string;
}

export const ConflictWarning: React.FC<ConflictWarningProps> = ({
  conflict,
  onContinue,
  onCancel,
  showButtons = true,
  className = '',
}) => {
  // No need to render if there's no conflict
  if (conflict.type === ConflictType.NONE) {
    return null;
  }

  // Get the appropriate icon based on severity
  const getIcon = () => {
    switch (conflict.severity) {
      case 'error':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case 'warning':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-500"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'info':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  return (
    <div
      className={`p-4 border rounded-md mb-4 ${getConflictSeverityClass(
        conflict.severity
      )} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="font-medium mb-1">
            {getConflictTypeDescription(conflict.type)} detected
          </h4>
          <p className="text-sm mb-3">{conflict.message}</p>

          {/* Show conflicting shortcuts */}
          {conflict.conflictingShortcuts.length > 0 && (
            <div className="border-t border-b py-2 my-2 text-sm">
              <h5 className="text-xs font-semibold uppercase mb-2 opacity-70">
                Conflicting Shortcuts
              </h5>
              <div className="space-y-2">
                {conflict.conflictingShortcuts.map((shortcut) => (
                  <div key={shortcut.id} className="flex items-start gap-2">
                    <span className="font-mono text-sm font-medium whitespace-nowrap">
                      {shortcut.key_combination}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${getAppBadgeClass(shortcut.application)}`}>
                          {shortcut.application}
                        </span>
                        <span className="text-xs text-gray-600">
                          {shortcut.description}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolution suggestions based on conflict type */}
          <div className="text-sm mt-2">
            {conflict.type === ConflictType.EXACT && (
              <p>
                A duplicate shortcut already exists. To proceed, please change either the
                key combination or the application.
              </p>
            )}
            {conflict.type === ConflictType.APP_SPECIFIC && (
              <p>
                This will replace existing function(s) for this key combination in the application.
                To continue, click "Override" or modify your shortcut.
              </p>
            )}
            {conflict.type === ConflictType.CROSS_APP && (
              <p>
                This key combination is already used by other applications. 
                This is usually fine but may cause confusion when switching between apps.
              </p>
            )}
          </div>

          {/* Action buttons */}
          {showButtons && (conflict.type !== ConflictType.EXACT) && (
            <div className="flex justify-end gap-2 mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={conflict.severity === 'warning' ? 'destructive' : 'default'}
                size="sm"
                onClick={onContinue}
              >
                {conflict.severity === 'warning' ? 'Override' : 'Continue'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};