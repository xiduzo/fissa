import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Button from '../components/atoms/Button';
import Typography from '../components/atoms/Typography';
import {useSpotify} from '../providers/SpotifyProvider';
import {RootStackParamList} from './Routes';

interface HomeProps
  extends NativeStackScreenProps<RootStackParamList, 'Home'> {}

const Home: FC<HomeProps> = ({navigation}) => {
  const {currentUser, auth} = useSpotify();

  const [signingIn, setSigningIn] = useState(false);

  const signIn = async () => {
    setSigningIn(() => true);
    await auth();
    setSigningIn(() => false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Typography variant="h1" gutter style={styles.text}>
          Hi there {currentUser?.display_name?.split(' ')[0] ?? 'stranger'},
        </Typography>
        <Typography variant="h5" style={styles.text}>
          {currentUser
            ? 'Would you like to create or join a fissa?'
            : 'please sign in to spotify to continue.'}
        </Typography>
      </View>
      {!currentUser && (
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <Button
            title="Sign in to spotify"
            onPress={signIn}
            disabled={signingIn}
          />
        </View>
      )}
      {currentUser && (
        <View style={{flex: 1}}>
          <View style={{marginBottom: 16}}>
            <Button
              title="Join a fissa"
              onPress={() => navigation.navigate('JoinSession')}
            />
          </View>
          <Button
            variant="outlined"
            inverted
            title="create a fissa"
            onPress={() => navigation.navigate('NewSession')}
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
