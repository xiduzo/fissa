import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useCallback, useMemo, useRef} from 'react';
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

  const activeTrackIndex = useMemo(
    () => activeTrack?.currentIndex ?? room?.currentIndex ?? -1,
    [activeTrack, room],
  );

  const queue = useMemo(
    () => tracks.slice(activeTrackIndex + 1, tracks.length),
    [tracks, activeTrackIndex],
  );

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

      console.log(render.index, track.name);

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

  if (!room?.pin) {
    return null;
  }

  console.log(room, activeTrack);

  if (activeTrackIndex === -1) {
    return (
      <View style={{flex: 1, marginTop: 24}}>
        <View style={[styles.header, {padding: 24}]}>
          <Typography variant="h2">Now playing</Typography>
          <RoomDetails
            pin={pin}
            playlistId={room.playlistId}
            navigation={navigation}
            leaveRoom={leaveRoom}
          />
        </View>
        <EmptyState
          icon="🦦"
          title="This fissa finished"
          subtitle="Poke your host to re-start the playlist"
        />
        <RoomAddTracksFab navigation={navigation} />
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
            }}
          />
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
            {!activeTrack?.is_in_playlist && (
              <Typography>
                This fissa is over. Poke your host to start from the top.
              </Typography>
            )}
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
                {Math.max(0, queue.length)} songs
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
