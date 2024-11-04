import { useCallback, useEffect, useRef, useState } from 'react';
import {
  mqtt,
  iot,
  io,
} from 'aws-iot-device-sdk-v2';

interface UseAwsIotConfig {
  endpoint: string;
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export function useAwsIot() {
  const [connected, setConnected] = useState(false);
  const connectionRef = useRef<mqtt.MqttClientConnection | null>(null);

  const connect = useCallback(async (config: UseAwsIotConfig) => {
    try {
      const clientBootstrap = new io.ClientBootstrap();
      

      const clientConfig = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets()
        .with_credentials(config.region, config.credentials.accessKeyId, config.credentials.secretAccessKey)
        .with_endpoint(config.endpoint)
        .with_client_id(`drone-control-${Date.now()}`)
        .build();

      const client = new mqtt.MqttClient(clientBootstrap);
      connectionRef.current = client.new_connection(clientConfig);

      await connectionRef.current.connect();
      setConnected(true);
      return true;
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnected(false);
      return false;
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      try {
        await connectionRef.current.disconnect();
        connectionRef.current = null;
        setConnected(false);
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
  }, []);

  const publish = useCallback(async (topic: string, message: any) => {
    if (!connectionRef.current || !connected) {
      throw new Error('Not connected to AWS IoT');
    }
    
    try {
      await connectionRef.current.publish(
        topic,
        JSON.stringify(message),
        mqtt.QoS.AtLeastOnce
      );
    } catch (error) {
      console.error('Failed to publish message:', error);
      throw error;
    }
  }, [connected]);

  const subscribe = useCallback(async (topic: string, callback: (message: any) => void) => {
    if (!connectionRef.current || !connected) {
      throw new Error('Not connected to AWS IoT');
    }

    try {
      await connectionRef.current.subscribe(
        topic,
        mqtt.QoS.AtLeastOnce,
        (_topic, payload) => {
          try {
            const message = JSON.parse(new TextDecoder().decode(payload));
            callback(message);
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        }
      );
    } catch (error) {
      console.error('Failed to subscribe:', error);
      throw error;
    }
  }, [connected]);

  useEffect(() => {
    return () => {
      if (connectionRef.current) {
        disconnect();
      }
    };
  }, [disconnect]);

  return {
    connected,
    connect,
    disconnect,
    publish,
    subscribe,
  };
}