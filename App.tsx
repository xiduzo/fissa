import {NavigationContainer} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {
  AuthConfiguration,
  authorize,
  refresh,
  AuthorizeResult,
} from 'react-native-app-auth';
import ToastContainer from './components/atoms/Toast';
import Routes from './routes/Routes';
import AddContextProvider from './routes/session/Room.AddContext';
import EncryptedStorage from 'react-native-encrypted-storage';

const App = () => {
  useMemo(async () => {
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

    try {
      const item = await EncryptedStorage.getItem('accessToken');
      const {accessTokenExpirationDate, refreshToken} = JSON.parse(
        item ?? '',
      ) as AuthorizeResult;

      // TODO: set timeout to update token
      if (refreshToken) {
        console.log('refreshToken', refreshToken);
      }
      if (new Date() < new Date(accessTokenExpirationDate)) {
        // Token is still valid
        console.log('token still valid');
        return;
      }

      console.log('fetching token');
      const result = await authorize(config);
      console.log('got token', result);

      await EncryptedStorage.setItem('accessToken', JSON.stringify(result));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <NavigationContainer>
      <AddContextProvider>
        <Routes />
      </AddContextProvider>
      <ToastContainer />
    </NavigationContainer>
  );
};

export default App;
