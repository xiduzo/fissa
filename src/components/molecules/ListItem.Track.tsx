import {DateTime} from 'luxon';
import React, {FC, useEffect, useMemo, useRef} from 'react';
import {Animated} from 'react-native';
import {Track as TrackInterface} from '../../routes/session/Room.PlaylistContext';
import {Color} from '../../types/Theme';
import ProgressBar from '../atoms/ProgressBar';
import Typography from '../atoms/Typography';
import ListItem, {ListItemProps} from './ListItem';

interface TrackProps extends Partial<ListItemProps> {
  track?: TrackInterface;
  progressMs?: number;
  expectedEndTime?: string;
  totalVotes?: number;
}

const Track: FC<TrackProps> = ({
  track,
  progressMs,
  totalVotes,
  expectedEndTime,
  inverted,
  ...props
}) => {
  if (!track) return null;

  const voteChangedAnimation = useRef(new Animated.Value(0)).current;
  const previousVoteCount = useRef(totalVotes);

  const votesBackgroundColorInterpolation = voteChangedAnimation.interpolate({
    inputRange: [0, 0.1, 0.7, 1],
    outputRange: [
      inverted ? Color.dark + 65 : Color.light + 70,
      inverted ? Color.dark : Color.main,
      inverted ? Color.dark : Color.main,
      inverted ? Color.dark + 60 : Color.light + 70,
    ],
  });
  const votesScaleInterpolation = voteChangedAnimation.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1.2, 1],
  });

  const progress = useMemo(() => {
    if (!expectedEndTime) return undefined;

    const {duration_ms} = track;

    const tMinus = DateTime.fromISO(expectedEndTime).diff(
      DateTime.now(),
    ).milliseconds;

    const progress = (tMinus * 100) / duration_ms;

    return 1 - progress / 100; // As percentage
  }, [expectedEndTime, track]);

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
    <ListItem
      imageUri={track.image}
      title={track.name}
      subtitle={track.artists}
      inverted={inverted}
      subtitlePrefix={
        !!totalVotes ? (
          <Animated.View
            style={{
              backgroundColor: votesBackgroundColorInterpolation,
              transform: [{scale: votesScaleInterpolation}],
              borderRadius: 2,
              paddingHorizontal: 2,
              marginRight: 4,
            }}>
            <Typography
              color={inverted ? 'main' : 'dark'}
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
      extra={
        <ProgressBar
          progress={progress}
          track={track}
          style={{marginTop: 16}}
        />
      }
      {...props}
    />
  );
};

export default Track;
