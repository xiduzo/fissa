import React, {FC} from 'react';
import {DEFAULT_IMAGE} from '../../lib/constants/Image';
import ListItem, {ListItemProps} from './ListItem';

interface PlaylistProps extends Partial<ListItemProps> {
  playlist?:
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.PlaylistObjectSimplified;
  imageStyle?: {
    width?: number;
    height?: number;
  };
}

const Playlist: FC<PlaylistProps> = ({playlist, ...props}) => {
  if (!playlist) {
    return null;
  }

  return (
    <ListItem
      imageUri={playlist.images[0]?.url ?? DEFAULT_IMAGE}
      title={playlist.name}
      subtitle={playlist.owner.display_name ?? playlist.description ?? ''}
      {...props}
    />
  );
};

export default Playlist;
