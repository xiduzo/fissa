import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const GroupIcon: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/group.svg')} />
);

export default GroupIcon;
