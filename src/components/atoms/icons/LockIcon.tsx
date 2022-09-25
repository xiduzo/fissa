import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const LockIcon: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/lock.svg')} />
);

export default LockIcon;
