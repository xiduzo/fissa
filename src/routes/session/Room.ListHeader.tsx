import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Typography from '../../components/atoms/Typography';
import Track from '../../components/molecules/ListItem.Track';
import {Room} from '../../lib/interfaces/Room';
import {RootStackParamList} from '../Routes';
import RoomDetails from './Room.Details';
import {Track as TrackInterface} from '../../lib/interfaces/Track';
import {useSpotify} from '../../providers/SpotifyProvider';
import Popover from '../../components/molecules/Popover';
import Action from '../../components/atoms/Action';
import SpotifyIcon from '../../components/atoms/icons/SpotifyIcon';
import ArrowRightIcon from '../../components/atoms/icons/ArrowRightIcon';
import {request} from '../../lib/utils/api';

interface RoomListHeaderProps
  extends NativeStackScreenProps<RootStackParamList, 'Room'> {
  room: Room;
  track?: TrackInterface;
  queueLength: number;
}

const RoomListHeader: FC<RoomListHeaderProps> = ({
  navigation,
  room,
  track,
  queueLength,
}) => {
  const {currentUser} = useSpotify();
  const [currentTrackSelected, setCurrentTrackSelected] = useState(false);

  const togglePopover = () => setCurrentTrackSelected(!currentTrackSelected);

  const skipTrack = async () => {
    togglePopover();
    try {
      await request('POST', `/room/skip`, {
        pin: room.pin,
        createdBy: currentUser?.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (!track) return null;

  return (
    <View>
      <View style={styles.header}>
        <Typography variant="h2">Now Playing</Typography>
        <RoomDetails
          isOwner={room?.createdBy === currentUser?.id}
          pin={room.pin}
          navigation={navigation}
        />
      </View>
      <Track
        imageStyle={{width: 125, height: 125}}
        track={track}
        expectedEndTime={room?.expectedEndTime}
        onPress={() => setCurrentTrackSelected(true)}
      />
      <View style={styles.queue}>
        <Typography variant="h2">Queue</Typography>
        <Typography variant="bodyM" style={{opacity: 0.6}}>
          {Math.max(0, queueLength)} tracks
        </Typography>
      </View>
      <Popover visible={currentTrackSelected} onRequestClose={togglePopover}>
        <Track inverted hasBorder track={track} />
        <Action
          title="Save track"
          subtitle="And dance to it later"
          inverted
          onPress={() => {
            navigation.navigate('SaveToPlaylist', {
              track,
            });
            togglePopover();
          }}
          icon={<SpotifyIcon color="dark" colorOpacity={40} />}
        />
        <Action
          hidden={room?.createdBy !== currentUser?.id}
          disabled={track?.index !== room.currentIndex}
          title="Skip track"
          subtitle="Use your power responsibly"
          inverted
          onPress={skipTrack}
          icon={<ArrowRightIcon color="dark" colorOpacity={40} />}
        />
      </Popover>
    </View>
  );
};

export default RoomListHeader;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  queue: {
    marginBottom: 12,
    marginTop: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
