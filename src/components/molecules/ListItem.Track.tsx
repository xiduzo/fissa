import React, {FC} from 'react';
import {DEFAULT_IMAGE} from '../../lib/constants/Image';
import ProgressBar from '../atoms/ProgressBar';
import ListItem, {ListItemProps} from './ListItem';

interface TrackProps extends Partial<ListItemProps> {
  track?: SpotifyApi.TrackObjectFull;
  progressMs?: number;
  isPlaying?: boolean;
}

const Track: FC<TrackProps> = ({track, progressMs, isPlaying, ...props}) => {
  if (!track) return null;

  return (
    <ListItem
      imageUri={track.album.images[0]?.url ?? DEFAULT_IMAGE}
      title={track.name}
      subtitle={track.artists.map((x: any) => x.name).join(', ')}
      extra={
        <ProgressBar
          progress={
            progressMs !== undefined
              ? progressMs / track.duration_ms
              : undefined
          }
          track={track}
          isPlaying={isPlaying}
          style={{marginTop: 16}}
        />
      }
      {...props}
    />
  );
};

export default Track;
