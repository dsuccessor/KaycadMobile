/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {Avatar, ListItem, Overlay, Dialog} from '@rneui/themed';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';

function WalletReceipt({route, navigation}) {
  const {height, width} = Dimensions.get('window');
  const [input, setInput] = useState();
  AsyncStorage.getItem('@activeUser').then(user => {
    let data = JSON.parse(user);
    setInput(data);
  });

  const schoolAccount = {
    accountName: 'KayCad University',
    accountNumber: '2021175420',
  };

  const {receipt} = route?.params;
  let payAmount = new Intl.NumberFormat().format(
    parseFloat(receipt?.payment?.amount?.$numberDecimal).toFixed(2),
  );
  let Amount = new Intl.NumberFormat().format(
    parseFloat(receipt?.amount?.$numberDecimal).toFixed(2),
  );

  let formatedBalanceBefore =
    receipt?.balanceBefore?.$numberDecimal === '0.00'
      ? '0.00'
      : new Intl.NumberFormat().format(
          parseFloat(receipt?.balanceBefore?.$numberDecimal).toFixed(2),
        );

  let formatedBalanceAfter =
    receipt?.walletBalance?.$numberDecimal === '0.00'
      ? '0.00'
      : new Intl.NumberFormat().format(
          parseFloat(receipt?.walletBalance?.$numberDecimal).toFixed(2),
        );

  return (
    <View style={{flex: 1}}>
      {/* <ScrollView style={{flex: 1}}> */}
      {/* Receipt Header */}
      <View
        style={{
          height: '30%',
          padding: 10,
          alignItems: 'center',
          //backgroundColor: 'white',
          marginBottom: 10,
        }}>
        <View
          style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: '#101C75',
            width: '20%',
            height: '40%',
            borderTopLeftRadius: 10,
            borderBottomRightRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FontAwesome5Icon
            name="coins"
            size={40}
            color={'white'}
            style={{marginVertical: 5}}
          />
        </View>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'black',
            fontSize: 15,
            marginVertical: 10,
            textAlign: 'center',
          }}>
          {`${receipt?.paymentType} \n ${receipt?.txnType}`}
        </Text>
        <Text style={{fontWeight: 'bold', color: '#101C75', fontSize: 15}}>
          {`${receipt?.updatedAt.split('T')[0]} ${
            receipt?.updatedAt.split('T')[1].split('.')[0]
          }`}
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            color: receipt?.paymentType === 'credit' ? 'green' : 'red',
            fontSize: 25,
            marginTop: 30,
            marginBottom: 10,
          }}>
          {receipt?.paymentType === 'credit' ? '+' : '-'}
          &#x20A6; {receipt?.payment === null ? Amount : payAmount}
        </Text>
      </View>

      {/* Receipt Content */}
      <View
        style={{
          height: '45%',
          paddingTop: 20,
          padding: 10,
          alignItems: 'center',
        }}>
        {/* FROM */}
        <ListItem
          bottomDivider
          pad={10}
          style={{width: '100%'}}
          containerStyle={{
            marginBottom: 10,
            borderRadius: 15,
            borderWidth: 0,
            borderColor: '#101C75',
            width: '100%',
            backgroundColor: 'transparent',
          }}>
          {/* FROM */}
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
              From
            </ListItem.Title>
          </ListItem.Content>

          {/* FROM DATA */}
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
                //width: 100,
              }}>
              {receipt?.payment === null
                ? `${input?.surname?.toUpperCase()} ${input?.surname?.toUpperCase()}`
                : receipt?.payment?.payeeName?.toUpperCase()}
            </ListItem.Title>
            <ListItem.Subtitle
              style={{
                color: 'rgba(0,0,0,0.5)',
                fontWeight: 'bold',
                width: 100,
                marginTop: 5,
                fontSize: 10,
              }}>
              {receipt?.payment === null
                ? receipt?.walletId
                : receipt?.payment?.paymentId}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>

        {/* TO */}
        <ListItem
          bottomDivider
          pad={10}
          style={{width: '100%'}}
          containerStyle={{
            marginBottom: 10,
            borderRadius: 15,
            borderWidth: 0,
            borderColor: '#101C75',
            width: '100%',
            backgroundColor: 'transparent',
          }}>
          {/* TO */}
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
              To
            </ListItem.Title>
          </ListItem.Content>

          {/* TO DATA */}
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
                //width: 100,
              }}>
              {schoolAccount?.accountName}
            </ListItem.Title>
            <ListItem.Subtitle
              style={{
                color: 'rgba(0,0,0,0.5)',
                fontWeight: 'bold',
                width: 100,
                marginTop: 5,
                fontSize: 10,
              }}>
              {receipt?.payment === null
                ? schoolAccount?.accountNumber
                : receipt?.payment?.bankName}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>

        {/* NARRATION/TXN TYE */}
        <ListItem
          bottomDivider
          pad={10}
          style={{width: '100%'}}
          containerStyle={{
            marginBottom: 10,
            borderRadius: 15,
            borderWidth: 0,
            borderColor: '#101C75',
            width: '100%',
            backgroundColor: 'transparent',
          }}>
          {/* NARRATION/TXN TYPE */}
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
              {receipt?.payment === null ? 'Payment Type' : 'Narration'}
            </ListItem.Title>
          </ListItem.Content>

          {/* NARRATION/TXN TYPE DATA */}
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
                //width: 100,
              }}>
              {receipt?.payment === null
                ? receipt?.txnType
                : receipt?.payment?.narration}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>

        {/* PAYMENT ID/REF */}
        <ListItem
          bottomDivider
          pad={10}
          style={{width: '100%'}}
          containerStyle={{
            marginBottom: 10,
            borderRadius: 15,
            borderWidth: 0,
            borderColor: '#101C75',
            width: '100%',
            backgroundColor: 'transparent',
          }}>
          {/* PAYMENT ID/REF */}
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
              Reference
            </ListItem.Title>
          </ListItem.Content>

          {/* PAYMENT ID/REF DATA */}
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
                //width: 100,
              }}>
              {receipt?.paymentRef}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>

        {/* STATUS */}
        <ListItem
          bottomDivider
          pad={10}
          style={{width: '100%'}}
          containerStyle={{
            marginBottom: 10,
            borderRadius: 15,
            borderWidth: 0,
            borderColor: '#101C75',
            width: '100%',
            backgroundColor: 'transparent',
          }}>
          {/* STATUS */}
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
              Status
            </ListItem.Title>
          </ListItem.Content>

          {/* STATUS DATA */}
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
                //width: 100,
              }}>
              Successful
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>

      {/* Receipt Footer */}
      <View style={{height: '25%', padding: 10}}>
        <Text
          style={{
            marginBottom: 10,
            paddingLeft: 10,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#101C75',
          }}>
          Want More?
        </Text>

        {/* Re-Initiate Payment */}
        <TouchableOpacity onPress={() => Alert.alert('Comming Soon!')}>
          <ListItem
            //bottomDivider
            pad={10}
            style={{width: '100%'}}
            containerStyle={{
              marginBottom: 10,
              borderRadius: 15,
              borderWidth: 0,
              borderColor: '#101C75',
              width: '100%',
              backgroundColor: 'transparent',
            }}>
            <Avatar
              rounded
              icon={{
                name: 'arrow-circle-down',
                type: 'material',
                size: 20,
              }}
              containerStyle={{
                backgroundColor: 'rgba(0,0,0,0.2)',
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
                }}>
                Re-Initiate Payment
              </ListItem.Title>
              <ListItem.Subtitle
                style={{
                  color: 'rgba(0,0,0,0.5)',
                  fontWeight: 'bold',
                  marginTop: 5,
                  fontSize: 10,
                }}>
                Make this transaction again
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron color="rgba(0,0,0,0.5)" solid />
          </ListItem>
        </TouchableOpacity>

        {/* Open Dispute */}
        <TouchableOpacity onPress={() => Alert.alert('Comming Soon!')}>
          <ListItem
            //bottomDivider
            pad={10}
            style={{width: '100%'}}
            containerStyle={{
              marginBottom: 10,
              borderRadius: 15,
              borderWidth: 0,
              borderColor: '#101C75',
              width: '100%',
              backgroundColor: 'transparent',
            }}>
            <Avatar
              rounded
              icon={{
                name: 'arrow-circle-down',
                type: 'material',
                size: 20,
              }}
              containerStyle={{
                backgroundColor: 'rgba(0,0,0,0.2)',
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
                }}>
                Dispute Payment
              </ListItem.Title>
              <ListItem.Subtitle
                style={{
                  color: 'rgba(0,0,0,0.5)',
                  fontWeight: 'bold',
                  marginTop: 5,
                  fontSize: 10,
                }}>
                Report issue with this transaction
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron color="rgba(0,0,0,0.5)" solid />
          </ListItem>
        </TouchableOpacity>
      </View>
      {/* </ScrollView> */}
    </View>
  );
}

export default WalletReceipt;
