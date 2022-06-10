import {useNavigation} from '@react-navigation/native';
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';
import BottomDrawer from '../../components/atoms/BottomDrawer';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import {Color} from '../../types/Color';
import Notification from '../../utils/Notification';

interface RoomAddContextState {
  selectedTracks: string[];
  addTrack: (trackId: string) => void;
  removeTrack: (trackId: string) => void;
  addToQueue: () => void;
}

const initialState: RoomAddContextState = {
  selectedTracks: [],
  addTrack: () => {},
  removeTrack: () => {},
  addToQueue: () => {},
};

const RoomAddContext = createContext<RoomAddContextState>(initialState);

const AddContextProvider: FC = ({children}) => {
  const {navigate} = useNavigation();

  const [selectedTracks, setSelectedTracks] = useState<string[]>(
    initialState.selectedTracks,
  );

  const addTrack = useCallback((trackId: string) => {
    setSelectedTracks(tracks => [...tracks, trackId]);
  }, []);

  const removeTrack = useCallback((trackId: string) => {
    setSelectedTracks(tracks => tracks.filter(id => id !== trackId));
  }, []);

  const addToQueue = useCallback(() => {
    console.log('add to queue', selectedTracks);
    // @ts-ignore
    navigate('Room');
    Notification.show({
      message: `You've added ${selectedTracks.length} songs to the queue. Kick it!`,
    });
    setSelectedTracks([]);
  }, [selectedTracks]);

  return (
    <RoomAddContext.Provider
      value={{
        selectedTracks,
        addTrack,
        removeTrack,
        addToQueue,
      }}>
      {children}
    </RoomAddContext.Provider>
  );
};

export const useAddContext = () => useContext(RoomAddContext);

export const AddContextBottomDrawer: FC = ({...props}) => {
  const {selectedTracks, addToQueue} = useAddContext();

  return (
    <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
      <BottomDrawer>
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
  );
};

export default AddContextProvider;

const styles = StyleSheet.create({
  text: {
    color: Color.dark,
    textAlign: 'center',
    margin: 24,
  },
});
