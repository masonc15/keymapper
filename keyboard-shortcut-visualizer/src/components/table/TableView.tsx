import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useShortcuts } from '@/hooks/useShortcuts';

export function TableView() {
  const { shortcuts, loading } = useShortcuts();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table View</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p>Loading shortcuts...</p>
          </div>
        ) : shortcuts.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No Shortcuts Found</h3>
            <p className="text-gray-500">Add your first shortcut to get started.</p>
          </div>
        ) : (
          <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Table View Coming Soon</h3>
            <p className="text-gray-500">The interactive shortcut table will be implemented here.</p>
            <p className="mt-4 text-sm text-gray-400">{shortcuts.length} shortcuts loaded.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}