import React, {FC, useRef} from 'react';
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
  const rotate = useRef(Math.random() * 360);

  const Component = useRef(
    [LetterA, LetterF, LetterI, LetterS][Math.floor(Math.random() * 4)],
  ).current;

  return (
    <Animated.View
      style={{
        width: '100%',
        left: prevPos.current.x,
        top: prevPos.current.y,
        transform: [{rotate: rotate.current + 'deg'}],
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
