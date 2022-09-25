import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const CLoseIcon: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/close.svg')} />
);

export default CLoseIcon;
