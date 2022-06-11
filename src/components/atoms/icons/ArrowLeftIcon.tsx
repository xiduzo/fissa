import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import React, {FC} from 'react';
import {Color} from '../../../types/Color';

interface ArrowIconProps extends Omit<VectorImageProps, 'source'> {}

const ArrowLeftIcon: FC<ArrowIconProps> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../../assets/icons/arrow_left.svg')}
  />
);

export default ArrowLeftIcon;
