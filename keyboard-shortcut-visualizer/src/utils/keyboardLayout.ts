import { Key, KeyboardLayout, KeyRow } from '../types/keyboard';

// ==============================================
// Standard Desktop/Tablet Layout (Full Keyboard)
// ==============================================

// Function keys row
const functionRow: KeyRow = {
  id: 'function-row',
  keys: [
    { id: 'escape', label: 'esc', size: 'default', type: 'special' },
    { id: 'f1', label: 'F1', size: 'default', type: 'function' },
    { id: 'f2', label: 'F2', size: 'default', type: 'function' },
    { id: 'f3', label: 'F3', size: 'default', type: 'function' },
    { id: 'f4', label: 'F4', size: 'default', type: 'function' },
    { id: 'f5', label: 'F5', size: 'default', type: 'function' },
    { id: 'f6', label: 'F6', size: 'default', type: 'function' },
    { id: 'f7', label: 'F7', size: 'default', type: 'function' },
    { id: 'f8', label: 'F8', size: 'default', type: 'function' },
    { id: 'f9', label: 'F9', size: 'default', type: 'function' },
    { id: 'f10', label: 'F10', size: 'default', type: 'function' },
    { id: 'f11', label: 'F11', size: 'default', type: 'function' },
    { id: 'f12', label: 'F12', size: 'default', type: 'function' },
    { id: 'power', label: '⏻', size: 'default', type: 'special' },
  ],
};

// Number row
const numberRow: KeyRow = {
  id: 'number-row',
  keys: [
    { id: 'backtick', label: '`', size: 'default', type: 'regular' },
    { id: '1', label: '1', size: 'default', type: 'regular' },
    { id: '2', label: '2', size: 'default', type: 'regular' },
    { id: '3', label: '3', size: 'default', type: 'regular' },
    { id: '4', label: '4', size: 'default', type: 'regular' },
    { id: '5', label: '5', size: 'default', type: 'regular' },
    { id: '6', label: '6', size: 'default', type: 'regular' },
    { id: '7', label: '7', size: 'default', type: 'regular' },
    { id: '8', label: '8', size: 'default', type: 'regular' },
    { id: '9', label: '9', size: 'default', type: 'regular' },
    { id: '0', label: '0', size: 'default', type: 'regular' },
    { id: 'minus', label: '-', size: 'default', type: 'regular' },
    { id: 'equals', label: '=', size: 'default', type: 'regular' },
    { id: 'backspace', label: '⌫', size: 'wide', type: 'special', width: 1.5 },
  ],
};

// QWERTY row
const qwertyRow: KeyRow = {
  id: 'qwerty-row',
  keys: [
    { id: 'tab', label: 'tab', size: 'wide', type: 'special', width: 1.5 },
    { id: 'q', label: 'Q', size: 'default', type: 'regular' },
    { id: 'w', label: 'W', size: 'default', type: 'regular' },
    { id: 'e', label: 'E', size: 'default', type: 'regular' },
    { id: 'r', label: 'R', size: 'default', type: 'regular' },
    { id: 't', label: 'T', size: 'default', type: 'regular' },
    { id: 'y', label: 'Y', size: 'default', type: 'regular' },
    { id: 'u', label: 'U', size: 'default', type: 'regular' },
    { id: 'i', label: 'I', size: 'default', type: 'regular' },
    { id: 'o', label: 'O', size: 'default', type: 'regular' },
    { id: 'p', label: 'P', size: 'default', type: 'regular' },
    { id: 'bracketLeft', label: '[', size: 'default', type: 'regular' },
    { id: 'bracketRight', label: ']', size: 'default', type: 'regular' },
    { id: 'backslash', label: '\\', size: 'default', type: 'regular', width: 1.5 },
  ],
};

// ASDF row
const asdfRow: KeyRow = {
  id: 'asdf-row',
  keys: [
    { id: 'capslock', label: 'caps lock', size: 'wide', type: 'special', width: 1.75 },
    { id: 'a', label: 'A', size: 'default', type: 'regular' },
    { id: 's', label: 'S', size: 'default', type: 'regular' },
    { id: 'd', label: 'D', size: 'default', type: 'regular' },
    { id: 'f', label: 'F', size: 'default', type: 'regular' },
    { id: 'g', label: 'G', size: 'default', type: 'regular' },
    { id: 'h', label: 'H', size: 'default', type: 'regular' },
    { id: 'j', label: 'J', size: 'default', type: 'regular' },
    { id: 'k', label: 'K', size: 'default', type: 'regular' },
    { id: 'l', label: 'L', size: 'default', type: 'regular' },
    { id: 'semicolon', label: ';', size: 'default', type: 'regular' },
    { id: 'quote', label: "'", size: 'default', type: 'regular' },
    { id: 'enter', label: 'return', size: 'wide', type: 'special', width: 2.25 },
  ],
};

