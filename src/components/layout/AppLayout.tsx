import { ReactNode, useMemo, useState } from 'react';
import { Keyboard, Layers3, ShieldAlert, Sparkles } from 'lucide-react';
import { TabNavigation } from '@/components/navigation/TabNavigation';
import { useShortcuts } from '@/hooks/useShortcuts';
import { detectConflicts, ConflictType } from '@/utils/conflictUtils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ShortcutModal } from '@/components/shortcuts/ShortcutModal';

interface AppLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  const { shortcuts } = useShortcuts();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const summary = useMemo(() => {
    if (!shortcuts.length) {
      return {
        totalShortcuts: 0,
        uniqueApps: 0,
        keysMapped: 0,
        conflictCount: 0,
        topApplication: '—',
      };
    }

    const uniqueApps = new Map<string, number>();
    const keys = new Set<string>();
    const conflictingShortcutIds = new Set<string>();

    shortcuts.forEach((shortcut) => {
      keys.add(shortcut.baseKey || shortcut.key_combination);
      const appKey = shortcut.application.trim() || 'Unknown';
      uniqueApps.set(appKey, (uniqueApps.get(appKey) || 0) + 1);

      const conflict = detectConflicts(shortcut, shortcuts, shortcut.id);
      if (conflict.type !== ConflictType.NONE) {
        conflictingShortcutIds.add(shortcut.id);
      }
    });

    const [topApplication = '—'] = Array.from(uniqueApps.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    return {
      totalShortcuts: shortcuts.length,
      uniqueApps: uniqueApps.size,
      keysMapped: keys.size,
      conflictCount: conflictingShortcutIds.size,
      topApplication,
    };
  }, [shortcuts]);

  const handleOpenComposer = () => setIsComposerOpen(true);
  const handleCloseComposer = () => setIsComposerOpen(false);

  const metricChips = [
    {
      icon: Keyboard,
      label: 'Shortcuts tracked',
      value: summary.totalShortcuts,
      description: `${summary.keysMapped} keys mapped`,
      accent: 'from-sky-500/30 to-cyan-400/20',
    },
    {
      icon: Layers3,
      label: 'Apps organized',
      value: summary.uniqueApps,
      description: summary.uniqueApps > 0
        ? `Top: ${summary.topApplication}`
        : 'Add your first app',
      accent: 'from-violet-500/30 to-fuchsia-400/20',
    },
    {
      icon: ShieldAlert,
      label: 'Conflict alerts',
      value: summary.conflictCount,
      description: summary.conflictCount === 0
        ? 'All clear'
        : 'Review needed',
      accent: 'from-amber-500/30 to-orange-400/20',
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col text-slate-100">
      <header className="relative overflow-hidden pb-12 pt-12 sm:pt-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.12),_transparent_60%)]" />
          <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
          <div className="absolute -right-24 top-6 h-80 w-80 rounded-full bg-violet-500/25 blur-[120px]" />
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-100/80 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Keymapper Studio
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Design a shortcut universe that feels cinematic and precise.
                </h1>
                <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                  Glide between an immersive keyboard stage and a structured library. Live stats keep you ahead of conflicts while a global composer is ready whenever inspiration strikes.
                </p>
              </div>
            </div>

            <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
              {metricChips.map(({ icon: Icon, label, value, description, accent }) => (
                <div
                  key={label}
                  className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/40 p-4 backdrop-blur"
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent}`} />
                  <div className="relative flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300/80">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                    <div className="text-2xl font-semibold text-white">{value}</div>
                    <p className="text-xs text-slate-300/80">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto w-full max-w-3xl">
              <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
        {children}
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} KeyMapper. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-500">Crafted for keyboard storytellers.</span>
          </div>
        </div>
      </footer>

      <button
        onClick={handleOpenComposer}
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 items-center gap-3 rounded-full border border-sky-400/30 bg-sky-500/90 px-6 text-base font-semibold text-white shadow-[0_20px_45px_rgba(14,165,233,0.4)] transition-transform hover:scale-105 hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
        aria-label="Create a new shortcut"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
          <span className="relative text-2xl leading-none">＋</span>
        </span>
        New shortcut
      </button>

      <ShortcutModal
        isOpen={isComposerOpen}
        onClose={handleCloseComposer}
        onSuccess={handleCloseComposer}
        isMobile={isMobile}
      />
    </div>
  );
}