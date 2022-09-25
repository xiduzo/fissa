import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const QuestionMarkIcon: FC<IconProps> = props => (
  <Icon
    {...props}
    source={require('../../../../assets/icons/question_mark.svg')}
  />
);

export default QuestionMarkIcon;
