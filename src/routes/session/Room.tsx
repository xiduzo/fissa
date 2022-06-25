import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  ImageStyle,
  Linking,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  View,
  VirtualizedList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Action from '../../components/atoms/Action';
import Button from '../../components/atoms/Button';
import Fab from '../../components/atoms/Fab';
import ArrowDownIcon from '../../components/atoms/icons/ArrowDownIcon';
import ArrowUpIcon from '../../components/atoms/icons/ArrowUpIcon';
import MoreIcon from '../../components/atoms/icons/MoreIcon';
import PlusIcons from '../../components/atoms/icons/PlusIcon';
import Typography from '../../components/atoms/Typography';
import Track from '../../components/molecules/ListItem.Track';
import Popover from '../../components/molecules/Popover';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import {Color} from '../../types/Color';
import {RootStackParamList} from '../Routes';
import {useRoomPlaylist} from './Room.PlaylistContext';

interface RoomProps
  extends NativeStackScreenProps<RootStackParamList, 'Room'> {}

const Room: FC<RoomProps> = ({route, navigation}) => {
  const {pin} = route.params;

  const backToTopOffset = useRef(new Animated.Value(-100));
  const [addingTracks, setAddingTracks] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const {tracks, room, votes, activeTrack} = useRoomPlaylist(pin);

  const {spotify} = useSpotify();

  const activeTrackIndex = useMemo(() => {
    return activeTrack?.currentIndex ?? -1;
  }, [activeTrack]);

  const tracksToShow = useMemo(() => {
    return tracks.slice(1 + activeTrackIndex, tracks.length);
  }, [tracks, activeTrackIndex]);

  const [selectedTrack, setSelectedTrack] =
    useState<SpotifyApi.TrackObjectFull>();

  const scrollRef =
    useRef<VirtualizedList<SpotifyApi.PlaylistTrackObject>>(null);

  const animateBackToTop = (
    config?: Partial<Animated.SpringAnimationConfig>,
  ) => {
    Animated.spring(backToTopOffset.current, {
      toValue: -100,
      useNativeDriver: false,
      ...(config ?? {}),
    }).start();
  };

  const animateIn = () =>
    animateBackToTop({
      toValue: 32,
    });

  const startAddingTracks = () => setAddingTracks(true);
  const stopAddingTracks = () => setAddingTracks(false);
  const selectTrack = (track: SpotifyApi.TrackObjectFull) => () =>
    setSelectedTrack(track);

  const openSpotify = () => Linking.openURL('https://open.spotify.com');
  const addFromPlaylist = () => {
    navigation.navigate('AddTracks');
    stopAddingTracks();
  };

  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollHeight = event.nativeEvent.contentOffset.y;

    if (scrollHeight < 500) {
      return animateBackToTop();
    }

    animateIn();
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollToIndex({
      index: 0,
      viewOffset: 500,
    });
  };

  const renderItem = (
    render: ListRenderItemInfo<SpotifyApi.PlaylistTrackObject>,
  ) => {
    const track = render.item.track as SpotifyApi.TrackObjectFull;
    const trackVotes = votes[track.uri];
    const count = trackVotes?.total ?? 0;

    const trackEndIcon = (_votes: number): JSX.Element => {
      const style: StyleProp<ImageStyle> = {
        tintColor: _votes !== 0 ? Color.main : Color.light,
      };

      if (_votes !== 0) {
        if (_votes > 0) {
          return <ArrowUpIcon style={style} />;
        }
        return <ArrowDownIcon style={style} />;
      }

      return <MoreIcon style={style} />;
    };

    return (
      <Track
        track={track}
        onPress={selectTrack(track)}
        onLongPress={() => Alert.alert(`long press ${track.name}`)}
        end={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {count !== 0 && (
              <Typography variant="bodyM" style={{marginRight: 4}}>
                {count}
              </Typography>
            )}
            {trackEndIcon(count)}
          </View>
        }
      />
    );
  };

  const castVote = (state: 'up' | 'down') => () => {
    request('POST', '/room/vote', {
      state,
      accessToken: spotify.getAccessToken(),
      pin,
      trackUri: selectedTrack?.uri,
    }).finally(() => setSelectedTrack(undefined));
  };

  if (!room?.pin) {
    return null;
  }

  return (
    <View style={{flex: 1}}>
      <VirtualizedList<SpotifyApi.PlaylistTrackObject>
        style={styles.container}
        ref={scrollRef}
        ListFooterComponent={<View style={{paddingBottom: 100}} />}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Typography variant="h2">Now Playing</Typography>
              <Typography
                variant="bodyM"
                onPress={() => setShowRoomDetails(true)}>
                {pin}
              </Typography>
            </View>
            {activeTrackIndex < 0 && <Typography>Loading....</Typography>}
            <Track
              imageStyle={{width: 125, height: 125}}
              track={
                tracks[activeTrackIndex]?.track as SpotifyApi.TrackObjectFull
              }
              isPlaying={activeTrack?.is_playing}
              progressMs={activeTrack?.progress_ms ?? 0}
            />
            <View style={styles.queue}>
              <Typography variant="h2">Queue</Typography>
              <Typography variant="h2" style={{fontWeight: '300'}}>
                ({Math.max(0, tracksToShow.length)})
              </Typography>
            </View>
          </>
        }
        data={tracksToShow}
        initialNumToRender={5}
        scrollEventThrottle={300}
        onScroll={scroll}
        renderItem={renderItem}
        getItemCount={() => tracksToShow.length}
        getItem={(data, index) => data[index]}
        keyExtractor={(item, index) => item.track.id + index}
      />
      <Popover
        visible={!!showRoomDetails}
        onRequestClose={() => setShowRoomDetails(false)}>
        <Typography variant="h2" style={styles.popoverText}>
          {pin}
        </Typography>
        <Action
          title="Leave session"
          subtitle="No worries, you can always come back"
          inverted
          onPress={() => navigation.replace('Home')}
          icon={
            <ArrowUpIcon
              style={{
                tintColor: Color.main,
              }}
            />
          }
        />
      </Popover>
      <Popover visible={!!addingTracks} onRequestClose={stopAddingTracks}>
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
        <Track track={selectedTrack} inverted hasBorder />
        <View
          style={{
            borderBottomWidth: 2,
            borderBottomColor: Color.dark + '10',
            marginVertical: 16,
          }}
        />
        <Action
          title="Up vote song"
          inverted
          onPress={castVote('up')}
          active
          icon={<ArrowUpIcon />}
          subtitle="And it will move up in the queue"
        />
        <Action
          title="Down vote song"
          inverted
          onPress={castVote('down')}
          icon={<ArrowDownIcon style={{tintColor: Color.main}} />}
          subtitle="And it will move down in the queue"
        />
      </Popover>
      <LinearGradient
        colors={[Color.dark + '00', Color.dark]}
        style={styles.gradient}
      />
      <Fab title="Add songs" onPress={startAddingTracks}>
        <PlusIcons style={{tintColor: Color.dark}} />
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
          end={<ArrowUpIcon />}
        />
      </Animated.View>
    </View>
  );
};

export default Room;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 68,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  queue: {
    marginBottom: 12,
    marginTop: 38,
    flexDirection: 'row',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 100,
    width: '100%',
    backgroundColor: 'transparent',
  },
  backToTop: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  popoverText: {
    color: Color.dark,
    textAlign: 'center',
  },
  popoverButtons: {
    marginTop: 32,
  },
});
