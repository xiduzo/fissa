import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useMemo, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Animation from '../components/atoms/animations/Animation';
import Typography from '../components/atoms/Typography';
import {Color} from '../types/Color';
import {RootStackParamList} from './Routes';

interface InitialProps
  extends NativeStackScreenProps<RootStackParamList, 'Initial'> {}

const Initial: FC<InitialProps> = ({navigation}) => {
  const colorAnimation = useRef(new Animated.Value(0));

  useMemo(async () => {
    const onboardingVersion = await EncryptedStorage.getItem('onboarding');
    await EncryptedStorage.setItem('onboarding', '1');

    colorAnimation.current.addListener(response => {
      if (response.value < 1) {
        return;
      }

      if (onboardingVersion !== '1') {
        navigation.replace('Onboarding');
        return;
      }

      navigation.replace('Home');
    });

    Animated.timing(colorAnimation.current, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();
  }, [navigation]);

  const backgroundColorInterpolation = colorAnimation.current.interpolate({
    inputRange: [0, 0.4, 0.6, 1],
    outputRange: ['#000000', '#000000', Color.dark, Color.dark],
  });

  const colorInterpolation = colorAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF90', Color.light],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: backgroundColorInterpolation},
      ]}>
      <Animation
        style={{transform: [{scale: 1.75}]}}
        progress={colorAnimation.current}
      />

      <Typography variant="bodyM" style={{color: colorInterpolation}}>
        Made by Milanovski and Xiduzo
      </Typography>
    </Animated.View>
  );
};

export default Initial;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 34,
  },
});
