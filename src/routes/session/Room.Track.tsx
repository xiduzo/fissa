import {FC, useMemo, useState} from 'react';
import {Alert, View} from 'react-native';
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

interface RoomTrackProps {
  track: SpotifyApi.TrackObjectFull;
  totalVotes?: number;
  myVote?: 'up' | 'down';
  pin: string;
}

const RoomTrack: FC<RoomTrackProps> = ({
  track,
  myVote,
  pin,
  totalVotes = 0,
}) => {
  const [selected, setSelected] = useState(false);
  const {spotify} = useSpotify();

  const selectTrack = () => setSelected(true);

  const castVote = (state?: 'up' | 'down') => async () => {
    setSelected(false);
    Notification.show({
      icon: myVote === state ? '🔄' : state === 'up' ? '⬆️' : '⬇️',
      message: `Your vote has been ${myVote === state ? 'reverted' : 'cast'}!`,
    });

    await request<any>('POST', '/room/vote', {
      state,
      accessToken: spotify.getAccessToken(),
      pin,
      trackUri: track.uri,
    });
  };

  const EndIcon = useMemo(() => {
    if (myVote) {
      return myVote === 'up' ? ArrowUpIcon : ArrowDownIcon;
    }

    return MoreIcon;
  }, [myVote]);

  const VotesIcon = totalVotes < 0 ? ArrowDownIcon : ArrowUpIcon;

  return (
    <View>
      <Track
        track={track}
        onPress={selectTrack}
        onLongPress={() => Alert.alert(`long press ${track.name}`)}
        end={
          <EndIcon
            color={myVote ? 'main' : 'light'}
            colorOpacity={myVote ? 100 : 80}
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
          title="Up vote track"
          inverted
          onPress={castVote('up')}
          active={myVote === 'up'}
          icon={
            <ArrowUpIcon
              color={myVote === 'up' ? 'main' : 'dark'}
              colorOpacity={myVote === 'up' ? 100 : 40}
            />
          }
          subtitle="And it will move up in the queue"
        />
        <Action
          title="Down vote track"
          inverted
          active={myVote === 'down'}
          onPress={castVote('down')}
          icon={
            <ArrowDownIcon
              color={myVote === 'down' ? 'main' : 'dark'}
              colorOpacity={myVote === 'down' ? 100 : 40}
            />
          }
          subtitle="And it will move down in the queue"
        />
      </Popover>
    </View>
  );
};

export default RoomTrack;
