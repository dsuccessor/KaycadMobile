/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Avatar, ListItem, Overlay, Dialog} from '@rneui/themed';
import client from './client';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

function StudentWallet({navigation, route}) {
  const {height, width} = Dimensions.get('window');

  const [walletDetails, setWalletDetails] = useState();
  const [walletHistory, setWalletHistory] = useState();
  const [input, setInput] = useState();
  const [walletBalance, setWalletBalance] = useState();

  AsyncStorage.getItem('@activeUser').then(user => {
    let data = JSON.parse(user);
    setInput(data);
  });

  const {activeUser} = route?.params;
  //const activeUser = input;

  const walletId = `900${activeUser?.userId}`;

  useEffect(() => {
    if (walletId !== undefined) {
      const fetchBalance = async () => {
        await client
          .get(`/wallet/studentwallethistory/${walletId}`)
          .then(response => {
            console.log(
              'wallet history success response = ',
              +JSON.stringify(response?.data?.result),
            );

            console.log(response?.data?.result);

            setWalletHistory(response?.data?.result);
          })
          .catch(error => {
            console.log(
              'wallet history failure response = ',
              +error?.response?.data,
            );
          });

        await client
          .get(`/wallet/getwalletbalance/${walletId}`)
          .then(response => {
            console.log(
              'wallet balance success response = ' +
                JSON.stringify(response.data.response[0]),
            );
            setWalletDetails(response.data.response[0]);
            const myBalance = parseFloat(
              response.data.response[0].walletBalance.$numberDecimal,
            ).toFixed(2);
            myBalance === '0.00'
              ? setWalletBalance(myBalance)
              : setWalletBalance(new Intl.NumberFormat().format(myBalance));
          })
          .catch(error => {
            console.log(
              'wallet balance failure response = ' + error?.response?.data,
            );
          });
      };

      fetchBalance();
    }
  }, [walletId]);

  const showWalletHistory = () => {
    if (walletHistory?.length > 0) {
      return (
        <FlatList
          style={{marginBottom: 10}}
          data={walletHistory}
          renderItem={({item, index}) => {
            let formatedBalanceBefore =
              item?.balanceBefore?.$numberDecimal === '0.00'
                ? '0.00'
                : new Intl.NumberFormat().format(
                    parseFloat(item?.balanceBefore?.$numberDecimal).toFixed(2),
                  );
            let formatedBalanceAfter =
              item?.walletBalance?.$numberDecimal === '0.00'
                ? '0.00'
                : new Intl.NumberFormat().format(
                    parseFloat(item?.walletBalance?.$numberDecimal).toFixed(2),
                  );
            let formatedAmount = new Intl.NumberFormat().format(
              parseFloat(item?.payment?.amount?.$numberDecimal).toFixed(2),
            );
            let myAmount = new Intl.NumberFormat().format(
              parseFloat(item?.amount?.$numberDecimal).toFixed(2),
            );
            return (
              <>
                <Pressable
                  key={index}
                  onPress={() =>
                    navigation.navigate('WalletReceipt', {receipt: item})
                  }
                  style={{
                    marginBottom: 8,
                    marginHorizontal: 15,
                    borderRadius: 15,
                    backgroundColor: 'transparent',
                  }}>
                  <ListItem
                    //topDivider
                    //bottomDivider
                    pad={10}
                    style={{width: '100%'}}
                    containerStyle={{
                      borderRadius: 10,
                      borderWidth: 0,
                      borderColor: '#101C75',
                      width: '100%',
                      backgroundColor: 'transparent',
                    }}>
                    <Avatar
                      rounded
                      icon={{
                        name:
                          item?.paymentType === 'credit'
                            ? 'arrow-circle-down'
                            : 'arrow-circle-up',
                        type: 'material',
                        size: 26,
                      }}
                      containerStyle={{
                        backgroundColor:
                          item?.paymentType === 'credit' ? 'green' : 'red',
                      }}
                    />
                    <ListItem.Content
                      style={{
                        width: 100,
                        color: 'black',
                      }}>
                      <ListItem.Title
                        style={{
                          fontSize: 13,
                          fontWeight: 'bold',
                          color: 'black',
                          width: 100,
                        }}>
                        &#x20A6;{formatedBalanceBefore}
                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{
                          color: 'rgba(0,0,0,0.5)',
                          fontWeight: 'bold',
                          width: 100,
                          marginTop: 5,
                          fontSize: 10,
                        }}>
                        {`${item?.createdAt.split('T')[0]} ${
                          item?.createdAt.split('T')[1].split('.')[0]
                        }`}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Content
                      style={{
                        color: 'black',
                        width: 100,
                      }}>
                      <ListItem.Title
                        style={{
                          fontSize: 13,
                          fontWeight: 'bold',
                          color:
                            item?.paymentType === 'credit' ? 'green' : 'red',
                          width: 100,
                        }}>
                        {item?.paymentType === 'credit' ? '+' : '-'}
                        &#x20A6;
                        {item?.payment === null ? myAmount : formatedAmount}
                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{
                          color: 'rgba(0,0,0,0.5)',
                          fontWeight: 'bold',
                          width: 100,
                          marginTop: 5,
                          fontSize: 10,
                        }}>
                        {item?.paymentType}
                      </ListItem.Subtitle>
                      <ListItem.Subtitle
                        style={{
                          color: 'rgba(0,0,0,0.5)',
                          fontWeight: 'bold',
                          width: 100,
                          marginTop: 5,
                          fontSize: 10,
                        }}>
                        {item?.payment === null
                          ? item?.txnType
                          : item?.payment?.bankName}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Content
                      style={{
                        color: 'black',
                        width: 100,
                      }}>
                      <ListItem.Title
                        style={{
                          fontSize: 13,
                          fontWeight: 'bold',
                          color: 'black',
                          width: 100,
                        }}>
                        &#x20A6;{formatedBalanceAfter}
                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{
                          color: 'rgba(0,0,0,0.5)',
                          fontWeight: 'bold',
                          width: 100,
                          marginTop: 5,
                          fontSize: 11,
                        }}>
                        {`${item?.updatedAt.split('T')[0]} ${
                          item?.updatedAt.split('T')[1].split('.')[0]
                        }`}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron color="rgba(0,0,0,0.5)" solid />
                  </ListItem>
                </Pressable>
              </>
            );

            //   <>
            //     <Pressable
            //       key={index}
            //       style={{
            //         marginBottom: 8,
            //         marginHorizontal: 15,
            //         borderRadius: 15,
            //       }}>
            //       <ListItem
            //         key={index}
            //         bottomDivider
            //         pad={10}
            //         style={{width: '100%'}}
            //         containerStyle={{
            //           borderRadius: 10,
            //           borderWidth: 0,
            //           borderColor: '#101C75',
            //           width: '100%',
            //         }}>
            //         <Avatar
            //           rounded
            //           icon={{
            //             name:
            //               item?.paymentType === 'credit'
            //                 ? 'arrow-downward'
            //                 : 'arrow-upward',
            //             type: 'material',
            //             size: 26,
            //           }}
            //           containerStyle={{
            //             backgroundColor:
            //               item?.paymentType === 'credit' ? 'green' : 'red',
            //           }}
            //         />
            //         <ListItem.Content
            //           style={{
            //             width: 100,
            //             color: 'black',
            //           }}>
            //           <ListItem.Title
            //             style={{
            //               fontSize: 13,
            //               fontWeight: 'bold',
            //               color: 'black',
            //               width: 100,
            //             }}>
            //             &#x20A6;{formatedBalanceBefore}
            //           </ListItem.Title>
            //           <ListItem.Subtitle
            //             style={{
            //               color: 'white',
            //               fontWeight: 'bold',
            //               width: 100,
            //               marginTop: 5,
            //               fontSize: 10,
            //             }}>
            //             {item?.txnType}
            //           </ListItem.Subtitle>
            //           <ListItem.Subtitle
            //             style={{
            //               color: 'white',
            //               fontWeight: 'bold',
            //               width: 100,
            //               marginTop: 5,
            //               fontSize: 10,
            //             }}>
            //             {`${item?.createdAt.split('T')[0]} ${
            //               item?.createdAt.split('T')[1].split('.')[0]
            //             }`}
            //           </ListItem.Subtitle>
            //         </ListItem.Content>
            //         <ListItem.Content
            //           style={{
            //             color: 'black',
            //             width: 100,
            //           }}>
            //           <ListItem.Title
            //             style={{
            //               fontSize: 13,
            //               fontWeight: 'bold',
            //               color:
            //                 item?.paymentType === 'credit' ? 'green' : 'red',
            //               width: 100,
            //             }}>
            //             {item?.paymentType === 'credit' ? '+' : '-'}
            //             &#x20A6;
            //             {item?.payment === null ? myAmount : formatedAmount}
            //           </ListItem.Title>
            //           <ListItem.Subtitle
            //             style={{
            //               color: 'white',
            //               fontWeight: 'bold',
            //               width: 100,
            //               marginTop: 5,
            //               fontSize: 10,
            //             }}>
            //             {item?.paymentType}
            //           </ListItem.Subtitle>
            //           <ListItem.Subtitle
            //             style={{
            //               color: 'white',
            //               fontWeight: 'bold',
            //               width: 100,
            //               marginTop: 5,
            //               fontSize: 10,
            //             }}>
            //             {item?.payment === null
            //               ? 'School Account'
            //               : item?.payment?.bankName}
            //           </ListItem.Subtitle>
            //         </ListItem.Content>
            //         <ListItem.Content
            //           style={{
            //             color: 'black',
            //             width: 100,
            //           }}>
            //           <ListItem.Title
            //             style={{
            //               fontSize: 13,
            //               fontWeight: 'bold',
            //               color: 'black',
            //               width: 100,
            //             }}>
            //             &#x20A6;{formatedBalanceAfter}
            //           </ListItem.Title>
            //           <ListItem.Subtitle
            //             style={{
            //               color: 'white',
            //               fontWeight: 'bold',
            //               width: 100,
            //               marginTop: 5,
            //               fontSize: 11,
            //             }}>
            //             {item?.payment === null
            //               ? item?.paymentRef.slice(0, 6)
            //               : item?.payment?.paymentId}
            //           </ListItem.Subtitle>
            //           <ListItem.Subtitle
            //             style={{
            //               color: 'white',
            //               fontWeight: 'bold',
            //               width: 100,
            //               marginTop: 5,
            //               fontSize: 11,
            //             }}>
            //             {`${item?.updatedAt.split('T')[0]} ${
            //               item?.updatedAt.split('T')[1].split('.')[0]
            //             }`}
            //           </ListItem.Subtitle>
            //         </ListItem.Content>
            //         <ListItem.Chevron color="rgba(0,0,0,0.5)" solid />
            //       </ListItem>
            //     </Pressable>
            //   </>
            // );
          }}
          keyExtractor={item => item?.payment?._id}
        />
      );
    } else {
      return (
        <>
          <Text
            style={{
              paddingHorizontal: 20,
              marginBottom: 10,
              fontSize: 15,
              textAlign: 'justify',
            }}>
            No payment found on your wallet!, Kindly confirm from your payment
            notification history that the Admin Approval Status is true on this
            particular payment ID!
          </Text>
          <Text
            style={{
              paddingHorizontal: 20,
              marginBottom: 10,
              fontSize: 15,
              color: 'red',
              textAlign: 'justify',
            }}>
            Note: The Admin Approval status needed to be true before the payment
            can reflect on your wallet & wallet history.
          </Text>
          <Text
            style={{
              paddingLeft: 20,
              marginVertical: 10,
              fontSize: 15,
              fontStyle: 'italic',
            }}>
            Cheers!
          </Text>
        </>
      );
    }
  };

  return (
    <View
      style={{
        //flex: 1,
        width: '100%',
        height: '100%',
        padding: 10,
      }}>
      {/* Wallet Dashboard Section */}
      <View
        style={{
          width: '100%',
          height: '40%',
          //flex: 1,
          flexDirection: 'row',
          backgroundColor: 'transparent',
          padding: 10,
          marginBottom: 10,
          shadowOffset: {
            width: 0.5,
            height: 0.5,
          },
          shadowColor: 'black',
          shadowOpacity: 0.2,
          borderRadius: 15,
        }}>
        {/* Wallet Details Card Left */}
        <LinearGradient
          colors={['rgb(16, 28, 117)', 'rgba(0,0,200,0.5)']}
          //start={{x: 0.35, y: 0.35}}
          //end={{x: 0.65, y: 0.65}}
          locations={[0.2, 0.8]}
          useAngle={true}
          angle={45}
          angleCenter={{x: 0.5, y: 0.5}}
          style={{
            flex: 1,
            borderRadius: 35,
            marginRight: 10,
          }}>
          <View
            style={{
              flex: 1,
              //backgroundColor: '#101C75',
              borderRadius: 15,
              padding: 10,
            }}>
            {/* <ImageBackground
              style={{...StyleSheet.absoluteFill}}
              source={require('../src/assets/blue-neon-aesthetic-wallpaper-2-scaled.jpeg')}
            /> */}
            <Text
              style={{
                color: 'rgba(0,0,0,0.5)',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'left',
                marginLeft: 15,
                paddingLeft: 5,
                marginTop: 15,
                marginBottom: 3,
                backgroundColor: 'white',
                width: '50%',
              }}>
              Balance:
            </Text>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'left',
                paddingLeft: 15,
              }}>
              &#x20A6; {walletBalance}
            </Text>
            <Text
              style={{
                color: 'rgba(0,0,0,0.5)',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'left',
                marginTop: 15,
                marginLeft: 15,
                paddingLeft: 3,
                marginBottom: 5,
                backgroundColor: 'white',
                width: '50%',
              }}>
              Wallet ID:
            </Text>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 17,
                textAlign: 'left',
                paddingLeft: 15,
              }}>
              {walletDetails?.walletId === undefined
                ? 'Acct Unavailable'
                : walletDetails?.walletId}
            </Text>
            <Text
              style={{
                color: 'rgba(0,0,0,0.5)',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'left',
                marginTop: 15,
                marginLeft: 15,
                paddingLeft: 3,
                marginBottom: 5,
                backgroundColor: 'white',
                width: '80%',
              }}>
              Last updated on
            </Text>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 17,
                textAlign: 'left',
                paddingLeft: 15,
                marginTop: 5,
              }}>
              {` ${walletDetails?.updatedAt?.split('T')[0]} ${
                walletDetails?.updatedAt?.split('T')[1].split('.')[0]
              }`}
            </Text>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 0,
                marginTop: 20,
                marginRight: 50,
                marginLeft: 15,
                backgroundColor: 'white',
                borderRadius: 10,
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('PaymentUpload', {activeUser})
                }
                style={{paddingVertical: 5}}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <FontAwesome5Icon
                    name="paper-plane"
                    size={18}
                    solid={false}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      marginLeft: 10,
                      textAlign: 'center',
                      fontWeight: '600',
                    }}>
                    Fund
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        {/* Wallet Details Card Right */}
        <LinearGradient
          colors={['rgba(0,0,200,0.5)', 'rgb(16, 28, 117)']}
          //start={{x: 0.35, y: 0.35}}
          //end={{x: 0.65, y: 0.65}}
          locations={[0.2, 0.8]}
          useAngle={true}
          angle={45}
          angleCenter={{x: 0.5, y: 0.5}}
          style={{
            flex: 1,
            borderRadius: 35,
          }}>
          <View
            style={{
              flex: 1,
              //backgroundColor: '#101C75',
              borderRadius: 35,
              padding: 10,
              alignItems: 'flex-end',
            }}>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 12,
                textAlign: 'left',
                paddingRight: 15,
                marginTop: 15,
              }}>
              Wallet Name:
            </Text>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 18,
                textAlign: 'right',
                paddingRight: 15,
              }}>
              {`${input?.surname.toUpperCase()} ${input?.otherName}`}
            </Text>

            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'left',
                paddingRight: 15,
                marginTop: 15,
              }}>
              Email:
            </Text>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 17,
                textAlign: 'right',
                paddingRight: 15,
              }}>
              {input?.email}
            </Text>

            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'left',
                paddingRight: 15,
                marginTop: 15,
              }}>
              Status:
            </Text>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 17,
                textAlign: 'right',
                paddingRight: 15,
              }}>
              {walletHistory?.length > 0 ? 'Online' : 'Offline'}
            </Text>
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginTop: 20,
                marginRight: 15,
                backgroundColor: 'transparent',
                borderRadius: 10,
                borderColor: 'white',
                borderWidth: 2,
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('PaymentHistory', {activeUser})
                }
                style={{paddingVertical: 5}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                  }}>
                  <FontAwesome5Icon
                    name="file-invoice-dollar"
                    size={18}
                    solid={false}
                    color={'white'}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      marginLeft: 10,
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'white',
                    }}>
                    Report
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Recent Transaction Section */}
      <View
        style={{
          //height: (height / 3) * 2 - 40,
          height: walletHistory?.length > 0 ? '59%' : '30%',
          //flex: 2,
          //flexDirection: 'column',
          backgroundColor: walletHistory?.length > 0 ? 'transparent' : 'white',
          marginHorizontal: walletHistory === undefined && 10,
          paddingTop: 15,
          // shadowOffset: {
          //   width: 0.5,
          //   height: 0.5,
          // },
          // shadowColor: 'black',
          // shadowOpacity: 0.2,
          borderRadius: 15,
        }}>
        <Text
          style={{
            paddingLeft: 20,
            marginBottom: 10,
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          Recent Transactions
        </Text>
        {showWalletHistory()}
      </View>
    </View>
  );
}

export default StudentWallet;
