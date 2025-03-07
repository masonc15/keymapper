import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useApplicationColors } from '@/hooks/useApplications';
import { Shortcut } from '@/types/shortcut';
import { 
  SortConfig, 
  SortDirection, 
  sortShortcuts, 
  loadTableState, 
  saveTableState,
  getDefaultTableState
} from '@/utils/tableUtils';

interface ShortcutTableProps {
  shortcuts: Shortcut[];
  onEditShortcut: (shortcut: Shortcut) => void;
  onDeleteShortcut: (shortcut: Shortcut) => void;
}

export function ShortcutTable({
  shortcuts,
  onEditShortcut,
  onDeleteShortcut,
}: ShortcutTableProps) {
  // Initialize sort config with defaults or from localStorage
  const [sortConfig, setSortConfig] = useState<SortConfig>(() => {
    const saved = loadTableState();
    return saved?.sortConfig || getDefaultTableState().sortConfig;
  });
  
  // Focus management for keyboard navigation
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);
  const tableRef = useRef<HTMLTableElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  // Get application colors
  const appColors = useApplicationColors();

  // Handle table sorting
  const handleSort = (column: keyof Shortcut) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.column === column) {
      // Toggle direction if clicking the same column
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    const newConfig = { column, direction };
    setSortConfig(newConfig);
    
    // Save sort preferences
    const currentState = loadTableState() || getDefaultTableState();
    saveTableState({
      ...currentState,
      sortConfig: newConfig
    });
  };

  // Sort the shortcuts
  const sortedShortcuts = sortShortcuts(shortcuts, sortConfig);

  // Save sort preferences when they change
  useEffect(() => {
    const currentState = loadTableState() || getDefaultTableState();
    saveTableState({
      ...currentState,
      sortConfig
    });
  }, [sortConfig]);
  
  // Initialize row refs
  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, sortedShortcuts.length);
  }, [sortedShortcuts]);
  
  // Focus handling
  useEffect(() => {
    // Focus the first row when the table is first loaded
    if (sortedShortcuts.length > 0 && focusedRowIndex === -1) {
      setFocusedRowIndex(0);
    }
  }, [sortedShortcuts, focusedRowIndex]);
  
  // Handle table keyboard navigation
  const handleTableKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Skip if we have no shortcuts
    if (sortedShortcuts.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedRowIndex(prev => {
          const nextIndex = Math.min(prev + 1, sortedShortcuts.length - 1);
          rowRefs.current[nextIndex]?.focus();
          return nextIndex;
        });
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setFocusedRowIndex(prev => {
          const nextIndex = Math.max(prev - 1, 0);
          rowRefs.current[nextIndex]?.focus();
          return nextIndex;
        });
        break;
        
      case 'Home':
        e.preventDefault();
        setFocusedRowIndex(0);
        rowRefs.current[0]?.focus();
        break;
        
      case 'End':
        e.preventDefault();
        const lastIndex = sortedShortcuts.length - 1;
        setFocusedRowIndex(lastIndex);
        rowRefs.current[lastIndex]?.focus();
        break;
    }
  };

  // Format key combination for display
  const formatKeyCombination = (combo: string) => {
    return (
      <span className="font-mono whitespace-nowrap">
        {combo.split('+').map((key, i, arr) => (
          <React.Fragment key={i}>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-gray-800">
              {key}
            </span>
            {i < arr.length - 1 && <span className="mx-1">+</span>}
          </React.Fragment>
        ))}
      </span>
    );
  };

  // Render sort indicator
  const renderSortIndicator = (column: keyof Shortcut) => {
    if (sortConfig.column !== column) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4 inline" /> 
      : <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  return (
    <div 
      className="rounded-md border"
      onKeyDown={handleTableKeyDown}
      role="grid"
      aria-rowcount={sortedShortcuts.length + 1} // +1 for header row
      aria-colcount={4}
    >
      <Table ref={tableRef}>
        <TableHeader>
          <TableRow role="row" aria-rowindex={1}>
            {/* Key Combination Column */}
            <TableHead 
              onClick={() => handleSort('key_combination')}
              className="cursor-pointer hover:bg-gray-50"
              style={{ width: '30%' }}
              role="columnheader"
              aria-sort={sortConfig.column === 'key_combination' 
                ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending')
                : undefined}
              aria-colindex={1}
            >
              Key Combination
              {renderSortIndicator('key_combination')}
            </TableHead>
            
            {/* Application Column */}
            <TableHead 
              onClick={() => handleSort('application')}
              className="cursor-pointer hover:bg-gray-50"
              style={{ width: '20%' }}
              role="columnheader"
              aria-sort={sortConfig.column === 'application' 
                ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending')
                : undefined}
              aria-colindex={2}
            >
              Application
              {renderSortIndicator('application')}
            </TableHead>
            
            {/* Description Column */}
            <TableHead 
              onClick={() => handleSort('description')}
              className="cursor-pointer hover:bg-gray-50"
              style={{ width: '40%' }}
              role="columnheader"
              aria-sort={sortConfig.column === 'description' 
                ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending')
                : undefined}
              aria-colindex={3}
            >
              Description
              {renderSortIndicator('description')}
            </TableHead>
            
            {/* Actions Column */}
            <TableHead 
              style={{ width: '10%' }}
              role="columnheader"
              aria-colindex={4}
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedShortcuts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No shortcuts found.
              </TableCell>
            </TableRow>
          ) : (
            sortedShortcuts.map((shortcut, index) => (
              <TableRow 
                key={shortcut.id}
                ref={el => rowRefs.current[index] = el}
                className={`
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  ${focusedRowIndex === index ? 'ring-2 ring-primary ring-inset' : ''}
                `}
                data-shortcut-id={shortcut.id}
                tabIndex={focusedRowIndex === index ? 0 : -1}
                role="row"
                aria-rowindex={index + 2} // +2 because aria-rowindex is 1-based and we have a header row
                aria-selected={focusedRowIndex === index}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onEditShortcut(shortcut);
                  } else if (e.key === 'Delete') {
                    onDeleteShortcut(shortcut);
                  }
                }}
                onClick={() => setFocusedRowIndex(index)}
              >
                {/* Key Combination */}
                <TableCell role="gridcell" aria-colindex={1}>
                  {formatKeyCombination(shortcut.key_combination)}
                </TableCell>
                
                {/* Application */}
                <TableCell role="gridcell" aria-colindex={2}>
                  <span 
                    className="inline-block px-2 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: appColors[shortcut.application],
                      color: 'white',
                    }}
                  >
                    {shortcut.application}
                  </span>
                </TableCell>
                
                {/* Description */}
                <TableCell role="gridcell" aria-colindex={3}>
                  {shortcut.description}
                </TableCell>
                
                {/* Actions */}
                <TableCell role="gridcell" aria-colindex={4}>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEditShortcut(shortcut)}
                      aria-label={`Edit shortcut ${shortcut.key_combination}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDeleteShortcut(shortcut)} 
                      aria-label={`Delete shortcut ${shortcut.key_combination}`}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Keyboard Navigation Instructions */}
      <div className="text-xs text-gray-500 mt-2 p-2 border-t">
        <span className="mr-2">
          <kbd className="px-1 py-0.5 bg-gray-100 border rounded">↑</kbd> / 
          <kbd className="px-1 py-0.5 bg-gray-100 border rounded">↓</kbd> Navigate rows
        </span>
        <span className="mr-2">
          <kbd className="px-1 py-0.5 bg-gray-100 border rounded">Enter</kbd> Edit shortcut
        </span>
        <span className="mr-2">
          <kbd className="px-1 py-0.5 bg-gray-100 border rounded">Delete</kbd> Delete shortcut
        </span>
      </div>
    </div>
  );
}