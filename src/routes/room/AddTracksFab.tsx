import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, useState} from 'react';
import {View} from 'react-native';
import Button from '../../components/atoms/Button';
import Fab from '../../components/atoms/Fab';
import PlusIcons from '../../components/atoms/icons/PlusIcon';
import SpotifyIcon from '../../components/atoms/icons/SpotifyIcon';
import Typography from '../../components/atoms/Typography';
import Popover from '../../components/molecules/Popover';
import {RootStackParamList} from '../../lib/interfaces/StackParams';

interface RoomAddTracksFabProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Room', undefined>;
}

const RoomAddTracksFab: FC<RoomAddTracksFabProps> = ({navigation}) => {
  const [addingTracks, setAddingTracks] = useState(false);

  const startAddingTracks = () => setAddingTracks(true);
  const stopAddingTracks = () => setAddingTracks(false);

  const addFromPlaylist = () => {
    stopAddingTracks();
    navigation.navigate('AddTracks');
  };

  const searchFromSpotify = () => {
    stopAddingTracks();
    navigation.navigate('AddFromSpotifySearch');
  };

  return (
    <View>
      <Fab
        title="Add tracks"
        onPress={startAddingTracks}
        scale={addingTracks ? 0 : 1}>
        <PlusIcons color="dark" />
      </Fab>
      <Popover visible={!!addingTracks} onRequestClose={stopAddingTracks}>
        <Typography variant="h2" color="dark" align="center">
          Add tracks
        </Typography>
        <Typography variant="bodyL" color="dark" align="center" gutter={32}>
          And keep this fissa going!
        </Typography>
        <View style={{marginTop: 32, marginBottom: 16}}>
          <Button
            onPress={addFromPlaylist}
            inverted
            title="From my Spotify playlists"
          />
        </View>
        <Button
          onPress={searchFromSpotify}
          start={<SpotifyIcon color="dark" />}
          variant="text"
          inverted
          title="Search in Spotify"
        />
      </Popover>
    </View>
  );
};

export default RoomAddTracksFab;
