import React, { useState, useEffect, useCallback } from 'react';
import { Shortcut } from '@/types/shortcut';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { KeyCombinationInput } from './KeyCombinationInput';
import { ConflictWarning } from './ConflictWarning';
import { isValidKeyCombination, getBaseKeyFromKeyId } from '@/utils/keyboardUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useShortcuts } from '@/hooks/useShortcuts';
import { useApplications } from '@/hooks/useApplications';
import { processShortcut } from '@/utils/shortcutUtils';
import { ConflictType, ShortcutConflict } from '@/utils/conflictUtils';
import { OverrideOptions } from '@/contexts/ShortcutContext';

// Define the form schema with Zod for validation
const formSchema = z.object({
  application: z
    .string()
    .min(1, { message: 'Application name is required' })
    .max(50, { message: 'Application name must be 50 characters or less' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(100, { message: 'Description must be 100 characters or less' }),
  key_combination: z
    .string()
    .min(1, { message: 'Key combination is required' })
    .refine(isValidKeyCombination, {
      message: 'Invalid key combination format. Example: ⌘+A, ⌃+⌥+Delete'
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcut?: Shortcut; // Optional, for editing existing shortcuts
  keyId?: string; // Optional, for adding a shortcut to a specific key
  onSuccess?: () => void; // Callback for when a shortcut is successfully added/updated
}

export const ShortcutModal: React.FC<ShortcutModalProps> = ({
  isOpen,
  onClose,
  shortcut,
  keyId,
  onSuccess,
}) => {
  const { checkForConflicts, addShortcut, updateShortcut } = useShortcuts();
  const applications = useApplications();
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Conflict state
  const [currentConflict, setCurrentConflict] = useState<ShortcutConflict | null>(null);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [overrideOptions, setOverrideOptions] = useState<OverrideOptions>({ 
    force: false,
    replaceConflicting: false
  });
  
  const isEditing = !!shortcut;
  const title = isEditing ? 'Edit Shortcut' : 'Add Shortcut';
  
  // Set up form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      application: '',
      description: '',
      key_combination: '',
    },
    mode: 'onChange' // Enable validation on change for real-time feedback
  });

  // Watch form values for conflict detection
  const formValues = useWatch({
    control: form.control,
    name: ['application', 'key_combination', 'description']
  });
  
  // Reset form state when modal opens/closes or shortcut/keyId changes
  useEffect(() => {
    if (shortcut) {
      // Editing an existing shortcut
      form.reset({
        application: shortcut.application,
        description: shortcut.description,
        key_combination: shortcut.key_combination,
      });
    } else if (keyId) {
      // If adding a shortcut for a specific key, pre-populate the key combination
      const baseKey = getBaseKeyFromKeyId(keyId);
      if (baseKey) {
        form.reset({
          application: '',
          description: '',
          key_combination: baseKey,
        });
      } else {
        form.reset();
      }
    } else {
      // Adding a completely new shortcut
      form.reset();
    }
    
    // Clear all state when opening/closing modal
    setErrorMessage(null);
    setSuccessMessage(null);
    setCurrentConflict(null);
    setShowConflictWarning(false);
    setOverrideOptions({ force: false, replaceConflicting: false });
  }, [shortcut, keyId, form, isOpen]);

  // Check for conflicts when form values change
  useEffect(() => {
    const checkConflict = () => {
      const [application, key_combination, description] = formValues;
      
      // Only check if we have the required fields
      if (
        form.formState.isValid && 
        application && 
        key_combination && 
        description
      ) {
        const values = { 
          application, 
          key_combination, 
          description 
        };
        
        // Check for conflicts
        const conflict = checkForConflicts(values, isEditing ? shortcut?.id : undefined);
        setCurrentConflict(conflict.type !== ConflictType.NONE ? conflict : null);
      } else {
        setCurrentConflict(null);
      }
    };
    
    checkConflict();
  }, [formValues, checkForConflicts, isEditing, shortcut, form.formState.isValid]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      // Check for conflicts one more time
      const conflict = checkForConflicts(values, isEditing ? shortcut?.id : undefined);
      
      // If there's a conflict and we're not already in override mode, show warning
      if (
        conflict.type !== ConflictType.NONE &&
        !overrideOptions.force &&
        conflict.type !== ConflictType.CROSS_APP // Info-level conflicts don't need confirmation
      ) {
        setCurrentConflict(conflict);
        setShowConflictWarning(true);
        setIsSubmitting(false);
        return;
      }
      
      // Process form values with override options
      let result;
      
      if (isEditing && shortcut) {
        // Update existing shortcut
        result = await updateShortcut(
          { ...shortcut, ...values },
          overrideOptions
        );
      } else {
        // Add new shortcut
        result = await addShortcut(values, overrideOptions);
      }
      
      // Handle the result
      if (result.success) {
        setSuccessMessage(isEditing ? 'Shortcut updated successfully!' : 'Shortcut added successfully!');
        
        // Call success callback after a brief delay to show the success message
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 800);
      } else if (result.conflict) {
        // Show conflict warning if we have one
        setCurrentConflict(result.conflict);
        setShowConflictWarning(true);
      } else if (result.error) {
        // Show error message
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error('Error saving shortcut:', error);
      setErrorMessage('An error occurred while saving the shortcut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle continuing with conflict override
  const handleOverride = useCallback(() => {
    setOverrideOptions({
      force: true,
      replaceConflicting: true
    });
    setShowConflictWarning(false);
    
    // Re-submit the form with override options
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  // Handle canceling the conflict override
  const handleCancelOverride = useCallback(() => {
    setShowConflictWarning(false);
  }, []);

  // Get application suggestions
  const applicationSuggestions = applications.map(app => app.name);
  
  // Determine if a field has a conflict
  const hasFieldConflict = (fieldName: keyof FormValues) => {
    if (!currentConflict) return false;
    
    if (fieldName === 'key_combination') {
      return currentConflict.type !== ConflictType.NONE;
    }
    
    if (fieldName === 'application') {
      return currentConflict.type === ConflictType.EXACT || 
             currentConflict.type === ConflictType.APP_SPECIFIC;
    }
    
    return false;
  };
  
  // Get field classes based on conflict status
  const getFieldClasses = (fieldName: keyof FormValues) => {
    if (hasFieldConflict(fieldName)) {
      return 'border-amber-300 focus:border-amber-500 focus:ring-amber-500';
    }
    return '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edit the shortcut details below.'
              : 'Add a new keyboard shortcut.'}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="p-3 mb-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="p-3 mb-3 text-sm bg-green-50 border border-green-200 text-green-600 rounded-md">
            {successMessage}
          </div>
        )}
        
        {/* Conflict warning - live conflict detection during editing */}
        {currentConflict && !showConflictWarning && (
          <ConflictWarning 
            conflict={currentConflict} 
            showButtons={false}
          />
        )}
        
        {/* Confirmation dialog for override */}
        {showConflictWarning && currentConflict && (
          <ConflictWarning 
            conflict={currentConflict}
            onContinue={handleOverride}
            onCancel={handleCancelOverride}
          />
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="application"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        list="app-suggestions"
                        placeholder="e.g., Chrome, VSCode" 
                        className={getFieldClasses('application')}
                        {...field} 
                        disabled={isSubmitting}
                      />
                      <datalist id="app-suggestions">
                        {applicationSuggestions.map(app => (
                          <option key={app} value={app} />
                        ))}
                      </datalist>
                      
                      {/* Application field conflict indicator */}
                      {hasFieldConflict('application') && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-500">
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
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Open a new tab" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key_combination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Shortcut Key Combination
                    {hasFieldConflict('key_combination') && (
                      <span className="ml-2 text-amber-500 text-xs font-normal">
                        • Conflict detected
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <KeyCombinationInput
                      value={field.value}
                      onChange={field.onChange}
                      error={!!form.formState.errors.key_combination}
                      warning={hasFieldConflict('key_combination')}
                      disabled={isSubmitting || !!keyId} // Disable if we're adding for a specific key
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting 
                  ? 'Saving...' 
                  : isEditing 
                    ? 'Save Changes' 
                    : 'Add Shortcut'
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};