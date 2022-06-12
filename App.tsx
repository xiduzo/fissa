import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import ToastContainer from './src/components/atoms/Toast';
import SpotifyProvider from './src/providers/SpotifyProvider';
import Routes from './src/routes/Routes';
import AddContextProvider from './src/routes/session/Room.AddContext';

const App = () => {
  return (
    <SpotifyProvider>
      <NavigationContainer>
        <AddContextProvider>
          <Routes />
        </AddContextProvider>
        <ToastContainer />
      </NavigationContainer>
    </SpotifyProvider>
  );
};

export default App;
