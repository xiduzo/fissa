import {useNavigation} from '@react-navigation/native';
import {createContext, FC, useCallback, useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import BottomDrawer from '../components/atoms/BottomDrawer';
import Button from '../components/atoms/Button';
import DeleteIcon from '../components/atoms/icons/DeleteIcon';
import Typography from '../components/atoms/Typography';
import {request} from '../lib/utils/api';
import {useSpotify} from './SpotifyProvider';
import Notification from '../utils/Notification';
import {useRoomPlaylist} from './PlaylistProvider';

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
  const {room} = useRoomPlaylist();
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

export const AddContextBottomDrawer: FC = props => {
  const {selectedTracks, addToQueue, reset} = useAddContext();

  return (
    <SharedElement id="tracks-to-add-drawer">
      <View style={styles.view}>
        <BottomDrawer action={reset} actionIcon={DeleteIcon}>
          <View style={styles.selectedAmountContainer}>
            <Typography
              color="dark"
              align="center"
              variant="h6"
              style={styles.selectedAmount}>
              {selectedTracks.length}
            </Typography>
            <Typography color="dark" align="center" variant="h6" gutter={24}>
              tracks selected
            </Typography>
          </View>
          <Button
            inverted
            title="Add to queue"
            onPress={addToQueue}
            disabled={selectedTracks.length <= 0}
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
  selectedAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selectedAmount: {
    minWidth: 28,
  },
});
