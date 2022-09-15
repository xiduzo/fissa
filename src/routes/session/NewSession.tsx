import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import {request} from '../../lib/utils/api';
import {useSpotify} from '../../providers/SpotifyProvider';
import Notification from '../../utils/Notification';
import {RootStackParamList} from '../Routes';
import {Room} from './Room.PlaylistContext';

interface NewSessionProps
  extends NativeStackScreenProps<RootStackParamList, 'NewSession'> {}

const NewSession: FC<NewSessionProps> = ({navigation}) => {
  const {spotify} = useSpotify();
  const [waitForResponse, setWaitForResponse] = useState(false);
  const startFromBlank = async () => {
    setWaitForResponse(true);
    try {
      const {content: pin} = await request<string>('POST', '/room', {
        accessToken: spotify.getAccessToken(),
      });

      navigation.popToTop();
      navigation.replace('Room', {pin});
      Notification.show({
        message: 'Aye, have a funky night sailor!',
        icon: '🚢',
      });
    } catch (error) {
      setWaitForResponse(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Typography variant="h1" gutterBottom style={styles.text}>
          Create a session
        </Typography>
        <Typography variant="h5" gutterBottom={24} style={styles.text}>
          How would you like to start this session?
        </Typography>
      </View>
      <View>
        <View style={{marginBottom: 24}}>
          <Button
            title="Based on a playlist"
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
