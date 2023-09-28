/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {useState, createRef, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Linking,
  Image,
  Keyboard,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  Pressable,
  ScrollView,
} from 'react-native';

//import type {StatusBarStyle} from 'react-native';

import {Dialog} from '@rneui/themed';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-community/async-storage';
import client from './client';
import LottieView from 'lottie-react-native';
import KeyboardAvoidingWrapper from './KeyboardAvoidingWrapper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const {height, width} = Dimensions.get('window');

// Login Page Component
function Login({route, navigation}) {
  const [isSelected, setSelection] = useState('unchecked');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customAlert, setCustomerAlert] = useState(false);

  const [username, setUsername] = useState('');
  const [response, setResponse] = useState(false);
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const passwordInputRef = createRef();
  const animationStart = useRef(new Animated.Value(1)).current;

  const checkBoxSelection = () => {
    if (isSelected === 'unchecked') {
      setSelection('checked');
    } else {
      setSelection('unchecked');
    }
  };

  const handleSubmitPress = async () => {
    if (!username) {
      setResponseMessage('Please fill in Email');
      setCustomerAlert(true);
      return;
    }
    if (!password) {
      setResponseMessage('Please fill in Password');
      setCustomerAlert(true);
      return;
    }
    setVisible(true);
    setLoading(true);
    let dataToSend = {email: username, password: password};
    console.log('data to send = ' + dataToSend);

    await client
      .post('/login', dataToSend)
      .then(res => {
        console.log(res?.data);
        const result = JSON.stringify(res?.data?.checkIfExist);

        AsyncStorage.setItem('@activeUser', result);

        console.log('server response 1 - ', result);

        setResponse(true);

        const {role, surname, passport, email, userId} =
          res?.data?.checkIfExist;
        setVisible(false);
        setLoading(false);
        setResponseMessage(
          role + ' ' + JSON.stringify(res?.data?.msg) + ' for ' + surname + '!',
        );

        //setCustomerAlert(true);

        navigation.navigate('MainScreen', {
          activeUser: {
            surname: surname,
            passport: passport,
            email: email,
            userId: userId,
          },
        });
      })
      .catch(err => {
        setVisible(false);
        setLoading(false);
        setResponse(false);
        console.log('Error Server Error: ', err?.response?.data);
        setResponseMessage(JSON.stringify(err?.response?.data?.msg));
        setCustomerAlert(true);
      });
  };

  const toggleDialog1 = () => {
    setCustomerAlert(!customAlert);
  };

  if (loading === true) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationStart, {
          toValue: 0,
          easing: Easing.circle,
          duration: 500,
          isInteraction: false,
          useNativeDriver: true,
        }),
        Animated.timing(animationStart, {
          toValue: 1,
          easing: Easing.circle,
          duration: 500,
          isInteraction: false,
          useNativeDriver: true,
        }),
        Animated.timing(animationStart, {
          toValue: 0,
          easing: Easing.circle,
          duration: 500,
          isInteraction: false,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView>
        <View style={styles.container}>
          <StatusBar
            animated={true}
            barStyle="light-content"
            showHideTransition="fade"
            hidden={false}
          />
          {/* <ImageBackground
          source={require('../images/homeBgv4.png')}
          //resizeMode="cover"
          style={StyleSheet.absoluteFill}
        /> */}
          <View style={styles.row}>
            <Image
              style={styles.tinylogo}
              source={require('../images/logo.png')}
            />
            <Text style={styles.title}>KayCad</Text>

            <View style={[styles.box, login.elevation]}>
              <View style={[login.inputBox, {flexDirection: 'row'}]}>
                <FontAwesome5Icon
                  name="lock"
                  size={20}
                  color={'#101C75'}
                  solid={false}
                  style={{alignSelf: 'center'}}
                />
                <TextInput
                  style={{
                    flex: 1,
                    paddingLeft: 15,
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                  placeholder="username"
                  onChangeText={userName => setUsername(userName)}
                  returnKeyType="next"
                  placeholderTextColor="#101C75"
                  onSubmitEditing={() =>
                    passwordInputRef.current && passwordInputRef.current.focus()
                  }
                  underlineColorAndroid="#f000"
                  blurOnSubmit={true}
                />
              </View>
              <View style={[login.inputBox, {flexDirection: 'row'}]}>
                <FontAwesome5Icon
                  name="lock"
                  size={20}
                  color={'#101C75'}
                  solid={false}
                  style={{alignSelf: 'center'}}
                />
                <TextInput
                  style={{
                    flex: 1,
                    paddingLeft: 15,
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                  placeholder="Password"
                  onChangeText={userPassword => setPassword(userPassword)}
                  placeholderTextColor="#101C75"
                  keyboardType="default"
                  ref={passwordInputRef}
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={true}
                  secureTextEntry={true}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                />
              </View>

              <Pressable style={login.btnStyle} onPress={handleSubmitPress}>
                <View style={{width: '50%'}}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '900',
                      color: 'white',
                      textAlign: 'right',
                      paddingRight: 10,
                    }}>
                    Login
                  </Text>
                </View>
                <View style={{width: '50%'}}>
                  <FontAwesomeIcon
                    style={{
                      textAlign: 'left',
                      color: '#fff',
                      alignSelf: 'flex-start',
                      paddingLeft: 10,
                    }}
                    icon="right-to-bracket"
                    size={20}
                    color="white"
                  />
                </View>
              </Pressable>
              <View style={login.label}>
                <Text style={[{marginRight: 10}, login.link]}>
                  Forget Password?
                </Text>
                <Text
                  style={[{color: '#101C75'}, login.link]}
                  onPress={() =>
                    Linking.openURL('https://kaycad-v2.netlify.app/')
                  }>
                  Reset Password
                </Text>
                {/* </View> */}
              </View>
              <View style={login.label}>
                <Text style={[{marginRight: 10}, login.link]}>New User?</Text>
                <Text
                  style={[{color: '#101C75'}, login.link]}
                  onPress={() => navigation.navigate('StudentReg')}>
                  Create an Account
                </Text>
                {/* </View> */}
              </View>

              {/* Customer Notification */}
              <Dialog
                overlayStyle={{
                  borderRadius: 15,
                  width: '60%',
                }}
                isVisible={customAlert}
                onBackdropPress={toggleDialog1}>
                <FontAwesomeIcon
                  style={{
                    textAlign: 'center',
                    marginVertical: 10,
                    alignSelf: 'center',
                  }}
                  icon={
                    response === true ? 'check-double' : 'exclamation-triangle'
                  }
                  color={response === true ? '#101C75' : 'red'}
                  size={30}
                  solid
                />
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    marginVertical: 10,
                    color: response === true ? '#101C75' : 'red',
                  }}>
                  {response === true ? 'Hurray!' : 'Oops!'}
                </Text>

                <Text
                  style={{
                    fontSize: 15,
                    textAlign: 'center',
                    marginBottom: 10,
                    color: 'black',
                  }}>
                  {responseMessage}
                </Text>
              </Dialog>

              {/* Page Loader */}
              <Dialog
                overlayStyle={{
                  width: windowWidth,
                  height: windowHeight,
                  backgroundColor: '#a2b7fa95',
                  paddingVertical: '90%',
                }}
                isVisible={loading}>
                <LottieView
                  source={require('../src/assets/cycling-blue-loader.json')}
                  autoPlay
                  loop={true}
                />

                <Animated.Image
                  style={[login.tinylogo, {opacity: animationStart}]}
                  source={require('../images/logo.png')}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: '#101C75',
                  }}>
                  Attempting Login ...
                </Text>
              </Dialog>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    justifyContent: 'center',
  },
  test: {
    borderWidth: 2,
    borderColor: 'red',
  },
  image: {
    flex: 1,
  },
  row: {
    height: '50%',
    width: width,
    color: '#101C75',
  },
  box: {
    width: '100%',
    height: '100%',
    color: '#101C75',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#101C75',
    textShadowColor: 'rgb(190, 199, 250)',
    textShadowOffset: {
      height: -2,
      width: -2,
    },
    textShadowRadius: 5,
    marginBottom: 10,
  },
  tinylogo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 12,
  },
});

const login = StyleSheet.create({
  inputBox: {
    borderColor: '#101C75',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    height: '12%',
    width: '75%',
    marginVertical: 7,
    marginHorizontal: 10,
    backgroundColor: 'rgb(190, 199, 250)',
  },
  btnStyle: {
    marginHorizontal: 10,
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 30,
    paddingVertical: 15,
    backgroundColor: '#101C75',
    borderRadius: 10,
    flexDirection: 'row',
    width: '75%',
    justifyContent: 'center',
  },
  label: {
    width: '75%',
    flexDirection: 'row',
    marginHorizontal: 5,
    color: '#101C75',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tinylogo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 20,
    borderRadius: 10,
  },
  link: {
    textAlign: 'center',
    paddingVertical: 5,
    fontSize: 13,
    fontWeight: 'bold',
    textShadowColor: 'transparent',
    textShadowOffset: {
      height: 1.5,
      width: 1.5,
    },
    textShadowRadius: 5,
  },
  elevation: {
    shadowColor: 'black',
    elevation: 25,
  },
});

export default Login;
