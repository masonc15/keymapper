import React from 'react';
import { Search, PlusCircle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApplications } from '@/hooks/useApplications';
import { TableFilters } from '@/utils/tableUtils';

interface TableHeaderProps {
  filters: TableFilters;
  onFilterChange: (filters: TableFilters) => void;
  onAddShortcut: () => void;
  totalShortcuts: number;
  filteredCount: number;
  isMobile?: boolean;
}

export function TableHeader({
  filters,
  onFilterChange,
  onAddShortcut,
  totalShortcuts,
  filteredCount,
}: TableHeaderProps) {
  const applications = useApplications();

  // Update search filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value,
    });
  };

  // Update application filter
  const handleApplicationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      application: e.target.value,
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      application: '',
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.search || filters.application;

  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search shortcuts..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-9 w-full"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Application filter */}
          <select
            value={filters.application}
            onChange={handleApplicationChange}
            className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm sm:w-auto w-full"
            aria-label="Filter by application"
          >
            <option value="">All Applications</option>
            {applications.map((app) => (
              <option key={app.name} value={app.name}>
                {app.name}
              </option>
            ))}
          </select>

          {/* Clear filters button - only shown when filters are active */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Add shortcut button */}
        <Button onClick={onAddShortcut} className="whitespace-nowrap">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Shortcut
        </Button>
      </div>

      {/* Filter status */}
      <div className="text-sm text-muted-foreground">
        {hasActiveFilters ? (
          <p>
            Showing {filteredCount} of {totalShortcuts} shortcuts
            {filters.application && ` for ${filters.application}`}
            {filters.search && ` matching "${filters.search}"`}
          </p>
        ) : (
          <p>{totalShortcuts} shortcuts total</p>
        )}
      </div>
    </div>
  );
}