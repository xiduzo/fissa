import {useNavigation} from '@react-navigation/native';
import {createContext, FC, useCallback, useContext, useState} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import BottomDrawer from '../components/atoms/BottomDrawer';
import Button from '../components/atoms/Button';
import DeleteIcon from '../components/atoms/icons/DeleteIcon';
import {request} from '../lib/utils/api';
import {useSpotify} from './SpotifyProvider';
import Notification from '../lib/utils/Notification';
import {Color} from '../lib/types/Theme';
import {useDebounce} from '../hooks/useDebounce';
import {useRoom} from '../hooks/useRoom';

interface RoomAddContextState {
  selectedTracks: string[];
  addTrack: (trackId: string) => void;
  removeTrack: (trackId: string) => void;
  addToQueue: () => void;
  cancel: () => void;
  reset: () => void;
}

const initialState: RoomAddContextState = {
  selectedTracks: [],
  addTrack: () => {},
  removeTrack: () => {},
  addToQueue: () => {},
  cancel: () => {},
  reset: () => {},
};

const AddTracksContext = createContext<RoomAddContextState>(initialState);

const AddTracksProvider: FC = ({children}) => {
  const {goBack, canGoBack} = useNavigation();
  const {room} = useRoom();
  const {spotify, currentUser} = useSpotify();

  const [selectedTracks, setSelectedTracks] = useState<string[]>(
    initialState.selectedTracks,
  );

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
      }}>
      {children}
    </AddTracksContext.Provider>
  );
};

export const useAddContext = () => useContext(AddTracksContext);

interface AddContextBottomDrawerProps {
  onSearch?: (value: string) => void;
}

export const AddContextBottomDrawer: FC<AddContextBottomDrawerProps> = ({
  onSearch,
}) => {
  const {selectedTracks, addToQueue, reset} = useAddContext();

  const [search, setSearch] = useState('');

  useDebounce(search, 500, newSearch => {
    console.log(newSearch);
    onSearch && onSearch(newSearch);
  });

  return (
    <SharedElement id="tracks-to-add-drawer">
      <View style={styles.view}>
        <BottomDrawer action={reset} actionIcon={DeleteIcon}>
          <Button
            inverted
            style={styles.button}
            title={`Add ${selectedTracks.length} tracks`}
            onPress={addToQueue}
            disabled={selectedTracks.length <= 0}
          />
          <TextInput
            value={search}
            style={styles.searchInput}
            placeholder="Search"
            onChange={e => setSearch(e.nativeEvent.text)}
          />
        </BottomDrawer>
      </View>
    </SharedElement>
  );
};

export default AddTracksProvider;

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: {
    marginTop: 16,
  },
  searchInput: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: Color.light,
    color: Color.dark,
    borderRadius: 8,
  },
});
