import {useContext} from 'react';
import {PlaylistContext} from '../providers/PlaylistProvider';

export const useRoom = () => {
  const context = useContext(PlaylistContext);

  if (!context) {
    throw new Error('useRoom must be used within a RoomPlaylistContext');
  }

  return {
    tracks: context.tracks,
    room: context.room,
    votes: context.votes,
    joinRoom: context.joinRoom,
  };
};
