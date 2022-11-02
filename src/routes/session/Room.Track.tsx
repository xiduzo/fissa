import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  GestureResponderEvent,
  ListRenderItemInfo,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
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
import {Vote} from '../../lib/interfaces/Vote';
import Divider from '../../components/atoms/Divider';
import {Dimensions} from 'react-native';
const windowHeight = Dimensions.get('window').height;
const windowCenter = windowHeight / 2;

interface RoomTrackProps {
  track: TrackInterface;
  totalVotes?: number;
  myVote?: 'up' | 'down';
  pin: string;
  isNextTrack?: boolean;
  index?: number;
  toggleScroll?: () => void;
}

const RoomTrack: FC<RoomTrackProps> = ({
  track,
  myVote,
  pin,
  index = 0,
  totalVotes = 0,
  isNextTrack,
  toggleScroll,
  ...listItemTrackProps
}) => {
  const [selected, setSelected] = useState(false);
  const {spotify, currentUser} = useSpotify();
  const previousIndex = useRef(index);
  const positionAnimation = useRef(new Animated.Value(0)).current;
  const focussedAnimation = useRef(new Animated.Value(0)).current;
  const actionOpacityAnimation = useRef(new Animated.Value(0)).current;
  const [actionSelected, setActionSelected] = useState<
    'up' | 'down' | undefined
  >(undefined);
  const focussedPosition = useRef(0);
  const height = useRef(0);
  const [focussedTrack, setFocussedTrack] = useState(false);

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

  const toggleLongPress = async (event: GestureResponderEvent) => {
    if (isNextTrack) return;
    focussedPosition.current = event.nativeEvent.pageY;

    if (actionSelected) {
      castVote(actionSelected)();
    }

    toggleScroll && toggleScroll();
    setFocussedTrack(!focussedTrack);
    setActionSelected(undefined);
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    if (!focussedTrack) return;
    toggleLongPress(event);
  };

  const handleTouchMove = (event: GestureResponderEvent) => {
    if (!focussedTrack) {
      setActionSelected(undefined);
      return;
    }

    const TRIGGER_DIFF = 100;

    const currentY = event.nativeEvent.pageY;

    if (currentY < windowCenter - TRIGGER_DIFF) {
      setActionSelected('up');
      return;
    }

    if (currentY > windowCenter + TRIGGER_DIFF) {
      setActionSelected('down');
      return;
    }

    // Reset
    setActionSelected(undefined);
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

  useEffect(() => {
    if (!focussedTrack) return;
    const offset = focussedPosition.current - windowCenter;
    Animated.timing(focussedAnimation, {
      toValue: offset,
      duration: 0,
      useNativeDriver: false,
    }).start(() => {
      Animated.parallel([
        Animated.spring(focussedAnimation, {
          toValue: 0,
          bounciness: 3,
          useNativeDriver: false,
        }),
        Animated.timing(actionOpacityAnimation, {
          duration: 200,
          delay: 100,
          toValue: 1,
          useNativeDriver: false,
        }),
      ]).start();
    });

    return () => {
      Animated.timing(actionOpacityAnimation, {
        duration: 0,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    };
  }, [focussedTrack]);

  const opacityInterpolation = focussedAnimation.interpolate({
    inputRange: [-Math.abs(focussedPosition.current), 0],
    outputRange: [0.1, 0.98],
  });

  const actionScaleInterpolation = actionOpacityAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <Animated.View
      onLayout={e => (height.current = e.nativeEvent.layout.height)}
      style={{top: positionAnimation}}>
      <Track
        track={track}
        totalVotes={totalVotes}
        onPress={selectTrack}
        onLongPress={toggleLongPress}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        end={
          <EndIcon
            color={myVote && !isNextTrack ? 'main' : 'light'}
            colorOpacity={myVote && !isNextTrack ? 100 : 80}
          />
        }
        {...listItemTrackProps}
      />
      <Popover visible={!!selected} onRequestClose={() => setSelected(false)}>
        <Track track={track} totalVotes={totalVotes} inverted hasBorder />
        <Divider color={Color.dark + '10'} />
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
      <Modal
        transparent
        visible={!!focussedTrack}
        // Redundant exit touch event
        // This should be handled by the track `onTouchEnd`
        // But if the track doesn't fire the user still needs a way out
        onTouchEnd={handleTouchEnd}>
        <Animated.View
          style={[
            styles.modalBackdrop,
            {
              opacity: opacityInterpolation,
            },
          ]}
        />
        <View style={styles.modalContent}>
          <Animated.View
            style={{
              width: '100%',
              opacity: actionOpacityAnimation,
              transform: [{scale: actionScaleInterpolation}],
            }}>
            <Action
              title="Up-vote track"
              disabled={myVote === 'up'}
              onPress={castVote('up')}
              active={myVote === 'up' || actionSelected === 'up'}
              icon={
                <ArrowUpIcon
                  color={
                    myVote === 'up' || actionSelected === 'up' ? 'dark' : 'main'
                  }
                  colorOpacity={
                    myVote === 'up' || actionSelected === 'up' ? 100 : 40
                  }
                />
              }
            />
          </Animated.View>
          <Animated.View
            style={{
              width: '100%',
              top: focussedAnimation,
            }}>
            <Track totalVotes={totalVotes} track={track} />
          </Animated.View>
          <Animated.View
            style={{
              width: '100%',

              opacity: actionOpacityAnimation,
              transform: [{scale: actionScaleInterpolation}],
            }}>
            <Action
              title="Down-vote track"
              disabled={myVote === 'down'}
              active={myVote === 'down' || actionSelected === 'down'}
              onPress={castVote('down')}
              icon={
                <ArrowDownIcon
                  color={
                    myVote === 'down' || actionSelected === 'down'
                      ? 'dark'
                      : 'main'
                  }
                  colorOpacity={
                    myVote === 'down' || actionSelected === 'down' ? 100 : 40
                  }
                />
              }
            />
          </Animated.View>
        </View>
      </Modal>
    </Animated.View>
  );
};

export const renderTrack =
  (
    votes: {[key: string]: Vote[]},
    pin: string,
    currentUserId?: string,
    toggleScroll?: () => void,
  ) =>
  (render: ListRenderItemInfo<TrackInterface>) => {
    const {item, index} = render;
    const trackVotes = votes[item.id];

    const myVote = trackVotes?.find(vote => vote.createdBy === currentUserId);

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
        toggleScroll={toggleScroll}
      />
    );
  };

export default RoomTrack;

const styles = StyleSheet.create({
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 24,
  },
  modalBackdrop: {
    backgroundColor: Color.dark,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
