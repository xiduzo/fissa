import React, {createContext, FC, useContext, useEffect, useRef} from 'react';
import {
  AuthConfiguration,
  authorize,
  refresh as spotifyApiRefresh,
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

const BASE_TOKEN_ENDPOINT =
  'https://fissa-spotify-swap-api-xiduzo.vercel.app/api/token/';
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
    tokenEndpoint: BASE_TOKEN_ENDPOINT,
  },
};
const SpotifyProvider: FC = ({children}) => {
  const spotifyApi = useRef(initialState.spotify);

  useEffect(() => {
    const refresh = async ({
      refreshToken,
      access_token,
    }: {
      refreshToken: string;
      access_token: string;
    }) => {
      const result = await spotifyApiRefresh(
        {
          ...authConfig,
          serviceConfiguration: {
            ...authConfig.serviceConfiguration,
            tokenEndpoint: BASE_TOKEN_ENDPOINT + 'refresh',
          },
          additionalParameters: {
            access_token,
          },
        },
        {
          refreshToken,
        },
      );

      spotifyApi.current.setAccessToken(result.accessToken);
      EncryptedStorage.setItem(
        'accessToken',
        JSON.stringify({
          ...result,
          refreshToken, // keep the refresh token in the encrypted storage
        }),
      );

      setTimeout(() => {
        refresh({
          refreshToken,
          access_token: result.accessToken,
        });
      }, Math.max(0, Math.abs(new Date().getTime() - new Date(result.accessTokenExpirationDate).getTime()) - 60_000));
    };

    const auth = async () => {
      const item = await EncryptedStorage.getItem('accessToken');
      const {accessTokenExpirationDate, refreshToken, accessToken} = JSON.parse(
        item ?? JSON.stringify(''),
      ) as AuthorizeResult;

      if (accessToken && refreshToken) {
        // Current token is still valid, lets use it while it lasts
        if (new Date() < new Date(accessTokenExpirationDate)) {
          spotifyApi.current.setAccessToken(accessToken);
        }

        refresh({
          refreshToken,
          access_token: accessToken,
        });

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
