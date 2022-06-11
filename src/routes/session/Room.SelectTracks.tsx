import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useRef} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Typography from '../../components/atoms/Typography';
import ListItem from '../../components/molecules/ListItem';
import {RootStackParamList} from '../Routes';
import {AddContextBottomDrawer, useAddContext} from './Room.AddContext';
import {randSong, randSinger} from '@ngneat/falso';

interface SelectTracksProps
  extends NativeStackScreenProps<RootStackParamList, 'SelectTracks'> {}

const SelectTracks: FC<SelectTracksProps> = ({navigation, ...props}) => {
  const {selectedTracks, addTrack, removeTrack} = useAddContext();

  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollHeight = event.nativeEvent.contentOffset.y;

    if (scrollHeight < 230)
      return navigation.setOptions({headerTitle: undefined});

    navigation.setOptions({headerTitle: 'Playlist title here'});
  };

  const toggleTrack = (trackId: string) => () => {
    if (selectedTracks.includes(trackId)) {
      removeTrack(trackId);
      return;
    }

    addTrack(trackId);
  };

  const tracks = useRef(
    Array.from({length: 10}).map((_, i) => ({
      id: i.toString(),
      title: randSong(),
      subtitle: randSinger({length: 4}).join(', '),
    })),
  );

  return (
    <View>
      <ScrollView
        onScroll={scroll}
        scrollEventThrottle={30}
        style={[styles.container]}>
        <Image
          style={styles.image}
          source={{uri: 'https://reactjs.org/logo-og.png'}}
        />
        <Typography variant="h1" style={{marginVertical: 24}}>
          Playlist title here
        </Typography>
        {tracks.current.map(track => (
          <ListItem
            imageUri=""
            key={track.id}
            onPress={toggleTrack(track.id)}
            selected={selectedTracks.includes(track.id)}
            title={track.title}
            subtitle={track.subtitle}
          />
        ))}
      </ScrollView>
      <AddContextBottomDrawer />
    </View>
  );
};

export default SelectTracks;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: '100%',
    marginBottom: 200,
  },
  image: {
    borderRadius: 8,
    width: 175,
    height: 175,
  },
});
