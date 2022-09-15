import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useCallback, useMemo, useRef} from 'react';
import {
  Animated,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  VirtualizedList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../components/atoms/Button';
import EmptyState from '../../components/atoms/EmptyState';
import ArrowUpIcon from '../../components/atoms/icons/ArrowUpIcon';
import Typography from '../../components/atoms/Typography';
import Track from '../../components/molecules/ListItem.Track';
import {useSpotify} from '../../providers/SpotifyProvider';
import {Color} from '../../types/Color';
import {RootStackParamList} from '../Routes';
import RoomAddTracksFab from './Room.AddTracksFab';
import RoomDetails from './Room.Details';
import {useRoomPlaylist} from './Room.PlaylistContext';
import RoomTrack from './Room.Track';
import {request} from '../../lib/utils/api';

interface RoomProps
  extends NativeStackScreenProps<RootStackParamList, 'Room'> {}

const SCROLL_TOP_OFFSET = -100;

const Room: FC<RoomProps> = ({route, navigation}) => {
  const {pin} = route.params;
  const {tracks, room, votes, activeTrack, leaveRoom} = useRoomPlaylist(pin);
  const {spotify} = useSpotify();

  const backToTopOffset = useRef(new Animated.Value(SCROLL_TOP_OFFSET));
  const mySpotifyId = useRef('');
  const scrollRef =
    useRef<VirtualizedList<SpotifyApi.PlaylistTrackObject>>(null);

  useMemo(async () => {
    const me = await spotify.getMe();

    mySpotifyId.current = me?.id ?? '';
  }, [spotify]);

  const activeTrackIndex = room?.currentIndex ?? -1;
  const queue = tracks.slice(activeTrackIndex + 1, tracks.length);

  const animateBackToTop = (
    config?: Partial<Animated.SpringAnimationConfig>,
  ) => {
    Animated.spring(backToTopOffset.current, {
      toValue: SCROLL_TOP_OFFSET,
      useNativeDriver: false,
      ...(config ?? {}),
    }).start();
  };

  const animateIn = () =>
    animateBackToTop({
      toValue: 32,
    });

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

  const renderTrack = useCallback(
    (render: ListRenderItemInfo<SpotifyApi.PlaylistTrackObject>) => {
      const track = render.item.track as SpotifyApi.TrackObjectFull;
      const trackVotes = votes[track.uri];
      const myVote = trackVotes?.votes?.find(
        vote => vote.createdBy === mySpotifyId.current,
      );

      return (
        <RoomTrack
          track={track}
          pin={pin}
          totalVotes={trackVotes?.total}
          myVote={myVote?.state}
          isUpcomingTrack={render.index === 0}
        />
      );
    },
    [votes, pin],
  );

  const restartPlaylist = async () => {
    await request('POST', '/room/play', {pin});
  };

  if (!room?.pin)
    return (
      <View style={{flex: 1, marginTop: 24}}>
        <View style={[styles.header, {padding: 24}]}>
          <Typography variant="h2">&nbsp;</Typography>
          <RoomDetails
            pin={pin}
            navigation={navigation}
            leaveRoom={leaveRoom}
          />
        </View>
        <EmptyState
          icon="🐕"
          title="Fetching fissa details"
          subtitle="Good boy"
        />
      </View>
    );

  if (!tracks.length)
    return (
      <View style={{flex: 1, marginTop: 24}}>
        <View style={[styles.header, {padding: 24}]}>
          <Typography variant="h2">&nbsp;</Typography>
          <RoomDetails
            pin={pin}
            navigation={navigation}
            leaveRoom={leaveRoom}
          />
        </View>
        <EmptyState
          icon="🦨"
          title="This fissa stinks"
          subtitle="Add tracks to get the fissa started"
        />
        <RoomAddTracksFab navigation={navigation} />
      </View>
    );

  if (activeTrackIndex === -1) {
    return (
      <View style={{flex: 1, marginTop: 24}}>
        <View style={[styles.header, {padding: 24}]}>
          <Typography variant="h2">&nbsp;</Typography>
          <RoomDetails
            pin={pin}
            playlistId={room.playlistId}
            navigation={navigation}
            leaveRoom={leaveRoom}
          />
        </View>
        <EmptyState
          icon="🦥"
          title="This fissa is over"
          subtitle={
            room?.createdBy !== mySpotifyId.current ? (
              'Poke your host to re-start this fissa'
            ) : (
              <Button title="restart fissa" onPress={restartPlaylist} />
            )
          }
        />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <VirtualizedList<SpotifyApi.PlaylistTrackObject>
        style={styles.container}
        ref={scrollRef}
        ListFooterComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 150,
              marginBottom: 150,
            }}>
            <Typography variant="h1" gutterBottom>
              🦦
            </Typography>
            <Typography variant="bodyM">Nothing to see here</Typography>
          </View>
        }
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Typography variant="h2">Now Playing</Typography>
              <RoomDetails
                pin={pin}
                playlistId={room.playlistId}
                navigation={navigation}
                leaveRoom={leaveRoom}
              />
            </View>
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
              <Typography variant="bodyM" style={{opacity: 0.6}}>
                {Math.max(0, queue.length)} tracks
              </Typography>
            </View>
          </>
        }
        data={queue}
        initialNumToRender={5}
        scrollEventThrottle={300}
        onScroll={scroll}
        renderItem={renderTrack}
        getItemCount={() => queue.length}
        getItem={(data, index) => data[index]}
        keyExtractor={(item, index) => item.track.id + index}
      />
      <LinearGradient
        colors={[Color.dark + '00', Color.dark]}
        style={styles.gradient}
      />
      <RoomAddTracksFab navigation={navigation} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
});
