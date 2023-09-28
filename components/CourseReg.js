/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import CheckBox from 'react-native-check-box';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  Dimensions,
  Animated,
  Easing,
  ImageBackground,
  AppState,
} from 'react-native';
import client from './client';
import AsyncStorage from '@react-native-community/async-storage';
import {DataTable} from 'react-native-paper';
import {Avatar, ListItem, Overlay, Dialog} from '@rneui/themed';
import LottieView from 'lottie-react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
const {height, width} = Dimensions.get('window');

function CourseReg({route, navigation}) {
  const [profile, setProfile] = useState();
  const [input, setInput] = useState();
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState([]);
  const [state, setState] = useState([{}]);
  const [courseForm, setCourseForm] = useState();
  const [status, setStatus] = useState();
  const [visible, setVisible] = useState(false);
  const [myCourse, setMyCourse] = useState({});
  var [totalCourseUnit, setTotalCourseUnit] = useState(0);
  var [maxCourseUnit, setMaxCourseUnit] = useState(0);
  const [courseSubmitted, setCourseSubmitted] = useState(false);
  const [showResponseScreen, setShowResponseScreen] = useState(false);
  const [responseMessage, setResponseMessage] = useState({status: '', msg: ''});

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const animationStart = useRef(new Animated.Value(1)).current;

  const navLinks = [
    {
      linkName: 'Home',
      linkUrl: 'Dashboard',
      linkIcon: 'home',
    },
    {
      linkName: 'Profile',
      linkUrl: 'Dashboard',
      linkIcon: 'user',
    },
    {
      linkName: 'Payment',
      linkUrl: 'PaymentUpload',
      linkIcon: 'money-check-alt',
    },
    {
      linkName: 'Course',
      linkUrl: 'CourseReg',
      linkIcon: 'file-invoice',
    },
    {
      linkName: 'History',
      linkUrl: 'PaymentHistory',
      linkIcon: 'wallet',
    },
  ];

  const [finalReg, setFinalReg] = useState({
    studentId: 'studentId',
    course: [],
    semester: 'semester',
    session: 'session',
  });

  const {activeUser} = route?.params;
  //const activeUser = input;

  AsyncStorage.getItem('@activeUser').then(user => {
    let data = JSON.parse(user);
    setInput(data);
  });

  useEffect(() => {
    navigation.setOptions({title: activeUser?.surname?.toUpperCase()});
    var totalUnit = 0;
    var maxUnit = 0;

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

    const userProfile = async () => {
      setLoading(true);
      await client
        .get(`/student/fetch/${input?.email}`)
        .then(response => {
          setProfile(response?.data?.result);
          const result = JSON.stringify(response?.data?.result);
          AsyncStorage.setItem('activeUserProfile', result);
          console.log(response);
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    };

    userProfile();

    const userDepartment = async () => {
      setLoading(true);
      await client
        .get(`/course/fetch/${profile?.department}`)
        .then(response => {
          setDepartment(response?.data?.result);

          const allCourse = response?.data?.result;
          allCourse?.map(course => {
            maxUnit = course?.courseUnit + maxUnit;
            setMaxCourseUnit(maxUnit);
          });

          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    };

    userDepartment();

    const userCourseForm = async () => {
      setLoading(true);
      await client
        .get(`/courseform/fetchAll/${profile?.studentId}`)
        .then(response => {
          setCourseForm(response?.data?.result);
          const csForm = response?.data?.result?.course;
          csForm?.map(course => {
            totalUnit = course?.courseUnit + totalUnit;
            setTotalCourseUnit(totalUnit);
          });
          setLoading(false);
        })
        .catch(error => {
          console.log(error?.response?.data);
          setStatus(error?.response?.data?.msg);
          setLoading(false);
        });
    };

    userCourseForm();

    return () => {
      checkAppState.remove();
    };
  }, [
    activeUser,
    input?.email,
    navigation,
    profile?.department,
    profile?.studentId,
  ]);

  const selectCoursesToRegister = (index, dept) => {
    // Check and Uncheck Box
    state[index]?.isChecked === true
      ? (state[index].isChecked = false)
      : (state[index] = {isChecked: true});

    // Set and Unset Record
    const courseExist = checkIfCourseAlreadySelected(dept?.courseId);

    console.log('courseId = ' + dept.courseId);
    console.log('courseExist = ' + courseExist?.courseId);

    if (courseExist?.courseId === dept.courseId) {
      removeSelectedCourse(dept);
    } else {
      //global.courseReg = dept
      let selectedCourse = {
        courseId: dept?.courseId,
        courseTitle: dept?.courseTitle,
        courseCode: dept?.courseCode,
        courseUnit: dept?.courseUnit,
      };

      setFinalReg({
        studentId: profile?.studentId,
        course: [...finalReg?.course, selectedCourse],
        semester: dept?.semester,
        session: dept?.session,
      });
    }
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

  const responseScreen = () => {
    setShowResponseScreen(false);

    if (responseMessage.status === 'Success') {
      navigation.navigate('Dashboard', {
        activeUser: input?.current?.surname,
      });
    } else {
      navigation.navigate('CourseReg', {
        activeUser: input?.current?.surname,
      });
    }
  };

  const checkIfCourseAlreadySelected = courseId => {
    console.log('check function courseId = ' + courseId);
    console.log('check function finalReg = ' + finalReg?.course);

    const findSelectedCourse = finalReg.course.find(item => {
      return item?.courseId === courseId;
    });

    console.log(
      'check function selectedCourse = ' + findSelectedCourse?.courseId,
    );
    return findSelectedCourse;
  };

  const removeSelectedCourse = dept => {
    console.log('my pass' + dept?.courseId);

    const filterSelectedCourse = finalReg.course.filter(item => {
      console.log('my filter' + item?.courseId);

      return item?.courseId !== dept?.courseId;
    });

    console.log('my arr' + filterSelectedCourse);

    setFinalReg({
      studentId: profile?.studentId,
      course: filterSelectedCourse,
      semester: dept?.semester,
      session: dept?.session,
    });
  };

  const submitCourseSelection = async () => {
    setShowResponseScreen(false);
    await client
      .post('/courseform/registercourse', finalReg)
      .then(res => {
        console.log(res?.data?.result);
        //Alert.alert(JSON.stringify(res?.data?.msg));
        setResponseMessage({
          status: 'Success',
          msg: JSON.stringify(res?.data?.msg),
        });
        setShowResponseScreen(true);
        //setCourseSubmitted(true);
        //navigation.navigate('Dashboard');
        //setLoad(!load);
      })
      .catch(err => {
        console.log(err?.response);
        // Alert.alert(JSON.stringify(err?.response?.data?.msg));
        setResponseMessage({
          status: 'Failed',
          msg: JSON.stringify(err?.response?.data?.msg),
        });
        //navigation.navigate('Dashboard');
        //setLoad(!load);
      });
  };

  const toggleOverlay = courseData => {
    setMyCourse(JSON.parse(JSON.stringify(courseData)));
    setVisible(!visible);
  };

  const displayOptions = () => {
    // console.log('status' + status);

    if (status === 'You havent register for any course yet') {
      return (
        <ScrollView style={styles.container}>
          <Text style={[styles.label]}>Course Registeration</Text>
          <View
            style={[
              styles.profileBox,
              styles.elevation,
              {borderWidth: 0, borderColor: '#101C75'},
            ]}>
            <Text
              style={{
                color: '#101C75',
                paddingLeft: 15,
                paddingTop: 10,
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              Student Profile
            </Text>

            {/* //Student Details Table */}

            <DataTable style={styleTable.container}>
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require('../src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
                //resizeMode="cover"
              />
              <DataTable.Row
                style={{
                  //backgroundColor: 'rgb(190, 199, 250)',
                  backgroundColor: 'white',
                  borderRadius: 15,
                  color: '#101C75',
                }}>
                <DataTable.Cell
                  textStyle={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: '#101C75',
                  }}>
                  Student ID:
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{fontSize: 12, width: '100%', color: '#101C75'}}>
                  {profile?.studentId}
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell
                  textStyle={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Surname:
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{fontSize: 12, width: '100%', color: 'white'}}>
                  {' '}
                  {profile?.surname.toUpperCase()}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row
                style={{
                  //backgroundColor: 'rgb(190, 199, 250)',
                  backgroundColor: 'white',
                  borderRadius: 15,
                }}>
                <DataTable.Cell
                  textStyle={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: '#101C75',
                  }}>
                  Other Name(s):
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{fontSize: 12, width: '100%', color: '#101C75'}}>
                  {profile?.otherName.toUpperCase()}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell
                  textStyle={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Matric No:
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{fontSize: 12, width: '100%', color: 'white'}}>
                  {profile?.matricNo}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row
                style={{
                  //backgroundColor: 'rgb(190, 199, 250)',
                  backgroundColor: 'white',
                  borderRadius: 15,
                }}>
                <DataTable.Cell
                  textStyle={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: '#101C75',
                  }}>
                  Email Address:
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{fontSize: 12, width: '100%', color: '#101C75'}}>
                  {profile?.email.toUpperCase()}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell
                  textStyle={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Faculty:
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{fontSize: 12, width: '100%', color: 'white'}}>
                  {profile?.faculty.toUpperCase()}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row
                style={{
                  //backgroundColor: 'rgb(190, 199, 250)',
                  backgroundColor: 'white',
                  borderRadius: 15,
                }}>
                <DataTable.Cell
                  textStyle={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    width: '100%',
                    color: '#101C75',
                  }}>
                  Department:
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{fontSize: 12, width: '100%', color: '#101C75'}}>
                  {' '}
                  {profile?.department.toUpperCase()}
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </View>
          <View style={[styles.profileBox, styles.elevation]}>
            <Text
              style={{
                color: '#101C75',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 15,
                marginVertical: 10,
              }}>
              Student Passport
            </Text>
            <View
              style={{
                borderColor: '#101C75',
                borderTopWidth: 1,
                marginBottom: 15,
                marginHorizontal: 30,
              }}
            />
            <Image
              source={{
                uri: profile?.passport,
              }}
              style={styles.tinylogo}
            />
          </View>
          <View
            style={[
              styles.profileBox,
              styles.elevation,
              {borderWidth: 0, borderColor: '#101C75', marginBottom: 60},
            ]}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 15,
                marginBottom: 5,
                color: '#101C75',
              }}>
              Student Course Registeration
            </Text>

            {/* // Course Registeration Table */}
            <DataTable style={styleTable.containerReg}>
              <DataTable.Header
                style={{
                  width: '100%',
                  borderTopWidth: 1,
                  borderTopColor: '#101C75',
                  backgroundColor: '#a2b7fa',
                }}>
                <DataTable.Title
                  textStyle={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    width: '100%',
                    color: '#101C75',
                  }}>
                  Course Code
                </DataTable.Title>
                <DataTable.Title
                  textStyle={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    width: '100%',
                    color: '#101C75',
                  }}>
                  Course Unit
                </DataTable.Title>
                <DataTable.Title
                  textStyle={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    width: '100%',
                    color: '#101C75',
                  }}>
                  Select Course
                </DataTable.Title>
              </DataTable.Header>

              {department.map((dept, index) => {
                global.courseReg = {};

                return (
                  <DataTable.Row
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 == 0
                          ? 'transparent'
                          : 'rgba(255, 255, 255,0.5)',
                      borderBottomWidth: 1,
                      //borderBottomColor: 'rgb(190, 199, 250)',
                      borderBottomColor: '#a2b7fa',
                      paddingVertical: 7,
                    }}>
                    <DataTable.Cell
                      textStyle={{
                        fontSize: 12,
                        width: '100%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        color: '#101C75',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          width: '100%',
                          fontSize: 12,
                          fontWeight: 'bold',
                          //color: '#a2b7fa',
                        }}>
                        {' '}
                        {dept?.courseCode.toUpperCase()}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      textStyle={{
                        fontSize: 12,
                        width: '100%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        color: '#101C75',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          width: '100%',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        {dept?.courseUnit}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      textStyle={{
                        fontSize: 12,
                        width: '100%',
                        justifyContent: 'center',
                        paddingStart: 40,
                        color: '#101C75',
                      }}>
                      <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={() => {
                          selectCoursesToRegister(index, dept);
                        }}
                        isChecked={state[index]?.isChecked}
                        checkBoxColor="blue"
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}
            </DataTable>

            <Pressable
              style={styleTable.btnStyle}
              onPress={submitCourseSelection}>
              <View style={{width: '80%'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '900',
                    color: 'white',
                    alignSelf: 'center',
                  }}>
                  Register
                </Text>
              </View>
              <View style={{width: '20%'}}>
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

            {/* <Button
              style={{
                width: '60%',
                minHeight: 80,
                alignSelf: 'center',
                borderRadius: 10,
                marginBottom: 10,
              }}
              color={'#101C75'}
              title="Register Course"
              onPress={submitCourseSelection}>
              <View style={{width: '50%', alignItems: 'flex-end'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '900',
                    color: 'white',
                  }}>
                  Register Course
                </Text>
              </View>
              <View style={{width: '30%', alignItems: 'flex-start'}}>
                <FontAwesomeIcon
                  style={{
                    color: '#fff',
                    alignSelf: 'center',
                  }}
                  icon="right-to-bracket"
                  size={20}
                  color="white"
                />
              </View>
            </Button> */}
          </View>
        </ScrollView>
      );
    } else {
      return (
        <View>
          <View style={{paddingBottom: 50}}>
            <FlatList
              style={{marginBottom: 10}}
              ListHeaderComponent={
                <>
                  <View style={[styles.container]}>
                    <Text style={[styles.label]}>Course Registeration</Text>
                    <View
                      style={[
                        styles.profileBox,
                        styles.elevation,
                        {borderWidth: 0, borderColor: '#101C75'},
                      ]}>
                      <Text
                        style={{
                          color: '#101C75',
                          paddingLeft: 15,
                          paddingTop: 10,
                          fontWeight: 'bold',
                          fontSize: 15,
                        }}>
                        Student Profile
                      </Text>

                      {/* //Student Details Table */}

                      <DataTable style={styleTable.container}>
                        <ImageBackground
                          style={{...StyleSheet.absoluteFill, borderRadius: 20}}
                          source={require('../src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
                          //resizeMode="cover"
                        />
                        <DataTable.Row
                          style={{
                            //backgroundColor: 'rgb(190, 199, 250)',
                            backgroundColor: 'white',
                            borderRadius: 15,
                            color: '#101C75',
                          }}>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              fontWeight: 'bold',
                              color: '#101C75',
                            }}>
                            Student ID:
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              width: '100%',
                              color: '#101C75',
                            }}>
                            {profile?.studentId}
                          </DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              fontWeight: 'bold',
                              color: 'white',
                            }}>
                            Surname:
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              width: '100%',
                              color: 'white',
                            }}>
                            {' '}
                            {profile?.surname.toUpperCase()}
                          </DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row
                          style={{
                            //backgroundColor: 'rgb(190, 199, 250)',
                            backgroundColor: 'white',
                            borderRadius: 15,
                          }}>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              fontWeight: 'bold',
                              color: '#101C75',
                            }}>
                            Other Name(s):
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              width: '100%',
                              color: '#101C75',
                            }}>
                            {profile?.otherName.toUpperCase()}
                          </DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              fontWeight: 'bold',
                              color: 'white',
                            }}>
                            Matric No:
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              width: '100%',
                              color: 'white',
                            }}>
                            {profile?.matricNo}
                          </DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row
                          style={{
                            //backgroundColor: 'rgb(190, 199, 250)',
                            backgroundColor: 'white',
                            borderRadius: 15,
                          }}>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              fontWeight: 'bold',
                              color: '#101C75',
                            }}>
                            Email Address:
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              width: '100%',
                              color: '#101C75',
                            }}>
                            {profile?.email.toUpperCase()}
                          </DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              fontWeight: 'bold',
                              color: 'white',
                            }}>
                            Faculty:
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              width: '100%',
                              color: 'white',
                            }}>
                            {profile?.faculty.toUpperCase()}
                          </DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row
                          style={{
                            //backgroundColor: 'rgb(190, 199, 250)',
                            backgroundColor: 'white',
                            borderRadius: 15,
                          }}>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              fontWeight: 'bold',
                              width: '100%',
                              color: '#101C75',
                            }}>
                            Department:
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={{
                              fontSize: 12,
                              width: '100%',
                              color: '#101C75',
                            }}>
                            {' '}
                            {profile?.department.toUpperCase()}
                          </DataTable.Cell>
                        </DataTable.Row>
                      </DataTable>
                    </View>
                    <View style={[styles.profileBox, styles.elevation]}>
                      <Text
                        style={{
                          color: '#101C75',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 15,
                          marginVertical: 10,
                        }}>
                        Student Passport
                      </Text>
                      <View
                        style={{
                          borderColor: '#101C75',
                          borderTopWidth: 1,
                          marginBottom: 15,
                          marginHorizontal: 30,
                        }}
                      />
                      <Image
                        source={{
                          uri: profile?.passport,
                        }}
                        style={styles.tinylogo}
                      />
                    </View>
                  </View>

                  {/* Course Form List Header Start */}

                  <View style={[styles.listHeader, styles.listHeaderElevation]}>
                    <ImageBackground
                      style={StyleSheet.absoluteFill}
                      source={require('../src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        width: '10%',
                        borderTopColor: 'white',
                        borderTopWidth: 3,
                        alignSelf: 'center',
                        marginTop: 30,
                      }}
                    />
                    {/* Course Registered Section Start */}
                    {/* <View style={[styles.listHeaderBox, styles.elevation]}>
                      <View style={{width: '100%', marginVertical: 5}}>
                        <Text
                          style={{
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 15,
                            textAlignVertical: 'center',
                            padding: 0,
                            margin: 0,
                          }}>
                          Course Registered
                        </Text>
                        <View
                          style={{
                            width: '60%',
                            borderTopColor: 'white',
                            borderTopWidth: 1,
                            alignSelf: 'center',
                            marginVertical: 5,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          width: '50%',
                          paddingLeft: 5,
                          marginBottom: 5,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          Total Unit Registered: {totalCourseUnit}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '50%',
                          paddingLeft: 5,
                          marginBottom: 5,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          Max. Available Unit: {maxCourseUnit}
                        </Text>
                      </View>
                      {/* Full Registered Course Details Start */}
                    <View style={{paddingHorizontal: 5}}>
                      <Overlay
                        overlayStyle={{padding: 0, borderRadius: 30}}
                        isVisible={visible}
                        onBackdropPress={() => toggleOverlay(myCourse)}>
                        <View
                          style={{
                            backgroundColor: '#2C89DC',
                            borderRadius: 20,
                          }}>
                          <Image
                            source={{
                              uri: profile?.passport,
                            }}
                            style={{
                              width: 70,
                              height: 70,
                              alignSelf: 'center',
                              marginVertical: 10,
                              borderRadius: 10,
                            }}
                          />
                          <Text style={overlayStyles.textPrimary}>
                            {input?.surname.toUpperCase()}
                          </Text>
                          <Text
                            style={[
                              overlayStyles.textSecondary,
                              {paddingBottom: 10},
                            ]}>
                            Course per Course Detail
                          </Text>
                        </View>
                        <View>
                          <ListItem bottomDivider style={{marginVertical: 4}}>
                            <Avatar
                              rounded
                              source={{
                                uri: profile?.passport,
                              }}
                            />
                            <ListItem.Content>
                              <ListItem.Subtitle style={{fontSize: 10}}>
                                Course Id
                              </ListItem.Subtitle>
                              <ListItem.Title
                                style={{fontWeight: 'bold', fontSize: 12}}>
                                {myCourse?.courseId}
                              </ListItem.Title>
                            </ListItem.Content>
                          </ListItem>
                          <ListItem bottomDivider style={{marginVertical: 4}}>
                            <Avatar
                              rounded
                              source={{
                                uri: profile?.passport,
                              }}
                            />
                            <ListItem.Content>
                              <ListItem.Subtitle style={{fontSize: 10}}>
                                Course Code
                              </ListItem.Subtitle>
                              <ListItem.Title
                                style={{fontWeight: 'bold', fontSize: 12}}>
                                {myCourse?.courseCode?.toUpperCase()}
                              </ListItem.Title>
                            </ListItem.Content>
                          </ListItem>
                          <ListItem bottomDivider style={{marginVertical: 4}}>
                            <Avatar
                              rounded
                              source={{
                                uri: profile?.passport,
                              }}
                            />
                            <ListItem.Content>
                              <ListItem.Subtitle style={{fontSize: 10}}>
                                Course Title
                              </ListItem.Subtitle>
                              <ListItem.Title
                                style={{fontWeight: 'bold', fontSize: 12}}>
                                {myCourse?.courseTitle?.toUpperCase()}
                              </ListItem.Title>
                            </ListItem.Content>
                          </ListItem>
                          <ListItem style={{marginVertical: 4}}>
                            <Avatar
                              rounded
                              source={{
                                uri: profile?.passport,
                              }}
                            />
                            <ListItem.Content>
                              <ListItem.Subtitle style={{fontSize: 10}}>
                                Course Unit
                              </ListItem.Subtitle>
                              <ListItem.Title
                                style={{fontWeight: 'bold', fontSize: 12}}>
                                {myCourse?.courseUnit}
                              </ListItem.Title>
                            </ListItem.Content>
                          </ListItem>
                        </View>
                      </Overlay>
                    </View>
                    {/* Full Registered Course Detals end */}
                    {/*   </View> */}
                    {/* Course Registered Section Ends */}

                    {/* Course Registered Section Start */}
                    <View style={[styles.listHeaderBox, styles.elevation]}>
                      <View style={{width: '100%', marginVertical: 5}}>
                        <Text
                          style={{
                            color: '#101C75',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 15,
                            textAlignVertical: 'center',
                            padding: 0,
                            margin: 0,
                          }}>
                          Course Registered
                        </Text>
                        <View
                          style={{
                            width: '60%',
                            borderTopColor: 'black',
                            borderTopWidth: 1,
                            alignSelf: 'center',
                            marginVertical: 5,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          width: '50%',
                          paddingLeft: 5,
                          marginBottom: 5,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: '#101C75',
                          }}>
                          Total Unit Registered: {totalCourseUnit}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '50%',
                          paddingLeft: 5,
                          marginBottom: 5,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: '#101C75',
                          }}>
                          Max. Available Unit: {maxCourseUnit}
                        </Text>
                      </View>
                      {/* Full Registered Course Details Start */}
                      <View style={{paddingHorizontal: 5}}>
                        <Overlay
                          overlayStyle={{padding: 0, borderRadius: 30}}
                          isVisible={visible}
                          onBackdropPress={() => toggleOverlay(myCourse)}>
                          <View
                            style={{
                              backgroundColor: '#2C89DC',
                              borderRadius: 20,
                            }}>
                            <Image
                              source={{
                                uri: profile?.passport,
                              }}
                              style={{
                                width: 70,
                                height: 70,
                                alignSelf: 'center',
                                marginVertical: 10,
                                borderRadius: 10,
                              }}
                            />
                            <Text style={overlayStyles.textPrimary}>
                              {input?.surname.toUpperCase()}
                            </Text>
                            <Text
                              style={[
                                overlayStyles.textSecondary,
                                {paddingBottom: 10},
                              ]}>
                              Course per Course Detail
                            </Text>
                          </View>
                          <View>
                            <ListItem bottomDivider style={{marginVertical: 4}}>
                              <Avatar
                                rounded
                                source={{
                                  uri: profile?.passport,
                                }}
                              />
                              <ListItem.Content>
                                <ListItem.Subtitle style={{fontSize: 10}}>
                                  Course Id
                                </ListItem.Subtitle>
                                <ListItem.Title
                                  style={{fontWeight: 'bold', fontSize: 12}}>
                                  {myCourse?.courseId}
                                </ListItem.Title>
                              </ListItem.Content>
                            </ListItem>
                            <ListItem bottomDivider style={{marginVertical: 4}}>
                              <Avatar
                                rounded
                                source={{
                                  uri: profile?.passport,
                                }}
                              />
                              <ListItem.Content>
                                <ListItem.Subtitle style={{fontSize: 10}}>
                                  Course Code
                                </ListItem.Subtitle>
                                <ListItem.Title
                                  style={{fontWeight: 'bold', fontSize: 12}}>
                                  {myCourse?.courseCode?.toUpperCase()}
                                </ListItem.Title>
                              </ListItem.Content>
                            </ListItem>
                            <ListItem bottomDivider style={{marginVertical: 4}}>
                              <Avatar
                                rounded
                                source={{
                                  uri: profile?.passport,
                                }}
                              />
                              <ListItem.Content>
                                <ListItem.Subtitle style={{fontSize: 10}}>
                                  Course Title
                                </ListItem.Subtitle>
                                <ListItem.Title
                                  style={{fontWeight: 'bold', fontSize: 12}}>
                                  {myCourse?.courseTitle?.toUpperCase()}
                                </ListItem.Title>
                              </ListItem.Content>
                            </ListItem>
                            <ListItem style={{marginVertical: 4}}>
                              <Avatar
                                rounded
                                source={{
                                  uri: profile?.passport,
                                }}
                              />
                              <ListItem.Content>
                                <ListItem.Subtitle style={{fontSize: 10}}>
                                  Course Unit
                                </ListItem.Subtitle>
                                <ListItem.Title
                                  style={{fontWeight: 'bold', fontSize: 12}}>
                                  {myCourse?.courseUnit}
                                </ListItem.Title>
                              </ListItem.Content>
                            </ListItem>
                          </View>
                        </Overlay>
                      </View>
                      {/* Full Registered Course Detals end */}
                    </View>
                    {/* Course Registered Section Ends */}
                  </View>
                </>
              }
              data={courseForm?.course}
              renderItem={({item, index}) => {
                return (
                  <>
                    <ImageBackground
                      style={{
                        ...StyleSheet.absoluteFill,
                      }}
                      source={require('../src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
                      resizeMode="cover"
                    />
                    <Pressable
                      onPress={() => toggleOverlay(item)}
                      style={{
                        marginBottom: 8,
                        marginHorizontal: 15,
                        borderRadius: 15,
                        //backgroundColor: '#a2b7fa',
                      }}>
                      <ListItem
                        //topDivider
                        bottomDivider
                        //pad={5}
                        style={{width: '100%'}}
                        containerStyle={{
                          backgroundColor: 'rgba(200, 200, 230,.2)',
                          borderRadius: 10,
                          borderWidth: 0,
                          borderColor: '#101C75',
                          width: '100%',
                        }}>
                        <Avatar
                          rounded
                          source={{
                            uri: profile?.passport,
                          }}
                        />
                        <ListItem.Content
                          style={{
                            width: 70,
                            color: 'white',
                          }}>
                          <ListItem.Title
                            style={{
                              fontSize: 12,
                              fontWeight: 'bold',
                              color: 'white',
                              width: 70,
                            }}>
                            {item.courseCode.toUpperCase()}
                          </ListItem.Title>
                          <ListItem.Subtitle
                            style={{
                              color: '#a2b7fa',
                              fontWeight: '600',
                              width: 70,
                              marginTop: 5,
                            }}>
                            {item?.courseId}
                          </ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Content
                          style={{
                            color: 'white',
                            width: 50,
                          }}>
                          <ListItem.Title
                            style={{
                              fontSize: 12,
                              fontWeight: 'bold',
                              color: 'white',
                              width: 50,
                              textAlign: 'center',
                              alignSelf: 'center',
                            }}>
                            {item?.courseUnit}
                          </ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Content
                          style={{
                            color: 'white',
                            width: 100,
                            marginRight: 20,
                          }}>
                          <ListItem.Title
                            style={{
                              fontSize: 12,
                              fontWeight: 'bold',
                              color: 'white',
                              width: 100,
                            }}>
                            {item?.courseTitle}
                          </ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron
                          color="white"
                          solid
                          style={{marginLeft: 20, padding: 0}}
                        />
                      </ListItem>
                    </Pressable>
                  </>
                );
              }}
              keyExtractor={item => item.courseId}
            />
          </View>
        </View>
      );
    }
  };

  return (
    <View style={{flex: 1}}>
      {displayOptions()}
      <View style={[styles.navOverlay, styles.elevation]}>
        <ImageBackground
          style={StyleSheet.absoluteFill}
          source={require('../src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
          //resizeMode="cover"
        />
        {navLinks.map((navLink, index) => (
          <Pressable
            key={index}
            style={styles.navBox}
            onPress={() =>
              navigation.navigate(navLink.linkUrl, {
                activeUser: {
                  surname: activeUser?.surname,
                  email: activeUser?.email,
                },
              })
            }>
            <View style={styles.navBox}>
              <FontAwesomeIcon
                icon={navLink?.linkIcon}
                size={20}
                color="rgb(199, 199, 250)"
                style={{alignSelf: 'center'}}
                //color="rgb(190, 199, 250)"
              />
              <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 12}}>
                {navLink.linkName}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Dialog
        isVisible={loading}
        overlayStyle={{
          width: windowWidth,
          height: windowHeight,
          //backgroundColor: 'rgba(0,0,255,.4)',
          backgroundColor: '#a2b7fa95',
          paddingVertical: '90%',
        }}>
        <LottieView
          source={require('../src/assets/cycling-blue-loader.json')}
          autoPlay
          loop={true}
        />
        <Animated.Image
          style={[styles.loader, {opacity: animationStart}]}
          source={require('../images/logo.png')}
        />
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 15,
            color: '#101C75',
            marginTop: 30,
          }}>
          Processing, Please wait ...
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
        {/* <FontAwesomeIcon
          icon={
            responseMessage?.status === 'Success' ? 'thumbs-up' : 'thumbs-down'
          }
          size={30}
          color={responseMessage?.status === 'Success' ? 'green' : 'red'}
          style={{alignSelf: 'center'}}
          //color="rgb(190, 199, 250)"
        /> */}
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 17,
            color: '#101C75',
            marginTop: 2,
            marginBottom: 10,
          }}>
          {responseMessage?.status}
        </Text>

        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 17,
            color: '#101C75',
            marginTop: 10,
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
                fontWeight: '500',
                textAlign: 'center',
                fontSize: 20,
                marginTop: 7,
              }}>
              {responseMessage.status === 'Success'
                ? 'Back to Dashboard'
                : 'Attempt CourseReg Again'}
            </Text>
          </View>
        </Pressable>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    backgroundColor: 'red',
  },
  navOverlay: {
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#101C75',
    zIndex: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  listHeader: {
    width: '100%',
    backgroundColor: '#a2b7fa',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    paddingHorizontal: 25,
  },
  profileBox: {
    color: '#101C75',
    paddingVertical: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 6,
    marginBottom: 5,
    textAlignVertical: 'center',
  },
  listHeaderElevation: {
    elevation: 2,
    shadowColor: '#00000040',
  },
  listHeaderBox: {
    paddingVertical: 10,
    textAlignVertical: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'white',
    borderRadius: 30,
    marginTop: 5,
    marginBottom: 15,
    //backgroundColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  passportBox: {
    borderRadius: 6,
    width: '62%',
    alignSelf: 'center',
    padding: 20,
    marginBottom: 10,
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#101C75',
  },
  tinylogo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 25,
  },
  loader: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 10,
  },
  elevation: {
    elevation: 0,
    shadowColor: '#101C75',
  },
  navBox: {
    marginHorizontal: 5,
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 7,
    marginBottom: 7,
  },
  navLogo: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
});

const styleTable = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#a2b7fa',
    margin: 10,
    borderRadius: 20,
    width: '95%',
  },
  containerReg: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    //backgroundColor: '#a2b7fa',
    margin: 10,
    //borderRadius: 20,
    width: '95%',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnStyle: {
    marginHorizontal: 10,
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#101C75',
    borderRadius: 10,
    flexDirection: 'row',
    width: '50%',
    alignSelf: 'center',
    marginBottom: 20,
  },
});

const overlayStyles = StyleSheet.create({
  button: {
    margin: 10,
  },
  textPrimary: {
    marginVertical: 7,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    paddingHorizontal: 40,
    color: '#fff',
  },
});

export default CourseReg;
