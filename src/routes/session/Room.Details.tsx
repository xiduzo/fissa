import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, useMemo, useRef, useState} from 'react';
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

interface RoomDetailsProps {
  pin: string;
  isOwner?: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Room', undefined>;
}

const RoomDetails: FC<RoomDetailsProps> = ({pin, isOwner, navigation}) => {
  const {leaveRoom} = useRoomPlaylist(pin);
  const {spotify} = useSpotify();
  const [activeDevice, setActiveDevice] = useState<
    SpotifyApi.UserDevice | undefined
  >();

  const device = useMemo(async () => {
    const {devices} = await spotify.getMyDevices();

    setActiveDevice(devices.find(_device => _device.is_active));
  }, [spotify]);

  const [showRoomDetails, setShowRoomDetails] = useState(false);

  const toggleRoomDetails = () => setShowRoomDetails(!showRoomDetails);

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
          hidden={!isOwner}
          title="Set speakers"
          subtitle={activeDevice?.name ?? 'Blast those neighbors away'}
          inverted
          disabled
          icon={<SpeakerIcon color="dark" colorOpacity={40} />}
        />
        <Action
          title="Create playlist in spotify"
          subtitle="And keep the memories of this fissa"
          inverted
          disabled
          icon={<SpotifyIcon color="dark" colorOpacity={40} />}
        />
      </Popover>
    </View>
  );
};

export default RoomDetails;
