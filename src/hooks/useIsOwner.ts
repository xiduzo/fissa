import {useSpotify} from '../providers/SpotifyProvider';
import {useRoom} from './useRoom';

export const useIsOwner = () => {
  const {currentUser} = useSpotify();
  const {room} = useRoom();

  return {
    isOwner: room?.createdBy === currentUser?.id,
  };
};