// ZXCV row
const zxcvRow: KeyRow = {
  id: 'zxcv-row',
  keys: [
    { id: 'shift-left', label: 'shift', size: 'extraWide', type: 'modifier', width: 2.25 },
    { id: 'z', label: 'Z', size: 'default', type: 'regular' },
    { id: 'x', label: 'X', size: 'default', type: 'regular' },
    { id: 'c', label: 'C', size: 'default', type: 'regular' },
    { id: 'v', label: 'V', size: 'default', type: 'regular' },
    { id: 'b', label: 'B', size: 'default', type: 'regular' },
    { id: 'n', label: 'N', size: 'default', type: 'regular' },
    { id: 'm', label: 'M', size: 'default', type: 'regular' },
    { id: 'comma', label: ',', size: 'default', type: 'regular' },
    { id: 'period', label: '.', size: 'default', type: 'regular' },
    { id: 'slash', label: '/', size: 'default', type: 'regular' },
    { id: 'shift-right', label: 'shift', size: 'extraWide', type: 'modifier', width: 2.75 },
  ],
};

// Bottom row
const bottomRow: KeyRow = {
  id: 'bottom-row',
  keys: [
    { id: 'fn', label: 'fn', size: 'medium', type: 'modifier', width: 1.25 },
    { id: 'control-left', label: 'control', size: 'medium', type: 'modifier', width: 1.25 },
    { id: 'option-left', label: 'option', size: 'medium', type: 'modifier', width: 1.25 },
    { id: 'command-left', label: 'command', size: 'medium', type: 'modifier', width: 1.25 },
    { id: 'space', label: '', size: 'spacebar', type: 'regular', width: 5 },
    { id: 'command-right', label: 'command', size: 'medium', type: 'modifier', width: 1.25 },
    { id: 'option-right', label: 'option', size: 'medium', type: 'modifier', width: 1.25 },
    { id: 'left', label: '←', size: 'default', type: 'navigation' },
    { id: 'up-down', keys: [
      { id: 'up', label: '↑', size: 'small', type: 'navigation', height: 0.5 },
      { id: 'down', label: '↓', size: 'small', type: 'navigation', height: 0.5 }
    ], size: 'default', type: 'navigation' },
    { id: 'right', label: '→', size: 'default', type: 'navigation' },
  ],
};

// Define the MacBook Air keyboard layout
export const macbookAirKeyboardLayout: KeyboardLayout = {
  id: 'macbook-air',
  name: 'MacBook Air',
  rows: [
    functionRow,
    numberRow,
    qwertyRow,
    asdfRow,
    zxcvRow,
    bottomRow,
  ],
};

// ==============================================
// Tablet Layout (Compact Version)
// ==============================================

// Create a more compact version for tablets
const tabletFunctionRow: KeyRow = {
  id: 'tablet-function-row',
  keys: [
    { id: 'escape', label: 'esc', size: 'default', type: 'special' },
    { id: 'f1', label: 'F1', size: 'default', type: 'function' },
    { id: 'f2', label: 'F2', size: 'default', type: 'function' },
    { id: 'f3', label: 'F3', size: 'default', type: 'function' },
    { id: 'f4', label: 'F4', size: 'default', type: 'function' },
    { id: 'f5', label: 'F5', size: 'default', type: 'function' },
    { id: 'f10', label: 'F10', size: 'default', type: 'function' },
    { id: 'power', label: '⏻', size: 'default', type: 'special' },
  ],
};

const tabletQwertyRow: KeyRow = {
  id: 'tablet-qwerty-row',
  keys: [
    { id: 'tab', label: 'tab', size: 'wide', type: 'special', width: 1.25 },
    { id: 'q', label: 'Q', size: 'default', type: 'regular' },
    { id: 'w', label: 'W', size: 'default', type: 'regular' },
    { id: 'e', label: 'E', size: 'default', type: 'regular' },
    { id: 'r', label: 'R', size: 'default', type: 'regular' },
    { id: 't', label: 'T', size: 'default', type: 'regular' },
    { id: 'y', label: 'Y', size: 'default', type: 'regular' },
    { id: 'u', label: 'U', size: 'default', type: 'regular' },
    { id: 'i', label: 'I', size: 'default', type: 'regular' },
    { id: 'o', label: 'O', size: 'default', type: 'regular' },
    { id: 'p', label: 'P', size: 'default', type: 'regular' },
    { id: 'backspace', label: '⌫', size: 'wide', type: 'special', width: 1.25 },
  ],
};

const tabletAsdfRow: KeyRow = {
  id: 'tablet-asdf-row',
  keys: [
    { id: 'capslock', label: 'caps', size: 'wide', type: 'special', width: 1.25 },
    { id: 'a', label: 'A', size: 'default', type: 'regular' },
    { id: 's', label: 'S', size: 'default', type: 'regular' },
    { id: 'd', label: 'D', size: 'default', type: 'regular' },
    { id: 'f', label: 'F', size: 'default', type: 'regular' },
    { id: 'g', label: 'G', size: 'default', type: 'regular' },
    { id: 'h', label: 'H', size: 'default', type: 'regular' },
    { id: 'j', label: 'J', size: 'default', type: 'regular' },
    { id: 'k', label: 'K', size: 'default', type: 'regular' },
    { id: 'l', label: 'L', size: 'default', type: 'regular' },
    { id: 'enter', label: 'return', size: 'wide', type: 'special', width: 1.75 },
  ],
};

