/* eslint-disable react-native/no-inline-styles */
import React, {useRef, createRef, useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Pressable,
  Keyboard,
  Animated,
  Easing,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Svg, {Image, Circle, ClipPath} from 'react-native-svg';
import {Dialog} from '@rneui/themed';
import AsyncStorage from '@react-native-community/async-storage';
import client from './client';
import LottieView from 'lottie-react-native';

function ActionScreen({navigation, route}) {
  const {height, width} = Dimensions.get('window');
  const loginAnimation = useRef(new Animated.Value(1)).current;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [customAlert, setCustomerAlert] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(false);
  const animationStart = useRef(new Animated.Value(1)).current;
  const passwordInputRef = createRef();

  const startAnimation = () => {
    Animated.timing(loginAnimation, {
      toValue: 0,
      easing: Easing.ease,
      duration: 1000,
      isInteraction: false,
      useNativeDriver: true,
    }).start();
  };

  const closeLogin = () => {
    Animated.timing(loginAnimation, {
      toValue: 1,
      easing: Easing.ease,
      duration: 1000,
      isInteraction: false,
      useNativeDriver: true,
    }).start();
  };

  const regPage = () => {
    navigation.navigate('Login');
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
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'transparent'}}
      behavior="position"
      keyboardVerticalOffset={Platform.OS === 'ios' ? -5 : null}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            //flex: 1,
            width: width,
            height: height,
            backgroundColor: 'white',
            justifyContent: 'flex-end',
          }}>
          {/* Background Image Starts */}
          <Animated.View
            style={{
              ...StyleSheet.absoluteFill,
              transform: [
                {
                  translateY: loginAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-height / 3 - 20, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }}>
            <Svg height={height + 20} width={width}>
              <ClipPath id="clip">
                <Circle r={height + 20} cx={width / 2} />
              </ClipPath>
              <Image
                href={require('../src/images/group-reading.jpeg')}
                width={width}
                height={height + 20}
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#clip)"
              />
            </Svg>
          </Animated.View>

          {/* Background Image Starts */}
          <View style={{height: height / 3}}>
            {/* Login Call-to-Action Starts */}
            <Animated.View
              style={{
                height: 60,
                backgroundColor: 'rgb(230, 245, 255)',
                marginHorizontal: 30,
                borderRadius: 30,
                borderWidth: 2,
                borderColor: 'blue',
                marginVertical: 10,
                opacity: loginAnimation,
                transform: [
                  {
                    translateY: loginAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              }}>
              <Pressable
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => startAnimation()}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  Login
                </Text>
              </Pressable>
            </Animated.View>
            {/* Login Call-to-Action Ends */}

            {/* Register Call-to-Action Starts */}
            <Animated.View
              style={{
                height: 60,
                backgroundColor: 'blue',
                marginHorizontal: 30,
                borderRadius: 30,
                borderWidth: 2,
                borderColor: 'white',
                marginVertical: 10,
                opacity: loginAnimation,
                transform: [
                  {
                    translateY: loginAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              }}>
              <Pressable
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => regPage()}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  Register
                </Text>
              </Pressable>
            </Animated.View>
            {/* Register Call-to-Action Ends */}

            {/* Login Section Start */}
            <Animated.View
              style={{
                height: height / 3,
                ...StyleSheet.absoluteFill,
                top: null,
                justifyContent: 'center',
                paddingHorizontal: 20,
                zIndex: loginAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, -1],
                  extrapolate: 'clamp',
                }),
                opacity: loginAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    translateY: loginAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              }}>
              {/* Login Section Close  Start */}
              <Animated.View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  //bottom: height / 3,
                  left: width / 2 - 20,
                  top: -20,
                  shadowOffset: {width: 2, height: 2},
                  shadowOpacity: 0.6,
                  shadowColor: 'blue',
                  opacity: loginAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                    extrapolate: 'clamp',
                  }),
                  zIndex: loginAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, -1],
                    extrapolate: 'clamp',
                  }),
                  transform: [
                    {
                      rotate: loginAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['180deg', '360deg'],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                }}>
                <Pressable
                  style={{
                    flex: 1,
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowOffset: {width: 2, height: 2},
                    shadowOpacity: 0.6,
                    shadowColor: 'blue',
                  }}
                  onPress={() => closeLogin()}>
                  <Text
                    style={{fontSize: 15, fontWeight: '900', color: 'blue'}}>
                    X
                  </Text>
                </Pressable>
              </Animated.View>
              {/* Login Section Close Ends */}

              {/* Login InputText Start */}
              <TextInput
                style={[
                  inputStyle.textInput,
                  {borderTopStartRadius: 25, borderTopEndRadius: 25},
                ]}
                placeholder="username"
                onChangeText={userName => setUsername(userName)}
                returnKeyType="next"
                placeholderTextColor="blue"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordInputRef.current.focus()}
                underlineColorAndroid="#f000"
              />
              <TextInput
                style={[inputStyle.textInput]}
                placeholder="Password"
                onChangeText={userPassword => setPassword(userPassword)}
                placeholderTextColor="blue"
                keyboardType="default"
                returnKeyType="next"
                ref={passwordInputRef}
                blurOnSubmit={true}
                onSubmitEditing={Keyboard.dismiss}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
              />
              {/* Login InputText Ends */}

              {/* Login Button Start */}
              <Animated.View>
                <Pressable
                  style={{
                    height: 60,
                    backgroundColor: 'blue',
                    marginHorizontal: 20,
                    paddingHorizontal: 100,
                    alignItems: 'center',
                    borderBottomStartRadius: 25,
                    borderBottomEndRadius: 25,
                    borderWidth: 0.5,
                    borderColor: 'black',
                    marginTop: 2,
                    flexDirection: 'row',
                  }}
                  onPress={handleSubmitPress}>
                  <View style={{width: '50%'}}>
                    <Text
                      style={{
                        textAlign: 'right',
                        fontSize: 15,
                        fontWeight: '900',
                        color: 'white',
                      }}>
                      Login
                    </Text>
                  </View>
                  <View style={{width: '50%'}}>
                    <FontAwesomeIcon
                      style={{
                        marginLeft: 15,
                        alignSelf: 'flex-start',
                        color: '#fff',
                      }}
                      icon="right-to-bracket"
                      size={20}
                      color="white"
                    />
                  </View>
                </Pressable>
              </Animated.View>
              {/* Login Button Ends */}
            </Animated.View>
            {/* Login Section Start */}
          </View>

          {/* Login Notification Start*/}
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
              icon={response === true ? 'check-double' : 'exclamation-triangle'}
              color={response === true ? 'blue' : 'red'}
              size={30}
              solid
            />
            <Text
              style={{
                fontSize: 15,
                textAlign: 'center',
                fontWeight: 'bold',
                marginVertical: 10,
                color: response === true ? 'blue' : 'red',
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
          {/* Login Notification End */}

          {/* Page Loader */}
          <Dialog
            overlayStyle={{
              width: width,
              height: height,
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
              style={[inputStyle.tinylogo, {opacity: animationStart}]}
              source={require('../images/logo.png')}
            />
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 15,
                color: 'blue',
              }}>
              Attempting Login ...
            </Text>
          </Dialog>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const inputStyle = StyleSheet.create({
  textInput: {
    height: 55,
    borderWidth: 0.5,
    marginHorizontal: 20,
    paddingLeft: 10,
    marginVertical: 2,
    borderColor: 'blue',
    backgroundColor: 'white',
  },
  tinylogo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default ActionScreen;
