//import React from 'react';
import { Battery, Signal, Thermometer, ArrowUp } from 'lucide-react';

interface TelemetryMetrics {
  battery: number;
  altitude: number;
  signal: number;
  temperature: number;
}

interface TelemetryProps {
  metrics: TelemetryMetrics;
}

export function Telemetry({ metrics }: TelemetryProps) {
  const telemetryItems = [
    {
      icon: <Battery size={24} />,
      label: 'Battery',
      value: `${metrics.battery}%`,
    },
    {
      icon: <ArrowUp size={24} />,
      label: 'Altitude',
      value: `${metrics.altitude}m`,
    },
    {
      icon: <Signal size={24} />,
      label: 'Signal',
      value: `${metrics.signal}%`,
    },
    {
      icon: <Thermometer size={24} />,
      label: 'Temperature',
      value: `${metrics.temperature}°C`,
    },
  ];

  return (
    <div className="bg-slate-800 p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Telemetry</h2>
      <div className="grid grid-cols-2 gap-4">
        {telemetryItems.map(({ icon, label, value }) => (
          <div
            key={label}
            className="bg-slate-700 p-4 rounded-lg flex items-center gap-3"
          >
            {icon}
            <div>
              <div className="text-slate-400 text-sm">{label}</div>
              <div className="font-semibold">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}