import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {View} from 'react-native';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import BaseView from '../../components/templates/BaseView';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import Notification from '../../utils/Notification';
import {RootStackParamList} from '../Routes';

interface NewSessionProps
  extends NativeStackScreenProps<RootStackParamList, 'NewSession'> {}

const NewSession: FC<NewSessionProps> = ({navigation}) => {
  const {spotify, refreshToken, currentUser} = useSpotify();
  const [waitForResponse, setWaitForResponse] = useState(false);

  const surprisePlaylist = async () => {
    setWaitForResponse(true);
    Notification.show({
      message: 'Creating your fissa...',
      icon: '🤖',
      duration: 10_000,
    });

    try {
      const {content: pin} = await request<string>('POST', '/room', {
        accessToken: spotify.getAccessToken(),
        refreshToken,
        createdBy: currentUser?.id,
      });

      Notification.hide();

      navigation.popToTop();
      navigation.replace('Room', {pin});
      Notification.show({
        message: 'Aye, have a funky fissa sailor!',
        icon: '🚢',
      });
    } finally {
      setWaitForResponse(false);
    }
  };

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
    </BaseView>
  );
};

export default NewSession;
