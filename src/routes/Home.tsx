import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Button from '../components/atoms/Button';
import Typography from '../components/atoms/Typography';
import {useSpotify} from '../providers/SpotifyProvider';
import {RootStackParamList} from './Routes';

interface HomeProps
  extends NativeStackScreenProps<RootStackParamList, 'Home'> {}

const Home: FC<HomeProps> = ({navigation}) => {
  const {spotify, auth} = useSpotify();

  const [hasToken, setHasToken] = useState(!!spotify.getAccessToken());

  const signIn = async () => setHasToken(await auth());

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Typography variant="h1" style={{...styles.text, marginBottom: 16}}>
          Ewa...
        </Typography>
        <Typography variant="h5" style={styles.text}>
          {hasToken
            ? 'Would you like to create or join a fissa session?'
            : 'Hi there stranger, sign in to spotify to continue.'}
        </Typography>
      </View>
      {!hasToken && (
        <View>
          <Button title="Sign in to spotify" onPress={signIn} />
        </View>
      )}
      {hasToken && (
        <View>
          <View style={{marginBottom: 24}}>
            <Button
              title="Create a session"
              onPress={() => navigation.navigate('NewSession')}
            />
          </View>
          <Button
            title="Join a session"
            onPress={() => navigation.navigate('JoinSession')}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
export default Home;

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
