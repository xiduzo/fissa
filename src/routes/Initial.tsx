import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useMemo, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Animation from '../components/atoms/animations/Animation';
import Typography from '../components/atoms/Typography';
import {Color} from '../types/Color';
import {RootStackParamList} from './Routes';

interface InitialProps
  extends NativeStackScreenProps<RootStackParamList, 'Initial'> {}

const CURRENT_ONBOARDING_VERSION = '1.0.0';

const Initial: FC<InitialProps> = ({navigation}) => {
  const colorAnimation = useRef(new Animated.Value(0)).current;

  useMemo(async () => {
    const onboardingVersion = await EncryptedStorage.getItem('onboarding');
    await EncryptedStorage.setItem('onboarding', CURRENT_ONBOARDING_VERSION);

    colorAnimation.addListener(response => {
      if (response.value < 1) return;

      if (onboardingVersion !== CURRENT_ONBOARDING_VERSION) {
        navigation.replace('Onboarding');
        return;
      }

      navigation.replace('Home');
    });

    Animated.timing(colorAnimation, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true,
    }).start();
  }, [navigation]);

  const backgroundColorInterpolation = colorAnimation.interpolate({
    inputRange: [0, 0.4, 0.6, 1],
    outputRange: ['#000000', '#000000', Color.dark, Color.dark],
  });

  const colorInterpolation = colorAnimation.interpolate({
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
        progress={colorAnimation}
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
