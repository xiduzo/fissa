import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import Button from '../../components/atoms/Button';
import ScrollViewWithHeaderTitle from '../../components/atoms/ScrollViewWithHeaderTitle';
import Typography from '../../components/atoms/Typography';
import Playlist from '../../components/molecules/ListItem.Playlist';
import Popover from '../../components/molecules/Popover';
import Playlists from '../../components/organisms/Playlists';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import {RootStackParamList} from '../Routes';

interface FromPlaylistProps
  extends NativeStackScreenProps<RootStackParamList, 'FromPlaylist'> {}

const FromPlaylist: FC<FromPlaylistProps> = ({navigation}) => {
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<SpotifyApi.PlaylistObjectSimplified>();
  const {spotify, refreshToken, currentUser} = useSpotify();

  const title = useRef('Select a playlist');

  const [waitForResponse, setWaitForResponse] = useState(false);

  const selectPlaylist = useCallback(
    (playlist: SpotifyApi.PlaylistObjectSimplified) => {
      setSelectedPlaylist(playlist);
    },
    [],
  );

  const closePopOver = () => setSelectedPlaylist(undefined);

  const startFromPlaylist = async () => {
    if (!selectedPlaylist) return;

    setWaitForResponse(true);

    try {
      const {content: pin} = await request<string>('POST', '/room', {
        accessToken: spotify.getAccessToken(),
        playlistId: selectedPlaylist.id,
        refreshToken,
        createdBy: currentUser?.id,
      });

      closePopOver();
      navigation.popToTop();
      navigation.replace('Room', {pin});
    } catch (error) {
      setWaitForResponse(false);
    }
  };

  return (
    <ScrollViewWithHeaderTitle
      title={title.current}
      style={styles.scrollView}
      navigation={navigation}
      scrollEventThrottle={30}>
      <Typography variant="h1" gutter={24}>
        {title.current}
      </Typography>
      <Playlists onPlaylistPress={selectPlaylist} />
      <Popover visible={!!selectedPlaylist} onRequestClose={closePopOver}>
        <Typography
          variant="h2"
          color="dark"
          align="center"
          style={styles.text}>
          Your fissa will start based on
        </Typography>

        <Playlist playlist={selectedPlaylist} inverted hasBorder />

        <Button
          title="let's kick it!"
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
    marginHorizontal: 52,
    marginBottom: 32,
  },
});
