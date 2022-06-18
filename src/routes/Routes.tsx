import {createStackNavigator} from '@react-navigation/stack';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {Alert} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import IconButton from '../components/atoms/IconButton';
import QuestionMarkIcon from '../components/atoms/icons/QuestionMarkIcon';
import {Color} from '../types/Color';
import Home from './Home';
import Initial from './Initial';
import Onboarding from './Onboarding';
import Header from './Routes.Header';
import FromPlaylist from './session/FromPlaylist';
import JoinSession from './session/JoinSession';
import NewSession from './session/NewSession';
import Room from './session/Room';
import AddFromPlaylist from './session/Room.AddFromPlaylist';
import SelectTracks from './session/Room.SelectTracks';

const RootStack = createStackNavigator();
const SharedElementStack = createSharedElementStackNavigator();

const SharedViewComponent: FC = () => {
  return (
    <SharedElementStack.Navigator
      initialRouteName="AddFromPlaylist"
      screenOptions={{
        header: Header,
        cardStyle: {
          backgroundColor: Color.dark,
        },
      }}>
      <SharedElementStack.Screen
        name="AddFromPlaylist"
        component={AddFromPlaylist}
      />
      <SharedElementStack.Screen
        name="SelectTracks"
        component={SelectTracks}
        sharedElements={() => ['tracks-to-add-drawer']}
      />
    </SharedElementStack.Navigator>
  );
};

const Routes: FC = () => {
  return (
    <RootStack.Navigator
      initialRouteName="Initial"
      screenOptions={{
        cardStyle: {
          backgroundColor: Color.dark,
        },
        header: Header,
      }}>
      <RootStack.Screen
        name="Initial"
        component={Initial}
        options={{
          headerShown: false,
        }}
      />
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
      <RootStack.Screen
        name="AddTracks"
        component={SharedViewComponent}
        options={{
          headerShown: false,
        }}
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
    pin: string;
  };
  AddTracks: undefined;
  Onboarding: undefined;
  Initial: undefined;
};

export default Routes;
