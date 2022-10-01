import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useCallback, useRef} from 'react';
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
import {Color} from '../../types/Theme';
import {RootStackParamList} from '../Routes';
import RoomAddTracksFab from './Room.AddTracksFab';
import RoomDetails from './Room.Details';
import {Track as TrackInterface, useRoomPlaylist} from './Room.PlaylistContext';
import RoomTrack from './Room.Track';
import {request} from '../../lib/utils/api';

interface RoomProps
  extends NativeStackScreenProps<RootStackParamList, 'Room'> {}

const SCROLL_TOP_OFFSET = -100;

const Room: FC<RoomProps> = ({route, navigation}) => {
  const {pin} = route.params;
  const {tracks, room, votes} = useRoomPlaylist(pin);
  const {currentUser} = useSpotify();

  const backTopTopAnimation = useRef(
    new Animated.Value(SCROLL_TOP_OFFSET),
  ).current;
  const scrollRef = useRef<VirtualizedList<TrackInterface>>(null);

  const activeTrackIndex = room?.currentIndex ?? -1;
  const queue = tracks.slice(activeTrackIndex + 1, tracks.length);

  const animateBackToTop = (
    config?: Partial<Animated.SpringAnimationConfig>,
  ) => {
    Animated.spring(backTopTopAnimation, {
      toValue: SCROLL_TOP_OFFSET,
      useNativeDriver: false,
      ...(config ?? {}),
    }).start();
  };

  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollHeight = event.nativeEvent.contentOffset.y;

    if (scrollHeight < 500) return animateBackToTop();

    animateBackToTop({
      toValue: 32,
    });
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollToIndex({
      index: 0,
      viewOffset: 500,
    });
  };

  const renderTrack = (render: ListRenderItemInfo<TrackInterface>) => {
    const {item} = render;
    const trackVotes = votes[item.id];

    const myVote = trackVotes?.find(vote => vote.createdBy === currentUser?.id);

    const total = trackVotes?.reduce(
      (acc, vote) => acc + (vote.state === 'up' ? 1 : -1),
      0,
    );

    return (
      <RoomTrack
        track={item}
        pin={pin}
        totalVotes={total}
        myVote={myVote?.state}
        isNextTrack={render.index === 0}
      />
    );
  };

  const restartPlaylist = async () => {
    await request('POST', '/room/play', {pin});
  };

  if (!room?.pin)
    return (
      <View style={{flex: 1}}>
        <View style={[styles.header, styles.headerEmpty]}>
          <Typography variant="h2">&nbsp;</Typography>
          <RoomDetails pin={pin} navigation={navigation} />
        </View>
        <EmptyState
          icon="🐕"
          title="Fetching fissa details"
          subtitle="Good boy"
        />
      </View>
    );

  if (activeTrackIndex === -1)
    return (
      <View style={{flex: 1}}>
        <View style={[styles.header, styles.headerEmpty]}>
          <RoomDetails pin={pin} navigation={navigation} />
        </View>
        <EmptyState
          icon="🦥"
          title="This fissa is out of sync"
          subtitle={
            room?.createdBy !== currentUser?.id ? (
              'Poke your host to resync this fissa'
            ) : (
              <Button title="resync fissa" onPress={restartPlaylist} />
            )
          }
        />
      </View>
    );

  if (!tracks.length)
    return (
      <View style={{flex: 1}}>
        <View style={[styles.header, styles.headerEmpty]}>
          <RoomDetails pin={pin} navigation={navigation} />
        </View>
        <EmptyState
          icon="🦨"
          title="This fissa stinks"
          subtitle="Add tracks to get the fissa started"
        />
        <RoomAddTracksFab navigation={navigation} />
      </View>
    );

  return (
    <View style={{flex: 1}}>
      <VirtualizedList<TrackInterface>
        style={styles.container}
        ref={scrollRef}
        ListFooterComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 100,
              marginBottom: 150,
            }}>
            <Typography variant="h1" gutter>
              🦦
            </Typography>
            <Typography variant="bodyM">
              Add tracks or I'll fill the queue
            </Typography>
          </View>
        }
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Typography variant="h2">Now Playing</Typography>
              <RoomDetails pin={pin} navigation={navigation} />
            </View>
            <Track
              imageStyle={{width: 125, height: 125}}
              track={tracks[activeTrackIndex]}
              expectedEndTime={room?.expectedEndTime}
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
        keyExtractor={(item, index) => item.id + index}
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
            bottom: backTopTopAnimation,
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
  headerEmpty: {
    padding: 24,
    marginTop: 44,
    justifyContent: 'flex-end',
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
