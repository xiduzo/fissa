import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, useState} from 'react';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import Action from '../../components/atoms/Action';
import ArrowUpIcon from '../../components/atoms/icons/ArrowUpIcon';
import InfoIcon from '../../components/atoms/icons/InfoIcon';
import SpotifyIcon from '../../components/atoms/icons/SpotifyIcon';
import Typography from '../../components/atoms/Typography';
import Popover from '../../components/molecules/Popover';
import {Color} from '../../types/Color';
import {RootStackParamList} from '../Routes';
import {useRoomPlaylist} from './Room.PlaylistContext';

interface RoomDetailsProps {
  pin: string;
  playlistId?: string;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Room', undefined>;
}

const RoomDetails: FC<RoomDetailsProps> = ({pin, playlistId, navigation}) => {
  const {leaveRoom} = useRoomPlaylist(pin);

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
        <Typography variant="h2" style={styles.popoverText}>
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
          icon={
            <ArrowUpIcon
              style={{
                tintColor: Color.dark + '40',
              }}
            />
          }
        />
        {playlistId && (
          <Action
            title="Open in Spotify"
            subtitle="Check the complete playlist"
            inverted
            onPress={() => {
              Linking.openURL(
                'https://open.spotify.com/playlist/' + playlistId,
              );
            }}
            icon={
              <SpotifyIcon
                style={{
                  tintColor: Color.dark + '40',
                }}
              />
            }
          />
        )}
      </Popover>
    </View>
  );
};

export default RoomDetails;

const styles = StyleSheet.create({
  popoverText: {
    color: Color.dark,
    textAlign: 'center',
  },
});
