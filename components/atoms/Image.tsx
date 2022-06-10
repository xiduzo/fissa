import React, {FC} from 'react';
import {Image, ImageProps, StyleSheet} from 'react-native';
import {Color} from '../../types/Color';

const LocalImage: FC<ImageProps> = ({style, source, ...props}) => {
  return <Image style={[styles.image, style]} source={source} {...props} />;
};

export default LocalImage;

const styles = StyleSheet.create({
  image: {
    borderRadius: 12,
    backgroundColor: Color.light,
  },
});
