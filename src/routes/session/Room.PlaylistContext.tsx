import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import Notification from '../../utils/Notification';
import mqtt from '@taoqf/react-native-mqtt';

interface RoomPlaylistContextState {
  tracks: SpotifyApi.PlaylistTrackObject[];
  room: {
    playlistId: string;
    currentIndex: number;
  };
  setPin: (pin: string) => void;
}

const initialState: RoomPlaylistContextState = {
  tracks: [],
  room: {
    playlistId: '',
    currentIndex: 0,
  },
  setPin: () => {},
};

const RoomPlaylistContext =
  createContext<RoomPlaylistContextState>(initialState);

const PlaylistContextProvider: FC = ({children}) => {
  const [tracks, setTracks] = useState(initialState.tracks);
  const [room, setRoom] = useState(initialState.room);
  const [pin, setStatePin] = useState('');
  const {spotify} = useSpotify();

  const setPin = useCallback(setStatePin, []);

  const fetchTracks = useCallback(
    async (newTracks: SpotifyApi.PlaylistTrackObject[], offset = 0) => {
      spotify.getPlaylistTracks(room.playlistId, {offset}).then(result => {
        newTracks = newTracks.concat(result.items);
        if (!result.next) return setTracks(newTracks);
        fetchTracks(newTracks, newTracks.length);
      });
    },
    [room?.playlistId, spotify.getPlaylist, spotify.getPlaylistTracks],
  );

  useEffect(() => {
    if (!room.playlistId) return;
    fetchTracks([]);
  }, [fetchTracks, room.playlistId]);

  useEffect(() => {
    if (!pin) return;
    if (!!room.playlistId) return;

    request('POST', '/room/join', {pin}).then(async response => {
      if (response.status === 404) {
        // return Notification.show({
        //   message: `Room ${joinedPin} does not exist`,
        // });
        return;
      }

      if (response.status === 500) {
        // return Notification.show({
        //   message: `Oops... something went wrong`,
        // });
        return;
      }

      if (response.status !== 200) return console.log(response);

      const room = await response.json();

      Notification.show({
        icon: '🪩',
        message: `Joined ${pin}, add your favorite tracks to keep to party going!`,
      });

      setRoom(room);
    });
  }, [pin, room.playlistId]);

  console.log(process.env);
  useEffect(() => {
    if (!pin) return;
    const mqttClient = mqtt.connect('mqtt://mqtt.mdd-tardis.net', {
      port: 9001,
      protocol: 'mqtt',
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASSWORD,
      clientId: 'fissa_' + Math.random().toString(16).substr(2, 8),
    });

    const topic = `fissa/room/${pin}`;

    mqttClient.subscribe(topic);

    mqttClient.on('error', console.error);

    mqttClient.on('message', (topic, payload) => {
      console.log(topic, JSON.parse(payload.toString()));
    });

    return () => {
      mqttClient.end();
    };
  }, [pin]);

  return (
    <RoomPlaylistContext.Provider
      value={{
        tracks,
        room,
        setPin,
      }}>
      {children}
    </RoomPlaylistContext.Provider>
  );
};

export const useRoomPlaylist = (pin: string) => {
  const context = useContext(RoomPlaylistContext);
  if (!context)
    throw new Error(
      'useRoomPlaylist must be used within a RoomPlaylistContext',
    );

  useEffect(() => {
    context.setPin(pin);

    return () => {
      context.setPin('');
    };
  }, [context.setPin, pin]);

  return {
    tracks: context.tracks,
    room: context.room,
  };
};

export default PlaylistContextProvider;
