import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import LetterA from '../atoms/icons/LetterA';
import LetterF from '../atoms/icons/LetterF';
import LetterI from '../atoms/icons/LetterI';
import LetterS from '../atoms/icons/LetterS';
import {IconProps} from '../atoms/icons/_Icon';

interface MovableLetterProps extends IconProps {
  bottom?: number;
  left?: number;
  top?: number;
  right?: number;
  scale?: number;
  rotate?: number;
  Component: FC<IconProps>;
}
const MovableLetter: FC<MovableLetterProps> = ({
  scale = 1,
  rotate = 0,
  Component,
  ...iconProps
}) => {
  console.log(scale, rotate, iconProps);
  return (
    <Component
      {...iconProps}
      style={{
        position: 'absolute',
        transform: [{rotate: `${rotate}deg`}, {scale}],
        // tintColor: '#00000020',
        tintColor: '#FFFFFF',
      }}
    />
  );
};

const LetterLogo: FC = () => {
  return (
    <View style={styles.container}>
      <MovableLetter
        Component={LetterF}
        // left={-15}
        right={20}
        // top={-5}
        //   rotate={-30}
      />
      <MovableLetter Component={LetterI} right={10} />
      <MovableLetter Component={LetterS} />
      <MovableLetter Component={LetterS} />
      <MovableLetter Component={LetterA} />
    </View>
  );
};

export default LetterLogo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    position: 'absolute',
    width: '100%',
    zIndex: -1,
    elevation: -1,
    marginTop: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{scale: 2}],
  },
});
