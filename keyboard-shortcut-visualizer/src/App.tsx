import { ShortcutProvider } from './contexts/ShortcutContext';
import { useShortcuts } from './hooks/useShortcuts';

function AppContent() {
  const { shortcuts, loading } = useShortcuts();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Keyboard Shortcut Visualizer
      </h1>
      
      {loading ? (
        <p className="text-gray-600">Loading shortcuts...</p>
      ) : (
        <div className="bg-white p-4 rounded shadow-md w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-2">Loaded Shortcuts ({shortcuts.length})</h2>
          {shortcuts.length === 0 ? (
            <p className="text-gray-500">No shortcuts available. Add your first shortcut!</p>
          ) : (
            <ul className="divide-y">
              {shortcuts.map(shortcut => (
                <li key={shortcut.id} className="py-2">
                  <div className="font-medium">{shortcut.key_combination}</div>
                  <div className="text-sm text-gray-600">{shortcut.application}</div>
                  <div className="text-sm">{shortcut.description}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ShortcutProvider>
      <AppContent />
    </ShortcutProvider>
  );
}

export default App;