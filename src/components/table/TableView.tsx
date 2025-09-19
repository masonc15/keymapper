import { useState, useEffect, useMemo } from 'react';
import { Rows3, Table2 } from 'lucide-react';
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
import { useApplicationColors } from '@/hooks/useApplications';
import { cn } from '@/lib/utils';

export function TableView() {
  const { shortcuts, loading, deleteShortcut } = useShortcuts();
  const appColors = useApplicationColors();

  const isMobile = useMediaQuery('(max-width: 639px)');

  const [filters, setFilters] = useState<TableFilters>(() => {
    const saved = loadTableState();
    return saved?.filters || getDefaultTableState().filters;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShortcut, setSelectedShortcut] = useState<Shortcut | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [shortcutToDelete, setShortcutToDelete] = useState<Shortcut | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(isMobile ? 'cards' : 'cards');

  useEffect(() => {
    if (isMobile) {
      setViewMode('cards');
    }
  }, [isMobile]);

  const filteredShortcuts = useMemo(() => filterShortcuts(shortcuts, filters), [shortcuts, filters]);

  useEffect(() => {
    const currentState = loadTableState() || getDefaultTableState();
    saveTableState({
      ...currentState,
      filters
    });
  }, [filters]);

  const handleOpenModal = (shortcut?: Shortcut) => {
    setSelectedShortcut(shortcut ?? null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShortcut(null);
  };

  const handleFilterChange = (newFilters: TableFilters) => {
    setFilters(newFilters);
  };

  const handleDeleteConfirmation = (shortcut: Shortcut) => {
    setShortcutToDelete(shortcut);
    setIsDeleteDialogOpen(true);
  };

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

  const renderCardView = () => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {filteredShortcuts.map((shortcut) => {
        const color = appColors[shortcut.application] || '#38bdf8';
        return (
          <article
            key={shortcut.id}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_55px_rgba(8,47,73,0.35)] transition-transform hover:-translate-y-1"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background: `radial-gradient(circle at top, ${color}33 0%, transparent 65%)`,
              }}
            />
            <div className="relative flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-slate-100">{shortcut.key_combination}</span>
                <button
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-200 transition-colors hover:bg-white/20"
                  onClick={() => handleOpenModal(shortcut)}
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-slate-300/90">{shortcut.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-200/80">
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1"
                  style={{
                    background: `linear-gradient(120deg, ${color}66 0%, ${color} 100%)`,
                    color: 'white'
                  }}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  {shortcut.application}
                </span>
                <button
                  onClick={() => handleDeleteConfirmation(shortcut)}
                  className="text-rose-200/80 transition-colors hover:text-rose-200"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        );
      })}
      {filteredShortcuts.length === 0 && (
        <div className="col-span-full rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-slate-300/80">
          No shortcuts match your filters yet.
        </div>
      )}
    </div>
  );

  const viewToggleClass = (mode: 'cards' | 'table') =>
    cn(
      'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
      viewMode === mode
        ? 'border-sky-400/60 bg-sky-500/30 text-white shadow-[0_15px_35px_rgba(56,189,248,0.35)]'
        : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
    );

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 px-6 py-10 shadow-[0_30px_80px_rgba(79,70,229,0.25)] sm:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
              Shortcut Library
            </span>
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold text-white md:text-4xl">Curate, audit, and celebrate your shortcuts.</h2>
              <p className="max-w-2xl text-sm text-slate-300/80">
                Browse stories for every key, or switch to the data grid when you need laser precision. Filters, search, and conflict checks keep your workflow smooth.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 p-2">
            <button
              onClick={() => setViewMode('cards')}
              className={viewToggleClass('cards')}
            >
              <Rows3 className="h-4 w-4" />
              Card view
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={viewToggleClass('table')}
              disabled={isMobile}
            >
              <Table2 className="h-4 w-4" />
              Data grid
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(8,47,73,0.35)]">
          <TableHeader
            filters={filters}
            onFilterChange={handleFilterChange}
            onAddShortcut={() => handleOpenModal()}
            totalShortcuts={shortcuts.length}
            filteredCount={filteredShortcuts.length}
          />
        </aside>

        <div className="space-y-6">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-slate-300/80">Loading shortcuts…</div>
          ) : shortcuts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-16 text-center text-slate-300/80">
              Add your first shortcut to start the story.
            </div>
          ) : viewMode === 'cards' ? (
            renderCardView()
          ) : (
            <div className="overflow-x-auto">
              <ShortcutTable
                shortcuts={filteredShortcuts}
                onEditShortcut={(shortcut) => handleOpenModal(shortcut)}
                onDeleteShortcut={handleDeleteConfirmation}
              />
            </div>
          )}

          {filteredShortcuts.length > 0 && !loading && (
            <div className="text-right text-xs uppercase tracking-wider text-slate-300/80">
              {filteredShortcuts.length === 1 ? '1 shortcut' : `${filteredShortcuts.length} shortcuts`}
            </div>
          )}
        </div>
      </section>

      <ShortcutModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        shortcut={selectedShortcut || undefined}
        onSuccess={() => {}}
        isMobile={isMobile}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        shortcut={shortcutToDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        isMobile={isMobile}
      />
    </div>
  );
}
