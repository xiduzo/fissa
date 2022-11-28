import AsyncStorage from '@react-native-community/async-storage';
import {createContext, FC, useCallback, useEffect, useReducer} from 'react';
import {AppState} from 'react-native';
import {useRtc} from '../hooks/useRtc';
import {Room} from '../lib/interfaces/Room';
import {Track} from '../lib/interfaces/Track';
import {Vote} from '../lib/interfaces/Vote';
import {request} from '../lib/utils/api';
import Notification from '../lib/utils/Notification';
import {
  clear,
  roomReducer,
  setPin,
  setRoom,
  setTracks,
  setVotes,
} from './roomReducer';

export const PlaylistContext = createContext({
  tracks: [] as Track[],
  votes: {} as {[key: string]: Vote[]},
  room: {} as Room | undefined,
  joinRoom: (pin: string) => {},
  leaveRoom: () => {},
});

const PlaylistProvider: FC = ({children}) => {
  const {listenTo, setMessageHandler} = useRtc();

  const [state, dispatch] = useReducer(roomReducer, {
    tracks: [],
    votes: {},
    pin: '',
  });

  const leaveRoom = useCallback(async () => dispatch(clear(undefined)), []);

  const fetchVotes = useCallback(async () => {
    if (!state.pin) return;
    const {content} = await request<Vote[]>(
      'GET',
      `/room/vote?pin=${state.pin}`,
    );
    dispatch(setVotes(content));
  }, [state.pin, dispatch]);

  const fetchTracks = useCallback(async () => {
    if (!state.pin) return;
    const {content} = await request<Track[]>(
      'GET',
      `/room/track?pin=${state.pin}`,
    );
    dispatch(setTracks(content));
  }, [state.pin, dispatch]);

  const fetchRoom = useCallback(async () => {
    if (!state.pin) return;

    try {
      const {content} = await request<Room>('GET', `/room/${state.pin}`);

      dispatch(setRoom(content));
    } catch (error) {
      if (error === 404) {
        Notification.show({
          type: 'warning',
          message: `Fissa ${state.pin} you are trying to join does not exist`,
        });
      }
    }
  }, [state.pin, dispatch]);

  useEffect(() => {
    if (!state.room?.pin) return;

    fetchTracks();
    fetchVotes();
  }, [state.room?.pin, fetchTracks, fetchVotes]);

  const joinRoom = useCallback(
    async (pin: string) => {
      if (!state.pin) return;

      await AsyncStorage.setItem('pin', state.pin);
      dispatch(setPin(pin));
    },
    [dispatch],
  );

  const handleRtcMessage = useCallback(
    (topic: string, payload: Buffer, packet: any) => {
      const message = JSON.parse(payload.toString());

      switch (topic) {
        case `fissa/room/${state.pin}/tracks/added`:
        case `fissa/room/${state.pin}/tracks/reordered`:
          fetchTracks();
          break;
        case `fissa/room/${state.pin}/votes`: {
          const payload = JSON.parse(message?.toString() ?? '[]');
          dispatch(setVotes(payload));
          break;
        }
        case `fissa/room/${state.pin}`: {
          const payload = JSON.parse(message?.toString() ?? '{}');
          dispatch(setRoom(payload));
          break;
        }
        default: {
          const payload = JSON.parse(message?.toString() ?? '');
          console.warn(topic, payload);
          break;
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    setMessageHandler(handleRtcMessage);
  }, [handleRtcMessage, setMessageHandler]);

  useEffect(() => {
    if (!state.pin) return;

    fetchRoom();

    listenTo([
      `fissa/room/${state.pin}`,
      `fissa/room/${state.pin}/votes`,
      `fissa/room/${state.pin}/tracks/reordered`,
      `fissa/room/${state.pin}/tracks/added`,
    ]);
  }, [state.pin, listenTo]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', () => {
      if (AppState.currentState !== 'active') return;

      fetchRoom();
      fetchTracks();
      fetchVotes();
    });

    return subscription.remove;
  }, [fetchRoom, fetchTracks, fetchVotes]);

  useEffect(() => {
    AsyncStorage.getItem('pin').then(pin => {
      if (!pin) return;

      request<Room>('GET', `/room/${pin}`)
        .then(() => dispatch(setPin(pin)))
        .catch(console.error);
    });
  }, [dispatch]);

  return (
    <PlaylistContext.Provider
      value={{
        tracks: state.tracks,
        room: state.room,
        votes: state.votes,
        joinRoom,
        leaveRoom,
      }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistProvider;
