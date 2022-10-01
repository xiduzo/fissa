import mqtt from '@taoqf/react-native-mqtt';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {AppState} from 'react-native';
import Config from 'react-native-config';
import {request} from '../../lib/utils/api';
import Notification from '../../utils/Notification';

export interface Room {
  id?: string;
  pin: string;
  createdBy: string;
  currentIndex: number;
  expectedEndTime?: string;
}

export interface Vote {
  createdBy: string;
  state: 'up' | 'down';
  trackId: string;
}

export interface Track {
  id: string;
  pin: string;
  image?: string;
  index: number;
  artists: string;
  name: string;
  duration_ms: number;
}

interface RoomPlaylistContextState {
  tracks: Track[];
  room?: Room;
  votes: {[key: string]: Vote[]};
  setPin: (pin: string) => void;
  leaveRoom: () => void;
}

const initialState: RoomPlaylistContextState = {
  tracks: [],
  votes: {},
  setPin: () => {},
  leaveRoom: () => {},
};

const RoomPlaylistContext =
  createContext<RoomPlaylistContextState>(initialState);

const PlaylistContextProvider: FC = ({children}) => {
  const [tracks, setTracks] = useState(initialState.tracks);
  const [votes, setVotes] = useState(initialState.votes);
  const [room, setRoom] = useState(initialState.room);
  const [pin, setPin] = useState('');

  const fetchTracks = useCallback(async () => {
    if (!room?.pin) return;
    const {content} = await request<Track[]>(
      'GET',
      `/room/track?pin=${room.pin}`,
    );
    setTracks(content);
  }, [room?.pin]);

  const sortAndSetVotes = useCallback((newVotes: Vote[]) => {
    const sorted = newVotes?.reduce(
      (acc: {[key: string]: Vote[]}, vote: Vote) => {
        acc[vote.trackId] = acc[vote.trackId] || [];
        acc[vote.trackId].push(vote);
        return acc;
      },
      {},
    );

    setVotes(sorted);
  }, []);

  const fetchVotes = useCallback(async () => {
    if (!room?.pin) return;

    const {content} = await request<Vote[]>(
      'GET',
      `/room/vote?pin=${room.pin}`,
    );
    sortAndSetVotes(content);
  }, [room?.pin]);

  const leaveRoom = useCallback(() => {
    setVotes({});
    setTracks([]);
    setRoom(undefined);
    setPin('');
  }, []);

  const fetchRoom = useCallback(async () => {
    if (!pin) return;

    try {
      const {content} = await request<Room>('GET', `/room/${pin}`);

      setRoom(content);
    } catch (error) {
      if (error === 404) {
        Notification.show({
          type: 'warning',
          message: `Fissa ${pin} you are trying to join does not exist`,
        });
      }
    }
  }, [pin]);

  useEffect(() => {
    if (!room?.pin) return;

    fetchTracks();
    fetchVotes();
  }, [room?.pin, fetchTracks, fetchVotes]);

  useEffect(() => {
    if (!pin) return;

    fetchRoom();

    // TODO: rewrite MQTT stuff to hook
    if (!Config.MQTT_USER || !Config.MQTT_PASSWORD) {
      console.error("No MQTT credentials provided, can't connect to MQTT");
      return;
    }

    const mqttClient = mqtt.connect('mqtt://mqtt.mdd-tardis.net', {
      port: 9001,
      protocol: 'mqtt',
      username: Config.MQTT_USER,
      password: Config.MQTT_PASSWORD,
      resubscribe: true,
      clientId: 'fissa_' + Math.random().toString(16).substr(2, 8),
    });

    mqttClient.on('connect', () => {
      const topics = [
        `fissa/room/${pin}`,
        `fissa/room/${pin}/votes`,
        `fissa/room/${pin}/tracks/reordered`,
        `fissa/room/${pin}/tracks/added`,
      ];
      mqttClient.subscribe(topics);
    });

    mqttClient.on('error', error => {
      console.warn('MQTT error', error);
    });

    mqttClient.on('message', (topic, message) => {
      // TODO: validate message to expected format?
      const payload = JSON.parse(message?.toString() ?? '{}');
      switch (topic) {
        case `fissa/room/${pin}/tracks/added`:
          fetchTracks();
          break;
        case `fissa/room/${pin}/tracks/reordered`:
          fetchTracks();
          break;
        case `fissa/room/${pin}/votes`:
          sortAndSetVotes(payload);
          break;
        case `fissa/room/${pin}`:
          setRoom(payload);
          break;
        default:
          console.info(topic, payload);
          break;
      }
    });

    return () => {
      mqttClient.end(true);
    };
  }, [pin, fetchTracks, fetchRoom, sortAndSetVotes]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', () => {
      if (AppState.currentState !== 'active') return;

      fetchRoom();
      fetchTracks();
      fetchVotes();
    });

    return subscription.remove;
  }, [fetchRoom, fetchTracks, fetchVotes]);

  return (
    <RoomPlaylistContext.Provider
      value={{
        tracks,
        room,
        votes,
        setPin,
        leaveRoom,
      }}>
      {children}
    </RoomPlaylistContext.Provider>
  );
};

export const useRoomPlaylist = (pin?: string) => {
  const context = useContext(RoomPlaylistContext);
  if (!context) {
    throw new Error(
      'useRoomPlaylist must be used within a RoomPlaylistContext',
    );
  }

  useEffect(() => {
    if (pin) {
      context.setPin(pin);
    }

    return () => {
      context.setPin('');
    };
  }, [context, pin]);

  return {
    tracks: context.tracks,
    room: context.room,
    votes: context.votes,
    leaveRoom: context.leaveRoom,
  };
};

export default PlaylistContextProvider;
