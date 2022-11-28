import {useSpotify} from '../providers/SpotifyProvider';
import {useRoom} from './useRoom';

export const useIsOwner = (pin: string) => {
  const {currentUser} = useSpotify();
  const {room} = useRoom(pin);

  return {
    isOwner: room?.createdBy === currentUser?.id,
  };
};
