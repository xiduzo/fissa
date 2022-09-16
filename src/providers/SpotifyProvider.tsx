import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {AppState, NativeEventSubscription} from 'react-native';
import {
  AuthConfiguration,
  authorize,
  AuthorizeResult,
  refresh as spotifyApiRefresh,
} from 'react-native-app-auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import SpotifyWebApi from 'spotify-web-api-js';

interface SpotifyProviderState {
  spotify: SpotifyWebApi.SpotifyWebApiJs;
  auth: () => Promise<boolean>;
  currentUser?: SpotifyApi.CurrentUsersProfileResponse;
}

const initialState: SpotifyProviderState = {
  spotify: new SpotifyWebApi(),
  auth: async () => false,
};

const SpotifyContext = createContext<SpotifyProviderState>(initialState);

const BASE_TOKEN_ENDPOINT = 'https://server-xiduzo.vercel.app/api/token/';
const authConfig: AuthConfiguration = {
  usePKCE: false,
  clientId: 'a2a88c4618324942859ce3e1f888b938',
  redirectUrl: 'com.fissa:/oauth',
  scopes: [
    // Read
    'user-read-playback-state',
    'user-read-recently-played',
    'user-read-currently-playing',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    // Modify
    'playlist-modify-public',
    'playlist-modify-private',
    'user-modify-playback-state',
  ],
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
  const [currentUser, setCurrentUser] =
    useState<SpotifyApi.CurrentUsersProfileResponse>();

  const spotifyAuth = useCallback(async () => {
    try {
      const result = await authorize(authConfig);

      spotifyApi.current.setAccessToken(result.accessToken);
      EncryptedStorage.setItem('accessToken', JSON.stringify(result));
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const refresh = useCallback(async ({refreshToken, access_token}: Tokens) => {
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
      setCurrentUser(await spotifyApi.current.getMe());

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
      }, Math.max(0, Math.abs(new Date().getTime() - new Date(result.accessTokenExpirationDate).getTime()) - 60000));
    } catch (error) {
      console.error('refresh error', error);
    }
  }, []);

  useEffect(() => {
    let refreshTokenSubscription: NativeEventSubscription;
    const auth = async () => {
      try {
        const item = await EncryptedStorage.getItem('accessToken');

        const {accessTokenExpirationDate, refreshToken, accessToken} =
          JSON.parse(item ?? JSON.stringify('')) as AuthorizeResult;

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

          refreshTokenSubscription = AppState.addEventListener('change', () => {
            if (AppState.currentState !== 'active') return;
            refresh(tokens);
          });
        }
      } catch (error) {
        console.error('auth error', error);
      }
    };

    auth();

    return () => {
      refreshTokenSubscription?.remove();
    };
  }, [refresh]);

  return (
    <SpotifyContext.Provider
      value={{
        spotify: spotifyApi.current,
        auth: spotifyAuth,
        currentUser,
      }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => useContext(SpotifyContext);

export default SpotifyProvider;
