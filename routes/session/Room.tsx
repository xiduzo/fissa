import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Action from '../../components/atoms/Action';
import Button from '../../components/atoms/Button';
import Fab from '../../components/atoms/Fab';
import AddIcon from '../../components/atoms/icons/AddIcon';
import ArrowLeftIcon from '../../components/atoms/icons/ArrowLeftIcon';
import QuestionMarkIcon from '../../components/atoms/icons/QuestionMarkIcon';
import Typography from '../../components/atoms/Typography';
import ListItem from '../../components/molecules/ListItem';
import Popover from '../../components/molecules/Popover';
import {Color} from '../../types/Color';
import {RootStackParamList} from '../Routes';
import {randSong, randSinger} from '@ngneat/falso';

interface RoomProps
  extends NativeStackScreenProps<RootStackParamList, 'Room'> {}

const Room: FC<RoomProps> = ({navigation, ...props}) => {
  const backToTopOffset = useRef(new Animated.Value(-80));
  const [addingTracks, setAddingTracks] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string>();

  const scrollRef = useRef<ScrollView>();

  const animate = (config?: Partial<Animated.SpringAnimationConfig>) => {
    Animated.spring(backToTopOffset.current, {
      toValue: -80,
      useNativeDriver: false,
      ...(config ?? {}),
    }).start();
  };

  const animateIn = () =>
    animate({
      toValue: 30,
    });

  const startAddingTracks = () => setAddingTracks(true);
  const stopAddingTracks = () => setAddingTracks(false);

  const openSpotify = () => Linking.openURL('https://open.spotify.com');
  const addFromPlaylist = () => {
    navigation.navigate('AddFromPlaylist');
    stopAddingTracks();
  };

  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollHeight = event.nativeEvent.contentOffset.y;

    if (scrollHeight < 500) return animate();

    animateIn();
  };
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({y: 0, animated: true});
  };

  const tracks = useRef(
    Array.from({length: 150}).map((_, i) => ({
      id: i.toString(),
      title: randSong(),
      subtitle: randSinger({length: 4}).join(', '),
    })),
  );

  return (
    <View>
      <ScrollView
        // @ts-ignore-next-line
        ref={scrollRef}
        style={[styles.container]}
        onScroll={scroll}
        scrollEventThrottle={300}>
        <Typography variant="h2" style={{marginBottom: 16}}>
          Now Playing
        </Typography>
        <ListItem imageUri="" title="Mojo so dope" subtitle="Kid Cudi" />
        <View style={styles.queue}>
          <Typography variant="h2">Queue</Typography>
          <Typography variant="h2" style={{fontWeight: '300'}}>
            ({tracks.current.length})
          </Typography>
        </View>
        <Action
          title="Up vote song"
          icon={
            <ArrowLeftIcon
              style={{
                tintColor: Color.light + '40',
                transform: [{rotate: '90deg'}],
              }}
            />
          }
          subtitle="And it will move up in the queue"
        />
        {tracks.current.map(track => (
          <ListItem
            imageUri=""
            onPress={() => setSelectedTrack(track.id)}
            onLongPress={() => Alert.alert(`long press ${track.title}`)}
            key={track.id}
            title={track.title}
            subtitle={track.subtitle}
            end={
              <View style={{flexDirection: 'row'}}>
                <Typography variant="bodyM">14</Typography>
                <QuestionMarkIcon />
              </View>
            }
          />
        ))}
        <View style={{height: 120}} />
        <Popover visible={addingTracks} onRequestClose={stopAddingTracks}>
          <Typography variant="h2" style={styles.popoverText}>
            Add songs
          </Typography>
          <Typography variant="h6" style={styles.popoverText}>
            Copy A Spotify song link or browse in your Spotify playlists
          </Typography>
          <View style={styles.popoverButtons}>
            <View style={{marginBottom: 16}}>
              <Button
                onPress={addFromPlaylist}
                inverted
                title="Browse my Spotify playlists"
              />
            </View>
            <Button
              onPress={openSpotify}
              inverted
              title="Copy song link in Spotify"
            />
          </View>
        </Popover>
        <Popover
          visible={!!selectedTrack}
          onRequestClose={() => setSelectedTrack(undefined)}>
          <ListItem
            imageUri=""
            title={'Track ' + selectedTrack}
            subtitle={'Kid cudi'}
            inverted
            hasBorder
          />
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Color.dark + '10',
              marginVertical: 16,
            }}
          />
          <Action
            title="Up vote song"
            inverted
            active
            icon={
              <ArrowLeftIcon
                style={{
                  tintColor: Color.main,
                  transform: [{rotate: '90deg'}],
                }}
              />
            }
            subtitle="And it will move up in the queue"
          />
          <Action
            title="Down vote song"
            inverted
            icon={
              <ArrowLeftIcon
                style={{
                  tintColor: Color.dark + '40',
                  transform: [{rotate: '-90deg'}],
                }}
              />
            }
            subtitle="And it will move down in the queue"
          />
        </Popover>
      </ScrollView>
      <LinearGradient
        colors={[Color.dark + '00', Color.dark]}
        style={styles.gradient}
      />
      <Fab title="Add songs" onPress={startAddingTracks}>
        <AddIcon style={{tintColor: Color.dark}} />
      </Fab>
      <Animated.View
        style={[
          styles.backToTop,
          {
            bottom: backToTopOffset.current,
          },
        ]}>
        <Button
          title="Back to top"
          variant="outlined"
          size="small"
          inverted
          onPress={scrollToTop}
          end={<QuestionMarkIcon />}
        />
      </Animated.View>
    </View>
  );
};

export default Room;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  queue: {
    marginBottom: 16,
    marginTop: 40,
    flexDirection: 'row',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 100,
    width: '100%',
  },
  backToTop: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popoverText: {
    color: Color.dark,
    textAlign: 'center',
  },
  popoverButtons: {
    marginTop: 32,
  },
});
