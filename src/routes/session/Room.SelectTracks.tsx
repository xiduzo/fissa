import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useEffect, useState} from 'react';
import {ListRenderItemInfo, StyleSheet, View} from 'react-native';
import IconButton from '../../components/atoms/IconButton';
import CLoseIcon from '../../components/atoms/icons/CloseIcon';
import Image from '../../components/atoms/Image';
import Typography from '../../components/atoms/Typography';
import VirtualizedListWithHeader from '../../components/atoms/VirtualizedListWithHeader';
import Track from '../../components/molecules/ListItem.Track';
import {SAVED_TRACK_IMAGE_URL} from '../../lib/constants/Images';
import {useSpotify} from '../../providers/SpotifyProvider';
import {SharedElementStackParamList} from '../Routes';
import {AddContextBottomDrawer, useAddContext} from './Room.AddContext';

interface SelectTracksProps
  extends NativeStackScreenProps<SharedElementStackParamList, 'SelectTracks'> {}

interface ListHeaderProps {
  name?: string;
  imageUri?: string;
}
const ListHeader: FC<ListHeaderProps> = ({name, imageUri}) => {
  return (
    <>
      <Image
        style={styles.image}
        source={{
          uri: imageUri,
        }}
      />
      <Typography variant="h1" gutter={24}>
        {name}
      </Typography>
    </>
  );
};

const SelectTracks: FC<SelectTracksProps> = ({route, navigation}) => {
  const {selectedTracks, addTrack, removeTrack, cancel} = useAddContext();
  const {spotify} = useSpotify();
  const {playlistId} = route.params;
  const [playlist, setPlaylist] = useState<SpotifyApi.SinglePlaylistResponse>();
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);

  const toggleTrack = (trackId: string) => () => {
    if (selectedTracks.includes(trackId)) {
      removeTrack(trackId);
      return;
    }

    addTrack(trackId);
  };

  useEffect(() => {
    const fetchTracks = async (offset = 0) => {
      if (playlistId === 'saved-tracks') {
        spotify.getMySavedTracks({offset}).then(result => {
          // TODO: filter tracks to be unique, no need for double tracks
          setTracks(prev => prev.concat(result.items.map(item => item.track)));
          if (!result.next) return;
          fetchTracks(offset + result.items.length);
        });
        return;
      }

      spotify.getPlaylistTracks(playlistId, {offset}).then(result => {
        // TODO: filter tracks to be unique, no need for double tracks
        setTracks(prev =>
          prev.concat(
            result.items.map(item => item.track as SpotifyApi.TrackObjectFull),
          ),
        );
        if (!result.next) return;
        fetchTracks(offset + result.items.length);
      });
    };

    if (playlistId === 'saved-tracks') {
      setPlaylist({
        name: 'Saved Tracks',
        images: [
          {
            url: SAVED_TRACK_IMAGE_URL,
          },
        ],
      } as any as SpotifyApi.SinglePlaylistResponse);
    } else {
      spotify.getPlaylist(playlistId).then(result => {
        setPlaylist(result);
      });
    }

    fetchTracks();
  }, [playlistId, spotify]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton title="cancel" onPress={cancel}>
          <CLoseIcon />
        </IconButton>
      ),
    });
  }, [navigation, cancel]);

  const renderItem = (
    render: ListRenderItemInfo<SpotifyApi.TrackObjectFull>,
  ) => {
    const track = render.item;
    return (
      <Track
        track={{
          id: track.id,
          name: track.name,
          artists: track.artists.map(artist => artist.name).join(', '),
          duration_ms: track.duration_ms,
          index: render.index,
          image: track.album.images[0]?.url,
          pin: 'XXXX',
        }}
        onPress={toggleTrack(track.id)}
        selected={selectedTracks.includes(track.id)}
      />
    );
  };

  return (
    <View>
      <VirtualizedListWithHeader
        navigation={navigation}
        scrollHeightTrigger={230}
        title={playlist?.name}
        style={[styles.container]}
        ListHeaderComponent={
          <ListHeader
            name={playlist?.name}
            imageUri={playlist?.images[0]?.url}
          />
        }
        data={tracks}
        initialNumToRender={4}
        scrollEventThrottle={30}
        renderItem={renderItem}
        getItemCount={data => data.length}
        getItem={(data, index) => data[index]}
        keyExtractor={item => item.id}
      />
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
    marginBottom: 24,
  },
});
