import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const CloseIcon: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/close.svg')} />
);

export default CloseIcon;
