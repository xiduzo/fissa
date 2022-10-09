import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import IconButton from '../../components/atoms/IconButton';
import CLoseIcon from '../../components/atoms/icons/CloseIcon';
import ScrollViewWithHeaderTitle from '../../components/atoms/ScrollViewWithHeaderTitle';
import Typography from '../../components/atoms/Typography';
import {SharedElementStackParamList} from '../Routes';
import {AddContextBottomDrawer, useAddContext} from './Room.AddContext';
import Playlists from '../../components/organisms/Playlists';

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
          <CLoseIcon />
        </IconButton>
      ),
    });
  }, [navigation, cancel]);

  const title = 'Your playlists';
  return (
    <View>
      <ScrollViewWithHeaderTitle
        title={title}
        navigation={navigation}
        style={styles.container}
        scrollEventThrottle={30}>
        <Typography variant="h1" gutter={32}>
          {title}
        </Typography>
        <Playlists onPlaylistPress={gotoPlaylist} />
      </ScrollViewWithHeaderTitle>
      <AddContextBottomDrawer />
    </View>
  );
};

export default AddFromPlaylist;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: '100%',
    marginBottom: 200,
  },
});
