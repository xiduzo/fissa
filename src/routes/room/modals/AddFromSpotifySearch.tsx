import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect} from 'react';
import {ListRenderItemInfo, StyleSheet} from 'react-native';
import Typography from '../../../components/atoms/Typography';
import {useAddContext} from '../../../providers/AddTracksProvider';
import {RootStackParamList} from '../../../lib/interfaces/StackParams';
import {AddContextBottomDrawer} from './AddTracksBottomDrawer';
import VirtualizedListWithHeader from '../../../components/atoms/VirtualizedListWithHeader';
import Spacer from '../../../components/atoms/Spacer';
import Track from '../../../components/molecules/ListItem.Track';
import {useSpotify} from '../../../providers/SpotifyProvider';
import EmptyState from '../../../components/atoms/EmptyState';

interface AddFromSpotifySearchProps
  extends NativeStackScreenProps<RootStackParamList, 'AddFromSpotifySearch'> {}

const AddFromSpotifySearch: FC<AddFromSpotifySearchProps> = ({navigation}) => {
  const {search, addTrack, removeTrack, selectedTracks} = useAddContext();
  const {spotify} = useSpotify();

  const [tracks, setTracks] = React.useState<SpotifyApi.TrackObjectFull[]>([]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!search) {
        setTracks([]);
        return;
      }

      spotify.search(search, ['track'], {limit: 50}).then(response => {
        setTracks(response.tracks?.items ?? []);
      });
    }, 300);

    return () => clearTimeout(debounce);
  }, [search]);

  const handleTrackPress = (trackId: string) => () => {
    selectedTracks.includes(trackId) ? removeTrack(trackId) : addTrack(trackId);
  };

  const renderItem = (
    render: ListRenderItemInfo<SpotifyApi.TrackObjectFull>,
  ) => {
    const track = render.item;
    return (
      <Track
        track={{
          ...track,
          artists: track.artists
            .map(artist => artist?.name ?? artist)
            .join(', '),
          index: render.index,
          image: track.album.images[0]?.url,
          pin: 'XXXX',
        }}
        onPress={handleTrackPress(track.id)}
        selected={selectedTracks.includes(track.id)}
      />
    );
  };

  const title = 'Search in Spotify';

  return (
    <>
      <VirtualizedListWithHeader
        navigation={navigation}
        title={title}
        ListHeaderComponent={<Typography variant="h1">{title}</Typography>}
        ListEmptyComponent={
          <EmptyState
            icon="🦑"
            title="No results found"
            subtitle="Search below to find tracks"
          />
        }
        style={styles.container}
        ListFooterComponent={<Spacer size={300} />}
        data={tracks}
        initialNumToRender={6}
        scrollEventThrottle={30}
        renderItem={renderItem}
        getItemCount={data => data.length}
        getItem={(data, index) => data[index]}
        keyExtractor={item => item.id}
      />
      <AddContextBottomDrawer filterText="Search in spotify" />
    </>
  );
};

export default AddFromSpotifySearch;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    minHeight: '100%',
  },
});
