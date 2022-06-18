import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import ListItem from '../../components/molecules/ListItem';
import Popover from '../../components/molecules/Popover';
import {DEFAULT_IMAGE} from '../../lib/constants/Image';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import {Color} from '../../types/Color';
import Notification from '../../utils/Notification';
import {RootStackParamList} from '../Routes';

interface FromPlaylistProps
  extends NativeStackScreenProps<RootStackParamList, 'FromPlaylist'> {}

const FromPlaylist: FC<FromPlaylistProps> = ({navigation}) => {
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<SpotifyApi.PlaylistObjectSimplified>();
  const {spotify} = useSpotify();
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);

  const [waitForResponse, setWaitForResponse] = useState(false);

  const closePopOver = () => setSelectedPlaylist(undefined);

  const startFromPlaylist = () => {
    if (!selectedPlaylist) return;
    setWaitForResponse(true);
    request('POST', '/room/create', {
      accessToken: spotify.getAccessToken(),
      playlistId: selectedPlaylist.id,
    })
      .then(async response => {
        if (response.status !== 200) {
          return;
        }

        closePopOver();
        const room = await response.json();
        navigation.popToTop();
        navigation.replace('Room', {pin: room.pin});
      })
      .catch(() => {
        setWaitForResponse(false);
      });
  };

  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollHeight = event.nativeEvent.contentOffset.y;

    if (scrollHeight < 35)
      return navigation.setOptions({headerTitle: undefined});

    navigation.setOptions({headerTitle: 'Select playlist'});
  };

  useEffect(() => {
    spotify.getUserPlaylists().then(result => setPlaylists(result.items));
  }, [spotify.getUserPlaylists]);

  return (
    <ScrollView
      style={styles.scrollView}
      onScroll={scroll}
      scrollEventThrottle={30}>
      <Typography variant="h1" style={{marginBottom: 24}}>
        Select Playlist
      </Typography>
      {playlists.map(playlist => (
        <ListItem
          onPress={() => setSelectedPlaylist(playlist)}
          imageUri={playlist.images[0]?.url ?? DEFAULT_IMAGE}
          key={playlist.id}
          title={playlist.name}
          subtitle={playlist.owner.display_name ?? ''}
        />
      ))}
      <Popover visible={!!selectedPlaylist} onRequestClose={closePopOver}>
        <Typography variant="h2" style={styles.text}>
          Your group session will start based on
        </Typography>

        <ListItem
          imageUri={selectedPlaylist?.images[0]?.url ?? DEFAULT_IMAGE}
          title={selectedPlaylist?.name ?? ''}
          subtitle={selectedPlaylist?.owner.display_name ?? ''}
          inverted
          hasBorder
        />
        <Button
          title="Let's kick it!"
          inverted
          onPress={startFromPlaylist}
          disabled={waitForResponse}
        />
      </Popover>
    </ScrollView>
  );
};

export default FromPlaylist;

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 8,
    paddingHorizontal: 24,
  },
  text: {
    textAlign: 'center',
    marginHorizontal: 52,
    marginBottom: 32,
    color: Color.dark,
  },
});
