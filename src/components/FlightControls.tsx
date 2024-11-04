import { ArrowUp, ArrowDown, RotateCcw, RotateCw, Plane } from 'lucide-react';

interface FlightControlsProps {
  onCommand: (command: string) => void;
  disabled: boolean;
}

export function FlightControls({ onCommand, disabled }: FlightControlsProps) {
  const controls = [
    { icon: <Plane size={24} />, command: 'takeoff', label: 'Take Off' },
    { icon: <ArrowUp size={24} />, command: 'up', label: 'Ascend' },
    { icon: <ArrowDown size={24} />, command: 'down', label: 'Descend' },
    { icon: <RotateCcw size={24} />, command: 'rotateLeft', label: 'Rotate Left' },
    { icon: <RotateCw size={24} />, command: 'rotateRight', label: 'Rotate Right' },
    { icon: <Plane className="rotate-180" size={24} />, command: 'land', label: 'Land' },
  ];

  return (
    <div className="bg-slate-800 p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Flight Controls</h2>
      <div className="grid grid-cols-2 gap-4">
        {controls.map(({ icon, command, label }) => (
          <button
            key={command}
            onClick={() => onCommand(command)}
            disabled={disabled}
            className={`flex items-center justify-center gap-2 p-4 rounded-lg transition-colors ${
              disabled
                ? 'bg-slate-700 cursor-not-allowed opacity-50'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}