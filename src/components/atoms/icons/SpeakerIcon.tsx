import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const SpeakerIcon: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/speaker.svg')} />
);

export default SpeakerIcon;
