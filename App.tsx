/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * http://172.20.10.8:3001 - iPhone Network
 * http://192.168.0.163:3001
 * https://kaycad-v2.onrender.com/Login
 * https://schoolportal.vercel.app/Loginnp
 * http://192.168.88.223:3001 - Shago Network
 * http://192.168.88.184:3001 - shago network 2
 * http://192.168.33.20:3001 - Camon C9 Network
 * primary color - #101C75
 * @format
 */

import React, {useEffect, useState} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-community/async-storage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CourseReg from './components/CourseReg';
import PaymentNotification from './components/PaymentNotification';
import PaymentUpload from './components/PaymentUpload';
import PaymentHistory from './components/PaymentHistory';
import SplashScreen from './src/screens/SplashScreen';
import ActionScreen from './components/ActionScreen';
import StudentWallet from './components/StudentWallet';
import MainScreen from './components/MainScreen';
import WalletReceipt from './components/WalletReceipt';
import SideBar from './components/SideBar';
import PaymentAdvice from './components/PaymentAdvice';
import StudentReg from './components/studentReg';

import {library} from '@fortawesome/fontawesome-svg-core';
import {faGoogleWallet, fab} from '@fortawesome/free-brands-svg-icons';
import {
  faSquareCheck,
  faRightToBracket,
  faMugSaucer,
  faCheckDouble,
  faExclamationTriangle,
  faEnvelopeOpenText,
  faFileInvoice,
  faWallet,
  faCalendarAlt,
  faSignOutAlt,
  faCreditCard,
  faChevronRight,
  faHome,
  faUser,
  faMoneyCheckAlt,
  faFileInvoiceDollar,
  faShare,
  faThumbsUp,
  faThumbsDown,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  fab,
  faSquareCheck,
  faMugSaucer,
  faRightToBracket,
  faCheckDouble,
  faExclamationTriangle,
  faEnvelopeOpenText,
  faFileInvoice,
  faWallet,
  faCalendarAlt,
  faSignOutAlt,
  faCreditCard,
  faChevronRight,
  faHome,
  faUser,
  faMoneyCheckAlt,
  faFileInvoiceDollar,
  faGoogleWallet,
  faShare,
  faThumbsUp,
  faThumbsDown,
);

// Pages Component
<>
  <Login navigation route={undefined} />
  <Dashboard navigation route={undefined} />
  <CourseReg navigation route={undefined} />
  <PaymentNotification navigation route={undefined} />
  <PaymentUpload navigation route={undefined} />
  <PaymentHistory navigation route={undefined} />
  <SplashScreen navigation route={undefined} />
  <StudentReg navigation route={undefined} />
  <ActionScreen navigation route={undefined} />
  <StudentWallet navigation route={undefined} />
  <SideBar navigation route={undefined} />
  <MainScreen navigation route={undefined} />
  <WalletReceipt navigation route={undefined} />
  <PaymentAdvice navigation route={undefined} />
</>;

const Stack = createNativeStackNavigator();

function App() {
  const [input, setInput] = useState();

  useEffect(() => {
    AsyncStorage.getItem('@activeUser').then(user => {
      let data = JSON.parse(user);
      setInput(data?.surname?.toUpperCase());
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerBackTitle: 'Back',
          headerTintColor: 'white',
          headerBackTitleStyle: {
            fontSize: 17,
            fontFamily: 'Helvetica',
          },
          headerStyle: {backgroundColor: 'transparent'},
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'Helvetica',
            fontSize: 16,
            color: 'white',
          },
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerBackVisible: false,
            headerBackground: () => (
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require('../kaycadproject/src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
              />
            ),
          }}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{
            headerBackVisible: false,
            headerShown: false,
            // headerBackground: () => (
            //   <ImageBackground
            //     style={StyleSheet.absoluteFill}
            //     source={require('../kaycadproject/src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
            //   />
            // ),
          }}
        />

        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerBackVisible: false,
            headerBackground: () => (
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require('../kaycadproject/src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
              />
            ),
          }}
        />

        <Stack.Screen
          name="CourseReg"
          component={CourseReg}
          options={{
            headerBackground: () => (
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require('../kaycadproject/src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
              />
            ),
          }}
        />
        <Stack.Screen
          name="PaymentNotification"
          component={PaymentNotification}
          options={{
            headerBackground: () => (
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require('../kaycadproject/src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
              />
            ),
          }}
        />
        <Stack.Screen
          name="PaymentUpload"
          component={PaymentUpload}
          options={{
            headerBackground: () => (
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require('../kaycadproject/src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
              />
            ),
          }}
        />

        <Stack.Screen
          name="PaymentAdvice"
          component={PaymentAdvice}
          options={{
            headerBackground: () => (
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require('../kaycadproject/src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
              />
            ),
          }}
        />

        <Stack.Screen
          name="PaymentHistory"
          component={PaymentHistory}
          options={{
            headerBackground: () => (
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require('../kaycadproject/src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
              />
            ),
          }}
        />

        <Stack.Screen
          name="StudentReg"
          component={StudentReg}
          options={{
            headerBackground: () => (
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require('../kaycadproject/src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
              />
            ),
          }}
        />

        <Stack.Screen
          name="StudentWallet"
          component={StudentWallet}
          options={{
            headerBackground: () => (
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require('../kaycadproject/src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
              />
            ),
          }}
        />

        <Stack.Screen
          name="WalletReceipt"
          component={WalletReceipt}
          options={{
            headerBackground: () => (
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require('../kaycadproject/src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
              />
            ),
          }}
        />

        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Action"
          component={ActionScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
