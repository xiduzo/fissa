import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, useMemo, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import Action from '../../components/atoms/Action';
import ArrowUpIcon from '../../components/atoms/icons/ArrowUpIcon';
import InfoIcon from '../../components/atoms/icons/InfoIcon';
import SpotifyIcon from '../../components/atoms/icons/SpotifyIcon';
import Typography from '../../components/atoms/Typography';
import Popover from '../../components/molecules/Popover';
import {RootStackParamList} from '../Routes';
import {useRoomPlaylist} from '../../providers/PlaylistProvider';
import SpeakerIcon from '../../components/atoms/icons/SpeakerIcon';
import {useSpotify} from '../../providers/SpotifyProvider';
import Notification from '../../lib/utils/Notification';

interface RoomDetailsProps {
  pin: string;
  isOwner?: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Room', undefined>;
}

const RoomDetails: FC<RoomDetailsProps> = ({pin, isOwner, navigation}) => {
  const {leaveRoom} = useRoomPlaylist(pin);
  const {tracks} = useRoomPlaylist(pin);

  const {spotify, currentUser} = useSpotify();
  const [savingPlaylist, setSavingPlaylist] = useState(false);
  const [activeDevice, setActiveDevice] = useState<
    SpotifyApi.UserDevice | undefined
  >();
  const [showRoomDetails, setShowRoomDetails] = useState(false);

  const toggleRoomDetails = () => setShowRoomDetails(!showRoomDetails);

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

  useMemo(async () => {
    if (!isOwner) return;
    const {devices} = await spotify.getMyDevices();

    setActiveDevice(devices.find(_device => _device.is_active));
  }, [spotify, showRoomDetails, isOwner]);

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
          subtitle="No worries, you can always come back"
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
          subtitle="And keep the fissa memories"
          inverted
          onPress={createPlaylist}
          disabled={!currentUser || savingPlaylist}
          icon={<SpotifyIcon color="dark" colorOpacity={40} />}
        />
        <Action
          hidden={!isOwner}
          title="Set speakers"
          subtitle={`Current speakers: ${activeDevice?.name ?? 'none'}`}
          inverted
          onPress={() => {
            Alert.alert(
              'Setting the speakers is coming soon',
              'be patient my young pawadan',
            );
          }}
          // disabled
          icon={<SpeakerIcon color="dark" colorOpacity={40} />}
        />
      </Popover>
    </View>
  );
};

export default RoomDetails;
