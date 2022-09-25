import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FC} from 'react';
import {Alert} from 'react-native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import IconButton from '../components/atoms/IconButton';
import QuestionMarkIcon from '../components/atoms/icons/QuestionMarkIcon';
import {Color} from '../types/Theme';
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

const RootStack = createNativeStackNavigator();
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
        contentStyle: {
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

      <RootStack.Screen
        name="Home"
        component={Home}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <RootStack.Screen name="NewSession" component={NewSession} />
      <RootStack.Screen
        name="JoinSession"
        options={{
          headerRight: () => (
            <IconButton
              title="hi"
              onPress={() =>
                Alert.alert(
                  'Scan function will come here',
                  'be patient my young pawadan',
                )
              }>
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
          animation: 'fade',
        }}
      />
      <RootStack.Screen
        name="AddTracks"
        component={SharedViewComponent}
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
          presentation: 'containedModal',
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
  NewSession: undefined;
  JoinSession: undefined;
  Room: {
    pin: string;
  };
  AddTracks: undefined;
  Onboarding: undefined;
  Initial: undefined;
};

export type SharedElementStackParamList = {
  AddFromPlaylist: undefined;
  SelectTracks: {
    playlistId: string;
  };
};

export default Routes;
