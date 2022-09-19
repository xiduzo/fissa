import {FC, useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {DotProps} from 'react-native-onboarding-swiper';
import {Color} from '../types/Color';

const DotComponent: FC<DotProps> = ({selected, ...props}) => {
  const widthAnimation = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const animate = (config?: Partial<Animated.TimingAnimationConfig>) => {
      Animated.timing(widthAnimation, {
        toValue: 8,
        duration: 150,
        useNativeDriver: false,
        ...(config ?? {}),
      }).start();
    };

    selected ? animate({toValue: 24}) : animate();
  }, [selected]);

  return (
    <LinearGradient
      colors={selected ? Color.gradient.colors : [Color.light]}
      {...props}
      style={[styles.dot]}>
      <Animated.View
        style={{
          width: widthAnimation,
        }}
      />
    </LinearGradient>
  );
};

export default DotComponent;

const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: 90,
    marginHorizontal: 4,
  },
});
