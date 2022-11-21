import {Track} from './Track';

export type RootStackParamList = {
  Home: undefined;
  FromPlaylist?: {
    scrollHeight?: number;
  };
  NewSession: undefined;
  JoinSession: undefined;
  SaveToPlaylist: {
    track: Track;
  };
  Room: {
    pin: string;
  };
  AddTracks: undefined;
  Initial: undefined;
};

export type SharedElementStackParamList = {
  AddFromPlaylist: undefined;
  SelectTracks: {
    playlistId: string;
  };
};
