import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const LetterA: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/letter_a.svg')} />
);

export default LetterA;
