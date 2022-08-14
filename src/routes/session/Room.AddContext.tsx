import {useNavigation} from '@react-navigation/native';
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import BottomDrawer from '../../components/atoms/BottomDrawer';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import {Color} from '../../types/Color';
import Notification from '../../utils/Notification';
import {useRoomPlaylist} from './Room.PlaylistContext';

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

const RoomAddContext = createContext<RoomAddContextState>(initialState);

const AddContextProvider: FC = ({children}) => {
  const {goBack, canGoBack} = useNavigation();
  const {room} = useRoomPlaylist();
  const {spotify} = useSpotify();

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
    if (!canGoBack()) {
      return;
    }
    goBack();
    goToRoom();
  }, [canGoBack, goBack]);

  const addToQueue = useCallback(() => {
    if (!room?.pin) {
      return;
    }

    console.log('adding tracks for room', room.pin);

    setSelectedTracks([]);
    goToRoom();

    Notification.show({
      message: `You've added ${selectedTracks.length} songs to the queue. Kick it!`,
    });
    request('POST', '/room/track', {
      trackUris: selectedTracks,
      pin: room.pin,
      accessToken: spotify.getAccessToken(),
    }).then(response => {
      if (response.status !== 200) {
        Notification.show({
          type: 'warning',
          message: 'Oops... something went wrong',
        });
        return;
      }
    });
  }, [room?.pin, spotify, selectedTracks, goToRoom]);

  const cancel = useCallback(() => {
    goToRoom();
    setSelectedTracks([]);
  }, [goToRoom]);

  const reset = useCallback(() => {
    setSelectedTracks([]);
  }, []);

  return (
    <RoomAddContext.Provider
      value={{
        selectedTracks,
        addTrack,
        removeTrack,
        addToQueue,
        cancel,
        reset,
      }}>
      {children}
    </RoomAddContext.Provider>
  );
};

export const useAddContext = () => useContext(RoomAddContext);

export const AddContextBottomDrawer: FC = () => {
  const {selectedTracks, addToQueue, reset} = useAddContext();

  return (
    <SharedElement id="tracks-to-add-drawer">
      <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
        <BottomDrawer close={reset}>
          <Typography style={styles.text} variant="h6">
            {selectedTracks.length} songs selected
          </Typography>
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

export default AddContextProvider;

const styles = StyleSheet.create({
  text: {
    color: Color.dark,
    textAlign: 'center',
    margin: 24,
    marginTop: 0,
  },
});
