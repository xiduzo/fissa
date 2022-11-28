import {useContext, useEffect} from 'react';
import {PlaylistContext} from '../providers/PlaylistProvider';

export const useRoom = (pin?: string) => {
  const context = useContext(PlaylistContext);

  if (!context) {
    throw new Error('useRoom must be used within a RoomPlaylistContext');
  }

  useEffect(() => {
    if (!pin) return;

    context.joinRoom(pin);
  }, [context, pin]);

  return {
    tracks: context.tracks,
    room: context.room,
    votes: context.votes,
    leaveRoom: context.leaveRoom,
  };
};
