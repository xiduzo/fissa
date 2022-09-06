import {FC} from 'react';
import LottieView, {AnimatedLottieViewProps} from 'lottie-react-native';
import {Color} from '../../../types/Color';

interface AnimationProps extends Omit<AnimatedLottieViewProps, 'source'> {}

const Animation: FC<AnimationProps> = ({...props}) => {
  switch (Color.name) {
    case 'blueey':
      return (
        <LottieView
          autoPlay
          loop={false}
          source={require('../../../../assets/animations/animation_blueey.json')}
          {...props}
        />
      );
    case 'pinkey':
      return (
        <LottieView
          autoPlay
          loop={false}
          source={require('../../../../assets/animations/animation_pinkey.json')}
          {...props}
        />
      );
    case 'greeny':
      return (
        <LottieView
          autoPlay
          loop={false}
          source={require('../../../../assets/animations/animation_greeny.json')}
          {...props}
        />
      );
    case 'limey':
      return (
        <LottieView
          autoPlay
          loop={false}
          source={require('../../../../assets/animations/animation_limey.json')}
          {...props}
        />
      );
    case 'sunny':
      return (
        <LottieView
          autoPlay
          loop={false}
          source={require('../../../../assets/animations/animation_sunny.json')}
          {...props}
        />
      );
    // TODO add orangy lottie file
    case 'orangy':
    default:
      return (
        <LottieView
          autoPlay
          loop={false}
          source={require('../../../../assets/animations/animation_sunny.json')}
          {...props}
        />
      );
  }
};

export default Animation;
