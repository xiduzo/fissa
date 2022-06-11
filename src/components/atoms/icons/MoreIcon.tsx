import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import React, {FC} from 'react';
import {Color} from '../../../types/Color';

interface MoreIconProps extends Omit<VectorImageProps, 'source'> {}

const MoreIcon: FC<MoreIconProps> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../../assets/icons/more.svg')}
  />
);

export default MoreIcon;
