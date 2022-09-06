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
import {useSpotify} from '../../providers/SpotifyProvider';
import Notification from '../../utils/Notification';

interface ActiveTrack {
  is_playing: boolean;
  progress_ms: number;
  currentIndex: number;
  is_in_playlist: boolean;
  // Id of playlist
  id: string;
}

export interface Room {
  playlistId: string;
  pin: string;
  currentIndex: number;
}

export interface Vote {
  trackId: string;
  total: number;
  votes: {
    createdBy: string;
    state: 'up' | 'down';
  }[];
}

interface RoomPlaylistContextState {
  tracks: SpotifyApi.PlaylistTrackObject[];
  room?: Room;
  votes: {[key: string]: Vote};
  activeTrack?: ActiveTrack;
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
  const [activeTrack, setActiveTrack] = useState<ActiveTrack>();
  const [pin, setPin] = useState('');
  const {spotify} = useSpotify();

  const fetchTracks = useCallback(
    async (newTracks: SpotifyApi.PlaylistTrackObject[] = [], offset = 0) => {
      if (!room?.playlistId) return;
      console.log('fetching tracks for room', room.playlistId);
      spotify.getPlaylistTracks(room?.playlistId, {offset}).then(result => {
        newTracks = newTracks.concat(result.items);
        if (!result.next) {
          return setTracks(newTracks);
        }
        fetchTracks(newTracks, newTracks.length);
      });
    },
    [room?.playlistId, spotify],
  );

  const leaveRoom = useCallback(() => {
    setVotes({});
    setTracks([]);
    setRoom(undefined);
    setActiveTrack(undefined);
    setPin('');
  }, []);

  const joinRoom = useCallback(async () => {
    if (!pin) return;

    try {
      const {content} = await request<Room>('GET', `/room/${pin}`);

      setRoom(content);
    } catch (error) {
      if (error === 404) {
        Notification.show({
          type: 'warning',
          message: 'The sessions you are trying to join does not exist',
        });
      }
    }
  }, [pin]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks, room?.playlistId]);

  useEffect(() => {
    if (!pin) return;

    joinRoom();

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
        `fissa/room/${pin}/tracks/active`,
      ];
      mqttClient.subscribe(topics);
    });

    mqttClient.on('error', error => {
      console.log('MQTT error', error);
    });

    mqttClient.on('message', (topic, message) => {
      // TODO: validate message to expected format?
      const payload = JSON.parse(message.toString());
      console.log('message', topic, payload);
      switch (topic) {
        case `fissa/room/${pin}/tracks/active`:
          setActiveTrack(payload as ActiveTrack);
          break;
        case `fissa/room/${pin}/tracks/reordered`:
          console.log('tracks reordered');
          fetchTracks();
          break;
        case `fissa/room/${pin}/votes`:
          setVotes(payload as {[key: string]: Vote});
          break;
        case `fissa/room/${pin}`:
          break;
        default:
          console.log(topic, payload);
          break;
      }
    });

    return () => {
      mqttClient.end(true);
    };
  }, [pin, fetchTracks, joinRoom]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', () => {
      if (AppState.currentState !== 'active') return;
      fetchTracks();
    });

    return subscription.remove;
  }, [fetchTracks]);

  return (
    <RoomPlaylistContext.Provider
      value={{
        tracks,
        activeTrack,
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
    activeTrack: context.activeTrack,
    votes: context.votes,
    leaveRoom: context.leaveRoom,
  };
};

export default PlaylistContextProvider;
