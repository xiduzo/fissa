import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import {FC} from 'react';
import {Color} from '../../../types/Color';

interface InfoIconProps extends Omit<VectorImageProps, 'source'> {}

const InfoIcon: FC<InfoIconProps> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../../assets/icons/info.svg')}
  />
);

export default InfoIcon;
