import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import Notification from '../../utils/Notification';
import {RootStackParamList} from '../Routes';

interface NewSessionProps
  extends NativeStackScreenProps<RootStackParamList, 'NewSession'> {}

const NewSession: FC<NewSessionProps> = ({navigation}) => {
  const {spotify} = useSpotify();
  const [waitForResponse, setWaitForResponse] = useState(false);
  const startFromBlank = () => {
    setWaitForResponse(true);
    request('POST', '/room/create', {
      accessToken: spotify.getAccessToken(),
    })
      .then(async response => {
        console.log(response);
        if (response.status !== 200) {
          return;
        }

        const room = await response.json();
        navigation.popToTop();
        navigation.replace('Room', {pin: room.pin});
        Notification.show({
          message: 'Aye, have a funky night sailor!',
          icon: '🚢',
        });
      })
      .catch(() => {
        setWaitForResponse(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Typography variant="h1" style={[styles.text, {marginBottom: 16}]}>
          Create group session
        </Typography>
        <Typography variant="h5" style={[styles.text, {marginBottom: 24}]}>
          How would you like to start?
        </Typography>
      </View>
      <View>
        <View style={{marginBottom: 24}}>
          <Button
            title="Select a spotify playlist"
            onPress={() => navigation.navigate('FromPlaylist')}
            disabled={waitForResponse}
          />
        </View>
        <Button
          title="Start from blank"
          onPress={startFromBlank}
          disabled={waitForResponse}
        />
      </View>
    </SafeAreaView>
  );
};

export default NewSession;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-evenly',
    marginHorizontal: 24,
  },
  text: {
    textAlign: 'center',
  },
});
