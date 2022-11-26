import React, {FC, useCallback, useEffect, useState} from 'react';
import {SAVED_TRACK_IMAGE_URL} from '../../lib/constants/Images';
import {SAVED_TRACKS_PLAYLIST_ID} from '../../lib/constants/Playlist';
import {useSpotify} from '../../providers/SpotifyProvider';
import Playlist from '../molecules/ListItem.Playlist';

interface PlaylistProps {
  onPlaylistPress?: (playlist: SpotifyApi.PlaylistObjectSimplified) => void;
  filter?: string;
}

const Playlists: FC<PlaylistProps> = ({onPlaylistPress, filter}) => {
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

  const fetchPlaylists = useCallback(
    async (offset = 0) => {
      spotify.getUserPlaylists(undefined, {offset}).then(({items, next}) => {
        setPlaylists(prev => [...prev, ...items]);
        if (next) fetchPlaylists(offset + items.length);
      });
    },
    [spotify],
  );

  useEffect(() => {
    fetchPlaylists();
    spotify.getMySavedTracks().then(savedTracks => {
      if (savedTracks.items.length <= 0) return;
      setPlaylists(prev => [
        {
          name: 'Saved Tracks',
          description: 'Your liked songs',
          id: SAVED_TRACKS_PLAYLIST_ID,
          images: [
            {
              url: SAVED_TRACK_IMAGE_URL,
            },
          ],
        } as any as SpotifyApi.PlaylistObjectSimplified,
        ...prev,
      ]);
    });
  }, [spotify, fetchPlaylists]);

  return (
    <>
      {playlists
        .filter(playlist => {
          if (!filter) return playlist;

          const hasTitle = playlist.name
            .toLowerCase()
            .includes(filter.toLowerCase());
          const hasOwner = playlist.owner?.display_name
            ?.toLowerCase()
            .includes(filter.toLowerCase());
          const hasDescription = playlist.description
            ?.toLowerCase()
            .includes(filter.toLowerCase());

          return hasTitle || hasOwner || hasDescription;
        })
        .map(playlist => (
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
