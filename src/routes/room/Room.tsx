import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useRef, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  VirtualizedList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../components/atoms/Button';
import EmptyState from '../../components/atoms/EmptyState';
import Typography from '../../components/atoms/Typography';
import {useSpotify} from '../../providers/SpotifyProvider';
import {Color} from '../../lib/types/Theme';
import RoomAddTracksFab from './AddTracksFab';
import RoomDetails from './Details';
import {renderTrack} from './Track';
import {request} from '../../lib/utils/api';
import Notification from '../../lib/utils/Notification';
import {Track as TrackInterface} from '../../lib/interfaces/Track';
import BaseView from '../../components/templates/BaseView';
import RoomListHeader from './ListHeader';
import RoomBackToTop, {
  RoomBackToTopRef,
} from '../../components/atoms/BackToTop';
import {useIsOwner} from '../../hooks/useIsOwner';
import {RootStackParamList} from '../../lib/interfaces/StackParams';
import {useRoom} from '../../hooks/useRoom';

interface RoomProps
  extends NativeStackScreenProps<RootStackParamList, 'Room'> {}

const Room: FC<RoomProps> = ({route, navigation}) => {
  const {pin} = route.params;
  const {tracks, room, votes} = useRoom(pin);
  const {currentUser} = useSpotify();
  const [isRestarting, setIsRestarting] = useState(false);
  const [canScroll, setCanScroll] = useState(true);
  const {isOwner} = useIsOwner(pin);

  const scrollRef = useRef<VirtualizedList<TrackInterface>>(null);
  const backToTopRef = useRef<RoomBackToTopRef>(null);

  const activeTrackIndex = room?.currentIndex ?? -1;
  const queue = tracks.slice(activeTrackIndex + 1, tracks.length);

  const scroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    backToTopRef.current?.scroll(event);
  };

  const toggleScroll = () => setCanScroll(!canScroll);

  const restartPlaylist = async () => {
    try {
      setIsRestarting(true);
      await request('POST', '/room/play', {pin});
    } catch (error) {
      if (error === 409) {
        Notification.show({
          message: 'The fissa was already playing',
          icon: '🦀',
        });
        return;
      }
    } finally {
      setIsRestarting(false);
    }
  };

  if (!room?.pin)
    return (
      <BaseView style={{flex: 1}}>
        <View style={[styles.header, styles.headerEmpty]}>
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
          title="This fissa is asleep"
          subtitle={!isOwner && 'Poke your host to continue this fissa'}>
          {isOwner && (
            <Button
              disabled={isRestarting}
              title="continue fissa"
              onPress={restartPlaylist}
            />
          )}
        </EmptyState>
      </BaseView>
    );

  if (!tracks.length)
    return (
      <BaseView style={{flex: 1}} noPadding>
        <View
          style={[styles.header, styles.headerEmpty, {paddingHorizontal: 24}]}>
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
        scrollEnabled={canScroll}
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
          <RoomListHeader
            track={tracks[room.currentIndex]}
            room={room}
            navigation={navigation}
            route={route}
            queueLength={queue.length}
          />
        }
        data={queue}
        initialNumToRender={5}
        scrollEventThrottle={300}
        onScroll={scroll}
        renderItem={renderTrack(votes, room.pin, currentUser?.id, toggleScroll)}
        getItemCount={() => queue.length}
        getItem={(data, index) => data[index]}
        keyExtractor={item => item.id}
      />
      <LinearGradient
        colors={[Color.dark + '00', Color.dark]}
        style={styles.gradient}
      />
      <RoomBackToTop scrollRef={scrollRef} ref={backToTopRef} />
      <RoomAddTracksFab navigation={navigation} />
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
    marginTop: 68,
    justifyContent: 'flex-end',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 100,
    width: '100%',
    backgroundColor: 'transparent',
  },
});
