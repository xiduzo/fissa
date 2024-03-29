import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {View} from 'react-native';
import Button from '../components/atoms/Button';
import Typography from '../components/atoms/Typography';
import BaseView from '../components/templates/BaseView';
import {useRoom} from '../hooks/useRoom';
import {RootStackParamList} from '../lib/interfaces/StackParams';
import Notification from '../lib/utils/Notification';
import {useSpotify} from '../providers/SpotifyProvider';

interface HomeProps
  extends NativeStackScreenProps<RootStackParamList, 'Home', undefined> {}

const Home: FC<HomeProps> = ({navigation}) => {
  const {currentUser} = useSpotify();
  const {room, joinRoom} = useRoom();

  const navigate = (route: keyof RootStackParamList, params?: any) => () =>
    navigation.navigate(route, params);

  const reJoinRoom = () => {
    if (!room?.pin) return;
    joinRoom(room.pin);
    navigation.replace('Room', {pin: room.pin});
    Notification.show({
      icon: '🦤',
      message: `Welcome back to ${room.pin}!`,
    });
  };

  return (
    <BaseView style={{justifyContent: 'space-evenly'}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Typography variant="h1" gutter align="center">
          Hi there {currentUser?.display_name?.split(' ')[0]},
        </Typography>
        <Typography variant="h4" align="center">
          What are you up to?
        </Typography>
      </View>
      <View style={{flex: 1}}>
        <View style={{marginBottom: 16}}>
          <Button title="Join a fissa" onPress={navigate('JoinSession')} />
        </View>
        <Button
          variant="outlined"
          inverted
          title="Host a fissa"
          onPress={navigate('NewSession')}
        />
      </View>
      {room && (
        <View style={{marginBottom: 64}}>
          <Button
            title="Rejoin last fissa"
            variant="text"
            onPress={reJoinRoom}
          />
        </View>
      )}
    </BaseView>
  );
};
export default Home;
