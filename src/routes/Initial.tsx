import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Typography from '../components/atoms/Typography';
import {Color, pinkey} from '../types/Color';
import {RootStackParamList} from './Routes';

interface InitialProps
  extends NativeStackScreenProps<RootStackParamList, 'Initial'> {}

const Initial: FC<InitialProps> = ({navigation, ...props}) => {
  const colorAnimation = useRef(new Animated.Value(0));

  useMemo(async () => {
    const onboardingVersion = await EncryptedStorage.getItem('onboarding');
    await EncryptedStorage.setItem('onboarding', '1');

    setTimeout(() => {
      if (onboardingVersion !== '1') {
        navigation.replace('Onboarding');
        return;
      }
      navigation.replace('Home');
    }, 1_500);
  }, [navigation]);

  useEffect(() => {
    Animated.timing(colorAnimation.current, {
      toValue: 1,
      duration: 500,
      delay: 500,
      useNativeDriver: false,
    }).start();
  }, []);

  const backgroundColorInterpolation = colorAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [pinkey.dark, Color.dark],
  });

  const colorInterpolation = colorAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [pinkey.light, Color.light],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: backgroundColorInterpolation},
      ]}>
      <View style={styles.appName}>
        <Typography variant="h1" style={{color: colorInterpolation}}>
          FISSA
        </Typography>
      </View>
      <Typography variant="bodyM" style={{color: colorInterpolation}}>
        Made by Xiduzo and Milanovski
      </Typography>
    </Animated.View>
  );
};

export default Initial;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  appName: {
    height: '80%',
    justifyContent: 'center',
  },
});
