import React from 'react';
import { Shortcut } from '@/types/shortcut';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getAppBadgeClass } from '@/utils/colorUtils';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shortcut: Shortcut | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  shortcut,
  onConfirm,
  isDeleting,
}) => {
  if (!shortcut) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Shortcut</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this shortcut? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {shortcut && (
          <div className="p-4 my-4 border rounded-md bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-sm font-medium text-blue-600">
                {shortcut.key_combination}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${getAppBadgeClass(shortcut.application)}`}>
                {shortcut.application}
              </span>
            </div>
            <p className="text-sm text-gray-600">{shortcut.description}</p>
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};