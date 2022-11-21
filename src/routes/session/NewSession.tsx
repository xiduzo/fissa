import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Button from '../../components/atoms/Button';
import EmptyState from '../../components/atoms/EmptyState';
import Typography from '../../components/atoms/Typography';
import BaseView from '../../components/templates/BaseView';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import Notification from '../../lib/utils/Notification';
import {useDevices} from '../../hooks/useDevices';
import SpotifyIcon from '../../components/atoms/icons/SpotifyIcon';
import {TransferPlaybackDevicePopover} from '../../components/organisms/TransferPlaybackDevicePopover';
import {RootStackParamList} from '../../lib/interfaces/StackParams';

interface NewSessionProps
  extends NativeStackScreenProps<RootStackParamList, 'NewSession'> {}

const NewSession: FC<NewSessionProps> = ({navigation}) => {
  const {spotify, refreshToken, currentUser} = useSpotify();
  const [waitForResponse, setWaitForResponse] = useState(false);
  const {devices, activeDevice} = useDevices();

  const [showDevicePopover, setShowDevicePopover] = useState(false);

  const toggleDevicePopover = () => setShowDevicePopover(!showDevicePopover);

  const surprisePlaylist = async () => {
    setWaitForResponse(true);
    Notification.show({
      message: 'Ay captain, we be creating a playlist for ye!',
      icon: '🦜',
      duration: 10000,
    });

    try {
      const {content: pin} = await request<string>('POST', '/room', {
        accessToken: spotify.getAccessToken(),
        refreshToken,
        createdBy: currentUser?.id,
      });

      navigation.popToTop();
      navigation.replace('Room', {pin});
      Notification.show({
        message: 'Have a funky fissa sailor!',
        icon: '🦜',
      });
    } catch (error) {
      if (error === 404) {
        Notification.show({
          message: 'Could not find an active speaker in spotify',
          icon: '🦑',
        });
      }
    } finally {
      setWaitForResponse(false);
    }
  };

  if (devices.length === 0) {
    return (
      <BaseView style={{justifyContent: 'space-evenly'}}>
        <EmptyState
          icon="🦑"
          title="No speaker found"
          subtitle={`Make sure you have at least one speaker connected to ${currentUser?.display_name}'s spotify account`}
        />
      </BaseView>
    );
  }

  return (
    <BaseView style={{justifyContent: 'space-evenly'}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Typography variant="h1" gutter align="center">
          Create a fissa
        </Typography>
        <Typography variant="h5" gutter={24} align="center">
          How would you like to start this fissa?
        </Typography>
      </View>
      <View style={{flex: 1}}>
        <View style={{marginBottom: 16}}>
          <Button
            title="based on my playlist"
            onPress={() => navigation.navigate('FromPlaylist')}
            disabled={waitForResponse}
          />
        </View>
        <Button
          title="surprise me"
          variant="outlined"
          inverted
          onPress={surprisePlaylist}
          disabled={waitForResponse}
        />
      </View>
      <TouchableOpacity
        style={{marginBottom: 64}}
        onPress={toggleDevicePopover}>
        <View>
          <Typography variant="bodyL" align="center">
            {activeDevice?.name ?? 'No active speaker found'}
          </Typography>
          <Button
            start={<SpotifyIcon scale={0.8} />}
            title="Set speaker"
            variant="text"
            disabled={waitForResponse}
            onPress={toggleDevicePopover}
          />
        </View>
      </TouchableOpacity>
      <TransferPlaybackDevicePopover
        visible={showDevicePopover}
        onRequestClose={toggleDevicePopover}
      />
    </BaseView>
  );
};

export default NewSession;
