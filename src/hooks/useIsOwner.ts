import {useRoomPlaylist} from '../providers/PlaylistProvider';
import {useSpotify} from '../providers/SpotifyProvider';

export const useIsOwner = (pin: string) => {
  const {currentUser} = useSpotify();
  const {room} = useRoomPlaylist(pin);

  return {
    isOwner: room?.createdBy === currentUser?.id,
  };
};