const tabletZxcvRow: KeyRow = {
  id: 'tablet-zxcv-row',
  keys: [
    { id: 'shift-left', label: 'shift', size: 'wide', type: 'modifier', width: 1.75 },
    { id: 'z', label: 'Z', size: 'default', type: 'regular' },
    { id: 'x', label: 'X', size: 'default', type: 'regular' },
    { id: 'c', label: 'C', size: 'default', type: 'regular' },
    { id: 'v', label: 'V', size: 'default', type: 'regular' },
    { id: 'b', label: 'B', size: 'default', type: 'regular' },
    { id: 'n', label: 'N', size: 'default', type: 'regular' },
    { id: 'm', label: 'M', size: 'default', type: 'regular' },
    { id: 'comma', label: ',', size: 'default', type: 'regular' },
    { id: 'shift-right', label: 'shift', size: 'wide', type: 'modifier', width: 1.75 },
  ],
};

const tabletBottomRow: KeyRow = {
  id: 'tablet-bottom-row',
  keys: [
    { id: 'fn', label: 'fn', size: 'medium', type: 'modifier' },
    { id: 'control-left', label: 'ctrl', size: 'medium', type: 'modifier' },
    { id: 'option-left', label: '⌥', size: 'medium', type: 'modifier' },
    { id: 'command-left', label: '⌘', size: 'medium', type: 'modifier' },
    { id: 'space', label: '', size: 'spacebar', type: 'regular', width: 3 },
    { id: 'command-right', label: '⌘', size: 'medium', type: 'modifier' },
    { id: 'option-right', label: '⌥', size: 'medium', type: 'modifier' },
  ],
};

const tabletArrowsRow: KeyRow = {
  id: 'tablet-arrows-row',
  keys: [
    { id: 'left', label: '←', size: 'default', type: 'navigation' },
    { id: 'up', label: '↑', size: 'default', type: 'navigation' },
    { id: 'down', label: '↓', size: 'default', type: 'navigation' },
    { id: 'right', label: '→', size: 'default', type: 'navigation' },
  ],
};

// Define the tablet layout for medium-sized screens
export const tabletKeyboardLayout: KeyboardLayout = {
  id: 'tablet-layout',
  name: 'Tablet Keyboard',
  rows: [
    tabletFunctionRow,
    tabletQwertyRow,
    tabletAsdfRow,
    tabletZxcvRow,
    tabletBottomRow,
    tabletArrowsRow,
  ],
};

// ==============================================
// Mobile Layout (Minimal Version)
// ==============================================

// Create a minimal version for phones
const mobileModifiersRow: KeyRow = {
  id: 'mobile-modifiers-row',
  keys: [
    { id: 'command-left', label: '⌘', size: 'medium', type: 'modifier', width: 1.5 },
    { id: 'option-left', label: '⌥', size: 'medium', type: 'modifier', width: 1.5 },
    { id: 'control-left', label: 'ctrl', size: 'medium', type: 'modifier', width: 1.5 },
    { id: 'shift-left', label: 'shift', size: 'medium', type: 'modifier', width: 1.5 },
  ],
};

const mobileEssentialKeysRow1: KeyRow = {
  id: 'mobile-essential-keys-row1',
  keys: [
    { id: 'escape', label: 'esc', size: 'default', type: 'special' },
    { id: 'tab', label: 'tab', size: 'default', type: 'special' },
    { id: 'space', label: 'space', size: 'wide', type: 'regular', width: 2 },
    { id: 'backspace', label: '⌫', size: 'default', type: 'special' },
  ],
};

const mobileEssentialKeysRow2: KeyRow = {
  id: 'mobile-essential-keys-row2',
  keys: [
    { id: 'c', label: 'C', size: 'default', type: 'regular' },
    { id: 'v', label: 'V', size: 'default', type: 'regular' },
    { id: 'x', label: 'X', size: 'default', type: 'regular' },
    { id: 'z', label: 'Z', size: 'default', type: 'regular' },
    { id: 'a', label: 'A', size: 'default', type: 'regular' },
  ],
};

const mobileArrowsRow: KeyRow = {
  id: 'mobile-arrows-row',
  keys: [
    { id: 'left', label: '←', size: 'default', type: 'navigation' },
    { id: 'up', label: '↑', size: 'default', type: 'navigation' },
    { id: 'down', label: '↓', size: 'default', type: 'navigation' },
    { id: 'right', label: '→', size: 'default', type: 'navigation' },
  ],
};

// Define the mobile layout for small screens
export const mobileKeyboardLayout: KeyboardLayout = {
  id: 'mobile-layout',
  name: 'Mobile Keyboard',
  rows: [
    mobileModifiersRow,
    mobileEssentialKeysRow1,
    mobileEssentialKeysRow2,
    mobileArrowsRow,
  ],
};