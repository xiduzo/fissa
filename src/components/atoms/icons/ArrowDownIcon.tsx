import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const ArrowDownIcon: FC<IconProps> = props => (
  <Icon
    {...props}
    source={require('../../../../assets/icons/arrow_down.svg')}
  />
);

export default ArrowDownIcon;
