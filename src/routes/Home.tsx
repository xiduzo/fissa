import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {View} from 'react-native';
import Button from '../components/atoms/Button';
import Typography from '../components/atoms/Typography';
import BaseView from '../components/templates/BaseView';
import {useSpotify} from '../providers/SpotifyProvider';
import {RootStackParamList} from './Routes';

interface HomeProps
  extends NativeStackScreenProps<RootStackParamList, 'Home', undefined> {}

const Home: FC<HomeProps> = ({navigation}) => {
  const {currentUser} = useSpotify();

  return (
    <BaseView style={{justifyContent: 'space-evenly'}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Typography variant="h1" gutter align="center">
          Hi there {currentUser?.display_name?.split(' ')[0]},
        </Typography>
        <Typography variant="h5" align="center">
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
    </BaseView>
  );
};
export default Home;
