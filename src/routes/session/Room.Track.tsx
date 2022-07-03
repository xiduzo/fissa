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

  const castVote = (state: 'up' | 'down') => () => {
    request('POST', '/room/vote', {
      state,
      accessToken: spotify.getAccessToken(),
      pin,
      trackUri: track.uri,
    }).finally(() => setSelected(false));
  };

  return (
    <View>
      <Track
        track={track}
        onPress={selectTrack}
        onLongPress={() => Alert.alert(`long press ${track.name}`)}
        end={<MoreIcon style={{tintColor: Color.light + '80'}} />}
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
          disabled={myVote === 'up'}
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
          disabled={myVote === 'down'}
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
