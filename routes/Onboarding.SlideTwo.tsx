import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PlusIcons from '../components/atoms/icons/PlusIcon';
import Typography from '../components/atoms/Typography';
import {Color} from '../types/Color';

const OnboardingSlideTwo: FC = () => (
  <View style={styles.view}>
    <Typography style={styles.icon}>💃🏾</Typography>
    <LinearGradient style={styles.button} {...Color.gradient}>
      <PlusIcons style={styles.buttonIcon} />
    </LinearGradient>
    <Typography style={[styles.icon, styles.rotated]}>🕺🏻</Typography>
  </View>
);

export default OnboardingSlideTwo;

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    lineHeight: 120,
    paddingVertical: 12,
  },
  rotated: {
    transform: [
      {
        rotateZ: '180deg',
      },
      {
        rotateY: '180deg',
      },
    ],
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
  },
  buttonIcon: {
    tintColor: Color.dark,
    transform: [{scale: 1.5}],
  },
});
