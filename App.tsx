import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import ToastContainer from './components/atoms/Toast';
import Routes from './routes/Routes';
import AddContextProvider from './routes/session/Room.AddContext';

const App = () => {
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
