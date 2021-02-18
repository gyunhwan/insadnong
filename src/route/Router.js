import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import MainScreen from '../screens/MainScreen';
import IntroScreen from '../screens/IntroScreen';
import NorthList from '../screens/NorthList';
import Depth01 from '../screens/Depth01';
import Detail from '../screens/Detail';
import IapTest from '../screens/IapTest';
const Stack = createStackNavigator();

function Stack_Navigation(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
      initialRouteName="MainScreen"
      //   initialRouteName= "PendingScreen"
      //   initialRouteName= "MainScreen"
    >
      <Stack.Screen
        name="IapTest"
        component={IapTest}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="IntroScreen"
        component={IntroScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NorthList"
        component={NorthList}
        options={{
          title: '북인사 마당',
          headerStyle: {
            backgroundColor: '#FFCF03',
          },
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Depth01"
        component={Depth01}
        // options={{
        //   headerStyle: {
        //     backgroundColor: '#FFCF03',
        //   },
        //   headerTitleAlign: 'center',
        // }}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        // options={{
        //   headerBackTitleVisible: false,
        //   // headerTransparent: true,
        //   headerTitleAlign: 'center',
        //   headerTintColor: '#fff',
        //   title: false,
        //   headerStyle: {
        //     backgroundColor: 'rgba(0,0,0,0.2)',
        //   },
        // }}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const Router = (props) => {
  const {userInfo, fetchSession} = props;

  return (
    <NavigationContainer>
      <Stack_Navigation></Stack_Navigation>
    </NavigationContainer>
  );
};

export default Router;
Router.defatulProps = {
  userInfo: null,
};
