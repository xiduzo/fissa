import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const ArrowUpIcon: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/arrow_up.svg')} />
);

export default ArrowUpIcon;
