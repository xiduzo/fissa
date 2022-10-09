import {FC, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Animated, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Action from '../../components/atoms/Action';
import ArrowDownIcon from '../../components/atoms/icons/ArrowDownIcon';
import ArrowUpIcon from '../../components/atoms/icons/ArrowUpIcon';
import LockIcon from '../../components/atoms/icons/LockIcon';
import MoreIcon from '../../components/atoms/icons/MoreIcon';
import Typography from '../../components/atoms/Typography';
import Track from '../../components/molecules/ListItem.Track';
import Popover from '../../components/molecules/Popover';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import {Color} from '../../types/Theme';
import Notification from '../../utils/Notification';
import {Track as TrackInterface} from './Room.PlaylistContext';

interface RoomTrackProps {
  track: TrackInterface;
  totalVotes?: number;
  myVote?: 'up' | 'down';
  pin: string;
  isNextTrack?: boolean;
}

const RoomTrack: FC<RoomTrackProps> = ({
  track,
  myVote,
  pin,
  totalVotes = 0,
  isNextTrack,
}) => {
  const [selected, setSelected] = useState(false);
  const {spotify, currentUser} = useSpotify();

  const voteChangedAnimation = useRef(new Animated.Value(0)).current;
  const previousVoteCount = useRef(totalVotes);

  const votesBackgroundColorInterpolation = voteChangedAnimation.interpolate({
    inputRange: [0, 0.1, 0.7, 1],
    outputRange: [Color.light + 70, Color.main, Color.main, Color.light + 70],
  });
  const votesScaleInterpolation = voteChangedAnimation.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1.2, 1],
  });

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

  const VotesIcon = totalVotes < 0 ? ArrowDownIcon : ArrowUpIcon;

  useEffect(() => {
    if (previousVoteCount.current === totalVotes) return;
    const animation = Animated.spring(voteChangedAnimation, {
      toValue: Number(totalVotes !== 0),
      friction: 10,
      useNativeDriver: false,
    });

    animation.start(() => {
      animation.reset();
      previousVoteCount.current = totalVotes;
    });
  }, [totalVotes]);

  return (
    <View>
      <Track
        track={track}
        subtitlePrefix={
          totalVotes !== 0 ? (
            <Animated.View
              style={{
                backgroundColor: votesBackgroundColorInterpolation,
                transform: [{scale: votesScaleInterpolation}],
                borderRadius: 2,
                paddingHorizontal: 2,
                marginRight: 4,
              }}>
              <Typography
                color="dark"
                align="center"
                style={{
                  fontWeight: 'bold',
                  fontSize: 12,
                  width: 16 + (totalVotes > 10 ? 6 : 0),
                }}>
                {totalVotes > 0 && '+'}
                {totalVotes}
              </Typography>
            </Animated.View>
          ) : undefined
        }
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
      <Popover
        title={
          <View
            style={{
              opacity: 0.6,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <VotesIcon color="dark" scale={0.6} />
            <Typography color="dark" variant="bodyM">
              {totalVotes}
            </Typography>
          </View>
        }
        visible={!!selected}
        onRequestClose={() => setSelected(false)}>
        <Track track={track} inverted hasBorder />
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
          hidden={!isNextTrack}
          icon={<LockIcon color={'dark'} />}
          subtitle="Voting is disabled on the next track"
        />
        <Action
          title="Up vote track"
          inverted
          hidden={isNextTrack}
          onPress={castVote('up')}
          active={myVote === 'up'}
          icon={
            <ArrowUpIcon
              color={myVote === 'up' ? 'main' : 'dark'}
              colorOpacity={myVote === 'up' ? 100 : 40}
            />
          }
          subtitle="It might move up in the queue"
        />
        <Action
          title="Down vote track"
          inverted
          hidden={isNextTrack}
          active={myVote === 'down'}
          onPress={castVote('down')}
          icon={
            <ArrowDownIcon
              color={myVote === 'down' ? 'main' : 'dark'}
              colorOpacity={myVote === 'down' ? 100 : 40}
            />
          }
          subtitle="It might move down in the queue"
        />
      </Popover>
    </View>
  );
};

export default RoomTrack;
