export type KeySize = 'default' | 'wide' | 'extraWide' | 'small' | 'medium' | 'large' | 'spacebar';
export type KeyType = 'regular' | 'function' | 'modifier' | 'navigation' | 'special';

export interface Key {
  id: string;
  label: string;
  size: KeySize;
  type: KeyType;
  width?: number; // Optional width multiplier for flexible sizing
  height?: number; // Optional height multiplier for flexible sizing
  keys?: Key[]; // For composite keys like arrow up/down
}

export interface KeyRow {
  id: string;
  keys: Key[];
}

export interface KeyboardLayout {
  id: string;
  name: string;
  rows: KeyRow[];
}