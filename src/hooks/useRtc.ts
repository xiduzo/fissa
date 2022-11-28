import {useCallback, useEffect, useRef} from 'react';
import Config from 'react-native-config';
import mqtt from '@taoqf/react-native-mqtt';

const mqttClient = mqtt.connect('mqtt://mqtt.mdd-tardis.net', {
  port: 9001,
  protocol: 'mqtt',
  username: Config.MQTT_USER,
  password: Config.MQTT_PASSWORD,
  resubscribe: true,
  clientId: 'fissa_' + Math.random().toString(16).substr(2, 8),
});

mqttClient.on('error', error => {
  console.warn('MQTT error', error);
});

export const useRtc = () => {
  const topicsRef = useRef<string[]>([]);

  const listenTo = useCallback((topics: string | string[], attempt = 0) => {
    if (!mqttClient.connected) {
      setTimeout(() => listenTo(topics, attempt + 1), 1000 * attempt);
      return;
    }

    mqttClient.subscribe(topics);

    if (Array.isArray(topics)) {
      topicsRef.current = topicsRef.current.concat(topics);
    } else {
      topicsRef.current.push(topics);
    }
  }, []);

  const setMessageHandler = useCallback((handler: mqtt.OnMessageCallback) => {
    mqttClient.on('message', handler);
  }, []);

  useEffect(() => {
    return () => {
      mqttClient.unsubscribe(topicsRef.current);
      topicsRef.current = [];
    };
  }, []);

  return {
    listenTo,
    setMessageHandler,
  };
};
