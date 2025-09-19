import React from 'react';
import { useShortcuts, useUniqueApplications } from '@/hooks/useShortcuts';
import { generateAppColor } from '@/utils/colorUtils';
import { Layers, AlertCircle } from 'lucide-react';

export const KeyboardLegend: React.FC = () => {
  const { shortcuts } = useShortcuts();
  const uniqueApps = useUniqueApplications(shortcuts);

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-sm text-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.4)]">
      <h3 className="text-base font-semibold text-white">Legend & cues</h3>
      <p className="mt-1 text-xs text-slate-300/80">Color and overlays help you read the keyboard at a glance.</p>

      {uniqueApps.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Application palette</h4>
          <div className="flex flex-wrap gap-2">
            {uniqueApps.map((app) => (
              <span
                key={app}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white"
                style={{ boxShadow: `0 0 0 1px ${generateAppColor(app)}` }}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: generateAppColor(app) }} />
                {app}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 text-xs text-slate-200/90 md:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80">
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-400 text-[10px] font-bold text-white">
              2
            </span>
          </div>
          <span>Multiple shortcuts on a single key</span>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80">
            <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white">
              <AlertCircle className="h-3 w-3" />
            </span>
          </div>
          <span>Conflicting shortcuts detected</span>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-slate-200">
            <Layers className="h-4 w-4" />
          </div>
          <span>Keys serving multiple applications</span>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-inner"
            style={{
              background: `linear-gradient(135deg, ${generateAppColor('VS Code')} 0%, ${generateAppColor('VS Code')} 49%, ${generateAppColor('Chrome')} 51%, ${generateAppColor('Chrome')} 100%)`,
            }}
          >
            A
          </div>
          <span>Split gradients highlight blended ownership</span>
        </div>
      </div>

      {uniqueApps.length === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-center text-sm text-slate-300/80">
          <p>No shortcuts yet—start building your collection to activate the legend.</p>
        </div>
      )}

      <div className="mt-6 space-y-1 border-t border-white/10 pt-4 text-xs text-slate-300/80">
        <p>• Click any key to open its shortcut story drawer.</p>
        <p>• Hover for quick stats, or use the palette above to filter and zoom.</p>
        <p>• Heat map mode reveals the most popular keys instantly.</p>
      </div>
    </div>
  );
};