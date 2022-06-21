import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
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
          source={require(`../../../../assets/animations/animation_blueey.json`)}
          {...props}
        />
      );
    case 'pinkey':
      return null;
    //   return (
    //     <LottieView
    //       autoPlay
    //       loop={false}
    //       source={require(`../../../../assets/animations/animation_pinkey.json`)}
    //       {...props}
    //     />
    //   );
    case 'greeny':
      return (
        <LottieView
          autoPlay
          loop={false}
          source={require(`../../../../assets/animations/animation_greeny.json`)}
          {...props}
        />
      );
    case 'orangy':
      return null;
    //   return (
    //     <LottieView
    //       autoPlay
    //       loop={false}
    //       source={require(`../../../../assets/animations/animation_greeny_orangy.json`)}
    //       {...props}
    //     />
    //   );
    case 'limey':
      return (
        <LottieView
          autoPlay
          loop={false}
          source={require(`../../../../assets/animations/animation_limey.json`)}
          {...props}
        />
      );
    case 'sunny':
      return (
        <LottieView
          autoPlay
          loop={false}
          source={require(`../../../../assets/animations/animation_sunny.json`)}
          {...props}
        />
      );
    default:
      return null;
  }
};

export default Animation;

const styles = StyleSheet.create({});
