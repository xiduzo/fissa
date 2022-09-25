import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const ArrowLeftIcon: FC<IconProps> = props => (
  <Icon
    {...props}
    source={require('../../../../assets/icons/arrow_left.svg')}
  />
);

export default ArrowLeftIcon;
