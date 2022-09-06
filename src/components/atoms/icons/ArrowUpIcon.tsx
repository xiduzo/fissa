import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import {FC} from 'react';
import {Color} from '../../../types/Color';

interface ArrowUpIconProps extends Omit<VectorImageProps, 'source'> {}

const ArrowUpIcon: FC<ArrowUpIconProps> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../../assets/icons/arrow_up.svg')}
  />
);

export default ArrowUpIcon;
