import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
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
import Popover from '../../components/molecules/Popover';
import AsyncStorage from '@react-native-community/async-storage';
import {useRoom} from '../../hooks/useRoom';

interface NewSessionProps
  extends NativeStackScreenProps<RootStackParamList, 'NewSession'> {}

const NewSession: FC<NewSessionProps> = ({navigation}) => {
  const {spotify, refreshToken, currentUser} = useSpotify();
  const [waitForResponse, setWaitForResponse] = useState(false);
  const {devices, activeDevice} = useDevices();
  const {joinRoom} = useRoom();

  const [showDevicePopover, setShowDevicePopover] = useState(false);
  const toggleDevicePopover = () => setShowDevicePopover(!showDevicePopover);

  const [showWarning, setShowWarning] = useState(false);
  const toggleShowWarning = () => setShowWarning(!showWarning);

  const disableWarning = () => {
    AsyncStorage.setItem('showHostWarning', Boolean(false).toString());
    toggleShowWarning();
  };

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

      joinRoom(pin);
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

  useEffect(() => {
    AsyncStorage.getItem('showHostWarning').then(doNotShowWarning => {
      if (Boolean(doNotShowWarning)) return;
      setShowWarning(true);
    });
  }, []);

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
          Host a fissa
        </Typography>
        <Typography variant="h4" gutter={24} align="center">
          How should this fissa start
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
      <Popover visible={showWarning} onRequestClose={disableWarning}>
        <Typography variant="h2" color="dark" align="center" gutter>
          Be aware
        </Typography>

        <Typography variant="body2" color="dark" align="center" gutter>
          The playlist you create in fissa will still be played via spotify. We
          will try our best to keep your fissa in sync with spotify. Controlling
          your music via spotify itself could cause your fissa to get out of
          sync.
        </Typography>
        <View style={{marginTop: 32}}>
          <Button title="Roger that" inverted onPress={disableWarning} />
        </View>
      </Popover>
    </BaseView>
  );
};

export default NewSession;
