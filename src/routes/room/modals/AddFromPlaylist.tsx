import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useCallback, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import IconButton from '../../../components/atoms/IconButton';
import CloseIcon from '../../../components/atoms/icons/CloseIcon';
import ScrollViewWithHeaderTitle from '../../../components/atoms/ScrollViewWithHeaderTitle';
import Typography from '../../../components/atoms/Typography';
import {
  AddContextBottomDrawer,
  useAddContext,
} from '../../../providers/AddTracksProvider';
import Playlists from '../../../components/organisms/Playlists';
import BaseView from '../../../components/templates/BaseView';
import Spacer from '../../../components/atoms/Spacer';
import {SharedElementStackParamList} from '../../../lib/interfaces/StackParams';

interface AddFromPlaylistProps
  extends NativeStackScreenProps<
    SharedElementStackParamList,
    'AddFromPlaylist'
  > {}

const AddFromPlaylist: FC<AddFromPlaylistProps> = ({navigation}) => {
  const {cancel} = useAddContext();

  const gotoPlaylist = useCallback(
    (playlist: SpotifyApi.PlaylistObjectSimplified) => {
      navigation.navigate('SelectTracks', {playlistId: playlist.id});
    },
    [navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton title="cancel" onPress={cancel}>
          <CloseIcon />
        </IconButton>
      ),
    });
  }, [navigation, cancel]);

  const title = 'Your playlists';
  return (
    <BaseView noPadding>
      <ScrollViewWithHeaderTitle
        title={title}
        navigation={navigation}
        style={styles.container}
        scrollEventThrottle={30}>
        <Typography variant="h1" gutter={32}>
          {title}
        </Typography>
        <Playlists onPlaylistPress={gotoPlaylist} />
        <Spacer size={300} />
      </ScrollViewWithHeaderTitle>
      <AddContextBottomDrawer />
    </BaseView>
  );
};

export default AddFromPlaylist;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
});
