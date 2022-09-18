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

export interface Room {
  id?: string;
  playlistId: string;
  pin: string;
  createdBy: string;
  currentIndex: number;
  expectedEndTime?: string;
}

export interface Vote {
  createdBy: string;
  state: 'up' | 'down';
  trackUri: string;
}

interface RoomPlaylistContextState {
  tracks: SpotifyApi.PlaylistTrackObject[];
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
  const {spotify} = useSpotify();

  const fetchTracks = useCallback(
    async (newTracks: SpotifyApi.PlaylistTrackObject[] = [], offset = 0) => {
      if (!room?.playlistId) return;
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

  const sortAndSetVotes = useCallback((votes: Vote[]) => {
    const sorted = votes.reduce((acc: {[key: string]: Vote[]}, vote: Vote) => {
      acc[vote.trackUri] = acc[vote.trackUri] || [];
      acc[vote.trackUri].push(vote);
      return acc;
    }, {});

    console.log(sorted);

    setVotes(sorted);
  }, []);

  const fetchVotes = useCallback(async () => {
    const votes = await request<Vote[]>('GET', `/room/vote?pin=${pin}`);
    sortAndSetVotes(votes.content);
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
    if (!room?.playlistId) return;

    fetchTracks();
    fetchVotes();
  }, [room?.playlistId, fetchTracks, fetchVotes]);

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
      const payload = JSON.parse(message.toString());
      switch (topic) {
        case `fissa/room/${pin}/tracks/added`:
          fetchTracks();
          break;
        case `fissa/room/${pin}/tracks/reordered`:
          console.log('tracks reordered');
          //fetchTracks();
          break;
        case `fissa/room/${pin}/votes`:
          sortAndSetVotes(payload);
          break;
        case `fissa/room/${pin}`:
          setRoom(payload);
          break;
        default:
          console.log(topic, payload);
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
