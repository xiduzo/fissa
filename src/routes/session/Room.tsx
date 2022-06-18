import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
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
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Action from '../../components/atoms/Action';
import Button from '../../components/atoms/Button';
import Fab from '../../components/atoms/Fab';
import ArrowDownIcon from '../../components/atoms/icons/ArrowDownIcon';
import ArrowUpIcon from '../../components/atoms/icons/ArrowUpIcon';
import MoreIcon from '../../components/atoms/icons/MoreIcon';
import PlusIcons from '../../components/atoms/icons/PlusIcon';
import Typography from '../../components/atoms/Typography';
import ListItem from '../../components/molecules/ListItem';
import Popover from '../../components/molecules/Popover';
import {DEFAULT_IMAGE} from '../../lib/constants/Image';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import {Color} from '../../types/Color';
import Notification from '../../utils/Notification';
import {RootStackParamList} from '../Routes';

interface RoomProps
  extends NativeStackScreenProps<RootStackParamList, 'Room'> {}

const Room: FC<RoomProps> = ({route, navigation, ...props}) => {
  const backToTopOffset = useRef(new Animated.Value(-80));
  const [addingTracks, setAddingTracks] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const {spotify} = useSpotify();
  const [tracks, setTracks] = useState<SpotifyApi.PlaylistTrackObject[]>([]);

  const [selectedTrack, setSelectedTrack] =
    useState<SpotifyApi.TrackObjectFull>();

  const [room, setRoom] = useState<{
    playlistId: string;
    currentIndex: number;
  }>();
  const {pin} = route.params;

  const scrollRef =
    useRef<VirtualizedList<SpotifyApi.PlaylistTrackObject>>(null);

  const animateBackToTop = (
    config?: Partial<Animated.SpringAnimationConfig>,
  ) => {
    Animated.spring(backToTopOffset.current, {
      toValue: -20,
      useNativeDriver: false,
      ...(config ?? {}),
    }).start();
  };

  const animateIn = () =>
    animateBackToTop({
      toValue: 64,
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

    if (scrollHeight < 500) return animateBackToTop();

    animateIn();
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollToIndex({
      index: 0,
      viewOffset: 500,
    });
  };

  const trackEndIcon = (votes: number): JSX.Element => {
    const style: StyleProp<ImageStyle> = {
      tintColor: votes !== 0 ? Color.main : Color.light,
    };

    if (votes !== 0) {
      if (votes > 0) return <ArrowUpIcon style={style} />;
      return <ArrowDownIcon style={style} />;
    }

    return <MoreIcon style={style} />;
  };

  useEffect(() => {
    if (!room) return;
    let newTracks: SpotifyApi.PlaylistTrackObject[] = [];
    const fetchTracks = async (offset: number) => {
      spotify.getPlaylistTracks(room.playlistId, {offset}).then(result => {
        newTracks = newTracks.concat(result.items);
        if (!result.next) return setTracks(newTracks);
        fetchTracks(offset + result.items.length);
      });
    };

    fetchTracks(room.currentIndex);
  }, [
    room?.playlistId,
    room?.currentIndex,
    spotify.getPlaylist,
    spotify.getPlaylistTracks,
  ]);

  useMemo(async () => {
    const user = await spotify.getMe();
    console.log(user); // Use user uri for voting
  }, [spotify.getUser]);

  useEffect(() => {
    if (room) return;
    request('POST', '/room/join', {pin}).then(async response => {
      console.log(response);
      if (response.status === 404) {
        // return Notification.show({
        //   message: `Room ${joinedPin} does not exist`,
        // });
        return;
      }

      if (response.status === 500) {
        // return Notification.show({
        //   message: `Oops... something went wrong`,
        // });
        return;
      }

      if (response.status !== 200) return console.log(response);

      const room = await response.json();

      Notification.show({
        icon: '🪩',
        message: `Joined ${pin}, add your favorite tracks to keep to party going!`,
      });

      navigation.setOptions({
        headerRight: () => (
          <TouchableWithoutFeedback onPress={() => setShowRoomDetails(true)}>
            <Typography variant="h6">{pin}</Typography>
          </TouchableWithoutFeedback>
        ),
      });

      setRoom(room);
    });
  }, [pin, room]);

  const renderItem = (
    render: ListRenderItemInfo<SpotifyApi.PlaylistTrackObject>,
  ) => {
    const {track} = render.item;

    return (
      <ListItem
        // @ts-ignore
        subtitle={track.artists.map(x => x.name).join(', ')}
        // @ts-ignore
        imageUri={track.album.images[0]?.url ?? DEFAULT_IMAGE}
        onPress={selectTrack(track as SpotifyApi.TrackObjectFull)}
        onLongPress={() => Alert.alert(`long press ${track.name}`)}
        title={track.name}
        // @ts-ignore
        subtitle={track.artists.map(x => x.name).join(', ')}
        end={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Typography variant="bodyM" style={{marginRight: 4}}>
              {5}
            </Typography>
            {trackEndIcon(5)}
          </View>
        }
      />
    );
  };

  if (!room) return null;

  return (
    <View>
      <VirtualizedList<SpotifyApi.PlaylistTrackObject>
        style={[styles.container]}
        ref={scrollRef}
        ListFooterComponent={<View style={{paddingBottom: 200}} />}
        ListHeaderComponent={
          <>
            <Typography variant="h2" style={{marginBottom: 16}}>
              Now Playing
            </Typography>
            <ListItem
              imageStyle={{width: 125, height: 125}}
              imageUri={
                // @ts-ignore
                tracks[room.currentIndex]?.track.album.images[0]?.url ??
                DEFAULT_IMAGE
              }
              title={tracks[room.currentIndex]?.track.name}
              // @ts-ignore
              subtitle={tracks[room.currentIndex]?.track.artists
                .map((x: any) => x.name)
                .join(', ')}
            />
            <View style={styles.queue}>
              <Typography variant="h2">Queue</Typography>
              <Typography variant="h2" style={{fontWeight: '300'}}>
                ({Math.max(0, tracks.length - 1 - room.currentIndex)})
              </Typography>
            </View>
          </>
        }
        data={tracks.slice(1 + room.currentIndex, tracks.length)}
        initialNumToRender={5}
        scrollEventThrottle={300}
        onScroll={scroll}
        renderItem={renderItem}
        getItemCount={() =>
          tracks.slice(1 + room.currentIndex, tracks.length).length
        }
        getItem={(data, index) => data[index]}
        keyExtractor={(item, index) => item.track.id + index}
      />
      <View accessibilityHint="popovers">
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
          {selectedTrack && (
            <ListItem
              // @ts-ignore
              imageUri={selectedTrack.album.images[0]?.url ?? DEFAULT_IMAGE}
              title={selectedTrack.name}
              // @ts-ignore
              subtitle={selectedTrack.artists
                .map((x: any) => x.name)
                .join(', ')}
              inverted
              hasBorder
            />
          )}
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
            active
            icon={<ArrowUpIcon />}
            subtitle="And it will move up in the queue"
          />
          <Action
            title="Down vote song"
            inverted
            icon={<ArrowDownIcon style={{tintColor: Color.main}} />}
            subtitle="And it will move down in the queue"
          />
        </Popover>
      </View>

      <View accessibilityHint="footer">
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
    </View>
  );
};

export default Room;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
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
