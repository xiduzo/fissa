import React, {FC, useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, View} from 'react-native';
import LetterA from '../atoms/icons/LetterA';
import LetterF from '../atoms/icons/LetterF';
import LetterI from '../atoms/icons/LetterI';
import LetterS from '../atoms/icons/LetterS';
import {IconProps} from '../atoms/icons/_Icon';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface MovableLetterProps extends IconProps {}
const MovableLetter: FC<MovableLetterProps> = ({...iconProps}) => {
  const prevPos = useRef({
    x: Math.random() * windowWidth,
    y: Math.random() * windowHeight,
  });

  const positionAnimation = new Animated.ValueXY(prevPos.current);
  const rotationAnimation = new Animated.Value(Math.random() * 360);

  const Component = useRef(
    [LetterA, LetterF, LetterI, LetterS][Math.floor(Math.random() * 4)],
  ).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    const move = () => {
      console.log('move');
      const {x, y} = prevPos.current;
      const newX = (Math.random() * windowWidth) / 10;
      const newY = (Math.random() * windowHeight) / 10;
      const newRotation = Math.random() * 360;
      const animationTime = 60_000;
      const newPos = {
        x: Math.max(
          0,
          Math.min(windowWidth, x + (Math.random() > 0.5 ? newX : -newX)),
        ),
        y: Math.max(
          0,
          Math.min(windowHeight, y + (Math.random() > 0.5 ? newY : -newY)),
        ),
      };

      prevPos.current = newPos;

      animation = Animated.parallel([
        Animated.timing(positionAnimation, {
          duration: animationTime,
          toValue: newPos,
          useNativeDriver: false,
        }),
        Animated.timing(rotationAnimation, {
          duration: animationTime,
          toValue: Math.random() > 0.5 ? newRotation : -newRotation,
          useNativeDriver: false,
        }),
      ]);

      animation.start(move);
    };

    move();

    return () => {
      console.log('stop animation');
      animation.stop();
    };
  }, []);

  const rotationAnimationInterpolate = rotationAnimation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        width: '100%',
        left: positionAnimation.x,
        top: positionAnimation.y,
        transform: [{rotate: rotationAnimationInterpolate}],
      }}>
      <Component
        {...iconProps}
        style={{
          position: 'absolute',

          tintColor: '#00000020',
          // tintColor: 'red',
          transform: [{scale: 0.5}],
        }}
      />
    </Animated.View>
  );
};

const LetterLogo: FC = () => {
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: -1,
        width: '100%',
        height: '100%',
      }}>
      {Array.from({length: 50}).map((_, index) => (
        <MovableLetter key={index} />
      ))}
    </View>
  );
};

export default LetterLogo;
