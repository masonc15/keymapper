import React from 'react';
import { Search, PlusCircle, X, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useApplications } from '@/hooks/useApplications';
import { TableFilters } from '@/utils/tableUtils';
import { cn } from '@/lib/utils';

interface TableHeaderProps {
  filters: TableFilters;
  onFilterChange: (filters: TableFilters) => void;
  onAddShortcut: () => void;
  totalShortcuts: number;
  filteredCount: number;
}

export function TableHeader({
  filters,
  onFilterChange,
  onAddShortcut,
  totalShortcuts,
  filteredCount,
}: TableHeaderProps) {
  const applications = useApplications();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleApplicationToggle = (appName: string) => {
    onFilterChange({
      ...filters,
      application: filters.application === appName ? '' : appName,
    });
  };

  const hasActiveFilters = Boolean(filters.search || filters.application);

  const filterCopy = hasActiveFilters
    ? `Showing ${filteredCount} of ${totalShortcuts} shortcuts` +
      (filters.application ? ` for ${filters.application}` : '') +
      (filters.search ? ` matching “${filters.search}”` : '')
    : `${totalShortcuts} shortcuts available`;

  const pillClass = (active: boolean) =>
    cn(
      'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
      active
        ? 'border-sky-400/60 bg-gradient-to-r from-sky-500/60 to-indigo-500/60 text-white shadow-[0_12px_35px_rgba(79,70,229,0.35)]'
        : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search the shortcut library"
              value={filters.search}
              onChange={handleSearchChange}
              className="h-12 rounded-full border-white/20 bg-white/5 pl-11 pr-12 text-sm text-slate-100 placeholder:text-slate-400/70"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-300/80">
            <Sparkles className="h-4 w-4" />
            {filterCopy}
          </div>
        </div>

        <button
          onClick={onAddShortcut}
          className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(56,189,248,0.35)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
        >
          <PlusCircle className="h-4 w-4" />
          New shortcut
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-slate-300/80">Filter by app:</span>
        <button
          onClick={() => onFilterChange({ ...filters, application: '' })}
          className={pillClass(!filters.application)}
        >
          All
        </button>
        {applications.map((app) => (
          <button
            key={app.name}
            onClick={() => handleApplicationToggle(app.name)}
            className={pillClass(filters.application === app.name)}
            style={
              filters.application === app.name
                ? { boxShadow: `0 0 0 1px ${app.color}` }
                : undefined
            }
            aria-pressed={filters.application === app.name}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: app.color }} />
            {app.name}
          </button>
        ))}
        {hasActiveFilters && (
          <button
            onClick={() => onFilterChange({ search: '', application: '' })}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition-colors hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}