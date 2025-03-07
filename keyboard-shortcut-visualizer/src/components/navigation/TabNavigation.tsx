import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <Tabs 
      defaultValue={activeTab} 
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full md:w-[400px] grid-cols-2">
        <TabsTrigger value="keyboard">Keyboard View</TabsTrigger>
        <TabsTrigger value="table">Table View</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}