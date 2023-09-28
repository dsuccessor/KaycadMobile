/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SideBar from './SideBar';
import PaymentHistory from './PaymentHistory';
import StudentWallet from './StudentWallet';
import Dashboard from './Dashboard';
import {ImageBackground, StyleSheet, View, Text} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import StudentReg from './studentReg';

const Drawer = createDrawerNavigator();

const sidebarMenu = [
  {
    menuName: 'Home',
    menuLink: Dashboard,
    menuIcon: 'home',
  },
  {
    menuName: 'Student Wallet',
    menuLink: StudentWallet,
    menuIcon: 'wallet',
  },
  {
    menuName: 'Payment History',
    menuLink: PaymentHistory,
    menuIcon: 'file-invoice',
  },
  {
    menuName: 'Student Registeration',
    menuLink: StudentReg,
    menuIcon: 'file-signature',
  },
];

const MainScreen = ({route, navigation}) => {
  const {activeUser} = route?.params;

  return (
    <Drawer.Navigator
      drawerContent={props => <SideBar {...props} mydata={activeUser} />}
      screenOptions={{
        drawerActiveTintColor: 'white',
        drawerActiveBackgroundColor: '#101C75',
        drawerInactiveTintColor: '#333',
        headerTintColor: 'white',
        drawerLabelStyle: {marginLeft: -20, fontSize: 13, fontWeight: '600'},
        headerBackground: () => (
          <ImageBackground
            style={StyleSheet.absoluteFill}
            source={require('../src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
          />
        ),
      }}>
      {sidebarMenu.map(menu => (
        <Drawer.Screen
          key={menu.menuName}
          name={menu.menuName}
          component={menu.menuLink}
          initialParams={{activeUser}}
          options={{
            drawerIcon: ({color}) => (
              <FontAwesome5Icon
                solid={false}
                name={menu.menuIcon}
                size={13}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default MainScreen;
