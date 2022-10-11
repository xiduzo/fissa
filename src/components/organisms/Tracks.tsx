import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
import {ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {SAVED_TRACK_IMAGE_URL} from '../../lib/constants/Images';
import {useSpotify} from '../../providers/SpotifyProvider';
import Image from '../atoms/Image';
import Typography from '../atoms/Typography';
import VirtualizedListWithHeader from '../atoms/VirtualizedListWithHeader';
import Track from '../molecules/ListItem.Track';

interface TracksProps {
  playlistId?: string;
  selectedTracks: string[];
  navigation: NativeStackNavigationProp<any, any, undefined>;
  toggleTrack?: (trackId: string) => void;
}

const Tracks: FC<TracksProps> = ({
  playlistId,
  navigation,
  selectedTracks,
  toggleTrack,
}) => {
  const {spotify} = useSpotify();

  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [playlist, setPlaylist] = useState<SpotifyApi.SinglePlaylistResponse>();

  const handleTrackPress = (trackId: string) => () => {
    toggleTrack && toggleTrack(trackId);
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

  useEffect(() => {
    if (!playlistId) return;

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

  return (
    <VirtualizedListWithHeader
      navigation={navigation}
      scrollHeightTrigger={230}
      title={playlist?.name ?? ''}
      style={styles.container}
      ListHeaderComponent={
        <>
          <Image
            style={styles.image}
            source={{
              uri: playlist?.images[0]?.url,
            }}
          />
          <Typography variant="h1" gutter={24}>
            {playlist?.name}
          </Typography>
        </>
      }
      ListFooterComponent={<View style={styles.view} />}
      data={tracks}
      initialNumToRender={6}
      scrollEventThrottle={30}
      renderItem={renderItem}
      getItemCount={data => data.length}
      getItem={(data, index) => data[index]}
      keyExtractor={item => item.id}
    />
  );
};

export default Tracks;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    minHeight: '100%',
  },
  view: {
    paddingBottom: 300,
  },
  image: {
    borderRadius: 8,
    width: 175,
    height: 175,
    marginBottom: 24,
  },
});