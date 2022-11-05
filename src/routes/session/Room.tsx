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
import {Color} from '../../types/Theme';
import {RootStackParamList} from '../Routes';
import RoomAddTracksFab from './Room.AddTracksFab';
import RoomDetails from './Room.Details';
import {useRoomPlaylist} from '../../providers/PlaylistProvider';
import {renderTrack} from './Room.Track';
import {request} from '../../lib/utils/api';
import Notification from '../../utils/Notification';
import {Track as TrackInterface} from '../../lib/interfaces/Track';
import BaseView from '../../components/templates/BaseView';
import RoomListHeader from './Room.ListHeader';
import RoomBackToTop, {
  RoomBackToTopRef,
} from '../../components/atoms/BackToTop';

interface RoomProps
  extends NativeStackScreenProps<RootStackParamList, 'Room'> {}

const Room: FC<RoomProps> = ({route, navigation}) => {
  const {pin} = route.params;
  const {tracks, room, votes} = useRoomPlaylist(pin);
  const {currentUser} = useSpotify();
  const [isSyncing, setIsSyncing] = useState(false);
  const [canScroll, setCanScroll] = useState(true);

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
      setIsSyncing(true);
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
      setIsSyncing(false);
    }
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
            room?.createdBy !== currentUser?.id
              ? 'Poke your host to resync this fissa'
              : undefined
          }>
          {room?.createdBy === currentUser?.id && (
            <Button
              disabled={isSyncing}
              title="resync fissa"
              onPress={restartPlaylist}
            />
          )}
        </EmptyState>
      </BaseView>
    );

  if (!tracks.length)
    return (
      <BaseView style={{flex: 1}} noPadding>
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
    paddingHorizontal: 24,
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
