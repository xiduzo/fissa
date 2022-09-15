import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import {FC} from 'react';
import {Color} from '../../../types/Color';

interface LockIconProps extends Omit<VectorImageProps, 'source'> {}

const LockIcon: FC<LockIconProps> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../../assets/icons/lock.svg')}
  />
);

export default LockIcon;
