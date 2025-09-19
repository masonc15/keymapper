import { Keyboard, Rows3 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const tabs = [
  {
    value: 'keyboard',
    label: 'Keyboard Studio',
    description: 'Immersive visual canvas',
    icon: Keyboard,
  },
  {
    value: 'table',
    label: 'Shortcut Library',
    description: 'Audit & batch edit shortcuts',
    icon: Rows3,
  },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-full bg-white/10 p-2 text-left backdrop-blur sm:grid-cols-2 sm:gap-1">
        {tabs.map(({ value, label, description, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className={cn(
              'group relative flex h-full flex-col items-start gap-2 rounded-full px-5 py-4 text-left transition-all',
              'data-[state=active]:bg-slate-900/80 data-[state=active]:shadow-[0_18px_45px_rgba(56,189,248,0.22)] data-[state=active]:text-white',
              'hover:bg-white/5 hover:text-white'
            )}
          >
            <div className="flex items-center gap-3 text-sm font-semibold">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-200 transition-colors group-data-[state=active]:border-sky-300/50 group-data-[state=active]:bg-sky-400/90 group-data-[state=active]:text-white">
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </div>
            <p className="text-xs text-slate-300/80 group-data-[state=active]:text-slate-200">
              {description}
            </p>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}