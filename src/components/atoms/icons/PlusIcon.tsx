import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const PlusIcons: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/plus.svg')} />
);

export default PlusIcons;
