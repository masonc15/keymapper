import React from 'react';
import { useShortcuts, useUniqueApplications } from '@/hooks/useShortcuts';
import { getAppBadgeClass } from '@/utils/colorUtils';

export const KeyboardLegend: React.FC = () => {
  const { shortcuts } = useShortcuts();
  const uniqueApps = useUniqueApplications(shortcuts);

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
      <h3 className="text-sm font-medium mb-2 text-gray-700">Legend</h3>
      
      <div className="flex flex-wrap gap-2">
        {uniqueApps.map(app => (
          <div key={app} className="flex items-center">
            <span className={`${getAppBadgeClass(app)} text-xs px-2 py-1 rounded-md`}>
              {app}
            </span>
          </div>
        ))}

        {uniqueApps.length === 0 && (
          <p className="text-sm text-gray-500">No shortcuts available. Add shortcuts to see them visualized on the keyboard.</p>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <p>• Keys with multiple shortcuts are shown with a split color</p>
        <p>• Hover over keys to see all assigned shortcuts</p>
      </div>
    </div>
  );
};