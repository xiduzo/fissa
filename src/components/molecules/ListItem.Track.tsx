import React, {FC} from 'react';
import {DEFAULT_IMAGE} from '../../lib/constants/Image';
import ListItem, {ListItemProps} from './ListItem';
import {Color} from '../../types/Color';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressBar from '../atoms/ProgressBar';

interface TrackProps extends Partial<ListItemProps> {
  track?: SpotifyApi.TrackObjectFull;
  progressPercentage?: number;
}

const Track: FC<TrackProps> = ({track, progressPercentage, ...props}) => {
  if (!track) return null;

  return (
    <ListItem
      imageUri={track.album.images[0]?.url ?? DEFAULT_IMAGE}
      title={track.name}
      subtitle={track.artists.map((x: any) => x.name).join(', ')}
      extra={
        <ProgressBar progress={progressPercentage} style={{marginTop: 16}} />
      }
      {...props}
    />
  );
};

export default Track;
