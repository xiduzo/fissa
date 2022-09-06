import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import {FC} from 'react';
import {Color} from '../../../types/Color';

interface CloseIconProps extends Omit<VectorImageProps, 'source'> {}

const CLoseIcon: FC<CloseIconProps> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../../assets/icons/close.svg')}
  />
);

export default CLoseIcon;
