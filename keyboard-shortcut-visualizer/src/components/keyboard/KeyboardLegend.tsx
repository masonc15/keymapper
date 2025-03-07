import React from 'react';
import { useShortcuts, useUniqueApplications } from '@/hooks/useShortcuts';
import { generateAppColor } from '@/utils/colorUtils';
import { Layers, AlertCircle } from 'lucide-react';

export const KeyboardLegend: React.FC = () => {
  const { shortcuts } = useShortcuts();
  const uniqueApps = useUniqueApplications(shortcuts);

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
      <h3 className="text-sm font-medium mb-2 text-gray-700">Keyboard Legend</h3>
      
      {/* Application Colors */}
      {uniqueApps.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-600 mb-1.5">Applications:</h4>
          <div className="flex flex-wrap gap-2">
            {uniqueApps.map(app => (
              <div key={app} className="flex items-center">
                <span 
                  className="text-xs px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: generateAppColor(app) }}
                >
                  {app}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Indicator Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 flex items-center justify-center bg-gray-100 rounded border border-gray-200">
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </div>
          <span className="text-xs text-gray-600">Multiple shortcuts on this key</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 flex items-center justify-center bg-gray-100 rounded border border-gray-200">
            <span className="absolute -top-1 -left-1 bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
              <AlertCircle className="h-3 w-3" />
            </span>
          </div>
          <span className="text-xs text-gray-600">Conflicting shortcuts detected</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 flex items-center justify-center bg-gray-100 rounded border border-gray-200">
            <span className="absolute bottom-1 right-1 text-gray-600">
              <Layers className="h-3 w-3" />
            </span>
          </div>
          <span className="text-xs text-gray-600">Shortcuts from multiple applications</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 flex items-center justify-center shadow-lg rounded"
            style={{ 
              background: `linear-gradient(135deg, ${generateAppColor('VSCode')} 0%, ${generateAppColor('VSCode')} 49%, ${generateAppColor('Chrome')} 51%, ${generateAppColor('Chrome')} 100%)`,
              color: 'white'
            }}
          >
            A
          </div>
          <span className="text-xs text-gray-600">Split colors show multiple applications</span>
        </div>
      </div>
      
      {/* Empty State */}
      {uniqueApps.length === 0 && (
        <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-500">
          <p>No shortcuts available. Add shortcuts to see them visualized on the keyboard.</p>
        </div>
      )}
      
      {/* Interaction Tips */}
      <div className="mt-3 p-2 border-t border-gray-100 text-xs text-gray-500 space-y-1">
        <p>• Click on any key to view and manage its shortcuts</p>
        <p>• Hover over keys to see details about assigned shortcuts</p>
        <p>• Use the controls above to zoom, filter, and change view modes</p>
      </div>
    </div>
  );
};