import React, {FC} from 'react';
import {DEFAULT_IMAGE} from '../../lib/constants/Image';
import ListItem, {ListItemProps} from './ListItem';

interface TrackProps extends Partial<ListItemProps> {
  track?: SpotifyApi.TrackObjectFull;
}

const Track: FC<TrackProps> = ({track, ...props}) => {
  if (!track) return null;

  return (
    <ListItem
      imageUri={track.album.images[0]?.url ?? DEFAULT_IMAGE}
      title={track.name}
      subtitle={track.artists.map((x: any) => x.name).join(', ')}
      {...props}
    />
  );
};

export default Track;
