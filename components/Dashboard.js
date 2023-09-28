/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ImageBackground,
  StatusBar,
  AppState,
  TextInput,
  Keyboard,
  Pressable,
} from 'react-native';
import {Dialog} from '@rneui/themed';
import client from './client';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-community/async-storage';
//var {width, height} = Dimensions.get('window');

function Dashboard({route, navigation}) {
  const [bgColor, setBgColor] = useState('#101C75');
  const [customAlert, setCustomerAlert] = useState(false);
  const [password, setPassword] = useState('');

  const [input, setInput] = useState();
  const [responseMessage, setResponseMessage] = useState('');
  const [responseSign, setResponseSign] = useState('');

  AsyncStorage.getItem('@activeUser').then(user => {
    let data = JSON.parse(user);
    setInput(data);
  });

  const {activeUser} = route?.params;
  //const activeUser = input;

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    navigation.setOptions({
      title: `Welcome ${activeUser?.surname?.toUpperCase()}!`,
    });

    //console.log(route?.params);

    // Semi Logout once user is not active anymore
    const checkAppState = AppState.addEventListener('change', nextAppState => {
      console.log('app is in background', nextAppState);
      if (appState.current.match(/active/) && nextAppState === 'background') {
        setTimeout(() => setCustomerAlert(true), 60000);
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      checkAppState.remove();
    };
  }, [activeUser, appStateVisible, navigation]);

  const dashboardLinks = [
    {
      linkName: 'Course Reg',
      linkUrl: 'CourseReg',
      linkIcon: 'square-check',
    },
    {
      linkName: 'Course Form',
      linkUrl: '#',
      linkIcon: 'mug-saucer',
    },
    {
      linkName: 'Payment Notice',
      linkUrl: 'PaymentUpload',
      linkIcon: 'envelope-open-text',
    },
    {
      linkName: 'Payment History',
      linkUrl: 'PaymentHistory',
      linkIcon: 'file-invoice',
    },
    {
      linkName: 'Payment Advice',
      linkUrl: 'PaymentAdvice',
      linkIcon: 'credit-card',
    },
    {
      linkName: 'Student Wallet',
      linkUrl: 'StudentWallet',
      linkIcon: 'wallet',
    },
    {
      linkName: 'Academic Calendar',
      linkUrl: '#',
      linkIcon: 'calendar-alt',
    },
    {
      linkName: 'Logout',
      linkUrl: 'Action',
      linkIcon: 'sign-out-alt',
    },
  ];

  const handleSubmitPress = async () => {
    if (!password) {
      setResponseMessage('Please fill in Password');
      setResponseSign('red');
      return;
    }

    let dataToSend = {email: activeUser?.email, password: password};
    console.log('data to upload = ' + dataToSend);

    await client
      .post('/login', dataToSend)
      .then(res => {
        console.log(res?.data);
        const result = JSON.stringify(res?.data?.checkIfExist);

        setCustomerAlert(false);
        setResponseSign('green');
      })
      .catch(err => {
        console.log('Error Server Error: ', err?.response?.data);
        setResponseMessage(JSON.stringify(err?.response?.data?.msg));
        setCustomerAlert(true);
        setResponseSign('red');
      });
  };

  const logout = async () => {
    await AsyncStorage.getAllKeys((err, keys) => {
      if (err) {
        console.log('get all keys failed' + err);
      } else {
        console.log('keys returned = ' + keys);
        AsyncStorage.multiRemove(keys, errr => {
          if (errr) {
            console.log('remove all keys failed' + errr);
          } else {
            AsyncStorage.getItem('@activeUser', (error, data) => {
              if (error) {
                console.log('fetch error' + error);
              } else if (data === null) {
                console.log('fetch resullt = ' + data);
                navigation.navigate('Action');
              } else {
                Alert.alert('User is still active');
              }
            });
          }
        });
      }
    });
  };

  return (
    <View style={styles.containerBody}>
      <StatusBar
        animated={true}
        barStyle="light-content"
        showHideTransition="fade"
        hidden={false}
      />
      <ScrollView style={{flex: 1}}>
        {/* ContainerBody Start */}
        <View style={styles.containerBody}>
          {/* Page Header Title Starts */}
          <View style={{padding: 10, flex: 1, margin: 10}}>
            <Text style={[styles.label, {color: '#101C75', marginTop: 15}]}>
              Student Dashboard
            </Text>
            {/* <Text style={[{color: '#101C75', marginTop: 5}]}>
              {appStateVisible}
            </Text> */}
          </View>
          {/* Page Header Title Ends */}

          {/* Navigation Section Starts */}
          <View
            style={{
              flex: 2,
              minHeight: '30%',
              paddingVertical: 15,
              paddingLeft: 15,
              paddingRight: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              //backgroundColor: '#a2b7fa',
              margin: 10,
              borderRadius: 15,
            }}>
            {/* <Text>Ade</Text> */}
            {/* Navigation Boxes */}
            {dashboardLinks.map((linkData, index) => (
              <View
                style={[
                  styles.box,
                  styles.elevation,
                  {borderWidth: 1, borderColor: '#101C75'},
                ]}
                key={index}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignContent: 'center',
                    alignItems: 'center',
                    paddingTop: 5,
                  }}
                  onPress={
                    linkData.linkName === 'Logout'
                      ? logout
                      : () =>
                          navigation.navigate(linkData.linkUrl, {
                            activeUser: activeUser,
                          })
                  }
                  key={index}>
                  <FontAwesomeIcon
                    icon={linkData.linkIcon}
                    size={30}
                    marginBottom={5}
                    color="rgba(190, 199, 250, 0.5)"
                    //color="rgb(190, 199, 250)"
                  />
                  <Text
                    style={[
                      styles.boxText,
                      {
                        color: bgColor === 'white' ? 'black' : '#101C75',
                        marginTop: 5,
                      },
                    ]}>
                    {linkData.linkName}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {/* Navigation Section Ends */}

          {/* Profile Section Starts */}
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              flexWrap: 'wrap',
              //width: '100%',
              padding: 10,
              backgroundColor: 'transparent',
              margin: 10,
            }}>
            {/* Student Details Section */}

            <View
              style={[
                styles.elevation,
                {
                  flex: 2,
                  marginRight: 5,
                  paddingTop: 5,
                  paddingBottom: 10,
                  paddingHorizontal: 10,
                  borderRadius: 4,
                  backgroundColor: '#fff',
                  height: '100%',
                  borderWidth: 1,
                  borderColor: '#101C75',
                },
              ]}>
              <Text
                style={[
                  myStyle.passportTitle,
                  {
                    color: '#101C75',
                  },
                ]}>
                Student Details
              </Text>

              <Text
                style={[
                  myStyle.contentText,
                  {
                    backgroundColor: 'transparent',
                    color: 'rgb(120, 120, 255)',
                  },
                ]}>
                User Id:
              </Text>
              <Text
                style={[
                  myStyle.userId,
                  {
                    backgroundColor: 'transparent',
                    borderBottomColor: '#00000010',
                    borderBottomWidth: 1,
                    color: '#101C75',
                  },
                ]}>
                {input?._id}
              </Text>
              <Text
                style={[
                  myStyle.contentText,
                  {
                    color: 'rgb(120, 120, 255)',
                  },
                ]}>
                Surname:
              </Text>
              <Text
                style={[
                  myStyle.contentText,
                  {
                    backgroundColor: 'transparent',
                    borderBottomColor: '#00000010',
                    borderBottomWidth: 1,
                    color: '#101C75',
                  },
                ]}>
                {input?.surname?.toUpperCase()}
              </Text>
              <Text
                style={[
                  myStyle.contentText,
                  {
                    backgroundColor: 'transparent',

                    color: 'rgb(120, 120, 255)',
                  },
                ]}>
                Other Name(s):
              </Text>
              <Text
                style={[
                  myStyle.contentText,
                  {
                    backgroundColor: 'transparent',
                    borderBottomColor: '#00000010',
                    borderBottomWidth: 1,
                    color: '#101C75',
                  },
                ]}>
                {input?.otherName?.toUpperCase()}
              </Text>
              <Text
                style={[
                  myStyle.contentText,
                  {
                    color: 'rgb(120, 120, 255)',
                  },
                ]}>
                Student ID:
              </Text>
              <Text
                style={[
                  myStyle.contentText,
                  {
                    backgroundColor: 'transparent',
                    borderBottomColor: '#00000010',
                    borderBottomWidth: 1,
                    color: '#101C75',
                  },
                ]}>
                {input?.userId}
              </Text>
              <Text
                style={[
                  myStyle.contentText,
                  {
                    backgroundColor: 'transparent',
                    color: 'rgb(120, 120, 255)',
                  },
                ]}>
                Email Address:
              </Text>
              <Text
                style={[
                  myStyle.contentText,
                  {
                    backgroundColor: 'transparent',
                    borderBottomColor: '#00000010',
                    borderBottomWidth: 1,
                    color: '#101C75',
                  },
                ]}>
                {input?.email}
              </Text>
            </View>

            {/* Passport Section */}

            <View
              style={[
                styles.elevation,
                {
                  flex: 1,
                  paddingTop: 5,
                  paddingBottom: 10,
                  paddingHorizontal: 10,
                  borderRadius: 4,
                  backgroundColor: '#fff',
                  height: '50%',
                  borderWidth: 1,
                  borderColor: '#101C75',
                },
              ]}>
              <Text
                style={[
                  myStyle.passportTitle,
                  {
                    color: '#101C75',
                  },
                ]}>
                Passport
              </Text>
              <Image
                source={{
                  uri: activeUser?.passport,
                }}
                style={myStyle.tinylogo}
              />
            </View>
          </View>
          {/* Profile Section Ends */}
        </View>
        {/* ContainerBody Ends */}
      </ScrollView>
      {/* Bottom Navigation Starts */}
      <View style={[styles.navOverlay, styles.elevation]}>
        <ImageBackground
          style={StyleSheet.absoluteFill}
          source={require('../src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
          //resizeMode="cover"
        />
      </View>
      {/* Bottom Navigation Ends */}

      {/* Welcome Back Sign In */}
      <Dialog
        overlayStyle={{
          borderRadius: 15,
          width: '80%',
          height: '30%',
          justifyContent: 'center',
        }}
        isVisible={customAlert}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: '#101C75',
              marginHorizontal: 10,
              marginBottom: 5,
              marginTop: 10,
            }}>
            Welcome Back, {activeUser?.surname?.toUpperCase()}
          </Text>
          <Text
            style={{
              fontSize: 13,
              marginHorizontal: 10,
              marginBottom: 10,
            }}>
            Kindly enter your Password to gain access again!
          </Text>
          <TextInput
            style={{
              width: '100%',
              height: '23%',
              backgroundColor:
                responseSign === 'red'
                  ? 'rgba(255, 0, 0, 0.3)'
                  : 'rgba(0, 0, 255,0.07)',
              borderRadius: 10,
              paddingLeft: 10,
              borderColor: '#101C75',
              borderWidth: 2,
              fontSize: 15,
            }}
            placeholder="Password"
            onChangeText={userPassword => setPassword(userPassword)}
            placeholderTextColor="blue"
            keyboardType="default"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
            secureTextEntry={true}
            underlineColorAndroid="#f000"
            returnKeyType="next"
          />
          <Pressable
            style={{
              marginVertical: 15,
              padding: 10,
              backgroundColor: '#101C75',
              borderRadius: 10,
              flexDirection: 'row',
              width: '100%',
              height: '23%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleSubmitPress}>
            <View style={{width: '50%', paddingRight: 0}}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '900',
                  color: 'white',
                  textAlign: 'right',
                }}>
                Login
              </Text>
            </View>
            <View style={{width: '50%', paddingLeft: 20}}>
              <FontAwesomeIcon
                style={{
                  color: '#fff',
                  alignSelf: 'flex-start',
                }}
                icon="right-to-bracket"
                size={20}
                color="white"
              />
            </View>
          </Pressable>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              marginHorizontal: 10,
              color: 'red',
              fontWeight: 'bold',
            }}>
            {responseMessage}
          </Text>
        </View>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101C75',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: 8,
    marginTop: 10,
    borderRadius: 2,
  },
  navOverlay: {
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    //backgroundColor: '#101C75',
    zIndex: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  containerBody: {
    flex: 1,
    backgroundColor: 'white',
  },
  box: {
    width: '23%',
    height: '47%',
    margin: 3,
    padding: 5,
    backgroundColor: 'white',
    verticalAlign: 'middle',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    verticalAlign: 'middle',
    includeFontPadding: true,
    fontFamily: 'Helvetica',
  },
  banner: {
    width: '100%',
    height: '5%',
    backgroundColor: '#101C75',
    color: 'white',
    paddingStart: 15,
    verticalAlign: 'middle',
    fontSize: 12,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'rgb(190, 199, 250)',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: '#101C75',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Helvetica',
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  elevation: {
    elevation: 2,
    shadowColor: '#00000040',
  },
});

//const STATUSBAR_HEIGHT = StatusBar.currentHeight;
//const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const myStyle = StyleSheet.create({
  contentText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    height: 30,
    verticalAlign: 'middle',
    paddingLeft: 5,
  },
  userId: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    height: 30,
    verticalAlign: 'middle',
    paddingLeft: 5,
  },
  passportTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    height: 50,
    marginTop: 10,
    borderBottomColor: '#00000010',
    borderBottomWidth: 2,
    textAlign: 'center',
    verticalAlign: 'middle',
    paddingBottom: 0,
  },
  tinylogo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 15,
  },
});

export default Dashboard;
