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
import { cn } from '@/lib/utils';

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
  const [sortConfig, setSortConfig] = useState<SortConfig>(() => {
    const saved = loadTableState();
    return saved?.sortConfig || getDefaultTableState().sortConfig;
  });

  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);
  const tableRef = useRef<HTMLTableElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const appColors = useApplicationColors();

  const handleSort = (column: keyof Shortcut) => {
    let direction: SortDirection = 'asc';

    if (sortConfig.column === column) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }

    const newConfig = { column, direction };
    setSortConfig(newConfig);

    const currentState = loadTableState() || getDefaultTableState();
    saveTableState({
      ...currentState,
      sortConfig: newConfig
    });
  };

  const sortedShortcuts = sortShortcuts(shortcuts, sortConfig);

  useEffect(() => {
    const currentState = loadTableState() || getDefaultTableState();
    saveTableState({
      ...currentState,
      sortConfig
    });
  }, [sortConfig]);

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, sortedShortcuts.length);
  }, [sortedShortcuts]);

  useEffect(() => {
    if (sortedShortcuts.length > 0 && focusedRowIndex === -1) {
      setFocusedRowIndex(0);
    }
  }, [sortedShortcuts, focusedRowIndex]);

  const handleTableKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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

  const formatKeyCombination = (combo: string) => (
    <span className="flex flex-wrap items-center gap-1 font-mono text-sm text-slate-100">
      {combo.split('+').map((key, i, arr) => (
        <React.Fragment key={i}>
          <span className="rounded-lg border border-white/15 bg-white/5 px-2 py-0.5 text-xs shadow-[0_6px_18px_rgba(15,23,42,0.45)]">
            {key}
          </span>
          {i < arr.length - 1 && <span className="text-slate-400/80">+</span>}
        </React.Fragment>
      ))}
    </span>
  );

  const renderSortIndicator = (column: keyof Shortcut) => {
    if (sortConfig.column !== column) return null;

    return sortConfig.direction === 'asc'
      ? <ArrowUp className="ml-1 inline h-4 w-4" />
      : <ArrowDown className="ml-1 inline h-4 w-4" />;
  };

  const actionButtonClass = 'flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60';

  return (
    <div
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_65px_rgba(8,47,73,0.45)]"
      onKeyDown={handleTableKeyDown}
      role="grid"
      aria-rowcount={sortedShortcuts.length + 1}
      aria-colcount={4}
    >
      <Table ref={tableRef} className="text-slate-200">
        <TableHeader className="bg-white/5">
          <TableRow role="row" aria-rowindex={1} className="border-white/10">
            <TableHead
              onClick={() => handleSort('key_combination')}
              className="cursor-pointer border-white/5 text-xs uppercase tracking-wider text-slate-300/80"
              style={{ width: '30%' }}
              role="columnheader"
              aria-sort={sortConfig.column === 'key_combination'
                ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending')
                : undefined}
              aria-colindex={1}
            >
              Key Combination {renderSortIndicator('key_combination')}
            </TableHead>

            <TableHead
              onClick={() => handleSort('application')}
              className="cursor-pointer border-white/5 text-xs uppercase tracking-wider text-slate-300/80"
              style={{ width: '20%' }}
              role="columnheader"
              aria-sort={sortConfig.column === 'application'
                ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending')
                : undefined}
              aria-colindex={2}
            >
              Application {renderSortIndicator('application')}
            </TableHead>

            <TableHead
              onClick={() => handleSort('description')}
              className="cursor-pointer border-white/5 text-xs uppercase tracking-wider text-slate-300/80"
              style={{ width: '40%' }}
              role="columnheader"
              aria-sort={sortConfig.column === 'description'
                ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending')
                : undefined}
              aria-colindex={3}
            >
              Description {renderSortIndicator('description')}
            </TableHead>

            <TableHead
              className="border-white/5 text-xs uppercase tracking-wider text-slate-300/80"
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
            <TableRow className="border-white/10 bg-white/5">
              <TableCell colSpan={4} className="h-24 text-center text-slate-300/80">
                No shortcuts found.
              </TableCell>
            </TableRow>
          ) : (
            sortedShortcuts.map((shortcut, index) => (
              <TableRow
                key={shortcut.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className={cn(
                  index % 2 === 0 ? 'bg-white/[0.04]' : 'bg-white/[0.02]',
                  'border-white/10 transition-colors hover:bg-white/10',
                  focusedRowIndex === index && 'ring-2 ring-sky-300/60 ring-inset'
                )}
                data-shortcut-id={shortcut.id}
                tabIndex={focusedRowIndex === index ? 0 : -1}
                role="row"
                aria-rowindex={index + 2}
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
                <TableCell role="gridcell" aria-colindex={1} className="border-white/10">
                  {formatKeyCombination(shortcut.key_combination)}
                </TableCell>

                <TableCell role="gridcell" aria-colindex={2} className="border-white/10">
                  <span
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white"
                    style={{
                      background: `linear-gradient(135deg, ${appColors[shortcut.application]}aa 0%, ${appColors[shortcut.application]} 100%)`,
                    }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: appColors[shortcut.application] }} />
                    {shortcut.application}
                  </span>
                </TableCell>

                <TableCell role="gridcell" aria-colindex={3} className="border-white/10 text-sm text-slate-200">
                  {shortcut.description}
                </TableCell>

                <TableCell role="gridcell" aria-colindex={4} className="border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditShortcut(shortcut)}
                      aria-label={`Edit shortcut ${shortcut.key_combination}`}
                      className={actionButtonClass}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteShortcut(shortcut)}
                      aria-label={`Delete shortcut ${shortcut.key_combination}`}
                      className={cn(actionButtonClass, 'hover:bg-rose-500/20 hover:text-rose-200')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="border-t border-white/10 bg-white/5 px-5 py-3 text-xs text-slate-300/80">
        <span className="mr-4 inline-flex items-center gap-1">
          <kbd className="rounded-md border border-white/20 bg-white/5 px-1.5 py-0.5">↑</kbd>
          <kbd className="rounded-md border border-white/20 bg-white/5 px-1.5 py-0.5">↓</kbd>
          Navigate rows
        </span>
        <span className="mr-4 inline-flex items-center gap-1">
          <kbd className="rounded-md border border-white/20 bg-white/5 px-1.5 py-0.5">Enter</kbd>
          Edit shortcut
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded-md border border-white/20 bg-white/5 px-1.5 py-0.5">Delete</kbd>
          Remove shortcut
        </span>
      </div>
    </div>
  );
}
