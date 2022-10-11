import {FC, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Animated, View} from 'react-native';
import Action from '../../components/atoms/Action';
import ArrowDownIcon from '../../components/atoms/icons/ArrowDownIcon';
import ArrowUpIcon from '../../components/atoms/icons/ArrowUpIcon';
import LockIcon from '../../components/atoms/icons/LockIcon';
import MoreIcon from '../../components/atoms/icons/MoreIcon';
import Track from '../../components/molecules/ListItem.Track';
import Popover from '../../components/molecules/Popover';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import {Color} from '../../types/Theme';
import Notification from '../../utils/Notification';
import {Track as TrackInterface} from '../../lib/interfaces/Track';

interface RoomTrackProps {
  track: TrackInterface;
  totalVotes?: number;
  myVote?: 'up' | 'down';
  pin: string;
  isNextTrack?: boolean;
  index?: number;
}

const RoomTrack: FC<RoomTrackProps> = ({
  track,
  myVote,
  pin,
  index = 0,
  totalVotes = 0,
  isNextTrack,
}) => {
  const [selected, setSelected] = useState(false);
  const {spotify, currentUser} = useSpotify();
  const previousIndex = useRef(index);
  const positionAnimation = useRef(new Animated.Value(0)).current;
  const height = useRef(0);

  const selectTrack = () => setSelected(true);

  const castVote = (state?: 'up' | 'down') => async () => {
    setSelected(false);
    Notification.show({
      icon: myVote === state ? '🔄' : state === 'up' ? '⬆️' : '⬇️',
      message: `Your vote has been ${myVote === state ? 'reverted' : 'cast'}!`,
    });

    await request('POST', '/room/vote', {
      state,
      accessToken: spotify.getAccessToken(),
      pin,
      trackId: track.id,
      createdBy: currentUser?.id,
    });
  };

  const EndIcon = useMemo(() => {
    if (isNextTrack) return LockIcon;

    if (myVote) {
      return myVote === 'up' ? ArrowUpIcon : ArrowDownIcon;
    }

    return MoreIcon;
  }, [myVote, isNextTrack]);

  useEffect(() => {
    const diff = previousIndex.current - index;
    previousIndex.current = index;
    if (diff === 0) return;

    Animated.timing(positionAnimation, {
      toValue: diff * 100,
      duration: 0,
      useNativeDriver: false,
    }).start(() => {
      Animated.spring(positionAnimation, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    });
  }, [index, track]);

  return (
    <Animated.View
      onLayout={e => (height.current = e.nativeEvent.layout.height)}
      style={{
        position: 'relative',
        top: positionAnimation,
      }}>
      <Track
        track={track}
        totalVotes={totalVotes}
        onPress={selectTrack}
        onLongPress={() =>
          Alert.alert(
            'Quick vote function will come here',
            'be patient my young pawadan',
          )
        }
        end={
          <EndIcon
            color={myVote && !isNextTrack ? 'main' : 'light'}
            colorOpacity={myVote && !isNextTrack ? 100 : 80}
          />
        }
      />
      <Popover visible={!!selected} onRequestClose={() => setSelected(false)}>
        <Track track={track} totalVotes={totalVotes} inverted hasBorder />
        <View
          style={{
            borderBottomWidth: 2,
            borderBottomColor: Color.dark + '10',
            marginVertical: 16,
          }}
        />
        <Action
          title="Locked track"
          inverted
          disabled
          hidden={!isNextTrack}
          icon={<LockIcon color={'dark'} />}
          subtitle="This track will not move"
        />
        <Action
          title="Up-vote track"
          inverted
          disabled={myVote === 'up'}
          hidden={isNextTrack}
          onPress={castVote('up')}
          active={myVote === 'up'}
          icon={
            <ArrowUpIcon
              color={myVote === 'up' ? 'main' : 'dark'}
              colorOpacity={myVote === 'up' ? 100 : 40}
            />
          }
          subtitle={
            myVote === 'up'
              ? 'You already up-voted this track'
              : 'It might move up in the queue'
          }
        />
        <Action
          title="Down-vote track"
          inverted
          hidden={isNextTrack}
          disabled={myVote === 'down'}
          active={myVote === 'down'}
          onPress={castVote('down')}
          icon={
            <ArrowDownIcon
              color={myVote === 'down' ? 'main' : 'dark'}
              colorOpacity={myVote === 'down' ? 100 : 40}
            />
          }
          subtitle={
            myVote === 'down'
              ? 'You already down-voted this track'
              : 'It might move down in the queue'
          }
        />
      </Popover>
    </Animated.View>
  );
};

export default RoomTrack;
