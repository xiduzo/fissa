import React, {FC, useState} from 'react';
import {Alert, View} from 'react-native';
import Action from '../../components/atoms/Action';
import ArrowDownIcon from '../../components/atoms/icons/ArrowDownIcon';
import ArrowUpIcon from '../../components/atoms/icons/ArrowUpIcon';
import MoreIcon from '../../components/atoms/icons/MoreIcon';
import Typography from '../../components/atoms/Typography';
import Track from '../../components/molecules/ListItem.Track';
import Popover from '../../components/molecules/Popover';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import {Color} from '../../types/Color';
import Notification from '../../utils/Notification';

interface RoomTrackProps {
  track: SpotifyApi.TrackObjectFull;
  totalVotes?: number;
  myVote?: 'up' | 'down';
  pin: string;
  isUpcomingTrack?: boolean;
}

const RoomTrack: FC<RoomTrackProps> = ({
  track,
  myVote,
  pin,
  isUpcomingTrack,
  totalVotes = 0,
}) => {
  const [selected, setSelected] = useState(false);
  const {spotify} = useSpotify();

  const selectTrack = () => setSelected(true);

  const castVote = (state: 'up' | 'down') => async () => {
    await request<any>('POST', '/room/vote', {
      state,
      accessToken: spotify.getAccessToken(),
      pin,
      trackUri: track.uri,
    });

    setSelected(false);
    Notification.show({
      icon: state === 'up' ? '🫴' : '🫳',
      message: 'Your vote has been cast!',
    });
  };

  return (
    <View>
      <Track
        track={track}
        disabled={isUpcomingTrack}
        onPress={selectTrack}
        onLongPress={() => Alert.alert(`long press ${track.name}`)}
        end={
          isUpcomingTrack ? (
            <Typography variant="body1">🔒</Typography>
          ) : (
            <MoreIcon style={{tintColor: Color.light + '80'}} />
          )
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
            <ArrowUpIcon
              style={{tintColor: Color.dark, transform: [{scale: 0.6}]}}
            />
            <Typography style={{color: Color.dark}} variant="bodyM">
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
          title="Up vote song"
          inverted
          disabled={myVote === 'up' || isUpcomingTrack}
          onPress={castVote('up')}
          active={myVote === 'up'}
          icon={
            <ArrowUpIcon
              style={{
                tintColor: myVote === 'up' ? Color.main : Color.dark + '40',
              }}
            />
          }
          subtitle="And it will move up in the queue"
        />
        <Action
          title="Down vote song"
          inverted
          disabled={myVote === 'down' || isUpcomingTrack}
          active={myVote === 'down'}
          onPress={castVote('down')}
          icon={
            <ArrowDownIcon
              style={{
                tintColor: myVote === 'down' ? Color.main : Color.dark + '40',
              }}
            />
          }
          subtitle="And it will move down in the queue"
        />
      </Popover>
    </View>
  );
};

export default RoomTrack;
