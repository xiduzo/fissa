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

interface SpotifyProviderState {
  spotify: SpotifyWebApi.SpotifyWebApiJs;
  auth: () => Promise<void>;
  refreshToken?: string | null;
  currentUser?: SpotifyApi.CurrentUsersProfileResponse;
}

const initialState: SpotifyProviderState = {
  spotify: new SpotifyWebApi(),
  auth: async () => {},
};

const SpotifyContext = createContext<SpotifyProviderState>(initialState);

const authConfig: AuthConfiguration = {
  usePKCE: false,
  clientId: 'a2a88c4618324942859ce3e1f888b938',
  redirectUrl: 'com.fissa:/oauth',
  scopes: [
    // Read
    'user-read-playback-state',
    'user-read-recently-played',
    'user-read-currently-playing',
    'user-top-read',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    // Modify
    'playlist-modify-public',
    'user-modify-playback-state',
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
      setCurrentUser(await spotifyApi.current.getMe());
    } catch (error) {
      console.error(`spotifyAuth error: ${error}`);
    }
  }, []);

  const refresh = useCallback(async ({refreshToken, access_token}: Tokens) => {
    if (!refreshToken) return;
    if (!access_token) return;
    console.log('refresh token');

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
      localRefreshToken.current = result.refreshToken;
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
    EncryptedStorage.getItem('accessToken').then(value => {
      if (!value) return;

      const {accessTokenExpirationDate, accessToken, refreshToken} = JSON.parse(
        value,
      ) as AuthorizeResult;

      console.log('accessTokenExpirationDate', accessTokenExpirationDate);
      if (
        accessTokenExpirationDate &&
        new Date() < new Date(accessTokenExpirationDate)
      ) {
        spotifyApi.current.setAccessToken(accessToken);
        spotifyApi.current.getMe().then(user => {
          setCurrentUser(user);
        });
        return;
      }

      refresh({refreshToken, access_token: accessToken});
    });
  }, []);

  useEffect(() => {
    let refreshTokenSubscription: NativeEventSubscription;
    let refreshTimeout: NodeJS.Timeout;

    const refreshTokenOnBackground = (
      refreshToken: string,
      access_token: string,
    ) => {
      refreshTimeout = setTimeout(() => {
        console.log('refresh token due to timeout');
        refresh({refreshToken, access_token});
        refreshTokenOnBackground(refreshToken, access_token);
      }, 1000 * 60 * 20);
    };
    EncryptedStorage.getItem('accessToken').then(value => {
      if (!value) return;

      const {accessToken, refreshToken} = JSON.parse(value) as AuthorizeResult;

      localRefreshToken.current = refreshToken;
      // TODO: set background progress to refresh the token each ~20 minutes instead of this hack
      console.log('add token subscription & token refresh on background');
      refreshTokenOnBackground(accessToken, refreshToken);
      refreshTokenSubscription = AppState.addEventListener('change', () => {
        if (AppState.currentState !== 'active') return;
        refresh({refreshToken, access_token: accessToken});
      });
    });

    return () => {
      console.log('reset subscription and timeout');
      refreshTokenSubscription?.remove();
      clearTimeout(refreshTimeout);
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
