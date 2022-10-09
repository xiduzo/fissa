import React, {FC, useCallback, useEffect, useState} from 'react';
import {SAVED_TRACK_IMAGE_URL} from '../../lib/constants/Images';
import {useSpotify} from '../../providers/SpotifyProvider';
import Playlist from '../molecules/ListItem.Playlist';

interface PlaylistProps {
  onPlaylistPress?: (playlist: SpotifyApi.PlaylistObjectSimplified) => void;
}

const Playlists: FC<PlaylistProps> = ({onPlaylistPress}) => {
  const {spotify} = useSpotify();

  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);

  const handlePlaylistPress = useCallback(
    (playlist: SpotifyApi.PlaylistObjectSimplified) => () => {
      onPlaylistPress && onPlaylistPress(playlist);
    },
    [onPlaylistPress],
  );

  useEffect(() => {
    spotify.getUserPlaylists().then(result => {
      setPlaylists(result.items);
      spotify.getMySavedTracks().then(savedTracks => {
        if (savedTracks.items.length <= 0) return;
        setPlaylists(prev => [
          {
            name: 'Saved Tracks',
            description: 'Your liked songs',
            id: 'saved-tracks',
            images: [
              {
                url: SAVED_TRACK_IMAGE_URL,
              },
            ],
          } as any as SpotifyApi.PlaylistObjectSimplified,
          ...prev,
        ]);
      });
    });
  }, [spotify]);

  return (
    <>
      {playlists.map(playlist => (
        <Playlist
          playlist={playlist}
          key={playlist.id}
          onPress={handlePlaylistPress(playlist)}
        />
      ))}
    </>
  );
};

export default Playlists;
