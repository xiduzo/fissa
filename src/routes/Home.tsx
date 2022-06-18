import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Button from '../components/atoms/Button';
import Typography from '../components/atoms/Typography';
import {RootStackParamList} from './Routes';

interface HomeProps
  extends NativeStackScreenProps<RootStackParamList, 'Home'> {}

const Home: FC<HomeProps> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Typography variant="h1" style={{...styles.text, marginBottom: 16}}>
          Ewa...
        </Typography>
        <Typography variant="h5" style={styles.text}>
          Do you want to create or join a group session?
        </Typography>
      </View>
      <View>
        <View style={{marginBottom: 24}}>
          <Button
            title="Create group session"
            onPress={() => navigation.navigate('NewSession')}
          />
        </View>
        <Button
          title="Join group session"
          onPress={() => navigation.navigate('JoinSession')}
        />
      </View>
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
