import { useState } from 'react';
import { Header } from './components/Header';
import { FlightControls } from './components/FlightControls';
import { Telemetry } from './components/Telemetry';

function App() {
  const [connected, setConnected] = useState(false);
  const [metrics, setMetrics] = useState({
    battery: 0,
    altitude: 0,
    signal: 0,
    temperature: 0,
  });

  const handleCommand = async (command: string) => {
    // In a real implementation, this would send commands to AWS IoT Core
    console.log('Sending command:', command);
  };

  const handleToggleConnection = async () => {
    // For demo purposes, just toggle the connection state
    setConnected(!connected);
    
    if (!connected) {
      // Simulate some initial metrics
      setMetrics({
        battery: 85,
        altitude: 0,
        signal: 98,
        temperature: 24,
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Header connected={connected} onToggleConnection={handleToggleConnection} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FlightControls onCommand={handleCommand} disabled={!connected} />
          <Telemetry metrics={metrics} />
        </div>
      </div>
    </div>
  );
}

export default App;