import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useRef, useState} from 'react';
import {
  Alert,
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
import {useRoomPlaylist} from '../../providers/PlaylistProvider';
import RoomTrack from './Room.Track';
import {request} from '../../lib/utils/api';
import {ShowProps} from '../../utils/Notification';
import Popover from '../../components/molecules/Popover';
import Action from '../../components/atoms/Action';
import ArrowRightIcon from '../../components/atoms/icons/ArrowRightIcon';
import SpotifyIcon from '../../components/atoms/icons/SpotifyIcon';
import {Track as TrackInterface} from '../../lib/interfaces/Track';
import BaseView from '../../components/templates/BaseView';

interface RoomProps
  extends NativeStackScreenProps<RootStackParamList, 'Room'> {}

const SCROLL_TOP_OFFSET = -100;

const Room: FC<RoomProps> = ({route, navigation}) => {
  const {pin} = route.params;
  const {tracks, room, votes} = useRoomPlaylist(pin);
  const {currentUser} = useSpotify();
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentTrackSelected, setCurrentTrackSelected] = useState(-1);

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

  const skipTrack = async () => {
    setCurrentTrackSelected(-1);
    try {
      await request('POST', `/room/skip`, {
        pin,
        createdBy: currentUser?.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const restartPlaylist = async () => {
    try {
      setIsSyncing(true);
      const errorResponses = new Map<number, Partial<ShowProps>>();
      errorResponses.set(409, {
        message: 'The fissa was already playing',
        icon: '🦀',
      });

      await request('POST', '/room/play', {pin}, errorResponses);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const renderTrack = (render: ListRenderItemInfo<TrackInterface>) => {
    const {item, index} = render;
    const trackVotes = votes[item.id];

    const myVote = trackVotes?.find(vote => vote.createdBy === currentUser?.id);

    const total = trackVotes?.reduce(
      (acc, vote) => acc + (vote.state === 'up' ? 1 : -1),
      0,
    );

    return (
      <RoomTrack
        key={item.id}
        track={item}
        index={index}
        pin={pin}
        totalVotes={total}
        myVote={myVote?.state}
        isNextTrack={render.index === 0}
      />
    );
  };

  if (!room?.pin)
    return (
      <BaseView style={{flex: 1}}>
        <View style={[styles.header, styles.headerEmpty]}>
          <Typography variant="h2">&nbsp;</Typography>
          <RoomDetails pin={pin} navigation={navigation} />
        </View>
        <EmptyState
          icon="🐕"
          title="Fetching fissa details"
          subtitle="Good boy"
        />
      </BaseView>
    );

  if (activeTrackIndex === -1)
    return (
      <BaseView style={{flex: 1}}>
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
              <Button
                disabled={isSyncing}
                title="resync fissa"
                onPress={restartPlaylist}
              />
            )
          }
        />
      </BaseView>
    );

  if (!tracks.length)
    return (
      <BaseView style={{flex: 1}}>
        <View style={[styles.header, styles.headerEmpty]}>
          <RoomDetails pin={pin} navigation={navigation} />
        </View>
        <EmptyState
          icon="🦨"
          title="This fissa stinks"
          subtitle="Add tracks to get the fissa started"
        />
        <RoomAddTracksFab navigation={navigation} />
      </BaseView>
    );

  return (
    <BaseView style={{flex: 1}} noPadding>
      <VirtualizedList
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
              <RoomDetails
                isOwner={room?.createdBy === currentUser?.id}
                pin={pin}
                navigation={navigation}
              />
            </View>
            <Track
              imageStyle={{width: 125, height: 125}}
              track={tracks[activeTrackIndex]}
              expectedEndTime={room?.expectedEndTime}
              onPress={() => setCurrentTrackSelected(room.currentIndex)}
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
        keyExtractor={item => item.id}
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
      <Popover
        visible={!!tracks[currentTrackSelected]}
        onRequestClose={() => setCurrentTrackSelected(-1)}>
        <Track inverted hasBorder track={tracks[currentTrackSelected]} />
        <Action
          title="Save track"
          subtitle="Dance to it later"
          inverted
          onPress={() => {
            Alert.alert(
              'Saving tracks  is coming soon',
              'be patient my young pawadan',
            );
          }}
          icon={<SpotifyIcon color="dark" colorOpacity={40} />}
        />
        <Action
          hidden={room?.createdBy !== currentUser?.id}
          disabled={
            tracks[room.currentIndex]?.id !== tracks[currentTrackSelected]?.id
          }
          title="Skip track"
          subtitle="Use your power responsibly"
          inverted
          onPress={skipTrack}
          icon={<ArrowRightIcon color="dark" colorOpacity={40} />}
        />
      </Popover>
    </BaseView>
  );
};

export default Room;

const styles = StyleSheet.create({
  container: {
    paddingTop: 68,
    paddingHorizontal: 24,
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
