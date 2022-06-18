import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import ToastContainer from './src/components/atoms/Toast';
import SpotifyProvider from './src/providers/SpotifyProvider';
import Routes from './src/routes/Routes';
import AddContextProvider from './src/routes/session/Room.AddContext';
import PlaylistContextProvider from './src/routes/session/Room.PlaylistContext';

const App = () => {
  return (
    <SpotifyProvider>
      <NavigationContainer>
        <PlaylistContextProvider>
          <AddContextProvider>
            <Routes />
          </AddContextProvider>
        </PlaylistContextProvider>
        <ToastContainer />
      </NavigationContainer>
    </SpotifyProvider>
  );
};

export default App;
