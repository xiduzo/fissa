import React, {createContext, FC, useContext, useEffect, useRef} from 'react';
import {
  AuthConfiguration,
  authorize,
  refresh,
  AuthorizeResult,
} from 'react-native-app-auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import SpotifyWebApi from 'spotify-web-api-js';

interface SpotifyProviderState {
  spotify: SpotifyWebApi.SpotifyWebApiJs;
}

const initialState: SpotifyProviderState = {
  spotify: new SpotifyWebApi(),
};

const SpotifyContext = createContext<SpotifyProviderState>(initialState);

const authConfig: AuthConfiguration = {
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
    tokenEndpoint: 'https://fissa-spotify-token-swap.herokuapp.com/api/token',
  },
};
const SpotifyProvider: FC = ({children}) => {
  const spotifyApi = useRef(initialState.spotify);

  useEffect(() => {
    const auth = async () => {
      const item = await EncryptedStorage.getItem('accessToken');
      const {accessTokenExpirationDate, refreshToken, accessToken} = JSON.parse(
        item ?? JSON.stringify(''),
      ) as AuthorizeResult;

      if (accessToken) {
        // TODO: set timeout to update token
        if (new Date() < new Date(accessTokenExpirationDate)) {
          spotifyApi.current.setAccessToken(accessToken);
        }

        if (refreshToken) {
          console.log('refreshToken', refreshToken);
          const result = await refresh(
            {
              ...authConfig,
              serviceConfiguration: {
                ...authConfig.serviceConfiguration,
                tokenEndpoint:
                  authConfig.serviceConfiguration.tokenEndpoint.replace(
                    '/token',
                    '/refresh',
                  ),
              },
              additionalParameters: {
                access_token: accessToken,
              },
            },
            {
              refreshToken,
            },
          );

          spotifyApi.current.setAccessToken(result.accessToken);
          EncryptedStorage.setItem('accessToken', JSON.stringify(result));
        }

        return;
      }

      const result = await authorize(authConfig);
      spotifyApi.current.setAccessToken(result.accessToken);

      EncryptedStorage.setItem('accessToken', JSON.stringify(result));
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
