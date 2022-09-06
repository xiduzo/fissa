import VectorImage, {VectorImageProps} from 'react-native-vector-image';
import {FC} from 'react';
import {Color} from '../../../types/Color';

interface QuestionMarkIconProps extends Omit<VectorImageProps, 'source'> {}

const QuestionMarkIcon: FC<QuestionMarkIconProps> = ({style, ...props}) => (
  <VectorImage
    {...props}
    style={[{tintColor: Color.light}, style]}
    source={require('../../../../assets/icons/question_mark.svg')}
  />
);

export default QuestionMarkIcon;
