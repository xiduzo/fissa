import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useRef} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Typography from '../../components/atoms/Typography';
import ListItem from '../../components/molecules/ListItem';
import {RootStackParamList} from '../Routes';
import {AddContextBottomDrawer} from './Room.AddContext';
import {randMusicGenre, randFullName, randNumber} from '@ngneat/falso';

interface AddFromPlaylistProps
  extends NativeStackScreenProps<RootStackParamList, 'AddFromPlaylist'> {}

const AddFromPlaylist: FC<AddFromPlaylistProps> = ({navigation, ...props}) => {
  const gotoPlaylist = (playlistId: string) => () =>
    navigation.navigate('SelectTracks', {playlistId});

  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollHeight = event.nativeEvent.contentOffset.y;

    if (scrollHeight < 35)
      return navigation.setOptions({headerTitle: undefined});

    navigation.setOptions({headerTitle: 'Your playlists'});
  };

  const playlists = useRef(
    Array.from({length: 10}).map((_, i) => ({
      id: i.toString(),
      title: randMusicGenre(),
      subtitle: `${randFullName()} • ${randNumber({
        min: 10,
        max: 1500,
      })} songs`,
    })),
  );

  return (
    <View>
      <ScrollView
        style={styles.container}
        onScroll={scroll}
        scrollEventThrottle={30}>
        <Typography style={styles.title} variant="h1">
          Your playlists
        </Typography>
        {playlists.current.map(playlist => (
          <ListItem
            imageUri=""
            onPress={gotoPlaylist('playlistId')}
            key={playlist.id}
            title={playlist.title}
            subtitle={playlist.subtitle}
          />
        ))}
      </ScrollView>
      <AddContextBottomDrawer />
    </View>
  );
};

export default AddFromPlaylist;

const styles = StyleSheet.create({
  title: {
    marginBottom: 32,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: '100%',
    marginBottom: 190,
  },
});
