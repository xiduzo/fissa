import {useNavigation} from '@react-navigation/native';
import {createContext, FC, useCallback, useContext, useState} from 'react';
import {request} from '../lib/utils/api';
import {useSpotify} from './SpotifyProvider';
import Notification from '../lib/utils/Notification';
import {useRoom} from '../hooks/useRoom';

const AddTracksContext = createContext({
  selectedTracks: [] as string[],
  search: '',
  setSearch: (value: string) => {},
  addTrack: (trackId: string) => {},
  removeTrack: (trackId: string) => {},
  addToQueue: () => {},
  cancel: () => {},
  reset: () => {},
});

const AddTracksProvider: FC = ({children}) => {
  const [search, setSearch] = useState('');
  const {goBack, canGoBack} = useNavigation();
  const {room} = useRoom();
  const {spotify, currentUser} = useSpotify();

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const addTrack = useCallback((trackId: string) => {
    setSelectedTracks(tracks => [...tracks, trackId]);
  }, []);

  const removeTrack = useCallback((trackId: string) => {
    setSelectedTracks(tracks => tracks.filter(id => id !== trackId));
  }, []);

  const goToRoom = useCallback(() => {
    if (!canGoBack()) return;
    setSelectedTracks([]);
    goBack();

    goToRoom(); // We can be two levels deep, so we need to go back twice
  }, [canGoBack, goBack]);

  const addToQueue = useCallback(async () => {
    if (!room?.pin) return;

    goToRoom();

    Notification.show({
      message: `You've added ${selectedTracks.length} tracks to the queue. Kick it!`,
    });

    await request<any>('POST', '/room/track', {
      trackIds: selectedTracks,
      pin: room.pin,
      createdBy: currentUser?.id,
    });
  }, [room?.pin, spotify, selectedTracks, goToRoom]);

  const cancel = useCallback(goToRoom, [goToRoom]);

  const reset = useCallback(() => {
    setSelectedTracks([]);
  }, []);

  return (
    <AddTracksContext.Provider
      value={{
        selectedTracks,
        addTrack,
        removeTrack,
        addToQueue,
        cancel,
        reset,
        search,
        setSearch,
      }}>
      {children}
    </AddTracksContext.Provider>
  );
};

export const useAddContext = () => useContext(AddTracksContext);

export default AddTracksProvider;
