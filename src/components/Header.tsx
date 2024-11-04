
import { Power } from 'lucide-react';

interface HeaderProps {
  connected: boolean;
  onToggleConnection: () => void;
}

export function Header({ connected, onToggleConnection }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Drone Control Center</h1>
      <button
        onClick={onToggleConnection}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          connected
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        <Power size={20} />
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </header>
  );
}