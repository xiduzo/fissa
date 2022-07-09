import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import Button from '../../components/atoms/Button';
import Fab from '../../components/atoms/Fab';
import PlusIcons from '../../components/atoms/icons/PlusIcon';
import Typography from '../../components/atoms/Typography';
import Popover from '../../components/molecules/Popover';
import {Color} from '../../types/Color';
import {RootStackParamList} from '../Routes';

interface RoomAddTracksFabProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Room', undefined>;
}

const RoomAddTracksFab: FC<RoomAddTracksFabProps> = ({navigation}) => {
  const [addingTracks, setAddingTracks] = useState(false);

  const startAddingTracks = () => setAddingTracks(true);
  const stopAddingTracks = () => setAddingTracks(false);
  const openSpotify = () => Linking.openURL('https://open.spotify.com');

  const addFromPlaylist = () => {
    navigation.navigate('AddTracks');
    stopAddingTracks();
  };

  return (
    <View>
      <Fab title="Add songs" onPress={startAddingTracks}>
        <PlusIcons style={{tintColor: Color.dark}} />
      </Fab>
      <Popover visible={!!addingTracks} onRequestClose={stopAddingTracks}>
        <Typography variant="h2" style={styles.popoverText}>
          Add songs
        </Typography>
        <Typography variant="h6" style={styles.popoverText}>
          And keep this fissa going!
        </Typography>
        <View style={styles.popoverButtons}>
          <View style={{marginBottom: 16}}>
            <Button
              onPress={addFromPlaylist}
              inverted
              title="From my Spotify playlists"
            />
          </View>
          {/* <Button
            onPress={openSpotify}
            inverted
            title="Copy song link in Spotify"
          /> */}
        </View>
      </Popover>
    </View>
  );
};

export default RoomAddTracksFab;

const styles = StyleSheet.create({
  popoverText: {
    color: Color.dark,
    textAlign: 'center',
  },
  popoverButtons: {
    marginTop: 32,
  },
});
