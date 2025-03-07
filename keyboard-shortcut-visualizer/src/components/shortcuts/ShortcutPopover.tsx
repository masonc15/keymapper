import React, { useRef, useEffect, useState } from 'react';
import { Shortcut } from '@/types/shortcut';
import { ShortcutItem } from './ShortcutItem';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useShortcuts } from '@/hooks/useShortcuts';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { ShortcutModal } from './ShortcutModal';

interface ShortcutPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  keyId: string;
  keyLabel: string;
  onSuccess?: () => void; // Callback for when a shortcut is successfully added/edited/deleted
}

interface ShortcutsByApp {
  [app: string]: Shortcut[];
}

export const ShortcutPopover: React.FC<ShortcutPopoverProps> = ({
  isOpen,
  onClose,
  keyId,
  keyLabel,
  onSuccess,
}) => {
  const { shortcuts, deleteShortcut, findShortcutsByBaseKey } = useShortcuts();
  const popoverRef = useRef<HTMLDivElement>(null);
  
  // States for modal visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Selected shortcut for edit/delete
  const [selectedShortcut, setSelectedShortcut] = useState<Shortcut | null>(null);
  
  // Get shortcuts for this key
  const keyShortcuts = findShortcutsByBaseKey(keyId);
  
  // Group shortcuts by application
  const groupedShortcuts = keyShortcuts.reduce<ShortcutsByApp>((acc, shortcut) => {
    const app = shortcut.application;
    if (!acc[app]) {
      acc[app] = [];
    }
    acc[app].push(shortcut);
    return acc;
  }, {});

  // Handle Escape key to close popover
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap within popover
  useEffect(() => {
    if (isOpen && popoverRef.current) {
      const focusableElements = popoverRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);
  
  // Handlers for shortcut actions
  const handleEdit = (shortcut: Shortcut) => {
    setSelectedShortcut(shortcut);
    setIsEditModalOpen(true);
  };
  
  const handleDelete = (shortcut: Shortcut) => {
    setSelectedShortcut(shortcut);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAdd = () => {
    setIsAddModalOpen(true);
  };
  
  // Confirm delete handler
  const confirmDelete = async () => {
    if (!selectedShortcut) return;
    
    try {
      setIsDeleting(true);
      await deleteShortcut(selectedShortcut.id);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error deleting shortcut:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedShortcut(null);
    }
  };
  
  // Success handler for add/edit
  const handleOperationSuccess = () => {
    // Reset modal states
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedShortcut(null);
    
    // Call success callback
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <PopoverTrigger className="hidden">Open</PopoverTrigger>
        <PopoverContent 
          ref={popoverRef}
          className="w-80 p-0 overflow-hidden"
          side="top"
          align="center"
          sideOffset={5}
          onEscapeKeyDown={onClose}
          onInteractOutside={onClose}
        >
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">
              {keyLabel} key shortcuts
            </h3>
            <p className="text-xs text-gray-500">
              {keyShortcuts.length === 0
                ? 'No shortcuts assigned to this key'
                : `${keyShortcuts.length} shortcut${keyShortcuts.length > 1 ? 's' : ''} assigned`}
            </p>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {Object.entries(groupedShortcuts).map(([app, appShortcuts]) => (
              <div key={app} className="p-3">
                <h4 className="text-xs font-semibold text-gray-500 mb-1">
                  {app}
                </h4>
                {appShortcuts.map((shortcut) => (
                  <ShortcutItem
                    key={shortcut.id}
                    shortcut={shortcut}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ))}

            {keyShortcuts.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <p className="mb-2">No shortcuts are assigned to this key.</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleAdd}
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
                className="mr-1"
              >
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
              Add new shortcut
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Add Modal */}
      <ShortcutModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        keyId={keyId}
        onSuccess={handleOperationSuccess}
      />
      
      {/* Edit Modal */}
      <ShortcutModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        shortcut={selectedShortcut || undefined}
        onSuccess={handleOperationSuccess}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        shortcut={selectedShortcut}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};