import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import React, {FC} from 'react';
import {Color} from '../../../types/Color';

interface AddIconProps extends Omit<VectorImageProps, 'source'> {}

const AddIcon: FC<AddIconProps> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../assets/icons/add.svg')}
  />
);

export default AddIcon;
