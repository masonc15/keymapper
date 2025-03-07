import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useShortcuts } from '@/hooks/useShortcuts';
import { TableHeader } from './TableHeader';
import { ShortcutTable } from './ShortcutTable';
import { ShortcutModal } from '../shortcuts/ShortcutModal';
import { DeleteConfirmationDialog } from '../shortcuts/DeleteConfirmationDialog';
import { Shortcut } from '@/types/shortcut';
import { 
  TableFilters, 
  filterShortcuts, 
  loadTableState, 
  saveTableState,
  getDefaultTableState
} from '@/utils/tableUtils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function TableView() {
  const { shortcuts, loading, deleteShortcut } = useShortcuts();
  
  // Responsive layout detection using media queries
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  
  // State for managing table filters
  const [filters, setFilters] = useState<TableFilters>(() => {
    const saved = loadTableState();
    return saved?.filters || getDefaultTableState().filters;
  });
  
  // State for managing modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShortcut, setSelectedShortcut] = useState<Shortcut | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [shortcutToDelete, setShortcutToDelete] = useState<Shortcut | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCardView, setIsCardView] = useState(false);
  
  // Automatically switch to card view on mobile
  useEffect(() => {
    setIsCardView(isMobile);
  }, [isMobile]);
  
  // Apply filters to shortcuts
  const filteredShortcuts = filterShortcuts(shortcuts, filters);
  
  // Save filter state when it changes
  useEffect(() => {
    const currentState = loadTableState() || getDefaultTableState();
    saveTableState({
      ...currentState,
      filters
    });
  }, [filters]);
  
  // Handle opening the add/edit modal
  const handleOpenModal = (shortcut?: Shortcut) => {
    if (shortcut) {
      setSelectedShortcut(shortcut);
    } else {
      setSelectedShortcut(null);
    }
    setIsModalOpen(true);
  };
  
  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShortcut(null);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: TableFilters) => {
    setFilters(newFilters);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirmation = (shortcut: Shortcut) => {
    setShortcutToDelete(shortcut);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle the actual deletion
  const handleConfirmDelete = async () => {
    if (!shortcutToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteShortcut(shortcutToDelete.id);
    } catch (error) {
      console.error('Failed to delete shortcut:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setShortcutToDelete(null);
    }
  };
  
  // Handle modal success (refresh or any other actions)
  const handleModalSuccess = () => {
    // We could do additional operations here if needed
  };

  // Card view for mobile
  const renderCardView = () => {
    return (
      <div className="space-y-4">
        {filteredShortcuts.map((shortcut) => (
          <div 
            key={shortcut.id} 
            className="p-3 bg-white rounded-lg border shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-mono text-sm font-medium text-blue-600 mr-2">
                  {shortcut.key_combination}
                </span>
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                  {shortcut.application}
                </span>
              </div>
              <div className="flex gap-1">
                <button 
                  className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full bg-gray-50"
                  onClick={() => handleOpenModal(shortcut)}
                  aria-label="Edit shortcut"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                    <path d="m15 5 4 4"></path>
                  </svg>
                </button>
                <button 
                  className="p-1.5 text-gray-500 hover:text-red-600 rounded-full bg-gray-50"
                  onClick={() => handleDeleteConfirmation(shortcut)}
                  aria-label="Delete shortcut"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{shortcut.description}</p>
          </div>
        ))}
        {filteredShortcuts.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No shortcuts match your filters.</p>
          </div>
        )}
      </div>
    );
  };

  // View toggle button
  const ViewToggleButton = () => (
    <button
      className="ml-2 flex items-center justify-center h-8 px-2 text-xs border rounded bg-white"
      onClick={() => setIsCardView(!isCardView)}
      aria-label={isCardView ? "Switch to table view" : "Switch to card view"}
    >
      {isCardView ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M3 3h18v18H3z"></path>
            <path d="M21 9H3"></path>
            <path d="M21 15H3"></path>
            <path d="M12 3v18"></path>
          </svg>
          Table
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <rect width="7" height="7" x="3" y="3" rx="1"></rect>
            <rect width="7" height="7" x="14" y="3" rx="1"></rect>
            <rect width="7" height="7" x="14" y="14" rx="1"></rect>
            <rect width="7" height="7" x="3" y="14" rx="1"></rect>
          </svg>
          Cards
        </>
      )}
    </button>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shortcuts Table</CardTitle>
          {!loading && shortcuts.length > 0 && (isTablet || isMobile) && <ViewToggleButton />}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p>Loading shortcuts...</p>
          </div>
        ) : shortcuts.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-2`}>No Shortcuts Found</h3>
            <p className="text-gray-500">Add your first shortcut to get started.</p>
          </div>
        ) : (
          <>
            {/* Table Header with Search and Filters */}
            <TableHeader 
              filters={filters}
              onFilterChange={handleFilterChange}
              onAddShortcut={() => handleOpenModal()}
              totalShortcuts={shortcuts.length}
              filteredCount={filteredShortcuts.length}
              isMobile={isMobile}
            />
            
            {/* Toggle between Card view and Table view */}
            {isCardView ? renderCardView() : (
              <div className="overflow-x-auto">
                <ShortcutTable 
                  shortcuts={filteredShortcuts}
                  onEditShortcut={(shortcut) => handleOpenModal(shortcut)}
                  onDeleteShortcut={handleDeleteConfirmation}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </div>
            )}
            
            {/* Pagination or stats could go here */}
            {filteredShortcuts.length > 0 && (
              <div className="text-sm text-gray-500 mt-4 text-right">
                {filteredShortcuts.length === 1 
                  ? '1 shortcut' 
                  : `${filteredShortcuts.length} shortcuts`}
              </div>
            )}
            
            {/* Shortcut Modal for adding/editing */}
            <ShortcutModal 
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              shortcut={selectedShortcut || undefined}
              onSuccess={handleModalSuccess}
              isMobile={isMobile}
            />
            
            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              shortcut={shortcutToDelete}
              onConfirm={handleConfirmDelete}
              isDeleting={isDeleting}
              isMobile={isMobile}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}