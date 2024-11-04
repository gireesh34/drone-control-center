import React from 'react';
import { Header } from './Header';
import { FlightControls } from './FlightControls';
import { Telemetry } from './Telemetry';
import { awsIotService } from '../services/awsIotService';

interface ConnectionConfig {
  endpoint: string;
  clientId: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

export default function DroneControl() {
  const [connected, setConnected] = React.useState(false);
  const [metrics, setMetrics] = React.useState({
    battery: 85,
    altitude: 0,
    signal: 92,
    temperature: 28,
  });

  const handleCommand = async (command: string) => {
    try {
      if (connected) {
        await awsIotService.publishCommand('drone/commands', command);
      }
    } catch (error) {
      console.error('Failed to send command:', error);
    }
  };

  const handleToggleConnection = async () => {
    if (connected) {
      await awsIotService.disconnect();
      setConnected(false);
    } else {
      // In a production environment, these values should come from environment variables
      // or a secure configuration management system
      const config: ConnectionConfig = {
        endpoint: import.meta.env.VITE_AWS_IOT_ENDPOINT || '',
        clientId: `drone-control-${Date.now()}`,
        region: import.meta.env.VITE_AWS_REGION || '',
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
        sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
      };

      const success = await awsIotService.connect(config);
      setConnected(success);
      
      if (success) {
        awsIotService.subscribe('drone/telemetry', (message) => {
          setMetrics(message);
        });
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Header connected={connected} onToggleConnection={handleToggleConnection} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FlightControls onCommand={handleCommand} disabled={false} />
          <Telemetry metrics={metrics} />
        </div>
      </div>
    </div>
  );
}