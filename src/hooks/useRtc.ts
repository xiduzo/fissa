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

  const listenTo = useCallback((topics: string[], attempt = 0) => {
    if (!mqttClient.connected && attempt < 5) {
      setTimeout(() => listenTo(topics, attempt + 1), 1000 * attempt);
    }

    mqttClient.subscribe(topics);

    topicsRef.current = topicsRef.current.concat(topics);

    return () => unsubscribeFrom(topics);
  }, []);

  const unsubscribeFrom = useCallback((topics: string[], attempt = 0) => {
    if (!mqttClient.connected && attempt < 5) {
      setTimeout(() => unsubscribeFrom(topics, attempt + 1), 1000 * attempt);
    }

    mqttClient.unsubscribe(topics);

    topicsRef.current = topicsRef.current.filter(
      topic => !topics.includes(topic),
    );
  }, []);

  const setMessageHandler = useCallback(
    (handler: (topic: string, message: string) => void) => {
      const _handler = (topic: string, message: Buffer) =>
        handler(topic, message.toString());

      mqttClient.on('message', _handler);

      return () => {
        mqttClient.off('message', _handler);
      };
    },
    [],
  );

  useEffect(() => {
    if (topicsRef.current.length <= 0) return;

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
