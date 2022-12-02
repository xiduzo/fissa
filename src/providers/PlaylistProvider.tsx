import AsyncStorage from '@react-native-community/async-storage';
import {createContext, FC, useCallback, useEffect, useReducer} from 'react';
import {AppState} from 'react-native';
import {useRtc} from '../hooks/useRtc';
import {Room} from '../lib/interfaces/Room';
import {Track} from '../lib/interfaces/Track';
import {Vote} from '../lib/interfaces/Vote';
import {request} from '../lib/utils/api';
import Notification from '../lib/utils/Notification';
import {roomReducer, setPin, setRoom, setTracks, setVotes} from './roomReducer';

export const PlaylistContext = createContext({
  tracks: [] as Track[],
  votes: {} as {[key: string]: Vote[]},
  room: {} as Room | undefined,
  joinRoom: (pin: string) => {},
});

const PlaylistProvider: FC = ({children}) => {
  const {listenTo, setMessageHandler} = useRtc();

  const [state, dispatch] = useReducer(roomReducer, {
    tracks: [],
    votes: {},
    pin: '',
  });

  const fetchVotes = useCallback(
    async pin => {
      const {content} = await request<Vote[]>('GET', `/room/vote?pin=${pin}`);
      dispatch(setVotes(content));
    },
    [dispatch],
  );

  const fetchTracks = useCallback(
    async pin => {
      const {content} = await request<Track[]>('GET', `/room/track?pin=${pin}`);
      dispatch(setTracks(content));
    },
    [dispatch],
  );

  const fetchRoom = useCallback(
    async pin => {
      try {
        const {content} = await request<Room>('GET', `/room/${pin}`);

        dispatch(setRoom(content));
      } catch (error) {
        if (error === 404) {
          Notification.show({
            type: 'warning',
            message: `Fissa ${state.pin} you are trying to join does not exist`,
          });
        }
      }
    },
    [dispatch],
  );

  const joinRoom = useCallback(
    async (pin: string) => {
      dispatch(setPin(pin));

      await AsyncStorage.setItem('pin', pin);
      fetchRoom(pin);
      fetchTracks(pin);
      fetchVotes(pin);
    },
    [dispatch, fetchRoom, fetchTracks, fetchVotes],
  );

  const handleRtcMessage = useCallback(
    (topic: string, payload: string) => {
      const message = JSON.parse(payload);

      switch (topic) {
        case `fissa/room/${state.pin}/tracks/added`:
        case `fissa/room/${state.pin}/tracks/reordered`:
          fetchTracks(state.pin);
          break;
        case `fissa/room/${state.pin}/votes`: {
          dispatch(setVotes(message));
          break;
        }
        case `fissa/room/${state.pin}`: {
          dispatch(setRoom(message));
          break;
        }
        default: {
          console.warn('no topic match', {topic, message});
          break;
        }
      }
    },
    [state.pin, dispatch, fetchTracks],
  );

  useEffect(
    () => setMessageHandler(handleRtcMessage),
    [handleRtcMessage, setMessageHandler],
  );

  useEffect(() => {
    if (!state.pin) return;

    return listenTo([
      `fissa/room/${state.pin}`,
      `fissa/room/${state.pin}/votes`,
      `fissa/room/${state.pin}/tracks/reordered`,
      `fissa/room/${state.pin}/tracks/added`,
    ]);
  }, [state.pin, listenTo]);

  useEffect(() => {
    if (!state.pin) return;

    const subscription = AppState.addEventListener('change', () => {
      if (AppState.currentState !== 'active') return;

      fetchRoom(state.pin);
      fetchTracks(state.pin);
      fetchVotes(state.pin);
    });

    return () => {
      subscription.remove();
    };
  }, [state.pin, fetchRoom, fetchTracks, fetchVotes]);

  useEffect(() => {
    AsyncStorage.getItem('pin').then(pin => {
      if (!pin) return;
      request<Room>('GET', `/room/${pin}`)
        .then(({content}) => {
          joinRoom(content.pin);
        })
        .catch(async e => {
          console.warn(e);
          await AsyncStorage.setItem('pin', '');
        });
    });
  }, [joinRoom]);

  return (
    <PlaylistContext.Provider
      value={{
        tracks: state.tracks,
        room: state.room,
        votes: state.votes,
        joinRoom,
      }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistProvider;
