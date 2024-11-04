import {
  mqtt,
  iot,
  auth,
  io,
  CrtError
} from 'aws-iot-device-sdk-v2';

interface ConnectionConfig {
  endpoint: string;
  clientId: string;
  certificatePem: string;
  privateKey: string;
}

class AwsIotService {
  private connection: mqtt.MqttClientConnection | null = null;

  async connect(config: ConnectionConfig): Promise<boolean> {
    try {
      const clientBootstrap = new io.ClientBootstrap();
      
      const configBuilder = iot.AwsIotMqttConnectionConfigBuilder
        .new_with_websockets()
        .with_client_id(config.clientId)
        .with_endpoint(config.endpoint)
        .with_credentials(
          config.region,
          config.accessKeyId,
          config.secretAccessKey,
          config.sessionToken
        );

      const client = new mqtt.MqttClient(clientBootstrap);
      this.connection = client.new_connection(configBuilder.build());

      await this.connection.connect();
      return true;
    } catch (error) {
      console.error('Failed to connect to AWS IoT:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.disconnect();
        this.connection = null;
      }
    } catch (error) {
      console.error('Failed to disconnect from AWS IoT:', error);
    }
  }

  async publishCommand(topic: string, command: string): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to AWS IoT');
    }

    try {
      await this.connection.publish(
        topic,
        JSON.stringify({ command, timestamp: Date.now() }),
        mqtt.QoS.AtLeastOnce
      );
    } catch (error) {
      console.error('Failed to publish command:', error);
      throw error;
    }
  }

  async subscribe(
    topic: string,
    callback: (message: any) => void
  ): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to AWS IoT');
    }

    try {
      await this.connection.subscribe(
        topic,
        mqtt.QoS.AtLeastOnce,
        (topic: string, payload: ArrayBuffer) => {
          const message = new TextDecoder().decode(payload);
          try {
            const data = JSON.parse(message);
            callback(data);
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        }
      );
    } catch (error) {
      console.error('Failed to subscribe:', error);
      throw error;
    }
  }
}

export const awsIotService = new AwsIotService();