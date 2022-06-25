import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {AppState, NativeEventSubscription} from 'react-native';
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

const BASE_TOKEN_ENDPOINT = 'https://server-xiduzo.vercel.app/api/token/';
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
type Tokens = {
  refreshToken: string;
  access_token: string;
};

const SpotifyProvider: FC = ({children}) => {
  const spotifyApi = useRef(initialState.spotify);

  const spotifyAuth = useCallback(async () => {
    const result = await authorize(authConfig);

    spotifyApi.current.setAccessToken(result.accessToken);
    EncryptedStorage.setItem('accessToken', JSON.stringify(result));
  }, []);

  const refresh = useCallback(
    async ({refreshToken, access_token}: Tokens) => {
      try {
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
      } catch (e) {
        await spotifyAuth();
      }
    },
    [spotifyAuth],
  );

  useEffect(() => {
    let subscription: NativeEventSubscription;
    const auth = async () => {
      const item = await EncryptedStorage.getItem('accessToken');
      const {accessTokenExpirationDate, refreshToken, accessToken} = JSON.parse(
        item ?? JSON.stringify(''),
      ) as AuthorizeResult;

      // TODO: if access token is invalid, just auth
      if (accessToken && refreshToken) {
        // Current token is still valid, lets use it while it lasts
        if (new Date() < new Date(accessTokenExpirationDate)) {
          spotifyApi.current.setAccessToken(accessToken);
        }

        const tokens = {
          refreshToken,
          access_token: accessToken,
        };

        refresh(tokens);

        subscription = AppState.addEventListener('change', () => {
          if (AppState.currentState !== 'active') {
            return;
          }
          refresh(tokens);
        });

        return;
      }

      await spotifyAuth();
    };

    const removeSubscription = () => subscription.remove();

    try {
      auth();
    } catch (e) {
      console.error('error', e);
    }

    return removeSubscription;
  }, [refresh, spotifyAuth]);

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
