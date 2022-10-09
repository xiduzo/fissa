import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import NetworkMonitor from './src/components/atoms/NetworkMonitor';
import ToastContainer from './src/components/atoms/Toast';
import SpotifyProvider from './src/providers/SpotifyProvider';
import Routes from './src/routes/Routes';
import AddTracksProvider from './src/providers/AddTracksProvider';
import PlaylistProvider from './src/providers/PlaylistProvider';

const App = () => {
  return (
    <SpotifyProvider>
      <NavigationContainer>
        <PlaylistProvider>
          <AddTracksProvider>
            <Routes />
            <NetworkMonitor />
          </AddTracksProvider>
        </PlaylistProvider>
        <ToastContainer />
      </NavigationContainer>
    </SpotifyProvider>
  );
};

export default App;
