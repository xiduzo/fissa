import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Typography from '../components/atoms/Typography';
import {Color} from '../types/Color';

const OnboardingSlideOne: FC = () => (
  <View>
    {['🤖', '👻', '🤡', '🎃'].map((icon, index) => (
      <View
        key={icon}
        style={[
          styles.item,
          {
            opacity: 1 - 0.3 * index,
          },
        ]}>
        <Typography style={styles.icon}>{icon}</Typography>
        <View style={styles.text}>
          <LinearGradient
            style={[
              styles.textLine,
              styles.textLineBig,
              {
                width: 150 + Math.random() * 50,
              },
            ]}
            {...Color.gradient}
          />
          <LinearGradient
            style={[
              styles.textLine,
              {
                width: 150 + Math.random() * 50,
              },
            ]}
            {...Color.gradient}
          />
        </View>
      </View>
    ))}
  </View>
);

export default OnboardingSlideOne;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  icon: {
    fontSize: 60,
    lineHeight: 80,
    marginRight: 16,
  },
  text: {
    justifyContent: 'center',
    width: 200,
  },
  textLineBig: {
    height: 16,
    marginBottom: 6,
  },
  textLine: {
    height: 13,
    borderRadius: 4,
  },
});
