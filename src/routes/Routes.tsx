import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FC} from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {Color} from '../lib/types/Theme';
import Home from './Home';
import Initial from './Initial';
import Header from './Routes.Header';
import FromPlaylist from './session/FromPlaylist';
import JoinSession from './session/JoinSession';
import NewSession from './session/NewSession';
import Room from './room/Room';
import AddFromPlaylist from './room/modals/AddFromPlaylist';
import SaveToPlaylist from './room/modals/SaveToPlaylist';
import SelectTracks from './room/modals/SelectTracks';
import AddFromSpotifySearch from './room/modals/AddFromSpotifySearch';

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
        headerStyle: {
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
        name="Home"
        component={Home}
        options={{
          animation: 'fade',
        }}
      />
      <RootStack.Screen name="NewSession" component={NewSession} />
      <RootStack.Screen name="JoinSession" component={JoinSession} />

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
        name="SaveToPlaylist"
        component={SaveToPlaylist}
        options={{
          animation: 'slide_from_bottom',
        }}
      />

      <RootStack.Screen
        name="AddFromSpotifySearch"
        component={AddFromSpotifySearch}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'containedModal',
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

export default Routes;
