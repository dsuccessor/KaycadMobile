/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-community/async-storage';
import React, {createRef, useEffect, useRef, useState} from 'react';
import client from './client';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  TextInput,
  Animated,
  PanResponder,
  Alert,
  Easing,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  AppState,
  Keyboard,
} from 'react-native';

import {Button} from '@rneui/base';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import LottieView from 'lottie-react-native';
import DocumentPicker from 'react-native-document-picker';
import {Dialog} from '@rneui/themed';
import KeyboardAvoidingWrapper from './KeyboardAvoidingWrapper';

const {height, width} = Dimensions.get('window');

function PaymentUpload({navigation, route}) {
  const [value, setValue] = useState(null);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [singleFile, setSingleFile] = useState('');
  const [myX, setmyX] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showResponseScreen, setShowResponseScreen] = useState(false);
  const [responseMessage, setResponseMessage] = useState({status: '', msg: ''});
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const narrationInput = createRef();
  const payeeInput = createRef();

  const myDate = JSON.stringify(date);
  const paymentDate = myDate.split('T')[0].split('"')[1];
  const input = useRef();

  const navLinks = [
    {
      linkName: 'Home',
      linkUrl: 'Dashboard',
      linkIcon: 'home',
    },
    {
      linkName: 'Profile',
      linkUrl: '#',
      linkIcon: 'user',
    },
    {
      linkName: 'Course',
      linkUrl: 'CourseReg',
      linkIcon: 'file-invoice',
    },
    {
      linkName: 'History',
      linkUrl: 'PaymentHistory',
      linkIcon: 'money-check-alt',
    },
    {
      linkName: 'Wallet',
      linkUrl: '#',
      linkIcon: 'wallet',
    },
  ];

  const bankOptions = [
    {
      label: 'Access Bank',
      value: 'Access Bank',
    },
    {
      label: 'First Bank',
      value: 'First Bank',
    },
    {
      label: 'GT Bank',
      value: 'GT Bank',
    },
    {
      label: 'Kuda MFB',
      value: 'Kuda MFB',
    },
    {
      label: 'United Bank for Africa',
      value: 'UBA',
    },
  ];

  const animationStart = useRef(new Animated.Value(1)).current;

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
  const {activeUser} = route?.params;
  //const activeUser = input;

  useEffect(() => {
    AsyncStorage.getItem('@activeUser').then(user => {
      let data = JSON.parse(user);
      input.current = data;
      paymentData.current.studentId = data?.userId;
    });

    // Semi Logout once user is not active anymore
    const checkAppState = AppState.addEventListener('change', nextAppState => {
      console.log('app is in background', nextAppState);
      if (appState.current.match(/active/) && nextAppState === 'background') {
        setTimeout(() => {
          navigation.navigate('Dashboard', {
            activeUser: activeUser,
          });
        }, 60000);
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      checkAppState.remove();
    };
  }, [navigation]);

  const selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log related to the file
      console.log('res : ' + JSON.stringify(res[0]));

      //Setting the state to show single file attributes
      setSingleFile(res[0]);

      paymentData.current.paymentEvidence = res[0];
      paymentData.current.uri = res[0]?.uri;
      paymentData.current.fileType = res[0]?.type;
      console.log('file = ' + paymentData.current.uri);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        Alert.alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const pan = useRef(new Animated.ValueXY()).current;
  const paymentData = useRef({
    studentId: '',
    bankName: '',
    amountPaid: '',
    payNarration: '',
    payeeName: '',
    paymentDate: '',
    paymentEvidence: {},
    uri: '',
    fileType: '',
  });

  paymentData.current.paymentDate = paymentDate;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: 0,
          y: 0,
        });
      },
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, {dx: pan.x}], {
          useNativeDriver: false,
        })(e, gestureState);
        setmyX(gestureState.dx);
      },
      onPanResponderRelease: (e, gestureState) => {
        const submitPaymentNotification = async () => {
          setShowResponseScreen(false);
          if (gestureState.dx >= 128) {
            console.log(
              'Data to Submit = ' + JSON.stringify(paymentData.current),
            );

            //   Submit data to the api

            const {
              studentId,
              bankName,
              amountPaid,
              payNarration,
              payeeName,
              paymentEvidence,
              uri,
              fileType,
            } = paymentData.current;

            if (
              amountPaid === '' ||
              paymentEvidence === '' ||
              bankName === '' ||
              payeeName === '' ||
              payNarration === ''
            ) {
              console.log('Fields cannot be empty');
              Alert.alert('Fields cannot be empty');
              return false;
            } else {
              setLoading(true);
              const formData = new FormData();
              formData.append('studentId', studentId);
              formData.append('bankName', bankName);
              formData.append('amountPaid', amountPaid);
              formData.append('payNarration', payNarration);
              formData.append('payeeName', payeeName);
              formData.append('paymentDate', paymentData.current.paymentDate);
              formData.append('paymentDetails', {
                name: `${paymentData.current.studentId}-${paymentData.current.paymentDate}-${paymentData.current.bankName}`,
                uri: uri,
                type: fileType,
              });

              const config = {
                crossDomain: true,
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'multipart/form-data',
                  'Access-Control-Allow-Origin': '*',
                },
              };

              console.log('formData to Submit = ' + JSON.stringify(formData));

              await client
                .post('/paymentUpload/sendnotification', formData, config)
                .then(res => {
                  setLoading(false);
                  const result = JSON.stringify(res.data);
                  console.log(result);
                  setResponseMessage({status: 'Success', msg: res?.data?.msg});
                  //Alert.alert(res.data.msg);

                  setShowResponseScreen(true);

                  //Alert.alert(res.data.msg);
                  //setTimeout(() => window.location.reload(), 5000);
                })
                .catch(err => {
                  setLoading(false);
                  console.log('our error = ' + err?.response);
                  const dat = JSON.stringify(err?.response?.data?.msg);
                  setResponseMessage({status: 'Failed', msg: dat});
                  //Alert.alert(err.response);

                  setShowResponseScreen(true);
                  //Alert.alert(err.response?.data.msg);
                });
            }
          }
        };
        submitPaymentNotification();
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const responseScreen = () => {
    setShowResponseScreen(false);

    if (responseMessage.status === 'Success') {
      navigation.navigate('Dashboard', {
        activeUser: input?.current?.surname,
      });
    } else {
      navigation.navigate('PaymentNotification', {
        activeUser: input?.current?.surname,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingWrapper>
        <ScrollView>
          <View style={formStyles.container}>
            {/* Bank Name */}
            <View style={{flex: 1, marginVertical: 15}}>
              <Text
                style={{
                  marginBottom: 7,
                  marginLeft: 5,
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: '#101C75',
                  //color: '#E6EAF7',
                }}>
                Beneficiary Bank Name:
              </Text>

              <Dropdown
                containerStyle={{
                  backgroundColor: 'white',
                  minHeight: 50,
                  // maxHeight: 50,
                }}
                itemTextStyle={{color: 'black'}}
                itemContainerStyle={{backgroundColor: 'white'}}
                style={[
                  dropdownStyles.dropdown,
                  {
                    borderWidth: 1,
                    borderColor: '#101C75',
                  },
                ]}
                placeholderStyle={dropdownStyles.placeholderStyle}
                selectedTextStyle={dropdownStyles.selectedTextStyle}
                inputSearchStyle={dropdownStyles.inputSearchStyle}
                iconStyle={dropdownStyles.iconStyle}
                data={bankOptions}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={value}
                onChange={item => {
                  setValue(item.value);
                  paymentData.current.bankName = item.value;
                }}
              />
            </View>

            {/* Amount Paid */}

            <View style={{flex: 1, marginVertical: 15}}>
              <Text
                style={{
                  marginBottom: 7,
                  marginLeft: 5,
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: '#101C75',
                  //color: '#E6EAF7',
                }}>
                Amount Paid:
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 7,
                  fontSize: 15,
                  paddingHorizontal: 10,
                  color: 'black',
                  borderWidth: 1,
                  borderColor: '#101C75',
                  minHeight: 50,
                }}
                onChangeText={payAmount =>
                  (paymentData.current.amountPaid = payAmount)
                }
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => narrationInput.current.focus()}
                placeholderTextColor="blue"
                autoCapitalize="sentences"
                underlineColorAndroid="#f000"
              />
            </View>

            {/* Payment Narration */}

            <View style={{flex: 1, marginVertical: 15}}>
              <Text
                style={{
                  marginBottom: 7,
                  marginLeft: 5,
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: '#101C75',
                  //color: '#E6EAF7',
                }}>
                Payment Narrtion:
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 7,
                  fontSize: 15,
                  paddingHorizontal: 10,
                  color: 'black',
                  borderWidth: 1,
                  borderColor: '#101C75',
                  minHeight: 50,
                }}
                onChangeText={payNarration =>
                  (paymentData.current.payNarration = payNarration)
                }
                ref={narrationInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => payeeInput.current.focus()}
                placeholderTextColor="blue"
                autoCapitalize="sentences"
                underlineColorAndroid="#f000"
              />
            </View>

            {/* Payee Name */}

            <View style={{flex: 1, marginVertical: 15}}>
              <Text
                style={{
                  marginBottom: 7,
                  marginLeft: 5,
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: '#101C75',
                  //color: '#E6EAF7',
                }}>
                Payee Name:
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 7,
                  fontSize: 15,
                  paddingHorizontal: 10,
                  color: 'black',
                  borderWidth: 1,
                  borderColor: '#101C75',
                  minHeight: 50,
                }}
                onChangeText={payPayee =>
                  (paymentData.current.payeeName = payPayee)
                }
                ref={payeeInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
                placeholderTextColor="blue"
                autoCapitalize="sentences"
                underlineColorAndroid="#f000"
              />
            </View>

            {/* Payment Date */}
            <View style={{flex: 1, marginVertical: 15}}>
              <Text
                style={{
                  marginBottom: 7,
                  marginLeft: 5,
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: '#101C75',
                  //color: '#E6EAF7',
                }}>
                Payment Date:
              </Text>

              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 7,
                    fontSize: 15,
                    paddingHorizontal: 10,
                    marginBottom: 10,
                    color: 'black',
                    width: '60%',
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: '#101C75',
                    minHeight: 50,
                  }}
                  editable={false}
                  selectTextOnFocus={false}
                  value={paymentDate}
                  returnKeyType="next"
                  placeholderTextColor="blue"
                  autoCapitalize="sentences"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={true}
                />
                <DatePicker
                  modal
                  open={open}
                  date={date}
                  onConfirm={mydate => {
                    setOpen(false);
                    setDate(mydate);
                    console.log(mydate);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                  androidVariant="nativeAndroid"
                  mode="date"
                />
                <Button
                  buttonStyle={{
                    width: '65%',
                    flexDirection: 'row',
                    height: 45,
                    borderRadius: 7,
                    marginTop: 1,
                    backgroundColor: '#101C75',
                  }}
                  onPress={() => setOpen(true)}
                  title="Select Date"
                />
              </View>
            </View>

            {/* Payment Evidence */}
            <View style={{flex: 1, marginVertical: 15}}>
              <Text
                style={{
                  marginBottom: 7,
                  marginLeft: 5,
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: '#101C75',
                  //color: '#E6EAF7',
                }}>
                Payment Evidence:
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 7,
                    fontSize: 12,
                    paddingHorizontal: 10,
                    width: '60%',
                    flexDirection: 'row',
                    marginRight: 10,
                    color: 'black',
                    borderWidth: 1,
                    borderColor: '#101C75',
                  }}
                  editable={false}
                  selectTextOnFocus={false}
                  value={singleFile?.name}
                  returnKeyType="next"
                  placeholderTextColor="blue"
                  autoCapitalize="sentences"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={true}
                />
                <Button
                  buttonStyle={{
                    width: '65%',
                    flexDirection: 'row',
                    height: 45,
                    borderRadius: 7,
                    marginTop: 2,
                    backgroundColor: '#101C75',
                  }}
                  onPress={() => selectOneFile()}
                  title="Select File"
                />
              </View>
            </View>

            {/* Submit Slider */}
            <View
              style={{
                marginTop: 5,
                alignSelf: 'center',
                marginBottom: 70,
                flex: 2,
              }}>
              <Text style={[sliderStyles.titleText]}>
                {myX >= 128 ? 'Submitted' : 'Swipe to Submit'}
              </Text>
              <View style={sliderStyles.container}>
                <Animated.View
                  style={[
                    sliderStyles.box,
                    {
                      transform:
                        myX < 0
                          ? [{translateX: 0}, {translateY: 0}]
                          : myX > 155
                          ? [{translateX: 0}, {translateY: 0}]
                          : [{translateX: pan.x}, {translateY: 0}],
                    },
                  ]}
                  {...panResponder.panHandlers}>
                  <FontAwesomeIcon
                    icon="share"
                    size={25}
                    color="rgb(199, 199, 250)"
                    style={{
                      alignSelf: 'center',
                      textAlign: 'center',
                      color: '#fff',
                    }}
                    //color="rgb(190, 199, 250)"
                  />
                </Animated.View>
              </View>
            </View>

            {/* Page Loader */}
            <Dialog
              overlayStyle={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                backgroundColor: 'rgba(0,0,255,.2)',
                paddingVertical: '90%',
              }}
              isVisible={loading}>
              <LottieView
                source={require('../src/assets/cycling-blue-loader.json')}
                autoPlay
                loop={true}
              />

              <Animated.Image
                style={[styles.tinylogo, {opacity: animationStart}]}
                source={require('../images/logo.png')}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: '#101C75',
                }}>
                Proccessing ...
              </Text>
            </Dialog>

            {/* Response Screen */}
            <Dialog
              overlayStyle={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                backgroundColor: '#a2b7fa',
                paddingVertical: '90%',
              }}
              isVisible={showResponseScreen}>
              {/* <Image
            style={styles.tinylogo}
            source={require('../images/logo.png')}
          /> */}

              <LottieView
                source={
                  responseMessage?.status === 'Success'
                    ? require('../src/assets/Successful-green.json')
                    : require('../src/assets/payment-failed.json')
                }
                autoPlay
                loop={false}
                style={{position: 'absolute', top: '-9%'}}
              />

              {/* <FontAwesomeIcon
            icon={
              responseMessage?.status === 'Success'
                ? 'thumbs-up'
                : 'thumbs-down'
            }
            size={30}
            color={responseMessage?.status === 'Success' ? 'green' : 'red'}
            style={{alignSelf: 'center'}}
            //color="rgb(190, 199, 250)"
          /> */}
              {/* <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 17,
              color: '#101C75',
              marginVertical: 10,
            }}>
            {responseMessage?.status}
          </Text> */}

              <Text
                style={{
                  textAlign: 'center',
                  //fontWeight: 'bold',
                  fontSize: 17,
                  color: '#101C75',
                  marginTop: 50,
                  marginBottom: 30,
                }}>
                {responseMessage?.msg}
              </Text>
              <Pressable onPress={() => responseScreen()}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 5,
                    marginVertical: 30,
                    height: 50,
                    borderRadius: 10,
                    alignContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#101C75',
                      //fontWeight: '500',
                      textAlign: 'center',
                      fontSize: 20,
                      marginTop: 7,
                    }}>
                    {responseMessage.status === 'Success'
                      ? 'Back to Dashboard'
                      : 'Attmept Again'}
                  </Text>
                </View>
              </Pressable>
            </Dialog>
          </View>
        </ScrollView>
      </KeyboardAvoidingWrapper>

      {/* Overlay Navigation */}
      <View style={[styles.navOverlay, styles.elevation]}>
        <ImageBackground
          style={StyleSheet.absoluteFill}
          source={require('../src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
          //resizeMode="cover"
        />
        {navLinks.map((navLink, index) => (
          <View key={index} style={styles.navBox}>
            <Pressable
              onPress={() =>
                navigation.navigate(navLink.linkUrl, {
                  activeUser: {
                    surname: activeUser?.surname,
                    email: activeUser?.email,
                  },
                })
              }>
              <FontAwesomeIcon
                icon={navLink?.linkIcon}
                size={20}
                color="rgb(199, 199, 250)"
                style={{alignSelf: 'center'}}
                //color="rgb(190, 199, 250)"
              />

              <Text style={{fontWeight: 'bold', color: '#fff'}}>
                {navLink.linkName}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //width: width,
    //height: height,
    //width: '100%',
    //height: '100%',
  },
  navOverlay: {
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#101C75',
    //'#E6EAF7',
    zIndex: 8,
    //borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    //backgroundColor: '#F8F9FA',
  },
  navBox: {
    marginHorizontal: 5,
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 7,
  },
  elevation: {
    shadowColor: 'black',
    elevation: 25,
  },
  navLogo: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
  tinylogo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 15,
    borderRadius: 10,
  },
});

const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    margin: 10,
    flexDirection: 'column',
    //backgroundColor: '#fff',
  },
});

const dropdownStyles = StyleSheet.create({
  dropdown: {
    height: 52,
    borderRadius: 7,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  icon: {
    marginRight: 15,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 9,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 12,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 12,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 12,
    color: 'black',
  },
});

const sliderStyles = StyleSheet.create({
  container: {
    backgroundColor: '#a2b7fa',
    borderRadius: 35,
    borderColor: '#101C75',
    borderStyle: 'solid',
    width: 200,
  },
  titleText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: 'bold',
    marginVertical: 7,
    textAlign: 'center',
    color: '#101C75',
  },
  box: {
    height: 60,
    width: 60,
    backgroundColor: '#101C75',
    borderRadius: 30,
    margin: 5,
    justifyContent: 'center',
  },
});

export default PaymentUpload;
