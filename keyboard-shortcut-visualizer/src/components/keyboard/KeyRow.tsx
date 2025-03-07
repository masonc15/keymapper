import { KeyRow as KeyRowType } from '@/types/keyboard';
import { Key } from './Key';

interface KeyRowProps {
  row: KeyRowType;
  activeKeys?: string[];
  onKeyClick?: (keyId: string) => void;
  onShortcutsChanged?: () => void;
}

export const KeyRow = ({ 
  row, 
  activeKeys = [], 
  onKeyClick,
  onShortcutsChanged,
}: KeyRowProps) => {
  return (
    <div className="flex flex-row items-center justify-center gap-1 mb-1">
      {row.keys.map((keyData) => (
        <Key
          key={keyData.id}
          keyData={keyData}
          isActive={activeKeys.includes(keyData.id)}
          onClick={onKeyClick}
          onShortcutsChanged={onShortcutsChanged}
        />
      ))}
    </div>
  );
};