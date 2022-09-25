import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ArrowDownIcon from '../components/atoms/icons/ArrowDownIcon';
import ArrowUpIcon from '../components/atoms/icons/ArrowUpIcon';
import Typography from '../components/atoms/Typography';
import {Color} from '../types/Theme';

const OnboardingSlideThree: FC = () => (
  <View>
    <Typography style={{...styles.icon, ...styles.rotate}}>🎉</Typography>
    <LinearGradient
      style={[styles.button, styles.buttonUp]}
      {...Color.gradient}>
      <ArrowUpIcon
        style={[{tintColor: Color.dark, transform: [{scale: 1.5}]}]}
      />
    </LinearGradient>
    <LinearGradient
      style={[styles.button, styles.buttonDown]}
      {...Color.gradient}
      colors={[Color.light, Color.light]}>
      <ArrowDownIcon
        style={[
          {
            tintColor: Color.dark + '16',
            transform: [{scale: 1.5}],
          },
        ]}
      />
    </LinearGradient>
    <Typography style={{...styles.icon, ...styles.shit}}>💩</Typography>
  </View>
);

export default OnboardingSlideThree;

const styles = StyleSheet.create({
  icon: {
    fontSize: 80,
    lineHeight: 120,
  },
  rotate: {
    transform: [{rotate: '-45deg'}],
    marginBottom: 24,
  },
  shit: {
    marginLeft: 32,
    marginTop: -8,
    marginBottom: 24,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderRadius: 28,
  },
  buttonUp: {
    padding: 30,
    marginRight: 32,
  },
  buttonDown: {
    borderWidth: 4.5,
    marginLeft: 32,
    marginTop: -32,
    zIndex: -1,
    borderColor: Color.dark + '16',
  },
});
