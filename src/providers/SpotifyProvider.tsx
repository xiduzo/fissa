import AsyncStorage from '@react-native-community/async-storage';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
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
import {TOKEN_ENDPOINT} from '../lib/constants/Endpoint';
import Notification from '../lib/utils/Notification';

interface SpotifyProviderState {
  spotify: SpotifyWebApi.SpotifyWebApiJs;
  auth: () => Promise<SpotifyApi.CurrentUsersProfileResponse | undefined>;
  refreshToken?: string | null;
  currentUser?: SpotifyApi.CurrentUsersProfileResponse;
}

const initialState: SpotifyProviderState = {
  spotify: new SpotifyWebApi(),
  auth: async () => undefined,
};

const SpotifyContext = createContext<SpotifyProviderState>(initialState);

const SCOPES_VERSION = '1';

const authConfig: AuthConfiguration = {
  usePKCE: false,
  clientId: 'a2a88c4618324942859ce3e1f888b938',
  redirectUrl: 'com.fissa:/oauth',
  scopes: [
    // Read
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-top-read',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    // Modify
    'playlist-modify-public',
    'user-modify-playback-state',
    'user-library-modify',
  ],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: TOKEN_ENDPOINT,
  },
};

type Tokens = {
  refreshToken: string;
  access_token: string;
};

const SpotifyProvider: FC = ({children}) => {
  const spotifyApi = useRef(initialState.spotify);
  const localRefreshToken = useRef<string | null>('');
  const [currentUser, setCurrentUser] =
    useState<SpotifyApi.CurrentUsersProfileResponse>();

  const spotifyAuth = useCallback(async () => {
    try {
      const result = await authorize(authConfig);

      spotifyApi.current.setAccessToken(result.accessToken);
      EncryptedStorage.setItem('accessToken', JSON.stringify(result));
      AsyncStorage.setItem('scopesVersion', SCOPES_VERSION);
      setCurrentUser(await spotifyApi.current.getMe());
      return await spotifyApi.current.getMe();
    } catch {
      Notification.show({
        type: 'error',
        message: 'Something went wrong while connecting to Spotify',
      });
    }
  }, []);

  const refresh = useCallback(async ({refreshToken, access_token}: Tokens) => {
    if (!refreshToken) return;
    if (!access_token) return;

    const scopesVersion = await AsyncStorage.getItem('scopesVersion');
    if (scopesVersion !== SCOPES_VERSION) {
      return;
    }

    try {
      const result = await spotifyApiRefresh(
        {
          ...authConfig,
          serviceConfiguration: {
            ...authConfig.serviceConfiguration,
            tokenEndpoint: TOKEN_ENDPOINT + '/refresh',
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
      localRefreshToken.current = refreshToken;
      setCurrentUser(await spotifyApi.current.getMe());

      EncryptedStorage.setItem(
        'accessToken',
        JSON.stringify({
          ...result,
          refreshToken, // keep the refresh token
        }),
      );
    } catch (error) {
      console.error('refresh error', error);
    }
  }, []);

  // Set user when token is present
  useEffect(() => {
    EncryptedStorage.getItem('accessToken').then(async value => {
      if (!value) return;

      const {accessTokenExpirationDate, accessToken, refreshToken} = JSON.parse(
        value,
      ) as AuthorizeResult;

      if (
        accessTokenExpirationDate &&
        new Date() < new Date(accessTokenExpirationDate)
      ) {
        spotifyApi.current.setAccessToken(accessToken);
        spotifyApi.current.getMe().then(async user => {
          const scopesVersion = await AsyncStorage.getItem('scopesVersion');
          if (scopesVersion !== SCOPES_VERSION) return;
          setCurrentUser(user);
        });
      }

      if (accessToken && refreshToken) {
        await refresh({refreshToken, access_token: accessToken});
      }
    });
  }, [refresh]);

  useEffect(() => {
    let refreshTokenSubscription: NativeEventSubscription;

    EncryptedStorage.getItem('accessToken').then(value => {
      if (!value) return;

      const {accessToken, refreshToken} = JSON.parse(value) as AuthorizeResult;

      localRefreshToken.current = refreshToken;
      refreshTokenSubscription = AppState.addEventListener(
        'change',
        async () => {
          if (AppState.currentState !== 'active') return;
          await refresh({refreshToken, access_token: accessToken});
        },
      );
    });

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
        refreshToken: localRefreshToken.current,
      }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => useContext(SpotifyContext);

export default SpotifyProvider;
