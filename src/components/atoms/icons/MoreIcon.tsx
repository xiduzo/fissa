import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const MoreIcon: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/more.svg')} />
);

export default MoreIcon;
