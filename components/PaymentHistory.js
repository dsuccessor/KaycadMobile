/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import client from './client';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  //TextInput,
  Animated,
  //PanResponder,
  // Alert,
  Easing,
  FlatList,
  ImageBackground,
  AppState,
} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
//import Icon from 'react-native-ionicons';
//import {Dropdown} from 'react-native-element-dropdown';
//import DatePicker from 'react-native-date-picker';
//import DocumentPicker from 'react-native-document-picker';
import {
  Avatar,
  ListItem,
  Overlay,
  //Button,
  Dialog,
  SearchBar,
} from '@rneui/themed';

const {height, width} = Dimensions.get('window');

function PaymentHistory({navigation, route}) {
  //const [value, setValue] = useState(null);
  const [date, setDate] = useState(new Date());
  //const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState('All');
  const myDate = JSON.stringify(date);
  const paymentDate = myDate?.split('T')[0]?.split('"')[1];
  const [search, setSearch] = useState([]);
  const [history, setHistory] = useState({});
  const [display, setDisplay] = useState(false);
  const [testArr, setTestArr] = useState();
  const [newArr, setNewArr] = useState(testArr);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const toggleOverlay = historyData => {
    setHistory(JSON.parse(JSON.stringify(historyData)));
    setDisplay(!display);
  };

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
      linkName: 'Wallet',
      linkUrl: '#',
      linkIcon: 'wallet',
    },
  ];

  const filterApproval = status => {
    const data = testArr.filter(item => {
      //console.log('item = ' + item);
      return item.adminConfirmStatus === status;
    });
    setNewArr(data);
    setChoice(status);
    //console.log('newArr = ' + JSON.stringify(data));
  };

  const updateSearch = mySearch => {
    const userSearch = testArr.filter(item => {
      const amount = new Intl.NumberFormat().format(
        parseFloat(item?.amount?.$numberDecimal).toFixed(2),
      );
      const createdAt = item?.createdAt?.split('T')[0];
      const updatedAt = item?.updatedAt?.split('T')[0];
      const payDate = item?.paymentDate?.split('T')[0];
      const paymentId = item?.paymentId?.toString();
      return (
        item?.bankName?.includes(mySearch) ||
        item?.payeeName?.includes(mySearch) ||
        item?.narration?.includes(mySearch) ||
        paymentId?.includes(mySearch) ||
        createdAt?.includes(mySearch) ||
        item?.adminName?.includes(mySearch) ||
        payDate?.includes(mySearch) ||
        item?.declineReason?.includes(mySearch) ||
        updatedAt?.includes(mySearch) ||
        amount?.includes(mySearch)
        // item.bankName == mySearch ||
        // item.payeeName == mySearch ||
        // amount == mySearch
      );
    });
    setNewArr(userSearch);
  };

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
      setInput(data);
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

    // navigation.setOptions({
    //   title: activeUser.toUpperCase(),
    // });

    if (input?.userId !== undefined) {
      const fetchPayNotifyRecord = async () => {
        console.log('userId = ' + input?.userId);
        await client
          .get(`/paymentNotification/history/${input?.userId}`)
          .then(response => {
            setTestArr(response?.data?.result);
            setNewArr(response?.data?.result);
            console.log('res = ' + JSON.stringify(response?.data?.result));
            console.log('testArr = ' + JSON.stringify(testArr));

            // toast.success(response.data.msg)
          })
          .catch(error => {
            console.log(error?.response?.data);
            // toast.error(error?.response?.data?.msg)
          });
      };

      fetchPayNotifyRecord();

      return () => {
        checkAppState.remove();
      };
    }
  }, [activeUser, input?.userId, navigation]);

  return (
    <View style={styles.container}>
      {/* Payment History Header */}
      <View style={formStyles.historyHeader}>
        <Text style={formStyles.historyText}>Payment History</Text>
      </View>
      <View style={formStyles.container}>
        {/* Payment History Category Selection */}
        <View style={formStyles.historyCat}>
          <Pressable
            style={[
              formStyles.catBox,
              {
                backgroundColor: choice === 'All' ? '#101C75' : 'transparent',
              },
            ]}
            onPress={() => {
              setChoice('All');
              setNewArr(testArr);
            }}>
            <View style={formStyles.catBox}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#fff',
                  verticalAlign: 'middle',
                  textAlignVertical: 'center',
                  paddingVertical: 15,
                }}>
                All
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={[
              formStyles.catBox,
              {
                backgroundColor:
                  choice === 'approved' ? '#101C75' : 'transparent',
              },
            ]}
            onPress={() => filterApproval('approved')}>
            <View style={formStyles.catBox}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#fff',
                  verticalAlign: 'middle',
                  textAlignVertical: 'center',
                  paddingVertical: 15,
                }}>
                Approved
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={[
              formStyles.catBox,
              {
                backgroundColor:
                  choice === 'pending' ? '#101C75' : 'transparent',
              },
            ]}
            onPress={() => filterApproval('pending')}>
            <View style={formStyles.catBox}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#fff',
                  verticalAlign: 'middle',
                  textAlignVertical: 'center',
                  paddingVertical: 15,
                }}>
                Pending
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={[
              formStyles.catBox,
              {
                backgroundColor:
                  choice === 'declined' ? '#101C75' : 'transparent',
              },
            ]}
            onPress={() => filterApproval('declined')}>
            <View style={formStyles.catBox}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#fff',
                  verticalAlign: 'middle',
                  textAlignVertical: 'center',
                  paddingVertical: 15,
                }}>
                Declined
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Payment History List */}
        <View style={{flex: 1, marginBottom: 50}}>
          <FlatList
            style={{marginBottom: 10}}
            ListHeaderComponent={
              <>
                <View style={{width: '100%', marginLeft: 15}}>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 0,
                      marginTop: 5,
                      marginBottom: 10,
                      marginRight: 15,
                    }}>
                    <SearchBar
                      containerStyle={{
                        width: '95%',
                        backgroundColor: 'rgb(16, 28, 117)',
                        borderRadius: 35,
                        padding: 7,
                      }}
                      inputContainerStyle={{
                        height: 40,
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: 25,
                      }}
                      lightTheme={true}
                      placeholder="Type Here..."
                      onChangeText={bankSearch => updateSearch(bankSearch)}
                      onCancel={() => {
                        setChoice('All');
                        setNewArr(testArr);
                      }}
                      onClear={() => {
                        setChoice('All');
                        setNewArr(testArr);
                      }}
                      value={search}
                    />
                  </View>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 15,
                      color: '#101C75',
                      marginVertical: 15,
                    }}>
                    Today
                    {console.log('kay = ' + JSON.stringify(newArr))}
                  </Text>
                  {JSON.stringify(newArr) === '[]' && (
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 15,
                        //color: 'blue',
                        marginVertical: 15,
                        textAlign: 'center',
                      }}>
                      No Record Found
                    </Text>
                  )}
                </View>
              </>
            }
            data={newArr}
            renderItem={({item, index}) => {
              console.log('kay = ' + JSON.stringify(newArr));
              return (
                <Pressable
                  onPress={() => toggleOverlay(item)}
                  style={{
                    marginHorizontal: 10,
                    marginTop: 0,
                    marginVertical: 5,
                  }}>
                  <ListItem
                    //topDivider
                    //bottomDivider
                    containerStyle={{
                      backgroundColor: 'rgba(16, 28, 117,0.2)80',
                      borderRadius: 10,
                      paddingRight: 20,
                    }}>
                    <Avatar
                      rounded
                      source={{
                        uri: input?.passport,
                      }}
                    />
                    <ListItem.Content>
                      <ListItem.Title
                        style={{fontSize: 12, fontWeight: 'bold'}}>
                        {item?.payeeName?.toUpperCase()}
                      </ListItem.Title>

                      <ListItem.Subtitle style={{fontSize: 12}}>
                        {item?.createdAt?.split('T')[0]}
                        {/* {item?.paymentDate} */}
                      </ListItem.Subtitle>

                      <ListItem.Subtitle style={{fontSize: 12}}>
                        {item?.paymentDate?.split('T')[0]}
                        {/* {item?.paymentDate} */}
                      </ListItem.Subtitle>
                    </ListItem.Content>

                    <ListItem.Content
                      style={{
                        alignItems: 'flex-end',
                      }}>
                      <ListItem.Title
                        style={{fontSize: 12, fontWeight: 'bold'}}>
                        &#8358;
                        {new Intl.NumberFormat().format(
                          parseFloat(item?.amount?.$numberDecimal).toFixed(2),
                        )}
                        {/* {item?.amount?.$numberDecimal} */}
                      </ListItem.Title>

                      <ListItem.Subtitle style={{fontSize: 12}}>
                        {item?.bankName?.toUpperCase()}
                      </ListItem.Subtitle>

                      <ListItem.Subtitle style={{fontSize: 12}}>
                        {item?.adminConfirmStatus?.toUpperCase()}
                      </ListItem.Subtitle>
                    </ListItem.Content>

                    {/* <ListItem.Chevron 
                       iconStyle={{
                       //   fontSize: 30,
                        //  fontWeight: 'bold',
                        //  color: 'black',
                      //  }}
                      />*/}
                  </ListItem>
                </Pressable>
              );
            }}
            keyExtractor={item => item?.paymentId}
          />
        </View>
      </View>

      {/* Flatlist Overlay for Payment History */}
      <View style={{paddingHorizontal: 5, width: '100%'}}>
        <Overlay
          overlayStyle={{padding: 0, borderRadius: 30, width: '70%'}}
          isVisible={display}
          onBackdropPress={() => toggleOverlay(history)}>
          <View
            style={{
              backgroundColor: 'rgba(16, 28, 117,0.2)',
              borderRadius: 20,
            }}>
            <Image
              source={{
                uri: input?.passport,
              }}
              style={{
                width: 70,
                height: 70,
                alignSelf: 'center',
                marginTop: 15,
                marginBottom: 5,
                borderRadius: 10,
              }}
            />
            <Text style={overlayStyles.textPrimary}>Payment History</Text>
            <Text style={overlayStyles.textSecondary}>ID: {history?._id}</Text>
            <Text style={overlayStyles.textSecondary}>
              Student ID: {history?.studentId}
            </Text>
          </View>
          <View>
            <ListItem
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(16, 28, 117,0.2)',
              }}>
              <Avatar
                rounded
                source={{
                  uri: input?.passport,
                }}
              />
              <ListItem.Content>
                <ListItem.Subtitle style={{fontSize: 10}}>
                  Payment ID
                </ListItem.Subtitle>

                <ListItem.Title style={{fontWeight: 'bold', fontSize: 12}}>
                  {history?.paymentId}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>

            <ListItem
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(16, 28, 117,0.2)',
              }}>
              <Avatar
                rounded
                source={{
                  uri: input?.passport,
                }}
              />
              <ListItem.Content>
                <ListItem.Subtitle style={{fontSize: 10}}>
                  Bank Name
                </ListItem.Subtitle>

                <ListItem.Title style={{fontWeight: 'bold', fontSize: 12}}>
                  {history?.bankName?.toUpperCase()}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>

            <ListItem
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(16, 28, 117,0.2)',
              }}>
              <Avatar
                rounded
                source={{
                  uri: input?.passport,
                }}
              />
              <ListItem.Content>
                <ListItem.Subtitle style={{fontSize: 10}}>
                  Amount
                </ListItem.Subtitle>

                <ListItem.Title style={{fontWeight: 'bold', fontSize: 12}}>
                  {new Intl.NumberFormat().format(
                    parseFloat(history?.amount?.$numberDecimal).toFixed(2),
                  )}
                  {/* {history?.amount?.$numberDecimal} */}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>

            <ListItem
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(16, 28, 117,0.2)',
              }}>
              <Avatar
                rounded
                source={{
                  uri: input?.passport,
                }}
              />
              <ListItem.Content>
                <ListItem.Subtitle style={{fontSize: 10}}>
                  Notification Date
                </ListItem.Subtitle>

                <ListItem.Title style={{fontWeight: 'bold', fontSize: 12}}>
                  {history?.createdAt?.split('T')[0]}
                </ListItem.Title>

                <ListItem.Subtitle style={{fontSize: 10}}>
                  PaymentDate
                </ListItem.Subtitle>

                <ListItem.Title style={{fontWeight: 'bold', fontSize: 12}}>
                  {history?.paymentDate?.split('T')[0]}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>

            <ListItem
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(16, 28, 117,0.2)',
              }}>
              <Avatar
                rounded
                source={{
                  uri: input?.passport,
                }}
              />
              <ListItem.Content>
                <ListItem.Subtitle style={{fontSize: 10}}>
                  Payee Name
                </ListItem.Subtitle>

                <ListItem.Title style={{fontWeight: 'bold', fontSize: 12}}>
                  {history?.payeeName?.toUpperCase()}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>

            <ListItem
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(16, 28, 117,0.2)',
              }}>
              <Avatar
                rounded
                source={{
                  uri: input?.passport,
                }}
              />
              <ListItem.Content>
                <ListItem.Subtitle style={{fontSize: 10}}>
                  Narration
                </ListItem.Subtitle>

                <ListItem.Title style={{fontWeight: 'bold', fontSize: 12}}>
                  {history?.narration?.toUpperCase()}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>

            <ListItem
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(16, 28, 117,0.2)',
              }}>
              <Avatar
                rounded
                source={{
                  uri: input?.passport,
                }}
              />
              <ListItem.Content>
                <ListItem.Subtitle style={{fontSize: 10}}>
                  Description
                </ListItem.Subtitle>

                <ListItem.Title style={{fontWeight: 'bold', fontSize: 12}}>
                  {history?.declineReason?.toUpperCase()}
                </ListItem.Title>

                <ListItem.Subtitle style={{fontSize: 10}}>
                  Admin Officer
                </ListItem.Subtitle>
                <ListItem.Title style={{fontWeight: 'bold', fontSize: 12}}>
                  {history?.adminName?.toUpperCase()}
                </ListItem.Title>

                <ListItem.Subtitle style={{fontSize: 10}}>
                  Status
                </ListItem.Subtitle>
                <ListItem.Title style={{fontWeight: 'bold', fontSize: 12}}>
                  {history?.adminConfirmStatus?.toUpperCase()}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </View>
        </Overlay>
      </View>

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
                  activeUser: {surname: input?.surname, email: input?.email},
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

      {/* Page Loader */}
      <Dialog
        overlayStyle={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: 'rgba(0,0,255,.2)',
          paddingVertical: '90%',
        }}
        isVisible={loading}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    paddingTop: 0,
    padding: 0,
  },
  navOverlay: {
    width: '100%',
    height: 60,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#101C75',
    //'#E6EAF7',
    zIndex: 10,
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
  historyHeader: {
    width: '100%',
    padding: 5,
    backgroundColor: 'rgba(16, 28, 117,0.2)',
    height: 50,
    marginTop: 0,
  },
  historyText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgb(100,100,255)',
    marginLeft: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  historyCat: {
    width: '90%',
    height: 50,
    backgroundColor: 'rgba(16, 28, 117,0.2)',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  catBox: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    verticalAlign: 'middle',
    textAlignVertical: 'center',
    borderRadius: 10,
  },
});

const overlayStyles = StyleSheet.create({
  button: {
    margin: 10,
  },
  textPrimary: {
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  textSecondary: {
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    color: '#fff',
  },
});

export default PaymentHistory;
