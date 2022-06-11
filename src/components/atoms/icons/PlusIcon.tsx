import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import React, {FC} from 'react';
import {Color} from '../../../types/Color';

interface PlusIconProps extends Omit<VectorImageProps, 'source'> {}

const PlusIcons: FC<PlusIconProps> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../../assets/icons/plus.svg')}
  />
);

export default PlusIcons;
