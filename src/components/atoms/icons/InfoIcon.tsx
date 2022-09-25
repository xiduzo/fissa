import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const InfoIcon: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/info.svg')} />
);

export default InfoIcon;
