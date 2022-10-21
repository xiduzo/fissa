import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import ScrollViewWithHeaderTitle from '../../components/atoms/ScrollViewWithHeaderTitle';
import Typography from '../../components/atoms/Typography';
import {RootStackParamList} from '../Routes';
import Playlists from '../../components/organisms/Playlists';
import BaseView from '../../components/templates/BaseView';
import Track from '../../components/molecules/ListItem.Track';
import {SAVED_TRACKS_PLAYLIST_ID} from '../../lib/constants/Playlist';
import {useSpotify} from '../../providers/SpotifyProvider';
import Notification from '../../utils/Notification';

interface SaveToPlaylistProps
  extends NativeStackScreenProps<RootStackParamList, 'SaveToPlaylist'> {}

const SaveToPlaylist: FC<SaveToPlaylistProps> = ({navigation, route}) => {
  const {track} = route.params;
  const {spotify} = useSpotify();

  const saveToPlaylist = useCallback(
    async (playlist: SpotifyApi.PlaylistObjectSimplified) => {
      console.log(playlist, track.id, track.name);
      try {
        if (playlist.id === SAVED_TRACKS_PLAYLIST_ID) {
          await spotify.addToMySavedTracks([track.id]);
        } else {
          await spotify.addTracksToPlaylist(playlist.id, [
            `spotify:track:${track.id}`,
          ]);
        }

        Notification.show({
          type: 'success',
          icon: '🎶',
          message: `${track.name} has been added to ${playlist.name}`,
        });
      } catch {
        Notification.show({
          type: 'warning',
          message: 'Could not add track to playlist',
        });
      } finally {
        navigation.goBack();
      }
    },
    [navigation],
  );

  const title = `Add to playlist`;
  return (
    <BaseView noPadding>
      <ScrollViewWithHeaderTitle
        title={title}
        navigation={navigation}
        style={styles.container}
        scrollEventThrottle={30}>
        <View style={{marginBottom: 16}}>
          <Track imageStyle={{width: 125, height: 125}} track={track} />
        </View>
        <Typography variant="h1" gutter={32}>
          {title}
        </Typography>
        <Playlists onPlaylistPress={saveToPlaylist} />
      </ScrollViewWithHeaderTitle>
    </BaseView>
  );
};

export default SaveToPlaylist;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
});
