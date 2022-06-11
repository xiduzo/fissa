import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import Notification from '../../utils/Notification';
import {RootStackParamList} from '../Routes';

interface NewSessionProps
  extends NativeStackScreenProps<RootStackParamList, 'NewSession'> {}

const NewSession: FC<NewSessionProps> = ({navigation}) => {
  const startFromBlank = () => {
    navigation.popToTop();
    navigation.replace('Room');
    Notification.show({
      message: 'Aye, have a funky night sailor!',
      icon: '🚢',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Typography variant="h1" style={[styles.text, {marginBottom: 16}]}>
          Create group session
        </Typography>
        <Typography variant="h5" style={styles.text}>
          How would you like to start?
        </Typography>
      </View>
      <View>
        <View style={{marginBottom: 24}}>
          <Button
            title="Select a spotify playlist"
            onPress={() => navigation.navigate('FromPlaylist')}
          />
        </View>
        <Button title="Start from blank" onPress={startFromBlank} />
      </View>
    </SafeAreaView>
  );
};

export default NewSession;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-evenly',
  },
  text: {
    textAlign: 'center',
  },
});
