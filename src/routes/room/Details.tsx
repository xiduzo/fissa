import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Action from '../../components/atoms/Action';
import ArrowUpIcon from '../../components/atoms/icons/ArrowUpIcon';
import InfoIcon from '../../components/atoms/icons/InfoIcon';
import SpotifyIcon from '../../components/atoms/icons/SpotifyIcon';
import Typography from '../../components/atoms/Typography';
import Popover from '../../components/molecules/Popover';
import SpeakerIcon from '../../components/atoms/icons/SpeakerIcon';
import {useSpotify} from '../../providers/SpotifyProvider';
import Notification from '../../lib/utils/Notification';
import {useDevices} from '../../hooks/useDevices';
import {TransferPlaybackDevicePopover} from '../../components/organisms/TransferPlaybackDevicePopover';
import {useIsOwner} from '../../hooks/useIsOwner';
import {RootStackParamList} from '../../lib/interfaces/StackParams';
import {useRoom} from '../../hooks/useRoom';

interface RoomDetailsProps {
  pin: string;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Room', undefined>;
}

const RoomDetails: FC<RoomDetailsProps> = ({pin, navigation}) => {
  const {leaveRoom, tracks} = useRoom(pin);
  const {isOwner} = useIsOwner(pin);

  const {spotify, currentUser} = useSpotify();
  const [savingPlaylist, setSavingPlaylist] = useState(false);
  const {activeDevice} = useDevices();

  const [showRoomDetails, setShowRoomDetails] = useState(false);

  const toggleRoomDetails = () => setShowRoomDetails(!showRoomDetails);

  const [showDevicePopover, setShowDevicePopover] = useState(false);

  const toggleDevicePopover = () => {
    setShowRoomDetails(false);
    setShowDevicePopover(!showDevicePopover);
  };

  const createPlaylist = async () => {
    if (!currentUser) return;
    setSavingPlaylist(true);
    try {
      const playlist = await spotify.createPlaylist(currentUser.id, {
        name: `Fissa ${pin}`,
        description: `Playlist created based with Fissa ${pin}`,
      });

      let tracksAdded = 0;
      do {
        await spotify.addTracksToPlaylist(
          playlist.id,
          tracks
            .slice(tracksAdded, tracksAdded + 100)
            .map(track => `spotify:track:${track.id}`),
        );
        tracksAdded += 100;
      } while (tracksAdded < tracks.length);

      Notification.show({
        type: 'success',
        icon: '🎉',
        message: 'Playlist saved in Spotify',
      });
    } catch {
      Notification.show({
        type: 'warning',
        message: 'Could not create playlist',
      });
    } finally {
      setSavingPlaylist(false);
      toggleRoomDetails();
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleRoomDetails}>
        <View
          style={{opacity: 0.6, flexDirection: 'row', alignItems: 'center'}}>
          <Typography
            variant="bodyM"
            style={{
              paddingHorizontal: 4,
              paddingVertical: 2,
            }}>
            {pin}
          </Typography>
          <InfoIcon />
        </View>
      </TouchableOpacity>
      <Popover visible={!!showRoomDetails} onRequestClose={toggleRoomDetails}>
        <Typography variant="h2" color="dark" align="center">
          {pin}
        </Typography>
        <Action
          title="Leave session"
          subtitle="No worries, you can come back"
          inverted
          onPress={() => {
            leaveRoom();
            toggleRoomDetails();
            navigation.replace('Home');
          }}
          icon={<ArrowUpIcon color="dark" colorOpacity={40} />}
        />
        <Action
          title="Create playlist in spotify"
          subtitle="And keep this fissa's memories"
          inverted
          onPress={createPlaylist}
          disabled={!currentUser || savingPlaylist}
          icon={<SpotifyIcon color="dark" colorOpacity={40} />}
        />
        <Action
          hidden={!isOwner}
          title={activeDevice?.name ?? 'No speakers found'}
          subtitle="Current speaker"
          inverted
          onPress={toggleDevicePopover}
          icon={<SpeakerIcon color="dark" colorOpacity={40} />}
        />
      </Popover>
      <TransferPlaybackDevicePopover
        visible={showDevicePopover}
        onRequestClose={toggleDevicePopover}
      />
    </View>
  );
};

export default RoomDetails;
