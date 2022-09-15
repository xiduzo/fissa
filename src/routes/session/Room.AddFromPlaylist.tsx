import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import IconButton from '../../components/atoms/IconButton';
import CLoseIcon from '../../components/atoms/icons/CloseIcon';
import ScrollViewWithHeaderTitle from '../../components/atoms/ScrollViewWithHeaderTitle';
import Typography from '../../components/atoms/Typography';
import Playlist from '../../components/molecules/ListItem.Playlist';
import {useSpotify} from '../../providers/SpotifyProvider';
import {SharedElementStackParamList} from '../Routes';
import {AddContextBottomDrawer, useAddContext} from './Room.AddContext';

interface AddFromPlaylistProps
  extends NativeStackScreenProps<
    SharedElementStackParamList,
    'AddFromPlaylist'
  > {}

const AddFromPlaylist: FC<AddFromPlaylistProps> = ({navigation}) => {
  const {cancel} = useAddContext();
  const {spotify} = useSpotify();
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);

  const gotoPlaylist = (playlistId: string) => () => {
    navigation.navigate('SelectTracks', {playlistId});
  };

  useEffect(() => {
    spotify.getUserPlaylists().then(result => setPlaylists(result.items));
  }, [spotify]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton title="cancel" onPress={cancel}>
          <CLoseIcon />
        </IconButton>
      ),
    });
  }, [navigation, cancel]);

  return (
    <View>
      <ScrollViewWithHeaderTitle
        title="Your playlists"
        navigation={navigation}
        style={styles.container}
        scrollEventThrottle={30}>
        <Typography variant="h1" gutterBottom={32}>
          Your playlists
        </Typography>
        {playlists.map(playlist => (
          <Playlist
            playlist={playlist}
            key={playlist.id}
            onPress={gotoPlaylist(playlist.id)}
          />
        ))}
      </ScrollViewWithHeaderTitle>
      <AddContextBottomDrawer />
    </View>
  );
};

export default AddFromPlaylist;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: '100%',
    marginBottom: 200,
  },
});
