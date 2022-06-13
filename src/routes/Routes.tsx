import React, {FC, useRef} from 'react';
import {Alert} from 'react-native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import IconButton from '../components/atoms/IconButton';
import QuestionMarkIcon from '../components/atoms/icons/QuestionMarkIcon';
import {Color} from '../types/Color';
import Home from './Home';
import Onboarding from './Onboarding';
import Header from './Routes.Header';
import FromPlaylist from './session/FromPlaylist';
import JoinSession from './session/JoinSession';
import NewSession from './session/NewSession';
import Room from './session/Room';
import AddFromPlaylist from './session/Room.AddFromPlaylist';
import SelectTracks from './session/Room.SelectTracks';

const RootStack = createSharedElementStackNavigator();

const Routes: FC = () => {
  const onboarding = useRef(false);

  return (
    <RootStack.Navigator
      initialRouteName={onboarding.current ? 'Onboarding' : 'Home'}
      screenOptions={{
        cardStyle: {
          backgroundColor: Color.dark,
        },
        header: Header,
      }}>
      <RootStack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{
          headerShown: false,
        }}
      />

      <RootStack.Screen name="Home" component={Home} />
      <RootStack.Screen name="NewSession" component={NewSession} />
      <RootStack.Screen
        name="JoinSession"
        options={{
          headerRight: () => (
            <IconButton title="hi" onPress={() => Alert.alert('hi there')}>
              <QuestionMarkIcon />
            </IconButton>
          ),
        }}
        component={JoinSession}
      />

      <RootStack.Screen name="FromPlaylist" component={FromPlaylist} />

      <RootStack.Screen
        name="Room"
        component={Room}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen name="AddFromPlaylist" component={AddFromPlaylist} />
      <RootStack.Screen
        name="SelectTracks"
        component={SelectTracks}
        sharedElements={() => ['tracks-to-add-drawer']}
      />
    </RootStack.Navigator>
  );
};

export type RootStackParamList = {
  Home: undefined;
  FromPlaylist?: {
    scrollHeight?: number;
  };
  SelectTracks: {
    playlistId: string;
  };
  NewSession: undefined;
  JoinSession: undefined;
  Room: {
    playlistId: string;
  };
  AddFromPlaylist: undefined;
  Onboarding: undefined;
};

export default Routes;
