import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {FC, useRef} from 'react';
import {Alert} from 'react-native';
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

const RootStack = createNativeStackNavigator();

const Routes: FC = () => {
  const onboarding = useRef(true);

  return (
    <RootStack.Navigator
      initialRouteName={onboarding.current ? 'Onboarding' : 'Home'}
      screenOptions={{
        contentStyle: {
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

      <RootStack.Group
        navigationKey="WithPadding"
        screenOptions={{
          contentStyle: {
            paddingHorizontal: 24,
            backgroundColor: Color.dark,
          },
        }}>
        <RootStack.Screen
          name="Home"
          options={{
            animation: 'fade_from_bottom',
          }}
          component={Home}
        />
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
      </RootStack.Group>

      <RootStack.Screen name="FromPlaylist" component={FromPlaylist} />

      <RootStack.Group navigationKey="RoomGroup">
        <RootStack.Screen
          name="Room"
          component={Room}
          options={{
            animation: 'fade',
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="AddFromPlaylist"
          component={AddFromPlaylist}
          options={{
            animation: 'fade_from_bottom',
          }}
        />
        <RootStack.Screen name="SelectTracks" component={SelectTracks} />
      </RootStack.Group>
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
  Room: undefined;
  AddFromPlaylist: undefined;
  Onboarding: undefined;
};

export default Routes;
