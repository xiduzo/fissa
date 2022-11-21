import {FC} from 'react';
import {StyleSheet} from 'react-native';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import {Color} from '../../lib/types/Theme';

const Image: FC<FastImageProps> = ({style, ...props}) => {
  return <FastImage style={[styles.image, style]} {...props} />;
};

export default Image;

const styles = StyleSheet.create({
  image: {
    borderRadius: 12,
    backgroundColor: Color.light + 40,
  },
});
