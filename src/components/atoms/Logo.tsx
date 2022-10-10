import {FC} from 'react';
import LottieView, {AnimatedLottieViewProps} from 'lottie-react-native';
import {Color} from '../../types/Theme';
import {Animated, RegisteredStyle, StyleSheet, ViewStyle} from 'react-native';

interface AnimationProps extends Omit<AnimatedLottieViewProps, 'source'> {
  viewStyle?:
    | false
    | RegisteredStyle<ViewStyle>
    | Animated.Value
    | Animated.AnimatedInterpolation<string>
    | Animated.WithAnimatedObject<ViewStyle>
    | null
    | undefined;
}

// TODO: refactor this mess
const Logo: FC<AnimationProps> = ({viewStyle, ...props}) => {
  switch (Color.name) {
    case 'blueey':
      return (
        <Animated.View style={[viewStyle, styles.commonStyling]}>
          <LottieView
            source={require('../../../assets/animations/animation_blueey.json')}
            {...props}
          />
        </Animated.View>
      );
    case 'pinkey':
      return (
        <Animated.View style={[viewStyle, styles.commonStyling]}>
          <LottieView
            source={require('../../../assets/animations/animation_pinkey.json')}
            style={{zIndex: -1}}
            {...props}
          />
        </Animated.View>
      );
    case 'greeny':
      return (
        <Animated.View style={[viewStyle, styles.commonStyling]}>
          <LottieView
            source={require('../../../assets/animations/animation_greeny.json')}
            {...props}
          />
        </Animated.View>
      );
    case 'limey':
      return (
        <Animated.View style={[viewStyle, styles.commonStyling]}>
          <LottieView
            source={require('../../../assets/animations/animation_limey.json')}
            {...props}
          />
        </Animated.View>
      );
    case 'sunny':
      return (
        <Animated.View style={[viewStyle, styles.commonStyling]}>
          <LottieView
            source={require('../../../assets/animations/animation_sunny.json')}
            {...props}
          />
        </Animated.View>
      );
    // TODO add orangy lottie file
    case 'orangy':
    default:
      return (
        <Animated.View style={[viewStyle, styles.commonStyling]}>
          <LottieView
            source={require('../../../assets/animations/animation_sunny.json')}
            {...props}
          />
        </Animated.View>
      );
  }
};

export default Logo;

const styles = StyleSheet.create({
  commonStyling: {
    width: '100%',
    height: '100%',
    zIndex: -100,
    position: 'absolute',
  },
});
