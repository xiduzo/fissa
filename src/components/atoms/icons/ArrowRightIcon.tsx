import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import React, {FC} from 'react';
import {Color} from '../../../types/Color';

interface ArrowRightIconProps extends Omit<VectorImageProps, 'source'> {}

const ArrowRightIcon: FC<ArrowRightIconProps> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../../assets/icons/arrow_right.svg')}
  />
);

export default ArrowRightIcon;
