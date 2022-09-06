import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import {FC} from 'react';
import {Color} from '../../../types/Color';

interface ArrowDownIconProps extends Omit<VectorImageProps, 'source'> {}

const ArrowDownIcon: FC<ArrowDownIconProps> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../../assets/icons/arrow_down.svg')}
  />
);

export default ArrowDownIcon;
