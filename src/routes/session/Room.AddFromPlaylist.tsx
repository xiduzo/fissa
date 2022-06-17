import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import IconButton from '../../components/atoms/IconButton';
import CLoseIcon from '../../components/atoms/icons/CloseIcon';
import Typography from '../../components/atoms/Typography';
import ListItem from '../../components/molecules/ListItem';
import {DEFAULT_IMAGE} from '../../lib/constants/Image';
import {useSpotify} from '../../providers/SpotifyProvider';
import {RootStackParamList} from '../Routes';
import {AddContextBottomDrawer, useAddContext} from './Room.AddContext';

interface AddFromPlaylistProps
  extends NativeStackScreenProps<RootStackParamList, 'AddFromPlaylist'> {}

const AddFromPlaylist: FC<AddFromPlaylistProps> = ({navigation, ...props}) => {
  const {cancel} = useAddContext();
  const {spotify} = useSpotify();
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);

  const gotoPlaylist = (playlistId: string) => () => {
    console.log(playlistId);
    navigation.navigate('SelectTracks', {playlistId});
  };

  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollHeight = event.nativeEvent.contentOffset.y;

    if (scrollHeight < 35)
      return navigation.setOptions({headerTitle: undefined});

    navigation.setOptions({headerTitle: 'Your playlists'});
  };

  useEffect(() => {
    spotify.getUserPlaylists().then(result => setPlaylists(result.items));
  }, [spotify.getUserPlaylists]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton title="cancel" onPress={cancel}>
          <CLoseIcon />
        </IconButton>
      ),
    });
  }, [navigation.setOptions, cancel]);

  return (
    <View>
      <ScrollView
        style={styles.container}
        onScroll={scroll}
        scrollEventThrottle={30}>
        <Typography style={styles.title} variant="h1">
          Your playlists
        </Typography>
        {playlists.map(playlist => (
          <ListItem
            imageUri={playlist.images[0]?.url ?? DEFAULT_IMAGE}
            onPress={gotoPlaylist(playlist.id)}
            key={playlist.id}
            title={playlist.name}
            subtitle={playlist.owner.display_name ?? ''}
          />
        ))}
      </ScrollView>
      <AddContextBottomDrawer />
    </View>
  );
};

export default AddFromPlaylist;

const styles = StyleSheet.create({
  title: {
    marginBottom: 32,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: '100%',
    marginBottom: 200,
  },
});
