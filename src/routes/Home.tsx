import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import Button from '../components/atoms/Button';
import Typography from '../components/atoms/Typography';
import LetterLogo from '../components/molecules/LetterLogo';
import {useSpotify} from '../providers/SpotifyProvider';
import {RootStackParamList} from './Routes';

interface HomeProps
  extends NativeStackScreenProps<RootStackParamList, 'Home', undefined> {
  children?: React.ReactNode;
}

const Home: FC<HomeProps> = ({navigation}) => {
  const {currentUser} = useSpotify();

  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Typography variant="h1" gutter style={styles.text}>
          Hi there {currentUser?.display_name?.split(' ')[0]},
        </Typography>
        <Typography variant="h5" style={styles.text}>
          Would you like to create or join a fissa?
        </Typography>
      </View>
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
      <LetterLogo />
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginHorizontal: 24,
    justifyContent: 'space-evenly',
  },
  text: {
    textAlign: 'center',
  },
});
