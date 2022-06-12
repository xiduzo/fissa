import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import IconButton from '../../components/atoms/IconButton';
import CLoseIcon from '../../components/atoms/icons/CloseIcon';
import Image from '../../components/atoms/Image';
import Typography from '../../components/atoms/Typography';
import ListItem from '../../components/molecules/ListItem';
import {DEFAULT_IMAGE} from '../../lib/constants/Image';
import {useSpotify} from '../../providers/SpotifyProvider';
import {RootStackParamList} from '../Routes';
import {AddContextBottomDrawer, useAddContext} from './Room.AddContext';

interface SelectTracksProps
  extends NativeStackScreenProps<RootStackParamList, 'SelectTracks'> {}

const SelectTracks: FC<SelectTracksProps> = ({route, navigation, ...props}) => {
  const {selectedTracks, addTrack, removeTrack, cancel} = useAddContext();
  const {spotify} = useSpotify();
  const {playlistId} = route.params;
  const [playlist, setPlaylists] =
    useState<SpotifyApi.SinglePlaylistResponse>();
  const [tracks, setTracks] = useState<SpotifyApi.PlaylistTrackObject[]>([]);

  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollHeight = event.nativeEvent.contentOffset.y;

    if (scrollHeight < 230)
      return navigation.setOptions({headerTitle: undefined});

    navigation.setOptions({headerTitle: playlist?.name});
  };

  const toggleTrack = (trackId: string) => () => {
    if (selectedTracks.includes(trackId)) {
      removeTrack(trackId);
      return;
    }

    addTrack(trackId);
  };

  useEffect(() => {
    console.log('fetch');
    const fetchTracks = async (offset: number) => {
      spotify.getPlaylistTracks(playlistId, {offset}).then(result => {
        console.log(result);
        setTracks(prev => [...prev, ...result.items]);
        if (!result.next) return;
        fetchTracks(offset + result.items.length);
      });
    };

    spotify.getPlaylist(playlistId).then(result => {
      setPlaylists(result);
    });

    spotify.getPlaylistTracks(playlistId).then(result => {
      setTracks(result.items);
      console.log(result);
      if (!result.next) return;

      fetchTracks(result.offset + result.items.length);
    });
  }, [
    playlistId,
    spotify.getPlaylistTracks,
    spotify.getPlaylist,
    spotify.getPlaylistTracks,
  ]);

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
        onScroll={scroll}
        scrollEventThrottle={30}
        style={[styles.container]}>
        <Image
          style={styles.image}
          source={{
            uri: playlist?.images[0]?.url ?? DEFAULT_IMAGE,
          }}
        />
        <Typography variant="h1" style={{marginVertical: 24}}>
          {playlist?.name}
        </Typography>
        {tracks.map(({track}) => (
          <ListItem
            // @ts-ignore
            imageUri={track.album.images[0]?.url ?? DEFAULT_IMAGE}
            key={track.id}
            onPress={toggleTrack(track.id)}
            selected={selectedTracks.includes(track.id)}
            title={track.name}
            // @ts-ignore
            subtitle={track.artists.map(x => x.name).join(', ')}
          />
        ))}
      </ScrollView>
      <AddContextBottomDrawer />
    </View>
  );
};

export default SelectTracks;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: '100%',
    marginBottom: 200,
  },
  image: {
    borderRadius: 8,
    width: 175,
    height: 175,
  },
});
