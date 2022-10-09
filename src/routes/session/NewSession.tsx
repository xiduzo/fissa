import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useState} from 'react';
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
  const {spotify, refreshToken, currentUser} = useSpotify();
  const [waitForResponse, setWaitForResponse] = useState(false);

  const surprisePlaylist = async () => {
    setWaitForResponse(true);
    try {
      const {content: pin} = await request<string>('POST', '/room', {
        accessToken: spotify.getAccessToken(),
        refreshToken,
        createdBy: currentUser?.id,
      });

      navigation.popToTop();
      navigation.replace('Room', {pin});
      Notification.show({
        message: 'Aye, have a funky fissa sailor!',
        icon: '🚢',
      });
    } catch (error) {
      setWaitForResponse(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Typography variant="h1" gutter style={styles.text}>
          Create a fissa
        </Typography>
        <Typography variant="h5" gutter={24} style={styles.text}>
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
