import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Button from '../../components/atoms/Button';
import ScrollViewWithHeaderTitle from '../../components/atoms/ScrollViewWithHeaderTitle';
import Typography from '../../components/atoms/Typography';
import Playlist from '../../components/molecules/ListItem.Playlist';
import Popover from '../../components/molecules/Popover';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import {Color} from '../../types/Color';
import {RootStackParamList} from '../Routes';
import {Room} from './Room.PlaylistContext';

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

  const selectPlaylist =
    (playlist: SpotifyApi.PlaylistObjectSimplified) => () => {
      setSelectedPlaylist(playlist);
    };
  const closePopOver = () => setSelectedPlaylist(undefined);

  const startFromPlaylist = async () => {
    if (!selectedPlaylist) return;

    setWaitForResponse(true);

    try {
      const {
        content: {pin},
      } = await request<Room>('POST', '/room', {
        accessToken: spotify.getAccessToken(),
        playlistId: selectedPlaylist.id,
      });

      closePopOver();
      navigation.popToTop();
      navigation.replace('Room', {pin});
    } catch (error) {
      setWaitForResponse(false);
    }
  };

  useEffect(() => {
    spotify.getUserPlaylists().then(result => setPlaylists(result.items));
    console.log(spotify.getAccessToken());
    spotify.getMySavedTracks({}).then(console.log);
  }, [spotify]);

  return (
    <ScrollViewWithHeaderTitle
      title="Your playlists"
      style={styles.scrollView}
      navigation={navigation}
      scrollEventThrottle={30}>
      <Typography variant="h1" style={{marginBottom: 24}}>
        Select Playlist
      </Typography>
      {playlists.map(playlist => (
        <Playlist
          playlist={playlist}
          key={playlist.id}
          onPress={selectPlaylist(playlist)}
        />
      ))}
      <Popover visible={!!selectedPlaylist} onRequestClose={closePopOver}>
        <Typography variant="h2" style={styles.text}>
          Your group session will start based on
        </Typography>

        <Playlist playlist={selectedPlaylist} inverted hasBorder />

        <Button
          title="Let's kick it!"
          inverted
          onPress={startFromPlaylist}
          disabled={waitForResponse}
        />
      </Popover>
    </ScrollViewWithHeaderTitle>
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
