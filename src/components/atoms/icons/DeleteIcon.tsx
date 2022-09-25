import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const DeleteIcon: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/delete.svg')} />
);

export default DeleteIcon;
