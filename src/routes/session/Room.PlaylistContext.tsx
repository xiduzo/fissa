import mqtt from '@taoqf/react-native-mqtt';
import React, {
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
  // Id of playlist
  id: string;
}

interface Room {
  playlistId: string;
  pin: string;
}

interface Vote {
  trackId: string;
  total: number;
}

interface RoomPlaylistContextState {
  tracks: SpotifyApi.PlaylistTrackObject[];
  room?: Room;
  votes: {[key: string]: Vote};
  activeTrack?: ActiveTrack;
  setPin: (pin: string) => void;
}

const initialState: RoomPlaylistContextState = {
  tracks: [],
  votes: {},
  setPin: () => {},
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
    async (newTracks: SpotifyApi.PlaylistTrackObject[], offset = 0) => {
      if (!room?.playlistId) {
        return;
      }
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

  useEffect(() => {
    if (!room?.playlistId) {
      return;
    }
    fetchTracks([]);
  }, [fetchTracks, room?.playlistId]);

  useEffect(() => {
    if (!pin) {
      return;
    }

    request('POST', '/room/join', {pin}).then(async response => {
      if (response.status === 404) {
        Notification.show({
          type: 'warning',
          message: 'The sessions you are trying to join does not exist',
        });
        return;
      }

      if (response.status !== 200) {
        console.warn(response);
        Notification.show({
          type: 'warning',
          message: 'Oops... something went wrong',
        });
        return;
      }

      const newRoom = await response.json();

      Notification.show({
        icon: '🪩',
        message: `You've joined ${pin}, add some of your favorite tracks to keep the party going!`,
      });

      setRoom(newRoom);
    });
  }, [pin, room?.playlistId]);

  useEffect(() => {
    if (!pin) {
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
        `fissa/room/${pin}/tracks/added`,
        `fissa/room/${pin}/tracks/active`,
      ];
      mqttClient.subscribe(topics);
    });

    mqttClient.on('error', console.error);

    mqttClient.on('message', (topic, message) => {
      // TODO: validate message to expected format?
      console.log(message);
      const payload = JSON.parse(message.toString());
      console.log(payload);
      switch (topic) {
        case `fissa/room/${pin}/tracks/active`:
          setActiveTrack(payload as ActiveTrack);
          break;
        case `fissa/room/${pin}`:
          break;
        case `fissa/room/${pin}/tracks/added`:
          fetchTracks([]);
          break;
        case `fissa/room/${pin}/votes`:
          setVotes(payload as {[key: string]: Vote});
          fetchTracks([]); // We refetch because playlist might be updated
          break;
        default:
          console.log(topic, payload);
          break;
      }
    });

    return () => {
      mqttClient.end(true);
    };
  }, [pin, fetchTracks]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', () => {
      if (AppState.currentState !== 'active') {
        return;
      }
      fetchTracks([]);
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
  };
};

export default PlaylistContextProvider;
