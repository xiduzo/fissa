import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  AuthConfiguration,
  authorize,
  AuthorizeResult,
} from 'react-native-app-auth';
import SpotifyWebApi from 'spotify-web-api-js';

interface SpotifyProviderState {
  spotify: SpotifyWebApi.SpotifyWebApiJs;
}

const initialState: SpotifyProviderState = {
  spotify: new SpotifyWebApi(),
};

const SpotifyContext = createContext<SpotifyProviderState>(initialState);

const SpotifyProvider: FC = ({children}) => {
  const spotifyApi = useRef(initialState.spotify);

  useEffect(() => {
    const config: AuthConfiguration = {
      usePKCE: false,
      clientId: 'a2a88c4618324942859ce3e1f888b938', // available on the app page
      redirectUrl: 'com.fissa:/oauth', // the redirect you defined after creating the app
      scopes: [
        'user-modify-playback-state',
        'user-read-playback-state',
        'user-read-recently-played',
        'user-read-currently-playing',
        'playlist-modify-public',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
      ], // the scopes you need to access
      serviceConfiguration: {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint:
          'https://fissa-spotify-token-swap.herokuapp.com/api/token',
      },
    };

    const auth = async () => {
      const item = await EncryptedStorage.getItem('accessToken');
      const {accessTokenExpirationDate, refreshToken, accessToken} = JSON.parse(
        item ?? JSON.stringify(''),
      ) as AuthorizeResult;

      // TODO: set timeout to update token
      if (refreshToken) {
        console.log('refreshToken', refreshToken);
      }

      if (new Date() < new Date(accessTokenExpirationDate)) {
        if (accessToken) {
          spotifyApi.current.setAccessToken(accessToken);
        }
        // Token is still valid
        console.log('token still valid');
        return;
      }

      console.log('fetching token');
      const result = await authorize(config);
      console.log('got token', result);

      await EncryptedStorage.setItem('accessToken', JSON.stringify(result));
    };

    try {
      auth();
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotify: spotifyApi.current,
      }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => useContext(SpotifyContext);

export default SpotifyProvider;
