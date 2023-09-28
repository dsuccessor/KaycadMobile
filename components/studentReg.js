/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect, createRef} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  Easing,
  PanResponder,
  Dimensions,
  Keyboard,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';
import DocumentPicker from 'react-native-document-picker';
import LottieView from 'lottie-react-native';
import client from './client';
import {Avatar, ListItem, Overlay, Dialog} from '@rneui/themed';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import KeyboardAvoidingWrapper from './KeyboardAvoidingWrapper';

function StudentReg({navigation, route}) {
  const {height, width} = Dimensions.get('window');
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const newDate = JSON.stringify(date);
  const myDob = newDate?.split('T')[0].split('"')[1];
  const [facultyValue, setFacultyValue] = useState(null);
  const [deptValue, setDeptValue] = useState(null);
  const [genderValue, setGenderValue] = useState(null);
  const [myPassport, setMyPassport] = useState();
  const [showResponseScreen, setShowResponseScreen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({status: '', msg: ''});
  const [registerationData, setRegisterationData] = useState({
    surname: '',
    otherName: '',
    gender: '',
    dob: '',
    email: '',
    phoneNo: '',
    passport: '',
    password: '',
    level: '100l',
    faculty: '',
    department: '',
  });
  const [customAlert, setCustomerAlert] = useState(false);
  //const [response, setResponse] = useState(false);

  const dateOfBirth = useRef();
  dateOfBirth.current = myDob;

  const nameInput = createRef();
  const addressInput = createRef();
  const phoneInput = createRef();
  const passwordInput = createRef();

  registerationData.dob = myDob;

  const slideAnimation = useRef(new Animated.Value(0)).current;
  // const slidePan = useRef(new Animated.ValueXY()).current;

  const genderOption = [
    {
      label: 'Male',
      value: 'male',
    },
    {
      label: 'Female',
      value: 'female',
    },
  ];

  const facultyOptions = [
    {
      label: 'Science & Tech.',
      value: 'science and technology',
    },
    {
      label: 'Agriculture',
      value: 'agriculture ',
    },
    {
      label: 'Enginerring',
      value: 'enginerring',
    },
    {
      label: 'Medcine',
      value: 'medcine ',
    },
    {
      label: 'Law',
      value: 'law ',
    },
  ];

  const deptOptions = [
    {
      label: 'Science Lab. Tech.',
      value: 'science laboratory technology',
    },
    {
      label: 'Agric. Tech.',
      value: 'agricultural technology',
    },
    {
      label: 'Forestry Tech.',
      value: 'forestry',
    },
    {
      label: 'Com. Sci.',
      value: 'computer science',
    },
    {
      label: 'Cooperate Law',
      value: 'cooperate law',
    },
    {
      label: 'Nursing',
      value: 'nursing',
    },
  ];

  const loadingAnimation = useRef(new Animated.Value(1)).current;

  if (loading === true) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingAnimation, {
          toValue: 0,
          easing: Easing.circle,
          duration: 500,
          isInteraction: false,
          useNativeDriver: true,
        }),
        Animated.timing(loadingAnimation, {
          toValue: 1,
          easing: Easing.circle,
          duration: 500,
          isInteraction: false,
          useNativeDriver: true,
        }),
        Animated.timing(loadingAnimation, {
          toValue: 0,
          easing: Easing.circle,
          duration: 500,
          isInteraction: false,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }

  const responseScreen = () => {
    setShowResponseScreen(false);

    if (responseMessage.status === 'Success') {
      navigation.navigate('Login');
    } else {
      navigation.navigate('StudentReg');
    }
  };

  const toggleDialog1 = () => {
    setCustomerAlert(!customAlert);
  };

  const register = async () => {
    setShowResponseScreen(false);

    //   Submit data to the api

    const {
      surname,
      otherName,
      gender,
      dob,
      email,
      phoneNo,
      password,
      level,
      faculty,
      department,
    } = registerationData;

    if (
      surname === '' ||
      otherName === '' ||
      gender === '' ||
      dob === '' ||
      email === '' ||
      phoneNo === '' ||
      myPassport?.uri === '' ||
      password === '' ||
      level === '' ||
      faculty === '' ||
      department === ''
    ) {
      setShowSubmitConfirm(false);
      console.log('Fields cannot be empty');
      setResponseMessage({
        status: 'Failed',
        msg: 'All fields must be filled in.',
      });
      setCustomerAlert(true);
      //Alert.alert('Fields cannot be empty');
      return false;
    } else {
      setShowSubmitConfirm(false);
      setLoading(true);
      const formData = new FormData();
      formData.append('surname', surname);
      formData.append('otherName', otherName);
      formData.append('gender', gender);
      formData.append('dob', dob);
      formData.append('email', email);
      formData.append('phoneNo', phoneNo);
      formData.append('password', password);
      formData.append('level', level);
      formData.append('faculty', faculty);
      formData.append('department', department);
      formData.append('passport', {
        name: `${surname}-${otherName}-${email}`,
        uri: myPassport.uri,
        type: myPassport.type,
      });

      const config = {
        crossDomain: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
        },
      };

      console.log('registeration data to submit' + JSON.stringify(formData));

      await client
        .post('/student/register', formData, config)
        .then(res => {
          setShowSubmitConfirm(false);
          setLoading(false);
          const result = JSON.stringify(res.data);
          console.log(result);
          setShowSubmitConfirm(false);
          setResponseMessage({status: 'Success', msg: res?.data?.msg});
          //Alert.alert(res.data.msg);

          setShowResponseScreen(true);

          //Alert.alert(res.data.msg);
          //setTimeout(() => window.location.reload(), 5000);
        })
        .catch(err => {
          setShowSubmitConfirm(false);
          setLoading(false);
          console.log('our error = ' + err?.response);
          const dat = JSON.stringify(err?.response?.data?.msg);
          setResponseMessage({status: 'Failed', msg: dat});
          //Alert.alert(err.response);

          setShowResponseScreen(true);
          //Alert.alert(err.response?.data.msg);
        });
    }
  };

  const startAnimation = () => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      easing: Easing.linear,
      duration: 300,
      isInteraction: false,
      useNativeDriver: true,
    }).start();
  };

  const prevAnimation = () => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      easing: Easing.linear,
      duration: 300,
      isInteraction: false,
      useNativeDriver: true,
    }).start();
  };

  const choosePassport = async () => {
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
      console.log('res : ' + JSON.stringify(res));

      //Setting the state to show single file attributes
      setMyPassport(res[0]);

      // paymentData.current.name = res[0]?.name;
      // paymentData.current.size = res[0]?.size;
      // paymentData.current.uri = res[0]?.uri;
      // paymentData.current.fileType = res[0]?.type;
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        Alert.alert('Passport Cancelled');
      } else {
        //For Unknown Error
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  return (
    <KeyboardAvoidingWrapper>
      <View style={{flex: 1, backgroundColor: '#F8F9FA'}}>
        <ScrollView>
          <Text
            style={[
              myStyles.titleText,
              {textAlign: 'center', color: '#101C75'},
            ]}>
            Student Registeration Page
          </Text>

          {/* Animated Screen */}
          <Animated.View
            style={[
              myStyles.container,
              {
                transform: [
                  {
                    translateX: slideAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -width + 10],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}>
            {/* First Slide Screen */}
            <View
              style={{
                width: '100%',
                height: '100%',
                marginRight: 10,
                paddingHorizontal: 5,
              }}>
              {/* Student Profile Section */}
              <View
                style={[
                  myStyles.sectionContainer,
                  {
                    height: '80%',
                    borderRadius: 10,
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowColor: 'rgba(0,0,0,0.2)',
                    shadowOpacity: 0.2,
                    backgroundColor: 'rgb(148, 169, 212)',
                  },
                ]}>
                <Text
                  style={[
                    myStyles.overLayText,
                    {textAlign: 'center', color: '#101C75'},
                  ]}>
                  Student Profile
                </Text>
                <TextInput
                  style={myStyles.textInput}
                  placeholder="Surname"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  onChangeText={surname => {
                    console.log(surname);
                    registerationData.surname = surname;
                  }}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    nameInput.current.focus();
                  }}
                />
                <TextInput
                  style={myStyles.textInput}
                  placeholder="Other Names"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  onChangeText={otherName =>
                    (registerationData.otherName = otherName)
                  }
                  ref={nameInput}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    addressInput.current.focus();
                  }}
                />
                <Dropdown
                  containerStyle={{
                    backgroundColor: '#101C75',
                    minHeight: 50,
                    // maxHeight: 50,
                  }}
                  itemTextStyle={{color: 'black'}}
                  itemContainerStyle={{
                    backgroundColor: '#fff',
                    paddingBottom: 5,
                  }}
                  style={[
                    dropdownmyStyles.dropdown,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(0, 0, 0, 0.2)',
                      borderTopWidth: 1,
                      borderTopColor: 'rgba(0, 0, 0, 0.2)',
                      backgroundColor: '#F8F9FA',
                    },
                  ]}
                  placeholderStyle={dropdownmyStyles.placeholderStyle}
                  selectedTextStyle={dropdownmyStyles.selectedTextStyle}
                  inputSearchStyle={dropdownmyStyles.inputSearchStyle}
                  iconStyle={dropdownmyStyles.iconStyle}
                  data={genderOption}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Gender"
                  searchPlaceholder="Search..."
                  value={registerationData.gender}
                  onChange={item => {
                    console.log(item.value);
                    setGenderValue(JSON.stringify(item.value));
                    registerationData.gender = item.value;
                  }}
                />
                <DatePicker
                  modal
                  open={open}
                  date={date}
                  onConfirm={myDate => {
                    setOpen(false);
                    setDate(myDate);
                    console.log(date);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                  androidVariant="nativeAndroid"
                  mode="date"
                />

                <TextInput
                  placeholder="Select Date of Birth"
                  style={myStyles.textInput}
                  editable={false}
                  selectTextOnFocus={false}
                  value={myDob}
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  autoCapitalize="sentences"
                  underlineColorAndroid="#f000"
                />
                <Pressable
                  style={[
                    myStyles.buttonStyle,
                    {zIndex: 10, position: 'relative', top: '-15%', left: 0},
                  ]}
                  onPress={() => setOpen(true)}
                />
              </View>

              {/* Contact Info Section */}
              <View
                style={[
                  myStyles.sectionContainer,
                  {
                    marginTop: 20,
                    height: '44%',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowColor: 'rgba(0,0,0,0.2)',
                    shadowOpacity: 0.2,
                    backgroundColor: 'rgb(148, 169, 212)',
                    borderRadius: 10,
                  },
                ]}>
                <Text
                  style={[
                    myStyles.overLayText,
                    {top: '-5%', textAlign: 'center', color: '#101C75'},
                  ]}>
                  Contact Information
                </Text>
                <TextInput
                  style={myStyles.textInput}
                  placeholder="Email Address"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  onChangeText={email => (registerationData.email = email)}
                  ref={addressInput}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    phoneInput.current.focus();
                  }}
                />
                <TextInput
                  style={myStyles.textInput}
                  placeholder="Phone Number"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  onChangeText={contact =>
                    (registerationData.phoneNo = contact)
                  }
                  ref={phoneInput}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    passwordInput.current.focus();
                  }}
                />
              </View>

              <View
                style={[
                  myStyles.bottomContainer,
                  {
                    height: '15%',
                  },
                ]}>
                <Pressable onPress={startAnimation}>
                  <View
                    style={{
                      marginVertical: 10,
                      backgroundColor: '#101C75',
                      width: '37%',
                      height: '90%',
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      shadowColor: '#9fa4d6',
                      shadowRadius: 1,
                      shadowOffset: {
                        width: -3,
                        height: -3,
                      },
                      shadowOpacity: 0.8,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      Next
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Second Slide Screen */}
            <View
              style={{
                width: '100%',
                height: '100%',
                marginRight: 10,
                padding: 5,
              }}>
              {/* Other Info Section */}
              <View
                style={[
                  myStyles.sectionContainer,
                  {
                    height: '65%',
                    borderRadius: 10,
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowColor: 'rgba(0,0,0,0.2)',
                    shadowOpacity: 0.2,
                    backgroundColor: 'rgb(148, 169, 212)',
                  },
                ]}>
                <Text
                  style={[
                    myStyles.overLayText,
                    {textAlign: 'center', color: '#101C75'},
                  ]}>
                  Other Informations
                </Text>
                <Dropdown
                  containerStyle={{
                    backgroundColor: 'white',
                    minHeight: 50,
                    // maxHeight: 50,
                  }}
                  itemTextStyle={{color: 'black'}}
                  itemContainerStyle={{
                    backgroundColor: '#fff',
                    paddingBottom: 5,
                  }}
                  style={[
                    dropdownmyStyles.dropdown,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(0, 0, 0, 0.2)',
                      borderTopWidth: 1,
                      borderTopColor: 'rgba(0, 0, 0, 0.2)',
                      backgroundColor: '#F8F9FA',
                    },
                  ]}
                  placeholderStyle={dropdownmyStyles.placeholderStyle}
                  selectedTextStyle={dropdownmyStyles.selectedTextStyle}
                  inputSearchStyle={dropdownmyStyles.inputSearchStyle}
                  iconStyle={dropdownmyStyles.iconStyle}
                  data={facultyOptions}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Faculty"
                  searchPlaceholder="Search..."
                  value={facultyValue}
                  onChange={item => {
                    setFacultyValue(item.value);
                    registerationData.faculty = item.value;
                  }}
                />

                <Dropdown
                  containerStyle={{
                    backgroundColor: 'white',
                    minHeight: 50,
                    // maxHeight: 50,
                  }}
                  itemTextStyle={{color: 'black'}}
                  itemContainerStyle={{
                    backgroundColor: '#fff',
                    paddingBottom: 5,
                  }}
                  style={[
                    dropdownmyStyles.dropdown,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(0, 0, 0, 0.2)',
                      borderTopWidth: 1,
                      borderTopColor: 'rgba(0, 0, 0, 0.2)',
                      backgroundColor: '#F8F9FA',
                    },
                  ]}
                  placeholderStyle={dropdownmyStyles.placeholderStyle}
                  selectedTextStyle={dropdownmyStyles.selectedTextStyle}
                  inputSearchStyle={dropdownmyStyles.inputSearchStyle}
                  iconStyle={dropdownmyStyles.iconStyle}
                  data={deptOptions}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Department"
                  searchPlaceholder="Search..."
                  value={deptValue}
                  onChange={item => {
                    setDeptValue(item.value);
                    registerationData.department = item.value;
                  }}
                />
                <TextInput
                  style={myStyles.textInput}
                  placeholder="Password"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  blurOnSubmit={true}
                  onSubmitEditing={Keyboard.dismiss}
                  secureTextEntry={true}
                  returnKeyType="next"
                  keyboardType="default"
                  onChangeText={password => {
                    registerationData.password = password;
                  }}
                  ref={passwordInput}
                />
              </View>

              {/* Passort Upload Box */}
              <Pressable
                style={[
                  myStyles.passportContainer,
                  {height: '50%', backgroundColor: '#fff'},
                ]}
                onPress={choosePassport}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  {myPassport?.uri ? (
                    <Image
                      source={{
                        uri: myPassport?.uri,
                      }}
                      style={{
                        flex: 1,
                        borderTopLeftRadius: 15,
                        borderBottomRightRadius: 15,
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        color: 'black',
                        textAlign: 'center',
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}>
                      Click to upload passport
                    </Text>
                  )}
                </View>
              </Pressable>

              {/* Botton Section */}
              <View
                style={[
                  myStyles.bottomContainer,
                  {
                    height: '48%',
                    flexDirection: 'row',
                  },
                ]}>
                <Pressable
                  style={{
                    height: '50%',
                    width: '53%',
                  }}
                  onPress={prevAnimation}>
                  <View
                    style={{
                      backgroundColor: 'rgb(240, 255, 240)',
                      width: '70%',
                      height: '55%',
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginVertical: 10,
                      shadowColor: 'black',
                      shadowRadius: 1,
                      shadowOffset: {
                        width: -4,
                        height: 5,
                      },
                      shadowOpacity: 0.8,
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        textAlign: 'center',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      Previous
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  style={{
                    height: '50%',
                    width: '50%',
                    paddingVertical: 0,
                  }}
                  onPress={() => setShowSubmitConfirm(true)}>
                  <View
                    style={{
                      backgroundColor: 'rgb(240, 240, 255)',
                      width: '70%',
                      height: '55%',
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginVertical: 10,
                      shadowColor: '#101C75',
                      shadowRadius: 1,
                      shadowOffset: {
                        width: 4,
                        height: 5,
                      },
                      shadowOpacity: 0.8,
                    }}>
                    <Text
                      style={{
                        color: '#101C75',
                        textAlign: 'center',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      Submit
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </Animated.View>

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
                  ? require('../src/assets/Successful-reg.json')
                  : require('../src/assets/failed-reg.json')
              }
              autoPlay
              loop={false}
              style={{position: 'absolute', top: '-9%'}}
            />

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

          {/* Page Loader */}
          <Dialog
            overlayStyle={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              backgroundColor: 'rgba(0,0,255,.2)',
              paddingVertical: '70%',
            }}
            isVisible={loading}>
            {/* <LottieView
          source={require('../src/assets/cycling-#101C75-loader.json')}
          autoPlay
          loop={true}
        /> */}
            <LottieView
              //source={require('../assets/cycling-#101C75-loader.json')}
              source={require('../src/assets/Loader.json')}
              autoPlay
              loop={true}
            />

            <Animated.Image
              style={[myStyles.tinylogo, {opacity: loadingAnimation}]}
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

          {/* Submission Confiration Page */}
          <Dialog
            overlayStyle={{
              width: width,
              height: height,
              backgroundColor: 'transparent',
              justifyContent: 'flex-end',
              padding: 0,
            }}
            isVisible={showSubmitConfirm}>
            <View
              style={{
                height: '60%',
                backgroundColor: '#101C75',
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
              }}>
              <TouchableOpacity
                onPress={() => setShowSubmitConfirm(false)}
                style={{
                  marginTop: 15,
                  marginRight: 15,
                  alignSelf: 'flex-end',
                }}>
                <FontAwesome5Icon
                  name="times-circle"
                  size={20}
                  color={'#bfccf5'}
                  solid={false}
                />
              </TouchableOpacity>

              <Text
                style={{
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: 25,
                  color: '#bfccf5',
                  marginLeft: 20,
                }}>
                Bio Data
              </Text>

              <View
                style={{
                  paddingTop: 10,
                  padding: 10,
                  alignItems: 'center',
                }}>
                <ListItem
                  bottomDivider
                  pad={10}
                  style={{width: '100%'}}
                  containerStyle={{
                    marginBottom: 5,
                    borderRadius: 15,
                    borderWidth: 0,
                    borderColor: '#fff',
                    width: '100%',
                    backgroundColor: 'transparent',
                  }}>
                  <ListItem.Content
                    style={{
                      width: 100,
                      color: 'white',
                    }}>
                    <ListItem.Title
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'white',
                        width: 100,
                      }}>
                      Surname
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        color: '#bfccf5',
                        fontWeight: 'bold',
                        width: 100,
                        marginTop: 5,
                        fontSize: 13,
                      }}>
                      Other Name(s)
                    </ListItem.Subtitle>
                  </ListItem.Content>

                  <ListItem.Content
                    style={{
                      width: 100,
                      color: 'white',
                    }}>
                    <ListItem.Title
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'white',
                        //width: 100,
                      }}>
                      {registerationData?.surname}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        color: '#bfccf5',
                        fontWeight: 'bold',
                        width: 100,
                        marginTop: 5,
                        fontSize: 13,
                      }}>
                      {registerationData?.otherName}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>

                <ListItem
                  bottomDivider
                  pad={10}
                  style={{width: '100%'}}
                  containerStyle={{
                    marginBottom: 5,
                    borderRadius: 15,
                    borderWidth: 0,
                    borderColor: '#fff',
                    width: '100%',
                    backgroundColor: 'transparent',
                  }}>
                  <ListItem.Content
                    style={{
                      width: 100,
                      color: 'white',
                    }}>
                    <ListItem.Title
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'white',
                        width: 100,
                      }}>
                      Gender
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        color: '#bfccf5',
                        fontWeight: 'bold',
                        width: 100,
                        marginTop: 5,
                        fontSize: 13,
                      }}>
                      Date of birth
                    </ListItem.Subtitle>
                  </ListItem.Content>

                  <ListItem.Content
                    style={{
                      width: 100,
                      color: 'white',
                    }}>
                    <ListItem.Title
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'white',
                        //width: 100,
                      }}>
                      {registerationData?.gender}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        color: '#bfccf5',
                        fontWeight: 'bold',
                        width: 100,
                        marginTop: 5,
                        fontSize: 13,
                      }}>
                      {registerationData?.dob}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>

                <ListItem
                  bottomDivider
                  pad={10}
                  style={{width: '100%'}}
                  containerStyle={{
                    marginBottom: 5,
                    borderRadius: 15,
                    borderWidth: 0,
                    borderColor: '#fff',
                    width: '100%',
                    backgroundColor: 'transparent',
                  }}>
                  <ListItem.Content
                    style={{
                      width: 100,
                      color: 'white',
                    }}>
                    <ListItem.Title
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'white',
                      }}>
                      Email Address
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        color: '#bfccf5',
                        fontWeight: 'bold',
                        width: 100,
                        marginTop: 5,
                        fontSize: 13,
                      }}>
                      Phone Number
                    </ListItem.Subtitle>
                  </ListItem.Content>

                  <ListItem.Content
                    style={{
                      width: 100,
                      color: 'white',
                    }}>
                    <ListItem.Title
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'white',
                        //width: 100,
                      }}>
                      {registerationData?.email}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        color: '#bfccf5',
                        fontWeight: 'bold',
                        width: 100,
                        marginTop: 5,
                        fontSize: 13,
                      }}>
                      {registerationData?.phoneNo}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>

                <ListItem
                  bottomDivider
                  pad={10}
                  style={{width: '100%'}}
                  containerStyle={{
                    marginBottom: 5,
                    borderRadius: 15,
                    borderWidth: 0,
                    borderColor: '#fff',
                    width: '100%',
                    backgroundColor: 'transparent',
                  }}>
                  <ListItem.Content
                    style={{
                      width: 100,
                      color: 'white',
                    }}>
                    <ListItem.Title
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'white',
                        width: 100,
                      }}>
                      Faculty
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        color: '#bfccf5',
                        fontWeight: 'bold',
                        width: 100,
                        marginTop: 5,
                        fontSize: 13,
                      }}>
                      Department
                    </ListItem.Subtitle>
                  </ListItem.Content>

                  <ListItem.Content
                    style={{
                      width: 100,
                      color: 'white',
                    }}>
                    <ListItem.Title
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'white',
                        //width: 100,
                      }}>
                      {registerationData?.faculty}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        color: '#bfccf5',
                        fontWeight: 'bold',
                        marginTop: 5,
                        fontSize: 13,
                      }}>
                      {registerationData?.department}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>

                <ListItem
                  bottomDivider
                  pad={10}
                  style={{width: '100%'}}
                  containerStyle={{
                    marginBottom: 5,
                    borderRadius: 15,
                    borderWidth: 0,
                    borderColor: '#fff',
                    width: '100%',
                    backgroundColor: 'transparent',
                  }}>
                  <ListItem.Content
                    style={{
                      width: 100,
                      color: 'white',
                    }}>
                    <ListItem.Title
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'white',
                        width: 100,
                      }}>
                      Passport
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        color: '#bfccf5',
                        fontWeight: 'bold',
                        width: 100,
                        marginTop: 5,
                        fontSize: 13,
                      }}>
                      Password
                    </ListItem.Subtitle>
                  </ListItem.Content>

                  <ListItem.Content
                    style={{
                      width: 100,
                      color: 'white',
                    }}>
                    <ListItem.Title
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor:
                          myPassport?.uri === '' ? 'red' : 'green',
                        paddingHorizontal: 15,
                        paddingVertical: 3,
                      }}>
                      {myPassport?.uri === '' ? 'Not Set' : 'Set'}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        marginTop: 5,
                        fontSize: 13,
                        backgroundColor:
                          registerationData?.password === '' ? 'red' : 'green',
                        paddingHorizontal: 15,
                        paddingVertical: 3,
                      }}>
                      {registerationData?.password === '' ? 'Not Set' : 'Set'}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              </View>

              <TouchableOpacity onPress={register}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 5,
                    marginVertical: 10,
                    height: 50,
                    borderRadius: 10,
                    alignContent: 'center',
                    marginHorizontal: 20,
                  }}>
                  <Text
                    style={{
                      color: '#101C75',
                      fontWeight: '600',
                      textAlign: 'center',
                      fontSize: 20,
                      marginTop: 7,
                    }}>
                    Register
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Dialog>

          {/* Customer Notification */}
          <Dialog
            overlayStyle={{
              borderRadius: 15,
              width: '60%',
            }}
            isVisible={customAlert}
            onBackdropPress={toggleDialog1}>
            <FontAwesome5Icon
              style={{
                textAlign: 'center',
                marginVertical: 10,
                alignSelf: 'center',
              }}
              name={
                responseMessage?.status === 'Success'
                  ? 'times-circle'
                  : 'times-circle'
              }
              color={responseMessage?.status === 'Failed' ? '#101C75' : 'red'}
              size={30}
              solid
            />
            <Text
              style={{
                fontSize: 15,
                textAlign: 'center',
                fontWeight: 'bold',
                marginVertical: 10,
                color:
                  responseMessage?.status === 'Success' ? '#101C75' : 'red',
              }}>
              {responseMessage?.status === 'Success' ? 'Hurray!' : 'Oops!'}
            </Text>

            <Text
              style={{
                fontSize: 15,
                textAlign: 'center',
                marginBottom: 10,
                color: 'black',
              }}>
              {responseMessage?.msg}
            </Text>
          </Dialog>
        </ScrollView>
      </View>
    </KeyboardAvoidingWrapper>
  );
}

const myStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '60%',
    padding: 10,
    flexDirection: 'row',
    //overflow: 'hidden',
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 20,
    width: '100%',
  },
  sectionContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
    marginBottom: 10,
    marginRight: 10,
  },
  tinylogo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  passportContainer: {
    width: '50%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 20,
    marginRight: 10,
    borderBottomEndRadius: 20,
    borderTopStartRadius: 20,
    alignSelf: 'center',
  },
  bottomContainer: {
    width: '100%',
    padding: 10,
    marginVertical: 15,
    justifyContent: 'center',
  },
  overLayText: {
    zIndex: 10,
    position: 'absolute',
    top: '-2.5%',
    left: '10%',
    fontWeight: 'bold',
    //backgroundColor: 'rgb(240, 240, 240)',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    fontSize: 15,
    paddingHorizontal: 10,
    color: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    minHeight: 50,
    marginVertical: 15,
  },
  buttonStyle: {
    width: '100%',
    flexDirection: 'row',
    height: 45,
    borderRadius: 7,
    marginTop: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    height: 52,
    borderRadius: 7,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
});

const dropdownmyStyles = StyleSheet.create({
  dropdown: {
    height: 52,
    //borderRadius: 7,
    paddingHorizontal: 10,
    marginVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    fontSize: 15,
    color: 'rgba(0,0,0,0.3)',
  },
  selectedTextStyle: {
    fontSize: 15,
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
export default StudentReg;
