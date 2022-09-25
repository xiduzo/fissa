import {FC} from 'react';
import Icon, {IconProps} from './_Icon';

const SpotifyIcon: FC<IconProps> = props => (
  <Icon {...props} source={require('../../../../assets/icons/spotify.svg')} />
);

export default SpotifyIcon;
