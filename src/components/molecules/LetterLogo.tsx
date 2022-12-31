import React, {FC, memo, useRef} from 'react';
import {Animated, Dimensions, View} from 'react-native';
import {themes} from '../../lib/types/Theme';
import LetterA from '../atoms/icons/LetterA';
import LetterF from '../atoms/icons/LetterF';
import LetterI from '../atoms/icons/LetterI';
import LetterS from '../atoms/icons/LetterS';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const letters = [LetterA, LetterF, LetterI, LetterS];
const MovableLetter: FC = () => {
  const Component = useRef(
    letters[Math.floor(Math.random() * letters.length)],
  ).current;

  return (
    <Animated.View
      style={{
        width: '100%',
        left: Math.random() * windowWidth,
        top: Math.random() * windowHeight,
        transform: [{rotate: Math.random() * 360 + 'deg'}],
      }}>
      <Component
        style={{
          position: 'absolute',

          tintColor:
            themes[Math.floor(Math.random() * themes.length)].main + '10',
          // tintColor: '#00000020',
          transform: [{scale: 0.5}],
        }}
      />
    </Animated.View>
  );
};

const LetterLogo: FC = memo(() => {
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
});

export default LetterLogo;
