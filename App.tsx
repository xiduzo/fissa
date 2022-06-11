import {NavigationContainer} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {AuthConfiguration, authorize} from 'react-native-app-auth';
import ToastContainer from './components/atoms/Toast';
import Routes from './routes/Routes';
import AddContextProvider from './routes/session/Room.AddContext';

const App = () => {
  useMemo(async () => {
    const config: AuthConfiguration = {
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
        tokenEndpoint: 'https://fissa--token-api.herokuapp.com/api/token',
      },
    };

    try {
      console.log(config);
      const result = await authorize(config);

      console.log(result);
    } catch (e) {
      console.warn(e);
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
