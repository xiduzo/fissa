import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useRef, useState} from 'react';
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
import {Color} from '../../types/Color';
import Notification from '../../utils/Notification';
import {RootStackParamList} from '../Routes';
import {randMusicGenre, randFullName, randNumber} from '@ngneat/falso';

interface FromPlaylistProps
  extends NativeStackScreenProps<RootStackParamList, 'FromPlaylist'> {}

const FromPlaylist: FC<FromPlaylistProps> = ({navigation}) => {
  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined,
  );

  const closePopOver = () => setSelectedItem(undefined);

  const startFromPlaylist = () => {
    closePopOver();
    Notification.show({
      message: 'Aye, your playlist has been imported successfully!',
      icon: '🎉',
    });
    navigation.popToTop();
    navigation.replace('Room');
  };

  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollHeight = event.nativeEvent.contentOffset.y;

    if (scrollHeight < 35)
      return navigation.setOptions({headerTitle: undefined});

    navigation.setOptions({headerTitle: 'Select playlist'});
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
    <ScrollView
      style={styles.scrollView}
      onScroll={scroll}
      scrollEventThrottle={30}>
      <Typography variant="h1" style={{marginBottom: 24}}>
        Select Playlist
      </Typography>
      {playlists.current.map(playlist => (
        <ListItem
          imageUri=""
          onPress={() => setSelectedItem(playlist.id)}
          key={playlist.id}
          title={playlist.title}
          subtitle={playlist.subtitle}
        />
      ))}
      <Popover visible={!!selectedItem} onRequestClose={closePopOver}>
        <Typography variant="h2" style={styles.text}>
          Your group session will start based on
        </Typography>
        <ListItem
          imageUri=""
          title="FIRE FIRE FIRE"
          subtitle="Milan van der Maaten • 1.502 songs"
          inverted
          hasBorder
        />
        <Button title="Let's kick it!" inverted onPress={startFromPlaylist} />
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
