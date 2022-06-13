import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import React, {FC} from 'react';
import {Color} from '../../../types/Color';

interface ArrowUpIcon extends Omit<VectorImageProps, 'source'> {}

const ArrowUpIcon: FC<ArrowUpIcon> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../../assets/icons/arrow_up.svg')}
  />
);

export default ArrowUpIcon;